import { io, Socket } from "socket.io-client";
import { registerChatListeners } from "./chatListeners";
import { store } from "@/redux/store";
import { registerNotificationListeners } from "./notificationListeners";
let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    const token = store.getState().auth.token; // 🔥 get JWT

    if (!token) {
      console.error("❌ No auth token, socket not initialized");
      return null;
    }

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`, // 🔥 REQUIRED
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    registerChatListeners(socket); // 🔥 only once
    registerNotificationListeners(socket);

  }

  return socket;
};

export const getSocket = () => socket;
