import { useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchGroupList } from "@/redux/slices/chatSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { IoChatbubblesOutline } from "react-icons/io5";
import { MdGroup } from "react-icons/md";

function formatTime(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GroupChats() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { groupList, isLoading } = useAppSelector(
    (state) => state.chat
  );

  const avatarFallback = "/We Bare Bears Pictures.jpg";

  useEffect(() => {
    dispatch(fetchGroupList());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Group Chats
          </h1>
          <p className="text-muted-foreground">
            Your group conversations
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex justify-around"
        >
          <NavLink
            to={"/chatlist"}
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid currentColor" : "none",
              paddingBottom: "6px",
            })}
          >
            <IoChatbubblesOutline size={25} />
          </NavLink>

          <NavLink
            to={"/group-chats"}
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid currentColor" : "none",
              paddingBottom: "6px",
            })}
          >
            <MdGroup size={25} />
          </NavLink>
        </motion.div>

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader size="lg" variant="instagram" text="Loading groups..." />
          </div>
        )}

        {/* Group List */}
        {!isLoading && groupList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
          >
            {groupList.map((group, index) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
                onClick={() => navigate(`/chat/${group._id}`)}
                className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition cursor-pointer border-b last:border-b-0"
              >
                <img
                  src={group.groupAvatar || avatarFallback}
                  alt={group.groupName}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold truncate">
                      {group.groupName}
                    </h3>

                    <span className="text-xs text-muted-foreground">
                      {formatTime(group.messageInfo?.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate">
                    {group.messageInfo?.content || "No messages yet"}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty */}
        {!isLoading && groupList.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No group conversations yet
          </div>
        )}
      </div>
    </div>
  );
}
