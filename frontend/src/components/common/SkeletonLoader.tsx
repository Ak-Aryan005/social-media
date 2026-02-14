import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-muted';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

interface SkeletonLoaderProps {
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonLoader({
  count = 1,
  variant = 'rectangular',
  width,
  height,
  className = '',
}: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          width={width}
          height={height}
          className={className}
        />
      ))}
    </>
  );
}

// Post Card Skeleton
export function PostCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={100} height={16} />
        </div>
        <Skeleton variant="circular" width={24} height={24} />
      </div>

      {/* Image */}
      <Skeleton variant="rectangular" width="100%" height={400} />

      {/* Actions */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
          <Skeleton variant="circular" width={24} height={24} />
        </div>
        <Skeleton variant="text" width={80} height={16} className="mb-2" />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-8">
      <div className="flex items-center gap-8 mb-8">
        <Skeleton variant="circular" width={150} height={150} />
        <div className="flex-1 space-y-4">
          <Skeleton variant="text" width={200} height={24} />
          <div className="flex gap-8">
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={80} height={16} />
          </div>
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
        </div>
      </div>
    </div>
  );
}

// Feed Skeleton
export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <PostCardSkeleton />
        </motion.div>
      ))}
    </>
  );
}

