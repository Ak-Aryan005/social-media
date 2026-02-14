import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
// import { follow, unfollow } from '../slices/followsSlice';

interface UserProfile {
  id: string;
  _id: string;
  username: string;
  fullName:string;
  email: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing: boolean;
  isVerified: boolean;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/profile/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const fetchCurrentUserProfile = createAsyncThunk(
  'user/fetchCurrentUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // const params = lng ? { lng } : {};
      const response = await axiosInstance.get('/users/profile/');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (params: { limit?: number; page?: number } = {}, { rejectWithValue }) => {
    const { limit, page } = params;
    try {
      const params: any = {};
      if (limit) params.limit = limit;
      if (page) params.page = page;
      const response = await axiosInstance.get('/users/', { params });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/search', { params: { type: query } });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    data: { username?: string; fullName?: string; bio?: string } = {}, 
    { rejectWithValue }
  ) => {
    try {
      const payload: any = {};
      if (data.username) payload.username = data.username;
      if (data.fullName) payload.fullName = data.fullName;
      if (data.bio) payload.bio = data.bio;

      const response = await axiosInstance.patch('/users/me', payload);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);





export const addProfilePicture = createAsyncThunk(
  'user/addProfilePicture',
  async (media: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('media', media);
      const response = await axiosInstance.post('/users/add-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add profile picture');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'user/deactivateUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/users/deactivateUser');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate user');
    }
  }
);

export const blockUser = createAsyncThunk(
  'user/blockUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/users/block-user/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block user');
    }
  }
);

export const unblockUser = createAsyncThunk(
  'user/unblockUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/users/unblock-user/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unblock user');
    }
  }
);

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/follows', { following: userId });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/follows', {
        data: { following: userId },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // .addCase(fetchProfile.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.profile = action.payload;
      // })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // .addCase(updateProfile.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.profile = action.payload;
      // })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.profile = action.payload;
      // })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // .addCase(updateUser.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(updateUser.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.profile = action.payload;
      // })
      // .addCase(updateUser.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      // })
      .addCase(addProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(addProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deactivateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state) => {
        state.isLoading = false;
        state.profile = null;
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(blockUser.fulfilled, (state) => {
        // Handle block user
      })
      .addCase(unblockUser.fulfilled, (state) => {
        // Handle unblock user
      })
.addCase(fetchProfile.fulfilled, (state, action) => {
  state.isLoading = false;
  const data = action.payload;
  state.profile = {
    ...data,
    followers: Array.isArray(data.followers) ? data.followers.length : data.followers || 0,
    following: Array.isArray(data.following) ? data.following.length : data.following || 0,
    posts: Array.isArray(data.posts) ? data.posts.length : data.posts || 0,
  };
})
.addCase(updateProfile.fulfilled, (state, action) => {
  state.isLoading = false;
  const data = action.payload;
  state.profile = {
    ...state.profile,
    ...data,
    followers: Array.isArray(data.followers) ? data.followers.length : data.followers || state.profile?.followers || 0,
    following: Array.isArray(data.following) ? data.following.length : data.following || state.profile?.following || 0,
    posts: Array.isArray(data.posts) ? data.posts.length : data.posts || state.profile?.posts || 0,
  };
})
.addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
  state.isLoading = false;
  const data = action.payload;
  state.profile = {
    ...data,
    followers: Array.isArray(data.followers) ? data.followers.length : data.followers || 0,
    following: Array.isArray(data.following) ? data.following.length : data.following || 0,
    posts: Array.isArray(data.posts) ? data.posts.length : data.posts || 0,
  };
})
.addCase(followUser.pending, (state, action) => {
  if (state.profile && state.profile._id === action.meta.arg) {
    state.profile.isFollowing = true;
    state.profile.followers += 1;
  }
})
.addCase(unfollowUser.pending, (state, action) => {
  if (state.profile && state.profile._id === action.meta.arg) {
    state.profile.isFollowing = false;
    state.profile.followers -= 1;
  }
})
.addCase(followUser.rejected, (state, action) => {
  if (state.profile && state.profile._id === action.meta.arg) {
    state.profile.isFollowing = false;
    state.profile.followers -= 1;
  }
})
.addCase(unfollowUser.rejected, (state, action) => {
  if (state.profile && state.profile._id === action.meta.arg) {
    state.profile.isFollowing = true;
    state.profile.followers += 1;
  }
});


  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
