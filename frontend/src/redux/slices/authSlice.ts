import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  purpose:string;
  // notifications:null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  purpose:null
  // notifications:null
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, phone, password }: { email?: string; phone?: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const payload: any = { password };
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      
      const response = await axiosInstance.post('/auth/login', payload);
      const { token, user } = response.data.data || response.data;
      localStorage.setItem('authToken', token);
      // localStorage.setItem('currentUser', JSON.stringify(user));
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    {
      username,
      fullName,
      email,
      phone,
      password,
    }: { username: string; fullName?: string; email?: string; phone?: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const payload: any = { username, password };
      if (fullName) payload.fullName = fullName;
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      
      const response = await axiosInstance.post('/auth/register', payload);
      const { user } = response.data.data || response.data;
      return { user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/profile');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (
    { email, phone, code }: { email?: string; phone?: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const payload: any = { code };
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      
      const response = await axiosInstance.post('/auth/verify-email', payload);
      const { token, user } = response.data.data || response.data;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Verification failed'
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, code });
      const { token, user } = response.data.data || response.data;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ email,purpose }: { email: string; purpose:string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/send-otp', { email,purpose });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send OTP'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('authToken');
      return null;
    } catch (error: any) {
      localStorage.removeItem('authToken');
      return null;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ password,email }: { password: string; email:string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { password,email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reset password'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { oldPassword, password }: { oldPassword: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        oldpassword: oldPassword,
        password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reset password'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        //  localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        // localStorage.removeItem('authToken');
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(sendOtp.pending, (state) => {
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Legacy alias for backward compatibility
export const verifyCode = verifyEmail;
export const resendCode = sendOtp;

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
