import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8 text-center backdrop-blur-sm">
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full 
                       bg-gradient-to-br 
                       from-red-100 to-pink-100 
                       dark:from-red-900/30 dark:to-pink-900/30 
                       flex items-center justify-center"
          >
            <XCircleIcon className="w-12 h-12 text-red-500 dark:text-red-400" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-3"
          >
            Payment Cancelled
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6"
          >
            Your subscription payment was not completed.  
            No worries — you can try again anytime.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => navigate('/subscription')}
              className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white py-3 font-semibold transition"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full rounded-xl border border-border text-foreground py-3 font-semibold hover:bg-muted transition"
            >
              Back to Home
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
