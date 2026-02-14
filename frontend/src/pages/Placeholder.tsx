import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchUserNotifications,
  markNotificationAsRead,
} from '@/redux/slices/notificationSlice';
import Loader from '@/components/common/Loader';
import { formatDistanceToNow } from 'date-fns';

const renderMessage = (n: any) => {
  switch (n.type) {
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'commented on your post';
    case 'follow':
      return 'started following you';
    case 'message':
      return 'sent you a message';
    default:
      return n.message || 'sent you a notification';
  }
};

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector(
    (state) => state.notifications
  );
const avatarimg = "/DP For Girls (19).jpg";

  useEffect(() => {
    dispatch(fetchUserNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleRead = (id: string, isRead: boolean) => {
  if (!isRead) {
    dispatch(markNotificationAsRead(id));       // API call
  }
};


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-foreground mb-6"
        >
          Notifications
        </motion.h1>

        {/* Loading */}
        {isLoading && notifications.length === 0 && (
          <div className="flex justify-center py-12">
            <Loader variant="instagram" text="Loading notifications..." />
          </div>
        )}

        {/* Notifications List */}
        {!isLoading &&
          notifications.map((n, index) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 120,
                damping: 15,
              }}
              onClick={() => handleRead(n._id, n.isRead)}
              className={`mb-3 cursor-pointer`}
            >
              <div
                className={`flex items-start gap-4 p-4 rounded-2xl border
                ${
                  n.isRead
                    ? 'bg-card border-border/50'
                    : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-900/50'
                }
                shadow-sm hover:shadow-md transition-all`}
              >
                {/* Avatar */}
                <img
                  src={n.relatedUser?.avatar || avatarimg}
                  alt="avatar"
                  className="w-11 h-11 rounded-full object-cover"
                />

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">
                      {n.relatedUser?.username || 'Someone'}
                    </span>{' '}
                    {renderMessage(n)}
                  </p>

                  {n.createdAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <span className="mt-2 w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </motion.div>
          ))}

        {/* Empty State */}
        {!isLoading && notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-28 h-28 mx-auto mb-6 rounded-full
                bg-gradient-to-br from-purple-100 to-pink-100
                dark:from-purple-900/30 dark:to-pink-900/30
                flex items-center justify-center"
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
                  />
                </svg>
              </motion.div>

              <h3 className="text-2xl font-bold text-foreground mb-3">
                No notifications yet
              </h3>
              <p className="text-muted-foreground text-lg">
                When someone interacts with you, you’ll see it here.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
