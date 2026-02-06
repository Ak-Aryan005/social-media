import { motion } from 'framer-motion';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface Props {
  onPay: () => void;
  loading: boolean;
}

export default function PaymentStep({ onPay, loading }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <LockClosedIcon className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">
            Secure Payment
          </h2>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          Pay $3 for one month of verified subscription. Your payment is encrypted and secure.
        </p>

        <button
          onClick={onPay}
          disabled={loading}
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 font-semibold flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            'Pay & Subscribe'
          )}
        </button>
      </motion.div>
    </div>
  );
}
