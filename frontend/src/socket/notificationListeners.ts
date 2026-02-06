import { Socket } from "socket.io-client";
import { store } from "@/redux/store";
import {
  addNotification,
  fetchUnreadCount,
} from "@/redux/slices/notificationSlice";

export const registerNotificationListeners = (socket: Socket) => {
    console.log("🧠 Registering notification listeners");
  socket.on("notification", (payload) => {
    console.log("🔔 New notification:", payload);

    store.dispatch(
      addNotification({
        _id: payload._id,
        type: payload.type,
        isRead: false,
        createdAt: payload.createdAt,
        message: payload.message,
        relatedPost: payload.relatedPost,
        relatedUser: payload.relatedUser,
      })
    );
  });

  socket.on("connect", () => {
    const userId = store.getState().auth.user?._id;
    if (!userId) return;

    socket.emit("join-notifications", userId); // ✅ ONLY THIS
  });
};
