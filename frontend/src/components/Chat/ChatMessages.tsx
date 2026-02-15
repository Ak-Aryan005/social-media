import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchMessagesByChat,addMessage } from "@/redux/slices/chatSlice";
import { getSocket } from "@/socket/socket";



interface ChatMessagesProps {
  chatId: string;
}

export default function ChatMessages({ chatId }: ChatMessagesProps) {
  const dispatch = useAppDispatch();
    const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useAppSelector((s) => s.auth.user?._id);
  const messages = useAppSelector((s) => s.chat.messagesByChat[chatId] || []);
  // Fetch previous messages once
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessagesByChat(chatId));
    }
  }, [chatId, dispatch]);

  // Join socket room
  useEffect(() => {
    if (!chatId) return;
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    socket.emit("join-chat", chatId, (res: any) => {
      if (res?.error) console.error(res.error);
      else console.log("✅ Joined chat room:", chatId);
    });

const handleNewMessage = (msg: any) => {
  if (msg.chatId === chatId) {
    const message = {
      _id: msg._id,
      chat: msg.chatId,  // must match reducer
      sender: msg.sender,
      content: msg.content,
      media: msg.media,
      createdAt: msg.createdAt,
    };
    dispatch(addMessage(message));
  }
};

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [chatId, dispatch]);

   useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


    const renderMessageContent = (msg: any) => {
    if (msg.media) {
      switch (msg.media.type) {
        case "image":
          return (
            <img
              src={msg.media.url}
              alt="chat"
              className="w-full max-w-[70vw] lg:max-w-md rounded-lg object-contain"
            />
          );
        case "video":
          return (
            <video
              src={msg.media.url}
              controls
              className="w-full max-w-[70vw] lg:max-w-md rounded-lg"

            />
          );
        case "audio":
          return <audio src={msg.media.url} controls />;
        case "file":
          return (
            <a
              href={msg.media.url}
              target="_blank"
              className="underline text-blue-500"
            >
              Download file
            </a>
          );
        // default:
        //   return null;
      }
    }

    return msg.content;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${msg.sender._id === currentUserId ? "justify-end" : "justify-start"}`}
        >
          {msg.sender._id !== currentUserId && (
  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 self-end">
    <img
      src={msg.sender.avatar || "/DP For Girls (19).jpg"}
      className="w-full h-full object-cover"
      alt="avatar"
    />
  </div>
)}

          <div className={`px-4 py-2 rounded-xl bg-muted ${msg.sender._id === currentUserId ? "bg-blue-600" : ""}`}>{renderMessageContent(msg)}</div>
      </div>
      ))}
            <div ref={bottomRef} />
    </div>
  );
}
