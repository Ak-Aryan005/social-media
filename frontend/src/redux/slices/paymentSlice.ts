import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface PaymentState {
  payment: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payment: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch payment
export const fetchPayment = createAsyncThunk(
  'payment/fetchPayment',
  async (userId:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/subscription/',{userId});
      // Assuming the API returns { data: { data: ... } } or { data: ... }
console.log('res', response);
      return response.data.data || response.data;
    } catch (error: any) {
      // Reject the thunk with a proper error message
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payment = action.payload;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
