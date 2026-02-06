import { Socket } from "socket.io-client";
import { store } from "@/redux/store";
import { addMessage } from "@/redux/slices/chatSlice";

export const registerChatListeners = (socket: Socket) => {
  socket.off("new-message"); // 🔥 prevent duplicates

  socket.on("new-message", (message) => {
    console.log("🔥 SOCKET RECEIVED:", message);
    store.dispatch(addMessage(message));
  });
};
