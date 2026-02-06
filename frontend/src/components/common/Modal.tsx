import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-xl',
};

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`${sizeClasses[size]} bg-card rounded-xl shadow-lg border border-border overflow-hidden max-h-[90vh] flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
