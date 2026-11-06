import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Bomb, Gem, Flame, ShieldAlert, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { MineCell, BetHistoryItem } from '../types';
import { sound } from '../utils/audio';

interface MinesGameProps {
  balance: number;
  updateBalance: (amount: number, gameType: 'Mines' | 'Crash' | 'Slots (Ra\'s Reckoning)' | 'Slots (Book of Abyss)' | 'Slots (Buffalo Song)', multiplier: number, outcome: 'win' | 'loss') => void;
  onBack: () => void;
}

export default function MinesGame({ balance, updateBalance, onBack }: MinesGameProps) {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [mineCount, setMineCount] = useState<number>(3);
  const [board, setBoard] = useState<MineCell[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [mineIndices, setMineIndices] = useState<Set<number>>(new Set());
  const [multiplier, setMultiplier] = useState<number>(1);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Generate initial board
  useEffect(() => {
    resetBoard();
  }, [mineCount]);

  const resetBoard = () => {
    const newBoard = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      isMine: false,
      isRevealed: false,
    }));
    setBoard(newBoard);
    setIsGameOver(false);
    setIsWon(false);
    setMultiplier(1);
    setRevealedCount(0);
  };

  const handleStartGame = () => {
    sound.playClick();
    if (betAmount <= 0) {
      setErrorMsg('Bet must be greater than 0');
      return;
    }
    if (betAmount > balance) {
      setErrorMsg('Insufficient balance');
      return;
    }
    setErrorMsg('');

    // Generate random mines
    const indices = new Set<number>();
    while (indices.size < mineCount) {
      indices.add(Math.floor(Math.random() * 25));
    }
    setMineIndices(indices);

    const newBoard = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      isMine: indices.has(i),
      isRevealed: false,
    }));

    setBoard(newBoard);
    setIsPlaying(true);
    setIsGameOver(false);
    setIsWon(false);
    setMultiplier(1);
    setRevealedCount(0);

    // Deduct initial bet
    updateBalance(-betAmount, 'Mines', 0, 'loss');
  };

  // Standard multiplier helper for Mines
  // formula approximates: House edge ~ 2-5%
  const calculateMultiplier = (mines: number, revealed: number) => {
    if (revealed === 0) return 1;
    let prob = 1;
    for (let i = 0; i < revealed; i++) {
      prob *= (25 - mines - i) / (25 - i);
    }
    const houseEdge = 0.97; // 3% edge
    const rawMult = 1 / prob;
    return parseFloat((rawMult * houseEdge).toFixed(2));
  };

  const handleCellClick = (id: number) => {
    if (!isPlaying || isGameOver || isWon) return;

    const cell = board[id];
    if (cell.isRevealed) return;

    sound.playClick();
    const newBoard = [...board];
    newBoard[id] = { ...cell, isRevealed: true };

    if (cell.isMine) {
      // Exploded! Game over
      sound.playExplosion();
      setIsGameOver(true);
      setIsPlaying(false);
      // Reveal all mines
      newBoard.forEach((c, idx) => {
        if (mineIndices.has(idx)) {
          newBoard[idx] = { ...c, isRevealed: true };
        }
      });
      setBoard(newBoard);
    } else {
      // Gem revealed!
      sound.playGem();
      const nextRevealedCount = revealedCount + 1;
      setRevealedCount(nextRevealedCount);

      const nextMult = calculateMultiplier(mineCount, nextRevealedCount);
      setMultiplier(nextMult);

      setBoard(newBoard);

      // Check if all gems are revealed, auto cashout
      if (nextRevealedCount === 25 - mineCount) {
        handleCashout(nextMult);
      }
    }
  };

  const handleCashout = (finalMultiplier = multiplier) => {
    if (!isPlaying || isGameOver) return;

    const winAmount = parseFloat((betAmount * finalMultiplier).toFixed(2));
    sound.playCashout();

    setIsWon(true);
    setIsPlaying(false);

    // Reveal remaining board
    const newBoard = board.map((c, i) => {
      if (mineIndices.has(i)) {
        return { ...c, isRevealed: true }; // Reveal bomb locations
      }
      return c;
    });
    setBoard(newBoard);

    // Refund win payout
    updateBalance(winAmount, 'Mines', finalMultiplier, 'win');
  };

  // Quick select buttons
  const adjustBet = (amount: number) => {
    sound.playClick();
    if (amount === -1) {
      setBetAmount(balance);
    } else if (amount === 0.5) {
      setBetAmount(prev => Math.max(1, Math.floor(prev / 2)));
    } else if (amount === 2) {
      setBetAmount(prev => Math.min(balance, prev * 2));
    } else {
      setBetAmount(prev => Math.max(1, Math.min(balance, prev + amount)));
    }
  };

  const nextPayout = parseFloat((betAmount * multiplier).toFixed(2));
  const gemRevealPayout = parseFloat((betAmount * calculateMultiplier(mineCount, revealedCount + 1)).toFixed(2));

  return (
    <div id="mines_game_wrapper" className="flex flex-col h-full bg-dark-900 overflow-y-auto no-scrollbar">
      {/* Header bar */}
      <div id="mines_header_bar" className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-950/80 backdrop-blur sticky top-0 z-10">
        <button 
          id="mines_back_btn"
          onClick={onBack} 
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition duration-200"
        >
          <span className="text-gold-accent font-semibold">{"<"}</span> Lobby
        </button>
        <div id="mines_title" className="text-center">
          <h2 className="text-sm font-display font-bold text-gold-accent tracking-wide gold-text-glow">MINES</h2>
          <p className="text-[10px] text-gray-400">Minefield Multipliers</p>
        </div>
        <div id="mines_sound_indicator" className="w-5 h-5 flex items-center justify-center opacity-40">
          <Bomb size={14} className="text-gray-400" />
        </div>
      </div>

      <div id="mines_content_layout" className="flex flex-col p-4 gap-4 flex-1">
        {/* Game Area */}
        <div id="mines_game_board_area" className="flex flex-col items-center bg-dark-950/40 p-4 border border-dark-700/60 rounded-2xl relative overflow-hidden">
          {/* Ambient light glow behind board */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />

          {/* Current Live Stats bar */}
          <div id="mines_status_strip" className="w-full flex items-center justify-between mb-4 px-3 py-2 bg-dark-950/60 rounded-xl border border-dark-800 text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Gem size={12} className="text-teal-400 animate-pulse" />
              Gems: <strong className="text-white font-mono">{revealedCount}/{25 - mineCount}</strong>
            </span>
            <span className="text-gold-accent flex items-center gap-1 font-mono font-semibold">
              <Flame size={12} className="text-gold-accent" />
              Multiplier: {multiplier}x
            </span>
          </div>

          {/* The Board */}
          <div id="mines_board_grid" className="grid grid-cols-5 gap-2 w-full aspect-square max-w-[320px] relative">
            {board.map((cell) => {
              const isMineAndRevealed = cell.isMine && cell.isRevealed;
              const isGemAndRevealed = !cell.isMine && cell.isRevealed;

              return (
                <button
                  key={cell.id}
                  id={`mines_cell_${cell.id}`}
                  onClick={() => handleCellClick(cell.id)}
                  disabled={!isPlaying || cell.isRevealed}
                  className={`
                    relative aspect-square rounded-xl border transition-all duration-300 transform active:scale-95 flex items-center justify-center font-display text-base font-bold
                    ${cell.isRevealed ? '' : 'cursor-pointer hover:-translate-y-0.5'}
                    ${!isPlaying && !cell.isRevealed ? 'bg-dark-800/80 border-dark-700 opacity-70' : ''}
                    ${isPlaying && !cell.isRevealed ? 'bg-dark-700 border-dark-600 hover:bg-dark-600 hover:border-gold-700 hover:shadow-lg' : ''}
                    ${isMineAndRevealed ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}
                    ${isGemAndRevealed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {cell.isRevealed ? (
                      <motion.div
                        key="revealed"
                        initial={{ scale: 0, rotate: cell.isMine ? -45 : 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex items-center justify-center w-full h-full"
                      >
                        {cell.isMine ? (
                          <Bomb size={18} className="fill-red-500 stroke-red-500" />
                        ) : (
                          <Gem size={18} className="fill-emerald-400 stroke-emerald-400" />
                        )}
                      </motion.div>
                    ) : (
                      <motion.span
                        key="unrevealed"
                        className="text-dark-600 text-[10px] select-none"
                      >
                        ⚡
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Overlay messages */}
            <AnimatePresence>
              {isGameOver && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-red-500/40"
                >
                  <ShieldAlert size={48} className="text-red-500 mb-2 animate-bounce" />
                  <h3 className="text-lg font-display font-bold text-red-500">KABOOM!</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">You hit a mine and lost your bet of <span className="text-red-400 font-semibold font-mono">${betAmount}</span>.</p>
                  <button
                    onClick={resetBoard}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}

              {isWon && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-emerald-500/40"
                >
                  <CheckCircle2 size={48} className="text-emerald-400 mb-2 animate-bounce" />
                  <h3 className="text-lg font-display font-black text-emerald-400 tracking-wide">CASHOUT WIN!</h3>
                  <p className="text-3xl font-display font-black text-gold-accent mt-1">${(betAmount * multiplier).toFixed(2)}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Multiplier: <span className="text-emerald-400 font-bold font-mono">{multiplier}x</span></p>
                  <button
                    onClick={resetBoard}
                    className="mt-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-dark-950 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Betting Panel Controls */}
        <div id="mines_betting_panel" className="flex flex-col gap-3 bg-dark-950/75 p-4 rounded-2xl border border-dark-800/80">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Bet Amount ($)</span>
              <span className="font-mono text-gray-300">Balance: <strong className="text-white">${balance}</strong></span>
            </div>
            <div className="flex gap-1 bg-dark-900 rounded-xl p-1 border border-dark-700">
              <input
                type="number"
                disabled={isPlaying}
                value={betAmount === 0 ? '' : betAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBetAmount(isNaN(val) ? 0 : Math.max(0, val));
                }}
                className="bg-transparent text-white font-mono font-bold text-sm h-9 pl-2 flex-1 focus:outline-none min-w-[50px]"
              />
              <button 
                disabled={isPlaying}
                onClick={() => adjustBet(0.5)}
                className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gray-400 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 transition"
              >
                1/2
              </button>
              <button 
                disabled={isPlaying}
                onClick={() => adjustBet(2)}
                className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gray-400 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 transition"
              >
                2x
              </button>
              <button 
                disabled={isPlaying}
                onClick={() => adjustBet(-1)}
                className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gold-accent bg-dark-800 hover:bg-dark-700 disabled:opacity-50 transition"
              >
                Max
              </button>
            </div>
          </div>

          {/* Mine count selector */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Mines Count (Danger!)</span>
              <span className="font-bold text-gold-accent">{mineCount} Bomb{mineCount > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 3, 5, 24].map((count) => (
                <button
                  key={count}
                  type="button"
                  disabled={isPlaying}
                  onClick={() => {
                    sound.playClick();
                    setMineCount(count);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold font-mono transition border
                    ${mineCount === count 
                      ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/25' 
                      : 'bg-dark-900 border-dark-700 text-gray-400 hover:bg-dark-800 hover:text-white'
                    }
                    disabled:opacity-50
                  `}
                >
                  {count === 24 ? 'CRZY (24)' : `${count}`}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-500 font-semibold text-center mt-1 bg-red-500/10 py-1 px-2 rounded-lg border border-red-500/20">{errorMsg}</p>
          )}

          {/* Start/Cashout Big Button */}
          <div className="mt-2.5">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-dark-950 font-display font-black tracking-wide text-xs uppercase rounded-xl transition duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.25)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.45)] hover:scale-[1.02] transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Coins size={14} className="stroke-[2.5]" />
                Start Bet
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleCashout()}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-display font-black tracking-wide text-xs uppercase rounded-xl transition duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] hover:scale-[1.02] transform active:scale-95 flex flex-col items-center justify-center leading-none"
              >
                <span className="text-[8px] tracking-widest text-[#0c2f1f] uppercase mb-1 font-sans">Cash out now</span>
                <span className="text-sm font-black flex items-center gap-1">
                  Cash Out: ${nextPayout} ({multiplier}x)
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Explainer card */}
        <div id="mines_how_to_play" className="flex gap-3 bg-dark-950/30 p-3 rounded-xl border border-dark-800 text-xs text-gray-400">
          <HelpCircle size={18} className="text-gold-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white mb-0.5">How to play Mines</h4>
            <p className="leading-relaxed">Click tiles to discover Gems. Each gem increases the prize pool. Cash out at any time to secure your winnings. Click a Bomb, and you lose!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
