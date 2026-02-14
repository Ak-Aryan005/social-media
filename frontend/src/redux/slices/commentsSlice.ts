import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface Comment {
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
  content: string;
  text?: string;
  createdAt: string;
}

interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const getComments = createAsyncThunk(
  'comments/getComments',
  async (targetId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/comments/${targetId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (
    {
      targetType,
      targetId,
      content,
    }: { targetType: string; targetId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/comments/', {
        targetType,
        targetId,
        content,
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (
    {
      commentId,
      targetType,
      targetId,
      content,
    }: {
      commentId: string;
      targetType: string;
      targetId: string;
      content: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch('/comments/', {
        commentId,
        targetType,
        targetId,
        content,
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (
    {
      commentId,
      targetType,
      targetId,
    }: {
      commentId: string;
      targetType: string;
      targetId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await axiosInstance.delete('/comments/', {
        data: { commentId, targetType, targetId },
      });
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure payload is always an array and filter by targetId
        const payload = action.payload;
        const comments = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
        // Replace comments for this targetId
        const targetId = action.meta.arg;
        state.comments = [
          ...state.comments.filter((c: any) => c.targetId !== targetId),
          ...comments.map((c: any) => ({ ...c, targetId })),
        ];
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const newComment = action.payload;
        const targetId = action.meta.arg.targetId;
        // Add targetId to comment for filtering
        state.comments.push({ ...newComment, targetId });
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedComment = action.payload;
        state.comments = state.comments.map((comment) =>
          comment.id === updatedComment.id || comment._id === updatedComment._id
            ? updatedComment
            : comment
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedCommentId = action.payload;
        state.comments = state.comments.filter(
          (comment) => comment.id !== deletedCommentId && comment._id !== deletedCommentId
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;

