import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface AnimatedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Renders a centered modal dialog with animated backdrop and scale/fade transitions.
 *
 * Renders nothing when `isOpen` is `false`; when `isOpen` is `true` it mounts an overlay
 * with a backdrop and an animated dialog panel containing the provided `title` and `children`.
 *
 * @param isOpen - Controls whether the dialog is mounted and visible
 * @param onClose - Called when the close button in the top-right of the dialog is clicked
 * @param title - Heading text displayed at the top of the dialog
 * @param children - Content rendered inside the dialog body
 * @param className - Additional classes applied to the dialog container (default: `"max-w-4xl"`)
 * @returns A React element that mounts the animated dialog when `isOpen` is `true`, otherwise `null`
 */
export function AnimatedDialog({ isOpen, onClose, title, children, className = "max-w-4xl" }: AnimatedDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`glass-card w-full ${className} max-h-[90vh] overflow-y-auto relative`}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">{title}</h2>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
