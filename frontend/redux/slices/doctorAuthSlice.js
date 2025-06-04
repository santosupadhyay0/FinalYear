import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const API_URL = 'http://localhost:8000/api/doctors';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isHydrated: false,
};


export const registerDoctor = createAsyncThunk(
  'doctorAuth/register',
  async ({ name, email, password, age, specialization, doctorValidationId, levelOfStudy, workplace }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email: email.toLowerCase(),
        password,
        age,
        specialization,
        doctorValidationId,
        levelOfStudy,
        workplace,
      });
      console.log("Registration response:", response.data);
      const { user, token, refreshToken } = response.data;

      await SecureStore.setItemAsync('doctorToken', token);
      if (refreshToken) await SecureStore.setItemAsync('doctorRefreshToken', refreshToken);

      return { user, token, refreshToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Doctor registration failed');
    }
  }
);

// Add debug logs to track API call and state transitions
export const loginDoctor = createAsyncThunk(
  'doctorAuth/login',
  async ({ email, password }, thunkAPI) => {
    console.log("loginDoctor action dispatched with email:", email);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.toLowerCase(),
        password,
      });
      console.log("loginDoctor API response:", response.data);

      if (!response.data || !response.data.token) {
        console.error("loginDoctor: Missing token in response");
        return thunkAPI.rejectWithValue("Invalid response from server");
      }

      const { user, token, refreshToken } = response.data;
      await SecureStore.setItemAsync('doctorToken', token);
      if (refreshToken) await SecureStore.setItemAsync('doctorRefreshToken', refreshToken);
      await SecureStore.setItemAsync('role', 'doctor');

      return { user, token, refreshToken };
    } catch (err) {
      console.error("loginDoctor API error:", err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Doctor login failed');
    }
  }
);

// Add debug logs to track API call and state transitions
export const loadDoctor = createAsyncThunk(
  'doctorAuth/loadUser',
  async (_, thunkAPI) => {
    console.log("loadDoctor action dispatched");
    try {
      const token = await SecureStore.getItemAsync('doctorToken');
      if (!token) {
        console.log("loadDoctor: No token found");
        return thunkAPI.rejectWithValue('No doctor token found');
      }

      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        console.log("loadDoctor: Token expired");
        await SecureStore.deleteItemAsync('doctorToken');
        return thunkAPI.rejectWithValue('Doctor token expired');
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("loadDoctor API response:", response.data);
      return { user: response.data, token };
    } catch (err) {
      console.log("loadDoctor API error:", err.response?.data);
      await SecureStore.deleteItemAsync('doctorToken');
      await SecureStore.deleteItemAsync('doctorRefreshToken');
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load doctor');
    }
  }
);

const doctorAuthSlice = createSlice({
  name: 'doctorAuth',
  initialState,
  reducers: {
    logoutDoctor: (state) => {
      console.log('logoutDoctor reducer called'); // Debug log
      console.log('logoutDoctor reducer executed');
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
      SecureStore.deleteItemAsync('doctorToken');
      SecureStore.deleteItemAsync('doctorRefreshToken');
    },
    hydrateDoctor: (state) => {
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDoctor.pending, (state) => {
        console.log("registerDoctor.pending: setting loading to true");
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state, action) => {
        console.log("registerDoctor.fulfilled: setting loading to false");
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        console.log("registerDoctor.rejected: setting loading to false");
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginDoctor.pending, (state) => {
        console.log("loginDoctor.pending: setting loading to true");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginDoctor.fulfilled, (state, action) => {
        console.log("loginDoctor.fulfilled: setting loading to false");
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginDoctor.rejected, (state, action) => {
        console.log("loginDoctor.rejected: setting loading to false");
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadDoctor.pending, (state) => {
        console.log("loadDoctor.pending: setting loading to true");
        state.loading = true;
      })
      .addCase(loadDoctor.fulfilled, (state, action) => {
        console.log("loadDoctor.fulfilled: setting user and loading to false");
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isHydrated = true;
      })
      .addCase(loadDoctor.rejected, (state, action) => {
        console.log("loadDoctor.rejected: setting loading to false");
        state.loading = false;
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

export const { logoutDoctor, hydrateDoctor } = doctorAuthSlice.actions;
export default doctorAuthSlice.reducer;
