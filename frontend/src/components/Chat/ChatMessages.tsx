// import { useAppSelector } from "@/hooks/redux";
// import { motion } from 'framer-motion';
// import { useAppDispatch } from '@/hooks/redux';
// import { useEffect } from 'react';
// import { fetchProfile } from '@/redux/slices/userSlice';

// export default function ChatMessages({ chatId }: { chatId: string }) {
//   const messages =
//     useAppSelector((s) => s.chat.messagesByChat[chatId]) || [];

//   const currentUserId = useAppSelector((s) => s.auth.user?._id);
//         const { isLoading,profile } = useAppSelector((state) => state.user);
//         const dispatch = useAppDispatch();

//      useEffect(() => {
//         if (profile) {
//           dispatch(fetchProfile(profile._id)); 
//         }
//       }, [profile._id, dispatch]);
//   return (
//     <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-card">
//       {messages.map((msg, index) => {
//         const isMe = msg.sender === currentUserId;

//         return (
//           <motion.div
//             key={msg._id}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.02 }}
//             className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//           >
//             {/* Avatar (only for others) */}
//             {!isMe && (
//               <img
//                 src={profile.avatar || "/avatar.png"}
//                 className="w-7 h-7 rounded-full mr-2 self-end"
//               />
//             )}

//             {/* Bubble */}
//             <div
//               className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl leading-relaxed ${
//                 isMe
//                   ? "bg-primary text-primary-foreground rounded-br-md"
//                   : "bg-muted text-foreground rounded-bl-md"
//               }`}
//             >
//               {msg.content}

//               <div className="mt-1 text-[10px] text-muted-foreground">
//                 {new Date(msg.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }






import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchMessagesByChat,addMessage } from "@/redux/slices/chatSlice";
import { getSocket } from "@/socket/socket";
import { initSocket } from "@/socket/socket";
import { store } from "@/redux/store";


