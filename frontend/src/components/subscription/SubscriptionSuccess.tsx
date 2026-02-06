import { motion } from 'framer-motion';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center"
      >
        <CheckBadgeIcon className="w-14 h-14 text-blue-500" />
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        You’re Verified!
      </h2>

      <p className="text-muted-foreground mb-6">
        Your blue tick subscription is now active for 1 month.
      </p>

      <button className="rounded-xl bg-blue-500 text-white px-6 py-3 font-semibold"
        onClick={() => navigate('/')}>
           Back to Home
      </button>
    </div>
  );
}
