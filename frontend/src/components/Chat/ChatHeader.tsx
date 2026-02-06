import { motion } from "framer-motion";
import { useAppSelector } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
interface ChatHeaderProps {
  chatId: string;
}

export default function ChatHeader({ chatId }: ChatHeaderProps) {
  const { profile } = useAppSelector((state) => state.user);
  const { chatList } = useAppSelector((state) => state.chat);
  const navigate = useNavigate();
  // Find current chat
  const currentChat = chatList.find((chat) => chat._id === chatId);

  // Determine header user (other participant)
  const headerUser = currentChat?.userInfo || profile;

  if (!headerUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 border-b border-border/50"
    >
      <img
        src={headerUser.avatar}
        className="w-10 h-10 rounded-full object-cover"
        alt={headerUser.username}
      />

      <div
        className="flex-1 cursor-pointer"
        onClick={() => navigate(`/profile/${profile._id || headerUser._id}`)}
      >
        <span className="flex gap-1">
          <p className="font-semibold text-foreground">{headerUser.username}</p>
          {headerUser.isVerified && (
            <span className="font-semibold text-foreground text-sm sm:text-base pt-1">
              <MdVerified className="text-[#0093f5]" size={17} />
            </span>
          )}
        </span>
        <p className="text-xs text-muted-foreground">Active now</p>
      </div>

      <button className="p-2 rounded-full hover:bg-muted transition">
        <svg
          className="w-5 h-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
          />
        </svg>
      </button>
    </motion.div>
  );
}
