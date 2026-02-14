import Navbar from "@/components/common/Navbar";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatMessages from "@/components/Chat/ChatMessages";
import ChatInput from "@/components/Chat/ChatInput";
import { motion } from "framer-motion";
import { useParams,useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import ChatList from "./ChatList";

export default function Chat() {
  const { chatId, userId } = useParams<{ chatId?: string; userId?: string }>();
  const currentUserId = useAppSelector((s) => s.auth.user?._id);
  const navigate = useNavigate();

  if (!currentUserId) return null;

  // Determine if we are in an existing chat or first-time message
  const isExistingChat = !!chatId;
  const receiverId = !isExistingChat ? userId : undefined;

  return (
// min-h-screen
<div className=" bg-background flex flex-col overflow-hidden">
  {/* Navbar (optional) */}

  <div className="flex-1 mx-auto w-full max-w-3xl px-4 flex overflow-hidden">
    <div className="bg-card flex flex-col rounded-xl overflow-hidden flex-1 my-4 md:h-[84vh] h-[75vh] ">
      
      {/* Header (fixed) */}
      <ChatHeader chatId={chatId} />

      {/* Messages (ONLY this scrolls) */}
      <div className="flex-1 overflow-y-auto h-[500px]">
        <ChatMessages chatId={chatId} />
      </div>

      {/* Input (ALWAYS visible) */}
      <div className="border-t shrink-0">
        <ChatInput
          chatId={chatId}
          receiverId={receiverId}
          navigate={navigate}
        />
      </div>

    </div>
  </div>
</div>
  );
}
