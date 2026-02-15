import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, UserMinus, Settings, MoreVertical,MessageCircle } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchChatList } from "@/redux/slices/chatSlice";
import { useEffect } from 'react';
import { followUser, unfollowUser } from '@/redux/slices/userSlice';
import { MdVerified } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
interface ProfileHeaderProps {
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
  isFollowing: boolean;
  isOwnProfile: boolean;
  isVerififed: boolean;
  onEditClick?: () => void;
}

export default function ProfileHeader({
  userId,
  fullName,
  username,
  avatar,
  followers,
  following,
  posts,   
  bio,
  isFollowing,
  isOwnProfile,
  isVerififed,
  onEditClick,
}: ProfileHeaderProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.user);
  const [isFollowingLocal, setIsFollowingLocal] = useState(isFollowing);
const navigate= useNavigate()
const { chatList } = useAppSelector((state) => state.chat);
const avatarimg = "/DP For Girls (19).jpg";

  // Find current chat
const existingChat = chatList.find(
  chat => chat.userInfo?._id === userId
);  
const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Even if logout fails, clear local state
    }
    navigate('/login');
  };

useEffect(() => {
  if (!chatList.length) {
    dispatch(fetchChatList());
  }
}, [dispatch, chatList.length]);

  useEffect(() => {
  setIsFollowingLocal(isFollowing);
}, [isFollowing]);
  const handleFollowClick = async () => {
    try {
      if (isFollowingLocal) {
        await dispatch(unfollowUser(userId)).unwrap();
        setIsFollowingLocal(false);  
      } else {
        await dispatch(followUser(userId)).unwrap();
        setIsFollowingLocal(true);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };
const handleMessageClick = () => {
  if (existingChat) {
    navigate(`/chat/${existingChat._id}`);
  } else {
    navigate(`/chat/user/${userId}`);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-card/80 backdrop-blur-sm border-b border-border/50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 flex-wrap">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            {/* <motion.div> */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-border ring-2 ring-primary/20 shadow-lg"
            >
              <img
                src={avatar || avatarimg}
                alt={username}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 w-full min-w-0">
            {/* Username and Actions */}
            <div className="flex  sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {username}
              </h1>
             { isVerififed && <span className='pt-1'>
                <MdVerified className='text-[#0093f5]' size={22} />
              </span>}
            </div>
              <p className='font-semibold text-foreground text-sm sm:text-base mt-1 mb-1'>{fullName}</p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-6 sm:gap-8 mb-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                    className="hover:opacity-80 transition-all duration-200 block">
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {posts.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">posts</p>
                  </div>
               
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/profile/${userId}/followers`}
                  className="hover:opacity-80 transition-all duration-200 block"
                >
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {followers.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">followers</p>
                  </div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/profile/${userId}/following`}
                  className="hover:opacity-80 transition-all duration-200 block"
                >
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {following.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">following</p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Bio */}
            {bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-foreground text-sm sm:text-base break-words"
              >
                {bio}
              </motion.p>
            )}

          
                <div className='mt-4'>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                {isOwnProfile ? (
                  <>
                    <Button
                      onClick={onEditClick}
                      variant="outline"
                      className="flex-1 sm:flex-initial"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem>
                         <Link to="/subscription">Subscription</Link> 
                          </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" 
                         onClick={handleLogout}>
                          Log Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                  <Button
                    onClick={handleFollowClick}
                    disabled={isLoading}
                    variant={isFollowingLocal ? 'outline' : 'default'}
                    className={`flex-1 sm:flex-initial ${!isFollowingLocal?"bg-[#4b5ffa] text-cyan-50" : ""}`}
                  >
                    {isFollowingLocal ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                    <Button className="flex-1 sm:flex-initial "
                    variant={isFollowingLocal ? 'outline' : 'default'}
                    onClick={handleMessageClick}
                    > <MessageCircle /> Message</Button>
                    </>
                )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
