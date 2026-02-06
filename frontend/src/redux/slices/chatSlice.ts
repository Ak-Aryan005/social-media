import { createSlice, createAsyncThunk,PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

/* ---------------- TYPES ---------------- */

export interface ChatUser {
  _id: string;
  username: string;
  fullName: string;
  avatar?: string;
  isVerified: boolean;
}

export interface ChatMessage {
  _id: string;
  chat: string;
  sender: string;
  content?: string;
  media?: ChatMedia;
  createdAt: string;
}

export interface ChatListItem {
  _id: string; // chatId
  userInfo: ChatUser;
  messageInfo?: {
    _id: string;
    content: string;
    createdAt: string;
  };
}

/* ---------------- STATE ---------------- */

interface ChatState {
  chatList: ChatListItem[];
  messagesByChat: Record<string, ChatMessage[]>;
  isLoading: boolean;
  error: string | null;
   isUploading: boolean,
}

const initialState: ChatState = {
  chatList: [],
  messagesByChat: {},
  isLoading: false,
  error: null,
  isUploading: false,
};
export interface ChatMedia {
  type: "image" | "video" | "audio" | "file";
  url: string;
}

/* ---------------- THUNKS ---------------- */

/**
 * Fetch chat list (for ChatList page)
 */
export const fetchChatList = createAsyncThunk(
  "chat/fetchChatList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/chats/chatlist");
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat list"
      );
    }
  }
);

/**
 * Fetch messages of a single chat (for ChatRoom)
 */
export const fetchMessagesByChat = createAsyncThunk(
  "chat/fetchMessagesByChat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chats/messages/${chatId}`);
      return {
        chatId,
        messages: response.data.data || response.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);
export const uploadChatMedia = createAsyncThunk<
  ChatMedia,
  File,
  { rejectValue: string }
>(
  "chat/uploadChatMedia",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("media", file);

      const response = await axiosInstance.post(
        "/chats/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(`med ${JSON.stringify(response.data)}`)
      return response.data.data.media; // { type, url }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Media upload failed"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },

    // For Socket.IO incoming messages
    // addMessage(state, action) {
    //   const message = action.payload as ChatMessage;
    //   const chatId = message.chat;

    //   if (!state.messagesByChat[chatId]) {
    //     state.messagesByChat[chatId] = [];
    //   }

    //   state.messagesByChat[chatId].push(message);
    // },
    addMessage(state, action) {
  const message = action.payload as ChatMessage;
  const chatId = message.chat;
  if (!state.messagesByChat[chatId]) {
    state.messagesByChat[chatId] = [];
  }
  state.messagesByChat[chatId].push(message);
},
    setMessages(
      state,
      action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>
    ) {
      state.messagesByChat[action.payload.chatId] =
        action.payload.messages;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Chat List ---------- */
      .addCase(fetchChatList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatList = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* ---------- Fetch Messages ---------- */
      .addCase(fetchMessagesByChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const { chatId, messages } = action.payload as {
          chatId: string;
          messages: ChatMessage[];
        };
        state.messagesByChat[chatId] = messages;
      })
      .addCase(fetchMessagesByChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      }).addCase(uploadChatMedia.pending, (state) => {
  state.isUploading = true;
  state.error = null;
})
.addCase(uploadChatMedia.fulfilled, (state) => {
  state.isUploading = false;
})
.addCase(uploadChatMedia.rejected, (state, action) => {
  state.isUploading = false;
  state.error = action.payload as string;
});
;
  },
});

export const { addMessage, clearChatError,setMessages } = chatSlice.actions;
export default chatSlice.reducer;
