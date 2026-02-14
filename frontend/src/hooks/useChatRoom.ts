import { useEffect } from "react";
import { getSocket } from "@/socket/socket";

export const useJoinChat = (chatId: string) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("join-chat", chatId);

    return () => {
      socket.emit("leave-chat", chatId); // optional
    };
  }, [chatId]);
};
