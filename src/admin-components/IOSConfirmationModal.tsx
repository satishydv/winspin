import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle, 
  Info,
  X 
} from 'lucide-react';

interface IOSConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'info' | 'success';
}

export default function IOSConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default'
}: IOSConfirmationModalProps) {
  
  // Custom helper to locate theme icons
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-450 shrink-0" />;
      case 'info':
        return <Info className="h-6 w-6 text-sky-400 shrink-0" />;
      default:
        return <HelpCircle className="h-6 w-6 text-indigo-400 shrink-0" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'danger':
        return 'from-rose-500/20 to-red-600/10';
      case 'success':
        return 'from-emerald-500/20 to-emerald-600/10';
      case 'info':
        return 'from-sky-500/20 to-sky-600/10';
      default:
        return 'from-indigo-600/20 to-[#4E5DFD]/15';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'ios-glass-btn-danger';
      default:
        return 'ios-glass-btn-primary';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Backdrop blur layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Liquid organic light blobs (Behind the Glass Pane for deep depth effect) */}
          <div className="absolute w-[360px] h-[360px] pointer-events-none overflow-hidden rounded-full">
            {/* Blob 1 */}
            <div className="absolute top-1/4 left-1/4 w-44 h-44 bg-indigo-500/25 rounded-full blur-[45px] animate-blob-1" />
            
            {/* Blob 2 (Dynamic Liquid) */}
            <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-[50px] animate-blob-2 ${
              type === 'danger' ? 'bg-rose-550/20' : 'bg-emerald-500/15'
            }`} />
          </div>

          {/* Liquid Glass Pane */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl ios-liquid-glass p-6 text-center z-10 font-sans"
          >
            
            {/* Specular sheen reflection gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-white/[0.12] pointer-events-none rounded-3xl" />

            <div className="flex flex-col items-center gap-4">
              
              {/* Premium Floating Ring Header Icon */}
              <div className={`p-4 rounded-2xl bg-gradient-to-b ${getAccentColor()} border border-white/10 shadow-inner flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm" />
                {getIcon()}
              </div>

              {/* Title & Description with light reflection specularity */}
              <div className="space-y-1.5 px-2">
                <h3 className="text-sm font-extrabold tracking-wide text-white uppercase font-display select-none">
                  {title}
                </h3>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Action Buttons styled like Apple/iOS Liquid segmented controls */}
              <div className="grid grid-cols-2 gap-3 w-full mt-4 border-t border-white/5 pt-4">
                
                {/* Secondary/Cancel Button */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-350 ios-glass-btn-secondary focus:outline-none transition-all active:scale-[0.96] hover:text-white cursor-pointer select-none"
                >
                  {cancelText}
                </button>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`w-full py-2.5 rounded-xl text-xs font-extrabold text-white focus:outline-none transition-all active:scale-[0.96] hover:brightness-110 cursor-pointer select-none ${getButtonClass()}`}
                >
                  {confirmText}
                </button>

              </div>

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
