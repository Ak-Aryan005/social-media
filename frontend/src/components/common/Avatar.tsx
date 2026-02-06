interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export default function Avatar({
  src,
  alt,
  size = 'md',
  className = '',
}: AvatarProps) {
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {/* {alt.charAt(0).toUpperCase()} */} {alt}
        </div>
      )
      }
    </div>
  );
}
