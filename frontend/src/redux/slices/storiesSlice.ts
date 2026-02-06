import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';


// Types

export interface StoryMedia {
  type: 'image' | 'video';
  url: string;
}
export interface StoryUser {
  _id: string;
  username: string;
  avatar: string;
}
export interface Story {
  id: string;
  _id: string;
  user: StoryUser;
    caption?: string;   // ✅ ADD
  media: StoryMedia;
  views: string[];
  createdAt: string;
}

interface StoriesState {
  stories: Story[];
  userStories: Story[];
  selectedStory: Story | null;
  isLoading: boolean;
  error: string | null;
}

 
  //  Initial State


const initialState: StoriesState = {
  stories: [],
  userStories: [],
  selectedStory: null,
  isLoading: false,
  error: null,
};

  //  Thunks

// GET /stories
export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stories/');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stories');
    }
  }
);

// GET /stories/user/:userId
export const fetchUserStories = createAsyncThunk(
  'stories/fetchUserStories',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stories/user/${userId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stories');
    }
  }
);

// GET /stories/:storyId
export const getStoryById = createAsyncThunk(
  'stories/getStoryById',
  async (storyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stories/${storyId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch story');
    }
  }
);

// POST /stories
export const createStory = createAsyncThunk(
  'stories/createStory',
  async (
    {
      media,
      caption,
    }: { media: File | File[]; caption?: string },    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (Array.isArray(media)) {
        media.forEach((file) => formData.append('media', file));
      } else {
        formData.append('media', media);
      }

       if (caption) {
        formData.append('caption', caption); // ✅ ADD
      }
      const response = await axiosInstance.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create story');
    }
  }
);

// POST /stories/:storyId/view
export const viewStory = createAsyncThunk(
  'stories/viewStory',
  async (storyId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/stories/${storyId}/view`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to view story');
    }
  }
);

// DELETE /stories/:storyId
export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (storyId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/stories/${storyId}`);
      return storyId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete story');
    }
  }
);

  //  Slice

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stories
      .addCase(fetchStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch user stories
      .addCase(fetchUserStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get story by id
      .addCase(getStoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedStory = action.payload;
      })
      .addCase(getStoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create story
      .addCase(createStory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStories.unshift(action.payload);
        state.stories.unshift(action.payload);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // View story
    //   .addCase(viewStory.fulfilled, (state, action) => {
    //     state.selectedStory = action.payload;
    //   })

      // Delete story
      .addCase(deleteStory.fulfilled, (state, action) => {
        const storyId = action.payload;
        state.stories = state.stories.filter(
          (story) => story.id !== storyId && story._id !== storyId
        );
        state.userStories = state.userStories.filter(
          (story) => story.id !== storyId && story._id !== storyId
        );
      })
      .addCase(viewStory.fulfilled, (state, action) => {
  const updatedStory = action.payload;

  state.stories = state.stories.map((story) =>
    story.id === updatedStory.id || story._id === updatedStory._id
      ? { ...story, isViewed: true }
      : story
  );

  state.userStories = state.userStories.map((story) =>
    story.id === updatedStory.id || story._id === updatedStory._id
      ? { ...story, isViewed: true }
      : story
  );

  state.selectedStory = updatedStory;
});

  },
});

export const { clearError } = storiesSlice.actions;
export default storiesSlice.reducer;
