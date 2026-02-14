import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Send,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { likePost, unlikePost,deletePost } from '@/redux/slices/postsSlice';
import { createComment, getComments } from '@/redux/slices/commentsSlice';
import { formatDistanceToNow } from 'date-fns';
import { Formik, Form, Field } from 'formik';
import { commentSchema } from '@/utils/validationSchemas';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MdVerified } from 'react-icons/md';
import { toast } from 'sonner';
import DeletePostModal from './DeletePostModal';
import { useNavigate } from 'react-router-dom';
interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  text: string;
  content?: string;
  createdAt: string;
}

interface PostCardProps {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  image: string[];
  caption: string;
  location: string;
  likes: number;
  isVerified: boolean;
  comments: Comment[];
  isLiked: boolean;
  createdAt: string;
}

export default function PostCard({
  id,
  userId,
  username,
  avatar,
  image,
  caption,
  isVerified,
  likes: initialLikes,
  comments: initialComments,
  isLiked: initialIsLiked,
  location,
  createdAt
}: PostCardProps) {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [animatingLike, setAnimatingLike] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const lastTapTime = useRef<number>(0);
const [currentImage, setCurrentImage] = useState(0);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const { isLoading } = useAppSelector((state) => state.posts);
const avatarimg = "/DP For Girls (19).jpg";
  const postComments = useAppSelector((state) =>
    state.comments.comments.filter((c: any) => (c.targetId === id || c.targetId === undefined))
  );
  // Use Redux comments if available, otherwise fall back to initial comments
  const comments = postComments.length > 0 ? postComments : initialComments;
  const safeComments = Array.isArray(comments) ? comments : [];
useEffect(() => {
  if (showComments) {
    dispatch(getComments(id));
  }
}, [showComments, id, dispatch, comments.length]);


  const handleDoubleTap = async (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      if (!isLiked) {
        try {
          await dispatch(likePost({ targetType: 'post', targetId: id })).unwrap();
          setIsLiked(true);
          setLikes((prev) => prev + 1);
          setAnimatingLike(true);
          setTimeout(() => setAnimatingLike(false), 700);
        } catch (error) {
          toast.error('Failed to like post');
        }
      }
      lastTapTime.current = 0; // Reset to prevent triple tap
    } else {
      lastTapTime.current = now;
    }
  };

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await dispatch(unlikePost({ targetType: 'post', targetId: id })).unwrap();
        setIsLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
      } else {
        await dispatch(likePost({ targetType: 'post', targetId: id })).unwrap();
        setIsLiked(true);
        setLikes((prev) => prev + 1);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleAddComment = async (values: { text: string }, { resetForm }: any) => {
    try {
      await dispatch(
        createComment({
          targetType: 'post',
          targetId: id,
          content: values.text,
        })
      ).unwrap();
      resetForm();
      if (!showComments) {
        setShowComments(true);
      }
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s post`,
          text: caption,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

const navigate = useNavigate();
const handleDeletePost = async () => {
  try {
    await dispatch(deletePost(id)).unwrap();
    toast.success('Post deleted');
    setShowDeleteModal(false);
     navigate(`/profile/${userId}`);
  } catch {
    toast.error('Failed to delete post');
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        <Link
          to={`/profile/${userId}`}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          {avatar && (
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={avatar|| avatarimg}
              alt={username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
            />
          )}
          <div>
           <span className='flex gap-1'>
            <p className="font-semibold text-foreground text-sm sm:text-base">
              {username}
            </p>
           { isVerified && <span className="font-semibold text-foreground text-sm sm:text-base pt-1">
             <MdVerified className='text-[#0093f5]' size={17} />
            </span>}
            </span> 
            <p className="text-xs text-muted-foreground">
              {/* {formatDistanceToNow(new Date(createdAt), { addSuffix: true })} */}
              {location}
            </p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {currentUser?._id === userId ? (
              <>
                <DropdownMenuItem>
                    <Link to={`/posts/${id}/edit`}>Edit Post</Link>
                  </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteModal(true)}>
                  Delete Post
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Unfollow</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image with Double-Tap Like Animation */}
      <div
        className="relative bg-muted cursor-pointer group overflow-hidden"
        onClick={handleDoubleTap}
      >
        <motion.img
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          src={image[currentImage]}
          alt="Post"
          className="w-full aspect-square object-cover select-none"
          loading="lazy"
        />
         {/* ⬅️➡️ IMAGE NAVIGATION BUTTONS */}
  {image.length > 1 && (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent double-tap like
          setCurrentImage((prev) =>
            prev === 0 ? image.length - 1 : prev - 1
          );
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full"
      >
        ‹
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImage((prev) =>
            prev === image.length - 1 ? 0 : prev + 1
          );
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-2 py-1 rounded-full"
      >
        ›
      </button>
    </>
  )}
        <AnimatePresence>
          {animatingLike && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 1, 0],
                rotate: [0, -10, 10, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Heart
                  size={100}
                  className="text-white fill-red-500 drop-shadow-2xl filter blur-sm"
                />
              </motion.div>
              <Heart
                size={100}
                className="absolute text-white fill-white drop-shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLikeClick}
              className="transition-all duration-200"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={26}
                  className={`transition-all duration-200 ${
                    isLiked
                      ? 'fill-red-500 text-red-500'
                      : 'text-foreground hover:text-red-500 hover:fill-red-500/20'
                  }`}
                />
              </motion.div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Comments"
            >
              <MessageCircle size={24} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Share"
            >
              <Send size={24} />
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors ${
              isBookmarked
                ? 'text-primary fill-primary'
                : 'text-foreground hover:text-primary'
            }`}
            aria-label="Bookmark"
          >
            <Bookmark size={24} className={isBookmarked ? 'fill-current' : ''} />
          </motion.button>
        </div>

        {/* Likes and Caption */}
        <div className="space-y-2">
          {likes > 0 && (
            <p className="font-semibold text-sm text-foreground">
              {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
            </p>
          )}
          {caption && (
            <p className="text-foreground text-sm break-words">
              <Link
                to={`/profile/${userId}`}
                className="font-semibold hover:opacity-70 transition"
              >
                {username}
              </Link>{' '}
              {caption}
            </p>
          )}
          {comments.length > 0 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className="text-muted-foreground text-sm hover:text-foreground transition"
            >
              View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto px-3 sm:px-4 py-3 space-y-3">
              {   
              safeComments.length === 0  ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                safeComments.map((comment: any) => (
                  <motion.div
                    key={comment.id || comment._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2"
                  >
                   
                      <img
                        src={comment.avatar || avatarimg}
                        alt={comment.username}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground break-words">
                        <Link
                          to={`/profile/${comment.userId || comment.user?._id}`}
                          className="font-semibold hover:opacity-70 transition"
                        >
                          {comment.username || comment.user?.username}
                        </Link>{' '}
                        {comment.text || comment.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(
                          new Date(comment.createdAt),
                          { addSuffix: true }
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <Formik
              initialValues={{ text: '' }}
              validationSchema={commentSchema}
              onSubmit={handleAddComment}
            >
              {({ isSubmitting }) => (
                <Form className="flex items-center gap-2 border-t border-border px-3 sm:px-4 py-3">
                  <Field
                    as="input"
                    name="text"
                    placeholder="Add a comment..."
                    disabled={isSubmitting}
                    className="flex-1 bg-muted text-foreground text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    Post
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
      </AnimatePresence>
      <DeletePostModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeletePost}
  isLoading={isLoading}
/>

    </motion.div>
  );
}
