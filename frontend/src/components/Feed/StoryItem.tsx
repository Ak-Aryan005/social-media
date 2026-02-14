import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StoryItemProps {
  id: string;
  username: string;
  avatar: string;
  views?: string[]; // array of user IDs who viewed the story
  currentUserId: string; // your current logged-in user ID
  onClick?: () => void;
}

export default function StoryItem({
  id,
  username,
  avatar,
  views = [],
  currentUserId,
  onClick,
}: StoryItemProps) {
  // Determine if current user has viewed the story
  const isViewed = views.includes(currentUserId);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
    >
      <Link
        to={`/stories/${id}`}
        onClick={onClick}
        className="relative"
      >
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 flex-shrink-0 transition-all ${
            isViewed
              ? 'bg-muted'
              : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 animate-pulse'
          }`}
        >
          <div className="w-full h-full rounded-full bg-card p-1 flex items-center justify-center">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={avatar}
              alt={username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        {!isViewed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card"
          />
        )}
      </Link>
      <p className="text-xs text-foreground truncate max-w-[64px] sm:max-w-[80px] text-center">
        {username}
      </p>
    </motion.div>
  );
}
