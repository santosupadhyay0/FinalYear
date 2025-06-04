import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const API_URL = 'http://localhost:8000/api/patients';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isHydrated: false,
};

// Register Patient
export const registerPatient = createAsyncThunk(
  'patientAuth/register',
  async ({ name, email, password, age, spouse }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email: email.toLowerCase(),
        password,
        age,
        spouse
      });

      const { user, token, refreshToken } = response.data;

      await SecureStore.setItemAsync('patientToken', token);
      if (refreshToken) await SecureStore.setItemAsync('patientRefreshToken', refreshToken);

      return { user, token, refreshToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Patient registration failed');
    }
  }
);

// Add debug logs to track API call and state transitions
export const loginPatient = createAsyncThunk(
  'patientAuth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.toLowerCase(),
        password,
      });
      const { user, token, refreshToken } = response.data;
      await SecureStore.setItemAsync('patientToken', token);
      if (refreshToken) await SecureStore.setItemAsync('patientRefreshToken', refreshToken);
      await SecureStore.setItemAsync('role', 'patient');
      return { user, token, refreshToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Patient login failed');
    }
  }
);

// Update the loadPatient function to avoid triggering it automatically
export const loadPatient = createAsyncThunk(
  'patientAuth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = await SecureStore.getItemAsync('patientToken');
      if (!token) {
        // Avoid rejecting with an error message that affects the UI
        return thunkAPI.rejectWithValue(null);
      }

      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        await SecureStore.deleteItemAsync('patientToken');
        return thunkAPI.rejectWithValue('Patient token expired');
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { user: response.data, token };
    } catch (err) {
      await SecureStore.deleteItemAsync('patientToken');
      await SecureStore.deleteItemAsync('patientRefreshToken');
      return thunkAPI.rejectWithValue(err.response?.data?.message || null);
    }
  }
);

// Slice
const patientAuthSlice = createSlice({
  name: 'patientAuth',
  initialState,
  reducers: {
    logoutPatient: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
      SecureStore.deleteItemAsync('patientToken');
      SecureStore.deleteItemAsync('patientRefreshToken');
    },
    hydratePatient: (state) => {
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(registerPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPatient.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isHydrated = true;
      })
      .addCase(loadPatient.rejected, (state, action) => {
        state.error = action.payload;
        state.isHydrated = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false; // Ensure loading is reset for any unhandled cases
        }
      );
  },
});

export const { logoutPatient, hydratePatient } = patientAuthSlice.actions;
export default patientAuthSlice.reducer;
