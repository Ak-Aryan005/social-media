import { motion } from 'framer-motion';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function BlueTickIntro({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckBadgeIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold text-foreground">
            Get Verified
          </h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Subscribe to get the official blue verification badge and protect
          your identity.
        </p>

        <ul className="space-y-3 mb-6">
          {[
            'Verified badge on your profile',
            'More trust & authenticity',
            'Protection from impersonation',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-foreground">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={onSubscribe}
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 transition text-white py-3 font-semibold"
        >
          Subscribe for $3 / month
        </button>
      </motion.div>
    </div>
  );
}
