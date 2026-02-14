import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import InstagramLogo from './InstagramLogo';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'instagram';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const sizeIconClasses = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export default function Loader({
  size = 'md',
  fullScreen = false,
  text,
  variant = 'spinner',
  className = '',
}: LoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'instagram':
        return (
          <motion.div
            className={`${sizeClasses[size]} relative ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <InstagramLogo
              size={sizeIconClasses[size]}
              className="absolute inset-0 m-auto"
            />
          </motion.div>
        );
      case 'spinner':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className={className}
          >
            <Loader2
              size={sizeIconClasses[size]}
              className="text-primary animate-pulse"
            />
          </motion.div>
        );
      case 'dots':
        return (
          <div className={`flex gap-2 ${className}`}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-500 to-pink-500`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-500 to-pink-500 ${className}`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      case 'bars':
        return (
          <div
            className={`flex gap-1.5 items-end ${sizeClasses[size]} ${className}`}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                style={{ height: '100%' }}
                animate={{
                  height: ['30%', '100%', '30%'],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className={className}
          >
            <Loader2
              size={sizeIconClasses[size]}
              className="text-primary animate-pulse"
            />
          </motion.div>
        );
    }
  };

  const loader = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      {renderLoader()}
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-muted-foreground animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-background/95 backdrop-blur-md z-50"
      >
        {loader}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">{loader}</div>
  );
}
