import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

interface Post {
  id: string;
  _id: string;
  userId: string;
  username: string;
  avatar?: string;
  image: string;
  caption: string;
  location: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  createdAt: string;
  isDeleted: boolean; 
  isVerified: boolean;
}

interface PostsState {
  feed: Post[];
  userPosts: Post[];
   selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
   page: number;
    hasMore: boolean;
    isFetchingMore: boolean; 
}

const initialState: PostsState = {
  feed: [],
  userPosts: [],
    page: 1,
     hasMore: true,
   selectedPost: null,
  isLoading: false,
  error: null,
    isFetchingMore: false,

};

export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async (
    { page = 1, limit = 5 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get('/posts', {
        params: { page, limit },
      });

      return {
        data: response.data.data || response.data,
        page,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch feed'
      );
    }
  }
);


export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const url = userId ? `/posts/getUserPosts/${userId}` : `/posts/getUserPosts/`;
      const response = await axiosInstance.get(url);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);



export const getPostById = createAsyncThunk(
  'posts/getPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

export const uploadPost = createAsyncThunk(
  'posts/uploadPost',
  async (
    {
      media,
      caption,
      location,
      tags,
    }: { media: File | File[]; caption?: string; location?: string; tags?: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (Array.isArray(media)) {
        media.forEach((file) => formData.append('media', file));
      } else {
        formData.append('media', media);
      }
      if (caption) formData.append('caption', caption);
      if (location) formData.append('location', location);
      if (tags) formData.append('tags', tags);
      
      const response = await axiosInstance.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (
    {
      postId,
      media,
      caption,
      location,
      tags,
    }: {
      postId: string;
      media?: File | File[];
      caption?: string;
      location?: string;
      tags?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (media) {
        if (Array.isArray(media)) {
          media.forEach((file) => formData.append('media', file));
        } else {
          formData.append('media', media);
        }
      }
      if (caption) formData.append('caption', caption);
      if (location) formData.append('location', location);
      if (tags) formData.append('tags', tags);
      
      const response = await axiosInstance.patch(`/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

// Note: Like/unlike operations should use likesSlice actions (addLike, deleteLike)
// These are kept here for backward compatibility but will be deprecated
export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ targetType, targetId }: { targetType: string; targetId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/likes/', {
        targetType,
        targetId,
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async ({ targetType, targetId }: { targetType: string; targetId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/likes/', {
        targetType,
        targetId,
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);


const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
  .addCase(fetchFeed.pending, (state, action) => {
  const page = action.meta.arg?.page || 1;

  if (page === 1) {
    state.isLoading = true;
  } else {
    state.isFetchingMore = true;
  }
})

.addCase(fetchFeed.fulfilled, (state, action) => {
  const { data, page } = action.payload;

  if (page === 1) {
    state.feed = data;
    state.isLoading = false;
  } else {
    state.feed = [...state.feed, ...data];
    state.isFetchingMore = false;
  }

  state.page = page;
  state.hasMore = data.length > 0;
})

      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure payload is always an array
        const payload = action.payload;
        state.userPosts = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state,action) => {
        state.isLoading = false;
        state.selectedPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const newPost = action.payload;
        state.userPosts.unshift(newPost);
        state.feed.unshift(newPost);
      })
      .addCase(uploadPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPost = action.payload;
        state.feed = state.feed.map((post) =>
          (post.id === updatedPost.id || post._id === updatedPost._id) ? updatedPost : post
        );
        state.userPosts = state.userPosts.map((post) =>
          (post.id === updatedPost.id || post._id === updatedPost._id) ? updatedPost : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedPostId = action.payload;
        state.feed = state.feed.filter((post) => post.id !== deletedPostId && post._id !== deletedPostId);
        state.userPosts = state.userPosts.filter((post) => post.id !== deletedPostId && post._id !== deletedPostId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // .addCase(likePost.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const { targetId } = action.meta.arg;
        state.feed = state.feed.map((post) =>
          (post.id === targetId || post._id === targetId) 
            ? { ...post, isLiked: true, likes: (post.likes || 0) + 1 }
            : post
        );
        state.userPosts = state.userPosts.map((post) =>
          (post.id === targetId || post._id === targetId)
            ? { ...post, isLiked: true, likes: (post.likes || 0) + 1 }
            : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // .addCase(unlikePost.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const { targetId } = action.meta.arg;
        state.feed = state.feed.map((post) =>
          (post.id === targetId || post._id === targetId)
            ? { ...post, isLiked: false, likes: Math.max(0, (post.likes || 0) - 1) }
            : post
        );
        state.userPosts = state.userPosts.map((post) =>
          (post.id === targetId || post._id === targetId)
            ? { ...post, isLiked: false, likes: Math.max(0, (post.likes || 0) - 1) }
            : post
        );
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
