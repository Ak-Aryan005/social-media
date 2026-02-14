import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface Like {
  id: string;
  _id: string;
  userId: string;
  user?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  username?: string;
  avatar?: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}

interface LikesState {
  likes: Like[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LikesState = {
  likes: [],
  isLoading: false,
  error: null,
};

export const getLikes = createAsyncThunk(
  'likes/getLikes',
  async (
    { type, id }: { type: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get('/likes/', {
        params: { type, id },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch likes');
    }
  }
);

export const addLike = createAsyncThunk(
  'likes/addLike',
  async (
    { targetType, targetId }: { targetType: string; targetId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/likes/', {
        targetType,
        targetId,
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add like');
    }
  }
);

export const deleteLike = createAsyncThunk(
  'likes/deleteLike',
  async (
    { targetType, targetId }: { targetType: string; targetId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch('/likes/', {
        targetType,
        targetId,
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove like');
    }
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLikes: (state) => {
      state.likes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLikes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLikes.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.likes = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(getLikes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLike.fulfilled, (state, action) => {
        state.isLoading = false;
        const newLike = action.payload;
        const { targetId } = action.meta.arg;
        // Add targetId to like for filtering
        const likeWithTarget = { ...newLike, targetId };
        if (!state.likes.find((like) => 
          (like.id === newLike.id || like._id === newLike._id) && like.targetId === targetId
        )) {
          state.likes.push(likeWithTarget);
        }
      })
      .addCase(addLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLike.fulfilled, (state, action) => {
        state.isLoading = false;
        const removedLike = action.payload;
        const { targetId } = action.meta.arg;
        // Remove like by targetId or by like id
        state.likes = state.likes.filter(
          (like) => 
            (like.id !== removedLike?.id && like._id !== removedLike?._id) &&
            like.targetId !== targetId
        );
      })
      .addCase(deleteLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearLikes } = likesSlice.actions;
export default likesSlice.reducer;

