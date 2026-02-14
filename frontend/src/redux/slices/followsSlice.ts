import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { followUser, unfollowUser } from '@/redux/slices/userSlice';

interface Follow {
  id: string;
  _id: string;
  follower: string;
  following: string;
  user?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}
export interface FollowUser {
  _id: string;
  userId: string;
  username: string;
  fullName: string;
  avatar?: string;
  isFollowing: boolean;
   followers:number;
  following:number;
  isVerified: boolean;
}

interface FollowsState {
    followers: FollowUser[];
  following: FollowUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FollowsState = {
  followers: [],
  following: [],
  isLoading: false,
  error: null,
};

// const initialState: FollowsState = {
//   followerList: [],
//   followingList: [],
//   isLoading: false,
//   error: null,
//   //    follower:0,
//   // following:0,
// };

// export const follow = createAsyncThunk(
//   'follows/follow',
//   async (following: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/follows', { following });
//       return response.data.data || response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
//     }
//   }
// );

// export const unfollow = createAsyncThunk(
//   'follows/unfollow',
//   async (following: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.delete('/follows', {
//         data: { following },
//       });
//       return response.data.data || response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
//     }
//   }
// );

export const getFollowers = createAsyncThunk(
  'follows/getFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/follows/followers');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const getFollowing = createAsyncThunk(
  'follows/getFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/follows/following');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

export const getAnothersFollowing = createAsyncThunk(
  'follows/getAnothersFollowing',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/follows/anothers-following/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

export const getAnothersFollowers = createAsyncThunk(
  'follows/getAnothersFollowers',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/follows/anothers-followers/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

const followsSlice = createSlice({
  name: 'follows',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFollows: (state) => {
      state.followers = [];
      state.following = [];
      // state.followerList  = [];
      // state.followingList  = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(follow.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // // .addCase(follow.fulfilled, (state) => {
      // //   state.isLoading = false;
      // // })
      // .addCase(follow.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      // })
      // .addCase(unfollow.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // // .addCase(unfollow.fulfilled, (state) => {
      // //   state.isLoading = false;
      // // })
      // .addCase(unfollow.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      // })
      .addCase(getFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.followers = Array.isArray(payload) 
        // state.followerList = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.following = Array.isArray(payload) 
        // state.followingList = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAnothersFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAnothersFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.following = Array.isArray(payload) 
        // state.followingList = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(getAnothersFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAnothersFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAnothersFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.followers = Array.isArray(payload) 
        // state.followerList = Array.isArray(payload) 
          ? payload 
          : (Array.isArray(payload?.data) ? payload.data : []);
      })
      .addCase(getAnothersFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(followUser.pending, (state, action) => {
  const userId = action.meta.arg;

  state.followers.forEach(user => {
    if (user.userId === userId) {
      user.isFollowing = true;
      user.followers += 1;
    }
  });

  state.following.forEach(user => {
    if (user.userId === userId) {
      user.isFollowing = true;
      user.followers += 1;
    }
  });
})

.addCase(unfollowUser.pending, (state, action) => {
  const userId = action.meta.arg;

  state.followers.forEach(user => {
    if (user.userId === userId) {
      user.isFollowing = false;
      user.followers -= 1;
    }
  });

  state.following.forEach(user => {
    if (user.userId === userId) {
      user.isFollowing = false;
      user.followers -= 1;
    }
  });
})

/* rollback on failure */
.addCase(followUser.rejected, (state, action) => {
  const userId = action.meta.arg;

  state.followers.forEach(user => {
    if (user.userId === userId) {
      user.isFollowing = false;
      user.followers -= 1;
    }
  });
})

.addCase(unfollowUser.rejected, (state, action) => {
  const userId = action.meta.arg;

  state.followers.forEach(user => {
    if (user.userId === userId) {
      user.isFollowing = true;
      user.followers += 1;
    }
  });
});

  },
});

export const { clearError, clearFollows } = followsSlice.actions;
export default followsSlice.reducer;

