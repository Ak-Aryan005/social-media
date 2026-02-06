import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';
import commentsReducer from './slices/commentsSlice';
import likesReducer from './slices/likesSlice';
import followsReducer from './slices/followsSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice'
import storyReducer from './slices/storiesSlice'
import paymentReducer from './slices/paymentSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    user: userReducer,
    search: searchReducer,
    comments: commentsReducer,
    likes: likesReducer,
    follows: followsReducer,
    chat: chatReducer,
    notifications:notificationReducer,
    stories:storyReducer,
    payment:paymentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