// export default function ChatMessages({ chatId }: { chatId: string }) {
//   const dispatch = useAppDispatch();
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const { messagesByChat, isLoading } = useAppSelector(
//     (state) => state.chat
//   );

//   const currentUserId = useAppSelector(
//     (state) => state.auth.user?._id
//   );

//   // const messages = messagesByChat[chatId] || [];
// const messages = useAppSelector(
//   s => s.chat.messagesByChat[chatId] || []
// );

//   /* 🔥 Fetch messages when chat opens */
//   useEffect(() => {
//     if (chatId) {
//       dispatch(fetchMessagesByChat(chatId));
//     }
//   }, [chatId, dispatch]);
// useEffect(() => {
//   if (!chatId) return;

//   const socket = initSocket();

//   socket.emit("join-chat", {
//     chatId,              // 🔥 REQUIRED
//     userId: currentUserId,
//   });

// }, [chatId, currentUserId]);

//   /* 🔽 Auto-scroll to bottom */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (isLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         Loading messages...
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-card">
//       {messages.map((msg, index) => {
//         const isMe = msg.sender === currentUserId;

//         return (
//           <motion.div
//             key={msg._id}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.02 }}
//             className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//           >
//             {/* Bubble */}
//             <div
//               className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl leading-relaxed ${
//                 isMe
//                   ? "bg-primary text-primary-foreground rounded-br-md"
//                   : "bg-muted text-foreground rounded-bl-md"
//               }`}
//             >
//               {msg.content}

//               <div className="mt-1 text-[10px] text-muted-foreground text-right">
//                 {new Date(msg.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>
//           </motion.div>
//         );
//       })}

//       <div ref={bottomRef} />
//     </div>
//   );
// }






// export default function ChatMessages({ chatId }: { chatId: string }) {
//   const dispatch = useAppDispatch();
//   const currentUserId = useAppSelector(s => s.auth.user?._id);
//   const messages = useAppSelector(
//     s => s.chat.messagesByChat[chatId] || []
//   );
//     const { isLoading,profile } = useAppSelector((state) => state.user);
//   const joinedRef = useRef(false);

//   useEffect(() => {
//     dispatch(fetchMessagesByChat(chatId));
//   }, [chatId]);

// useEffect(() => {
//   if (!chatId || !currentUserId) return;

//   const socket = getSocket();

//   // 🔥 FIND OTHER PARTICIPANT FROM CHAT LIST
//   const chat = store
//     .getState()
//     .chat.chatList
//     .find(c => c._id === chatId);

//   const otherUserId = chat?.userInfo?.[0]?._id || profile._id;
//   if (!otherUserId) return;

//   socket.emit("join-chat", {
//     userId: currentUserId,
//     participants: [otherUserId], // 🔥 REQUIRED
//   });

// }, [chatId, currentUserId]);


//   // useEffect(() => {
//   //   if (joinedRef.current) return;

//   //   const socket = getSocket();
//   //   socket?.emit("join-chat", { chatId, userId: currentUserId });

//   //   joinedRef.current = true;
//   // }, [chatId, currentUserId]);

//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-2">
//       {messages.map(msg => (
//         <div
//           key={msg._id}
//           className={`flex ${
//             msg.sender === currentUserId ? "justify-end" : "justify-start"
//           }`}
//         >
//           <div className="px-4 py-2 rounded-xl bg-muted">
//             {msg.content}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }










// export default function ChatMessages({ chatId }: { chatId: string }) {
//   const dispatch = useAppDispatch();
//   const currentUserId = useAppSelector(s => s.auth.user?._id);
//   const messages = useAppSelector(
//     s => s.chat.messagesByChat[chatId] || []
//   );

  
// useEffect(() => {
//   if (!chatId) return;

//   const socket = getSocket();
//   if (!socket || !socket.connected) return;

//   socket.emit("join-chat", chatId, (res: any) => {
//     if (res?.error) {
//       console.error("Join chat failed:", res.error);
//     } else {
//       console.log("✅ Joined chat room:", chatId);
//     }
//   });
// }, [chatId]);

//   // ✅ Correct room join
//   // useEffect(() => {
//   //   if (!chatId || !currentUserId) return;

//   //   const socket = getSocket();

//   //   socket?.emit("join-chat", chatId, (res: any) => {
//   //     if (res?.error) {
//   //       console.error("Join chat failed:", res.error);
//   //     }
//   //   });

//   // }, [chatId, currentUserId]);

//   useEffect(() => {
//   if (!chatId) return;

//   const socket = getSocket();

//   socket.emit("join-chat", chatId, (res: any) => {
//     if (res?.error) {
//       console.error(res.error);
//     }
//   });

// }, [chatId]);


//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-2">
//       {messages.map(msg => (
//         <div
//           key={msg._id}
//           className={`flex ${
//             msg.sender === currentUserId ? "justify-end" : "justify-start"
//           }`}
//         >
//           <div className="px-4 py-2 rounded-xl bg-muted">
//             {msg.content}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }















interface ChatMessagesProps {
  chatId: string;
}

export default function ChatMessages({ chatId }: ChatMessagesProps) {
  const dispatch = useAppDispatch();
    const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useAppSelector((s) => s.auth.user?._id);
  const messages = useAppSelector((s) => s.chat.messagesByChat[chatId] || []);
console.log(`curr${currentUserId}`)
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

    // Listen for new messages in this chat
    // const handleNewMessage = (msg: any) => {
    //   if (msg.chatId === chatId) {
    //     dispatch(addMessage({ chatId, message: msg }));
    //   }
    // };
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
              className="max-w-xs rounded-lg"
            />
          );
        case "video":
          return (
            <video
              src={msg.media.url}
              controls
              className="max-w-xs rounded-lg"
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
          className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div className="px-4 py-2 rounded-xl bg-muted">{renderMessageContent(msg)}</div>
          {/* <div className="px-4 py-2 rounded-xl bg-muted">{msg.content ||  <img
              src={msg.media?.url}
              alt="chat"
              className="max-w-xs rounded-lg"
            />}</div> */}
            
            {/* <div className={ `${msg.media}`?`px-4 py-2 rounded-xl bg-muted` :"display-none"}>{msg.media.url}</div> */}
        </div>
      ))}
            <div ref={bottomRef} />
    </div>
  );
}
