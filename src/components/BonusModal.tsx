import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import bonusImage from '../../assets/images/pngs/bonus_modal.png';

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const BonusModal: React.FC<BonusModalProps> = ({ isOpen, onClose, onAccept }) => {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[600px] bg-[#1a1f26] rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
            >
              <div className="flex flex-col md:flex-row items-stretch">

                {/* Left Side Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center order-2 md:order-1 relative z-10">
                  <h2 className="text-2xl md:text-[28px] font-sans font-bold text-white mb-3 leading-tight tracking-wide">
                    Accept your Bonus or Reject it
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed font-sans font-medium">
                    Enjoy immediate rewards and benefits, or decline to play without restrictions. Make your choice now to personalize your experience.
                  </p>

                  <div className="flex flex-row items-center gap-3 w-full">
                    <button
                      onClick={onAccept}
                      className="flex-1 px-4 py-2.5 rounded-[100px] bg-gradient-to-b from-[#f2d075] to-[#c79133] hover:brightness-110 text-[#1a1300] font-sans font-bold text-[14px] transition-all shadow-[0_0_20px_rgba(214,165,74,0.3)] active:scale-95 border border-[#ffe9a6]/50 text-center flex items-center justify-center"
                    >
                      Accept
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-[100px] bg-[#29303c] hover:bg-[#323947] border border-[#5a6272] text-white font-sans font-bold text-[14px] transition-all active:scale-95 text-center flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="w-full md:w-[280px] flex items-end justify-center md:justify-end bg-[#1a1f26] order-1 md:order-2 pt-6 md:pt-0 relative overflow-hidden">
                  <img
                    src={bonusImage}
                    alt="Bonus Controller"
                    className="w-[220px] md:w-full h-auto object-contain md:transform md:translate-y-6 md:translate-x-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-0"
                  />
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BonusModal;
