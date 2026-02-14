import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

/* =======================
   Types
======================= */

interface User {
  _id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

interface Notification {
  _id: string;
  user: string;
  type: string;
  message?: string;
  isRead: boolean;
  relatedUser?: User;
  relatedPost?: any;
  relatedComment?: any;
  createdAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

/* =======================
   Initial State
======================= */

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  meta: null,
  isLoading: false,
  error: null,
};

/* =======================
   Thunks
======================= */

export const fetchUserNotifications = createAsyncThunk(
  'notifications/fetchUserNotifications',
  async (
    { page = 1, limit = 20 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get('/notifications', {
        params: { page, limit },
      });
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications/unread-count');
      return response.data.data.count || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch unread count'
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark all as read'
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/notifications/${notificationId}`
      );
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification'
      );
    }
  }
);

/* =======================
   Slice
======================= */

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,

reducers: {
  clearNotificationError: (state) => {
    state.error = null;
  },
  resetNotifications: (state) => {
    state.notifications = [];
    state.meta = null;
    state.unreadCount = 0;
  },

  // 🔁 realtime
   addNotification: (state, action) => {
    state.notifications.unshift(action.payload);
    state.unreadCount += 1;
  },

  markNotificationReadRealtime: (state, action) => {
    const n = state.notifications.find(
      (item) => item._id === action.payload
    );
    if (n && !n.isRead) {
      n.isRead = true;
      state.unreadCount = Math.max(state.unreadCount - 1, 0);
    }
  },
},

  extraReducers: (builder) => {
    builder
      /* Fetch notifications */
      .addCase(fetchUserNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

    .addCase(fetchUserNotifications.fulfilled, (state, action) => {
  state.isLoading = false;

  if (Array.isArray(action.payload)) {
    state.notifications = action.payload;
  } else {
    state.notifications = action.payload.data || [];
    state.meta = action.payload.meta || null;
  }
})
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* Unread count */
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      /* Mark single as read */
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          state.notifications[index].isRead = true;
        }
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      })

      /* Mark all as read */
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
      })

      /* Delete notification */
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload._id
        );
      });
  },
});

/* =======================
   Exports
======================= */

export const {
  clearNotificationError,
  resetNotifications,
  addNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
