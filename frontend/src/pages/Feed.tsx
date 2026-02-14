import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import StoryItem from '@/components/Feed/StoryItem';
import PostCard from '@/components/Feed/PostCard';
import Loader from '@/components/common/Loader';
import { FeedSkeleton } from '@/components/common/SkeletonLoader';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchFeed } from '@/redux/slices/postsSlice';
import StoriesList from '@/components/Feed/StoriesList';

export default function Feed() {
  const dispatch = useAppDispatch();
const { feed, isLoading, page, hasMore,isFetchingMore } = useAppSelector(
  (state) => state.posts
);
 useEffect(() => {
  dispatch(fetchFeed({ page: 1, limit: 5 }));
}, [dispatch]);

useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200 &&
      hasMore &&
      !isLoading
    ) {
      dispatch(fetchFeed({ page: page + 1, limit: 5 }));
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [page, hasMore, isLoading, dispatch]);


  // Ensure feed is always an array
  const posts = Array.isArray(feed) ? feed : [];

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 mb-6 sm:mb-8 overflow-hidden backdrop-blur-sm"
        >
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-2 min-w-max">
              <StoriesList />
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        {isLoading && posts.length === 0 && <FeedSkeleton count={3} />}
        {isLoading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <Loader size="lg" variant="instagram" text="Loading more posts..." />
          </motion.div>
        )}

        {!isLoading &&
          posts.length > 0 &&
          posts.map((post: any, index: number) => {
            const fixedPost = {
              ...post,
              id: post.id || post._id || `post-${index}`,
              userId: post.userId || post.user?._id || post.user || 'unknown',
              username: post.username || post.user?.username || 'Unknown',
              // avatar: post.avatar || post.user?.avatar || '',
              avatar: post.avatar ?? post.data?.avatar ?? "",
              image: post.image || post.media?.[0] || post.media || '',
              caption: post.caption || '',
              likes: post.likes || post.likesCount || 0,
              comments: post.comments || [],
              isLiked: post.isLiked || false,
              isVerified:post.isVerified || false,
              createdAt:
                post.createdAt || post.created_at || new Date().toISOString(),
            };

            // Skip if no image
            if (!fixedPost.image) {
              return null;
            }

            return (
              <motion.div
                key={fixedPost.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.08,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                }}
                className="mb-6"
              >
                <PostCard {...fixedPost} />
              </motion.div>
            );
          })}
{isFetchingMore && (
  <div className="flex justify-center py-6">
    <Loader
      size="lg"
      variant="instagram"
      text="Loading more posts..."
    />
  </div>
)}

        {!isLoading && posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center"
              >
                <svg
                  className="w-14 h-14 text-purple-500 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-3"
              >
                No posts yet
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-lg"
              >
                Follow some users to see their posts in your feed!
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
