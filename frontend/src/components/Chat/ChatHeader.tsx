import { motion } from "framer-motion";
import { useAppSelector } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import Loader from "../common/Loader";
interface ChatHeaderProps {
  chatId: string;
}

export default function ChatHeader({ chatId }: ChatHeaderProps) {
  const { profile } = useAppSelector((state) => state.user);
  const { chatList } = useAppSelector((state) => state.chat);
  const avatarimg = "/DP For Girls (19).jpg";
  const navigate = useNavigate();
  // Find current chat
  const currentChat = chatList.find((chat) => chat._id === chatId);
 const { groupList, isLoading } = useAppSelector(
    (state) => state.chat
  );

  const matchedGroup = groupList.find((u) => u._id === chatId);

  if (isLoading) {
  return <Loader />;
}

if (!currentChat && !matchedGroup) {
  return <Loader />;
}

  // Determine header user (other participant)
  const headerUser = currentChat?.userInfo || profile;
// defaults
const defaultUser = "/DP For Girls (19).jpg";
const defaultGroup = "/We Bare Bears Pictures.jpg";

// detect if this chat is a group
const isGroupChat = matchedGroup?.isGroup === true;
// console.log(`is ${isGroupChat}`)
const handleClick = () => {
  if (isGroupChat) {
    navigate(`/group/${chatId}`);
  } else {
    navigate(`/profile/${profile?._id || headerUser?._id}`);
  }
};

// decide avatar
const avatarSrc = isGroupChat
  ? matchedGroup?.groupAvatar || defaultGroup
  : headerUser?.avatar || defaultUser;

// decide display name
const displayName = isGroupChat
  ? matchedGroup?.groupName || "Group"
  : headerUser?.username || "Unknown";


  // if (!headerUser) return null;
// if (!headerUser || !groupList) return <Loader />

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 border-b border-border/50"
    >
      <img
        src={avatarSrc}
        className="w-10 h-10 rounded-full object-cover"
        alt={displayName}
      />

      <div
        className="flex-1 cursor-pointer"
        // onClick={() =>  navigate(`/profile/${profile?._id || headerUser?._id}`)}  
        onClick={handleClick}  
      >
        <span className="flex gap-1">
          <p className="font-semibold text-foreground"> {displayName || "kk"}</p>

          {headerUser?.isVerified && isGroupChat===false && (
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
