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
  sender: ChatUser;
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
    readBy:string[]
  };
}

export interface Group {
  _id: string;
  name: string;
  members: ChatUser[];
  avatar?: string;
}

export interface GroupDetails {
  _id: string;
  groupName: string;
  admin:string;
  groupAvatar?: string;
  participants: ChatUser[];
}


/* ---------------- STATE ---------------- */

interface ChatState {
  chatList: ChatListItem[];
  messagesByChat: Record<string, ChatMessage[]>;
  groupUsers: ChatUser[]; 
  isLoading: boolean;
  selectedGroup: GroupDetails | null;
  error: string | null;
  isUploading: boolean,
  isCreatingGroup: boolean;      // 👈 add
  groupList: GroupListItem[];   // ✅ add this

}

const initialState: ChatState = {
  chatList: [],
  groupUsers: [],
  groupList: [],
  messagesByChat: {},
  selectedGroup: null,
  isLoading: false,
  error: null,
  isUploading: false,
  isCreatingGroup: false,
};
export interface ChatMedia {
  type: "image" | "video" | "audio" | "file";
  url: string;
}

export interface GroupListItem {
  _id: string;
  groupName: string;
  groupAvatar?: string;
  isGroup:boolean
  messageInfo?: {
    content: string;
    createdAt: string;
  };
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

export const fetchUsersForGroup = createAsyncThunk<
  ChatUser[],
  void,
  { rejectValue: string }
>(
  "chat/fetchUsersForGroup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/chats/users-list");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);


export const createGroupThunk = createAsyncThunk<
  any,
  { participantIds: string[]; groupName: string; groupAvatar?: string },
  { rejectValue: string }
>(
  "chat/createGroup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/chats/create-group",
        data
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create group"
      );
    }
  }
);

export const fetchGroupList = createAsyncThunk(
  "chat/fetchGroupList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/chats/group-list");
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch group list"
      );
    }
  }
);

export const fetchGroupDetails = createAsyncThunk<
  GroupDetails,
  string,
  { rejectValue: string }
>(
  "chat/fetchGroupDetails",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/chats/group-members/${chatId}`
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch group details"
      );
    }
  }
);

export const updateGroupThunk = createAsyncThunk<
  GroupDetails,
  { chatId: string; name?: string; media?: File },
  { rejectValue: string }
>(
  "chat/updateGroup",
  async ({ chatId, name, media }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);

      if (name) formData.append("name", name);
      if (media) formData.append("media", media);

      const response = await axiosInstance.post(
        "/chats/update-group",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update group"
      );
    }
  }
);


export const removeMembersThunk = createAsyncThunk<
  GroupDetails,
  { chatId: string; userIds: string[] },
  { rejectValue: string }
>(
  "chat/removeMembers",
  async ({ chatId, userIds }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/chats/remove-members/${chatId}`,
        { userIds }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove members"
      );
    }
  }
);

export const leaveGroupThunk = createAsyncThunk<
  string, // returning chatId for state update
  string,
  { rejectValue: string }
>(
  "chat/leaveGroup",
  async (chatId, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/chats/leave-group/${chatId}`);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to leave group"
      );
    }
  }
);


export const addMembersThunk = createAsyncThunk<
  GroupDetails,
  { chatId: string; participantIds: string[] },
  { rejectValue: string }
>(
  "chat/addMembers",
  async ({ chatId, participantIds }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/chats/add-members/${chatId}`,
        { participantIds }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add members"
      );
    }
  }
);

export const makeAdminThunk = createAsyncThunk<
  GroupDetails,
  { chatId: string; newAdminId: string },
  { rejectValue: string }
>(
  "chat/makeAdmin",
  async ({ chatId, newAdminId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/chats/make-admin/${chatId}`,
        { newAdminId }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign admin"
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
})
/* ---------- Fetch Users For Group ---------- */
.addCase(fetchUsersForGroup.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchUsersForGroup.fulfilled, (state, action) => {
  state.isLoading = false;
  state.groupUsers = action.payload;
})
.addCase(fetchUsersForGroup.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})

/* ---------- Create Group ---------- */
.addCase(createGroupThunk.pending, (state) => {
  state.isCreatingGroup = true;
  state.error = null;
})
.addCase(createGroupThunk.fulfilled, (state, action) => {
  state.isCreatingGroup = false;

  // Add new group to top of chat list
  state.chatList.unshift(action.payload);
})
.addCase(createGroupThunk.rejected, (state, action) => {
  state.isCreatingGroup = false;
  state.error = action.payload as string;
})
.addCase(fetchGroupList.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchGroupList.fulfilled, (state, action) => {
  state.isLoading = false;
  state.groupList = Array.isArray(action.payload)
    ? action.payload
    : [];
})
.addCase(fetchGroupList.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
/* ---------- Fetch Group Details ---------- */
.addCase(fetchGroupDetails.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchGroupDetails.fulfilled, (state, action) => {
  state.isLoading = false;
  state.selectedGroup = action.payload;
})
.addCase(fetchGroupDetails.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})

/* ---------- Update Group ---------- */
.addCase(updateGroupThunk.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(updateGroupThunk.fulfilled, (state, action) => {
  state.isLoading = false;
  state.selectedGroup = action.payload;

  // update group list also
  const index = state.groupList.findIndex(
    (g) => g._id === action.payload._id
  );
  if (index !== -1) {
    state.groupList[index].groupName = action.payload.groupName;
    state.groupList[index].groupAvatar = action.payload.groupAvatar;
  }
})
.addCase(updateGroupThunk.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
/* ---------- Leave Group ---------- */
.addCase(leaveGroupThunk.fulfilled, (state, action) => {
  const chatId = action.payload;

  // Remove group from groupList
  state.groupList = state.groupList.filter(
    (group) => group._id !== chatId
  );

  // Remove from chatList also
  state.chatList = state.chatList.filter(
    (chat) => chat._id !== chatId
  );

  state.selectedGroup = null;
})

/* ---------- Remove Members ---------- */
.addCase(removeMembersThunk.fulfilled, (state, action) => {
  state.selectedGroup = action.payload;
})

/* ---------- Add Members ---------- */
.addCase(addMembersThunk.fulfilled, (state, action) => {
  state.selectedGroup = action.payload;
})

/* ---------- Make Admin ---------- */
.addCase(makeAdminThunk.fulfilled, (state, action) => {
  state.selectedGroup = action.payload;
})
  },
});

export const { addMessage, clearChatError,setMessages } = chatSlice.actions;
export default chatSlice.reducer;
