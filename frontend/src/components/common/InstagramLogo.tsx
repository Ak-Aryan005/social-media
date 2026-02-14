import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface InstagramLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function InstagramLogo({
  size = 24,
  className = '',
  animated = false,
}: InstagramLogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const gradientId = `instagram-gradient-2011-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  // 2011 Instagram logo - Classic Polaroid camera design
  const logo = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definition - 2011 Instagram colors (brown to yellow to orange) */}
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6A453B" />
          <stop offset="25%" stopColor="#8B5A3C" />
          <stop offset="50%" stopColor="#C99E66" />
          <stop offset="75%" stopColor="#E4B04A" />
          <stop offset="100%" stopColor={isDark ? '#F5A623' : '#E4B04A'} />
        </linearGradient>
      </defs>

      {/* Main camera body - Polaroid style with rounded corners */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        ry="4"
        fill={`url(#${gradientId})`}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="0.5"
      />

      {/* Camera viewfinder - top center (2011 style) */}
      <rect
        x="10"
        y="5"
        width="4"
        height="2.5"
        rx="1"
        fill="rgba(0,0,0,0.3)"
      />

      {/* Camera flash - top right corner (2011 style) */}
      <circle cx="16.5" cy="7.5" r="1.2" fill="rgba(255,255,255,0.9)" />

      {/* Main lens - large circle in center (2011 Polaroid style) */}
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="rgba(0,0,0,0.2)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />

      {/* Inner lens circle */}
      <circle cx="12" cy="12" r="3.5" fill="rgba(0,0,0,0.4)" />

      {/* Lens highlight - small white circle (2011 detail) */}
      <circle cx="11" cy="11" r="0.8" fill="rgba(255,255,255,0.6)" />

      {/* Camera bottom detail - Polaroid photo slot (2011 style) */}
      <rect
        x="8"
        y="17"
        width="8"
        height="2"
        rx="1"
        fill="rgba(0,0,0,0.2)"
      />

      {/* Small decorative dots on bottom (2011 style) */}
      <circle cx="9.5" cy="18" r="0.4" fill="rgba(255,255,255,0.5)" />
      <circle cx="14.5" cy="18" r="0.4" fill="rgba(255,255,255,0.5)" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="inline-block"
      >
        {logo}
      </motion.div>
    );
  }

  return logo;
}

