import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import diamondImage from '../../assets/images/pngs/diamond.png';
import coinImage from '../../assets/images/pngs/coin.png';

interface PlayModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (mode: 'bonus' | 'cash') => void;
  bonusBalance?: number;
  cashBalance?: number;
}

const PlayModeModal: React.FC<PlayModeModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  bonusBalance = 350.00,
  cashBalance = 15.75,
}) => {
  const [selectedMode, setSelectedMode] = useState<'bonus' | 'cash'>('bonus');

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[360px] bg-[#1a1b23] rounded-[24px] overflow-hidden pointer-events-auto shadow-2xl border border-white/5"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b border-white/5">
                <div className="w-8"></div> {/* Spacer for center alignment */}
                <h2 className="text-[15px] font-sans font-bold text-white tracking-wide text-center uppercase">
                  Select Your Play Mode
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-3">
                {/* Bonus Option */}
                <button
                  onClick={() => setSelectedMode('bonus')}
                  className={`flex items-center p-3 rounded-2xl border ${
                    selectedMode === 'bonus'
                      ? 'border-[#f2d075] bg-[#f2d075]/5'
                      : 'border-white/10 bg-transparent hover:border-white/20'
                  } transition-all duration-200 w-full text-left`}
                >
                  {/* Radio button */}
                  <div className="flex-shrink-0 ml-1 mr-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedMode === 'bonus' ? 'border-[#e0e0e0]' : 'border-gray-500'
                    }`}>
                      {selectedMode === 'bonus' && <div className="w-2 h-2 rounded-full bg-[#e0e0e0]" />}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-[52px] h-[52px] rounded-[14px] bg-[#121319] flex items-center justify-center mr-3 shrink-0 shadow-inner overflow-hidden p-1.5">
                    <img src={diamondImage} alt="Diamond" className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pixelated" />
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[12px] font-sans font-extrabold text-white mb-0.5 tracking-tight uppercase">USE FREE POINT (BONUS)</span>
                    <span className="text-[20px] font-sans font-black text-[#5ba1f5] leading-none drop-shadow-[0_0_8px_rgba(91,161,245,0.4)]">
                      {bonusBalance.toFixed(2)}
                    </span>
                  </div>
                </button>

                {/* Cash Option */}
                <button
                  onClick={() => setSelectedMode('cash')}
                  className={`flex items-center p-3 rounded-2xl border ${
                    selectedMode === 'cash'
                      ? 'border-[#f2d075] bg-[#f2d075]/5'
                      : 'border-white/10 bg-transparent hover:border-white/20'
                  } transition-all duration-200 w-full text-left`}
                >
                  {/* Radio button */}
                  <div className="flex-shrink-0 ml-1 mr-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedMode === 'cash' ? 'border-[#e0e0e0]' : 'border-gray-500'
                    }`}>
                      {selectedMode === 'cash' && <div className="w-2 h-2 rounded-full bg-[#e0e0e0]" />}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-[52px] h-[52px] rounded-[14px] bg-[#121319] flex items-center justify-center mr-3 shrink-0 shadow-inner overflow-hidden p-1.5">
                    <img src={coinImage} alt="Coin" className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pixelated" />
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[12px] font-sans font-extrabold text-white mb-0.5 tracking-tight uppercase">USE REAL MONEY (CASH)</span>
                    <span className="text-[20px] font-sans font-black text-[#d6aa4d] leading-none drop-shadow-[0_0_8px_rgba(214,170,77,0.4)]">
                      ₹{cashBalance.toFixed(2)}
                    </span>
                  </div>
                </button>

                <div className="text-center mt-3 mb-2 px-2">
                  <p className="text-[11px] text-gray-400 mb-1 font-sans tracking-tight">Game cost: 10 Points/Money</p>
                  <p className="text-[10px] text-gray-500 leading-snug font-sans tracking-tight">
                    Real money can be used for all purchases. Locked Points can can be used only for Magic Cards and special plays.
                  </p>
                </div>

                <div className="flex justify-center mt-1 pb-1">
                  <button
                    onClick={() => onContinue(selectedMode)}
                    className="w-[180px] py-[10px] rounded-xl bg-gradient-to-b from-[#f3cf78] via-[#e2b152] to-[#c78831] hover:brightness-110 text-[#2a1b02] font-sans font-bold text-[14px] shadow-[0_4px_10px_rgba(218,165,32,0.2)] transition-all active:scale-95 border-b-4 border-[#a36920]"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlayModeModal;
