import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Loader from "@/components/common/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchChatList } from "@/redux/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { initSocket } from "@/socket/socket";
import { MdVerified,MdGroupAdd,MdOutlineGroupAdd,MdGroup } from "react-icons/md";
import { IoChatbubblesOutline  } from "react-icons/io5";
import { NavLink } from "react-router-dom";
function formatTime(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatList() {
  const dispatch = useAppDispatch();
const navigate= useNavigate()
  const { isAuthenticated,user } = useAppSelector((state) => state.auth);
 const currentUserId = user?._id
  const { chatList, isLoading } = useAppSelector(
    (state) => state.chat
  );
const avatarimg = "/DP For Girls (19).jpg";

  useEffect(() => {
    dispatch(fetchChatList()); // ✅ API RUNS HERE
  }, [dispatch]);

  const chats = chatList.map((chat) => {
    const user = chat.userInfo;
    const message = chat.messageInfo;
    return {
      chatId: chat._id,
      username: user?.username ?? "Unknown",
      isVerified : user?.isVerified ?? false,
      avatar: user?.avatar ?? "",
      lastMessage: message?.content ?? "",
      time: formatTime(message?.createdAt),
      readBy:message.readBy
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground flex items-end justify-between">
            Messages <MdGroupAdd className="cursor-pointer" onClick={()=>navigate('/create-group')}/>

          </h1>
          <p className="text-muted-foreground">
            Your recent conversations
          </p>
        </motion.div>
      <motion.div  initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-around">
        <NavLink to={'/chatlist'}  style={({ isActive }) => ({
    borderBottom: isActive ? "2px solid currentColor" : "none",
    paddingBottom: "6px",
  })}><IoChatbubblesOutline size={25}  /></NavLink>
       <NavLink to={'/group-chats'}  style={({ isActive }) => ({
    borderBottom: isActive ? "2px solid currentColor" : "none",
    paddingBottom: "6px",
  })}> <MdGroup size={25} /></NavLink>
      </motion.div>
        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center py-16"> 
            <Loader
              size="lg"
              variant="instagram"
              text="Loading chats..."
            />
          </div>
        )}

        {/* Chat List */}
        {!isLoading && chats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
          >
            {chats.map((chat, index) => (
              <motion.div
                key={chat.chatId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
                // onClick={()=>navigate(`/chat/${chatList?.map(id=>id.userInfo[0]._id)}`)}
                // onClick={()=>navigate(`/chat/${chatList?.map(id=>id._id)}`)}
                onClick={() => navigate(`/chat/${chat.chatId}`)}

                className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition cursor-pointer border-b last:border-b-0"
              >
                <img
                  src={chat.avatar|| avatarimg}
                  alt={chat.username}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className={`flex justify-between`}>
                     <span className='flex gap-1'>
                                 <h3 className="font-semibold truncate">
                      {chat.username}
                    </h3>
                        { chat.isVerified && <span className="font-semibold text-foreground text-sm sm:text-base pt-1">
                           <MdVerified className='text-[#0093f5]' size={17} />
                             </span>}
                             </span> 
                   
                    <span className="text-xs text-muted-foreground">
                      {chat.time}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty */}
        {!isLoading && chats.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
}
