// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/auth';

// export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
//   try {
//     let token = await AsyncStorage.getItem('token');
//     if (!token) return thunkAPI.rejectWithValue('No token found');

//     try {
//       token = JSON.parse(token);
//     } catch (e) {
//     }

//     // Validate token format
//     if (typeof token !== 'string' || token === '') {
//       return thunkAPI.rejectWithValue('Invalid token format');
//     }

//     // Log token for debugging
//     console.log('🔍 loadUser token:', token);

//     const res = await axios.get(`${API_URL}/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     return { user: res.data, token };
//   } catch (err) {
//     console.error('❌ loadUser error:', {
//       message: err.message,
//       response: err.response?.data,
//       status: err.response?.status,
//     });
//     return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load user');
//   }
// });

// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async ({ email, password }, thunkAPI) => {
//     try {
//       // Normalize email to lowercase
//       const normalizedEmail = email.toLowerCase();

//       // Log credentials for debugging
//       console.log('🔍 Attempting login with:', { email: normalizedEmail, password });

//       const res = await axios.post(`${API_URL}/login`, {
//         email: normalizedEmail,
//         password,
//       });

//       const { token, refreshToken, user } = res.data;

//       await AsyncStorage.setItem('token', token);
//       if (refreshToken) {
//         await AsyncStorage.setItem('refreshToken', refreshToken);
//       }

//       return { user, token, refreshToken };
//     } catch (err) {
//       console.log(res.data)
//       console.error('❌ Login failed:', err.response?.data || err.message);
//       return thunkAPI.rejectWithValue(err.response?.data?.message || 'Invalid email or password');
//     }
//   }
// );

// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async ({ name, email, password, age, specialization }, thunkAPI) => {
//     try {
//       // Normalize email to lowercase
//       const normalizedEmail = email.toLowerCase();

//       // Log credentials for debugging
//       console.log('🔍 Registering user with:', { name, email: normalizedEmail, password, age, specialization });

//       const res = await axios.post(`${API_URL}/register`, {
//         name,
//         email: normalizedEmail,
//         password,
//         age,
//         specialization,
//       });

//       const { user, token } = res.data;

//       // Log registered user details for debugging
//       console.log('🔍 Registered user:', { user, token });

//       // Store token as plain string
//       await AsyncStorage.setItem('token', token);

//       return { user, token };
//     } catch (err) {
//       console.error('❌ Registration failed:', err.response?.data || err.message);
//       return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null,
//     isHydrated: false,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.error = null;
//       state.isHydrated = false;
//       AsyncStorage.removeItem('token');
//       AsyncStorage.removeItem('refreshToken');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loadUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isHydrated = true;
//       })
//       .addCase(loadUser.rejected, (state, action) => {
//         state.loading = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload;
//         state.isHydrated = true;
//       })
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your backend's IP address
const API_URL = 'http://localhost:8000/api/auth';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, age, specialization }, thunkAPI) => {
    try {
      const normalizedEmail = email.toLowerCase();
      console.log('🔍 Registering user with:', { name, email: normalizedEmail, password, age, specialization });
      
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email: normalizedEmail,
        password,
        age,
        specialization,
      });

      console.log('🔍 Register response:', response.data);

      const { user, token, refreshToken } = response.data;

      await AsyncStorage.setItem('token', token);
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }

      console.log('🔍 Registered user:', { user, token });

      return { user, token, refreshToken };
    } catch (err) {
      console.error('❌ Registration failed:', err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const normalizedEmail = email.toLowerCase();
      const res = await axios.post(`${API_URL}/login`, {
        email: normalizedEmail,
        password,
      });

      const { user, token, refreshToken } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      return { user, token, refreshToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 loadUser token:', token);

      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('🔍 loadUser response:', response.data);

      return { user: response.data, token };
    } catch (err) {
      console.error('❌ loadUser failed:', err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load user');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;