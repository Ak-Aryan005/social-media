import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface SearchResult {
  id: string;
  _id: string;
  type: 'user' | 'post';
  username?: string;
  fullName?: string;
  avatar?: string;
  caption?: string;
  image?: string;
  media?: string[];
}

interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
}

const initialState: SearchState = {
  results: [],
  isLoading: false,
  error: null,
  query: '',
};

export const searchContent = createAsyncThunk(
  'search/searchContent',
  async (query: string, { rejectWithValue }) => {
    if (!query.trim()) {
      return [];
    }
    try {
      // Using the search-users endpoint from Postman collection
      const response = await axiosInstance.get('/users/search', {
        params: { type: query },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.query = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.results = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, clearResults, clearError } = searchSlice.actions;
export default searchSlice.reducer;
