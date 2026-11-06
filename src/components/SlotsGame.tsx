import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, HelpCircle, Trophy, Sparkles, AlertCircle, ChevronLeft, Volume2, Play, RefreshCw, Flame } from 'lucide-react';
import { SlotGameId, SlotSymbol, GameInfo } from '../types';
import { SLOT_GAMES } from '../data';
import { sound } from '../utils/audio';

interface SlotsGameProps {
  balance: number;
  initialGameId: SlotGameId;
  updateBalance: (amount: number, gameType: 'Mines' | 'Crash' | 'Slots (Ra\'s Reckoning)' | 'Slots (Book of Abyss)' | 'Slots (Buffalo Song)', multiplier: number, outcome: 'win' | 'loss') => void;
  onBack: () => void;
}

export default function SlotsGame({ balance, initialGameId, updateBalance, onBack }: SlotsGameProps) {
  const [activeGameId, setActiveGameId] = useState<SlotGameId>(initialGameId);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [reels, setReels] = useState<SlotSymbol[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [winMessage, setWinMessage] = useState<string>('');
  const [winningLineIds, setWinningLineIds] = useState<number[]>([]); // horizontal: 0 (top), 1 (mid), 2 (bot), 3 (diag down), 4 (diag up)
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [isWinCelebration, setIsWinCelebration] = useState<boolean>(false);

  const gameInfo = SLOT_GAMES.find(g => g.id === activeGameId) || SLOT_GAMES[0];

  // Set initial random symbols on load
  useEffect(() => {
    generateRandomBoard();
    setWinAmount(0);
    setWinMessage('');
    setWinningLineIds([]);
  }, [activeGameId]);

  const generateRandomBoard = () => {
    const freshReels: SlotSymbol[][] = [];
    for (let col = 0; col < 3; col++) {
      const colSymbols: SlotSymbol[] = [];
      for (let row = 0; row < 3; row++) {
        const randomSymbol = gameInfo.symbols[Math.floor(Math.random() * gameInfo.symbols.length)];
        colSymbols.push(randomSymbol);
      }
      freshReels.push(colSymbols);
    }
    setReels(freshReels);
  };

  const handleSpin = () => {
    if (isSpinning) return;
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
    setIsSpinning(true);
    setWinAmount(0);
    setWinMessage('');
    setWinningLineIds([]);
    setIsWinCelebration(false);

    // Deduct initial bet
    const gameLabel = `Slots (${gameInfo.title})` as any;
    updateBalance(-betAmount, gameLabel, 0, 'loss');

    // Simulate animated spin
    let spinsCount = 0;
    const maxSpins = 12;
    const intervalTime = 120;

    const interval = setInterval(() => {
      sound.playSpin();
      
      // Randomize display reels during spin
      setReels(prevReels => {
        return prevReels.map(() => 
          Array.from({ length: 3 }, () => 
            gameInfo.symbols[Math.floor(Math.random() * gameInfo.symbols.length)]
          )
        );
      });

      spinsCount++;
      if (spinsCount >= maxSpins) {
        clearInterval(interval);
        stopSpinning();
      }
    }, intervalTime);
  };

  const stopSpinning = () => {
    // Generate final random resulting elements
    const finalReels: SlotSymbol[][] = [];
    for (let col = 0; col < 3; col++) {
      const colSymbols: SlotSymbol[] = [];
      for (let row = 0; row < 3; row++) {
        // High tier symbols get slightly weighted lower chance to hit jackpot, making a true casino math feel!
        const r = Math.random();
        let selected: SlotSymbol;
        if (r < 0.15) {
          // Low tier Ace/Jacks
          selected = gameInfo.symbols.find(s => ['jack', 'queen', 'king', 'ace'].includes(s.id)) || gameInfo.symbols[gameInfo.symbols.length - 1];
        } else {
          selected = gameInfo.symbols[Math.floor(Math.random() * gameInfo.symbols.length)];
        }
        colSymbols.push(selected);
      }
      finalReels.push(colSymbols);
    }

    sound.playStop();
    setReels(finalReels);
    
    // Evaluate outcome
    evaluateResults(finalReels);
    setIsSpinning(false);
  };

  const evaluateResults = (board: SlotSymbol[][]) => {
    // board cols: board[0][row], board[1][row], board[2][row]
    // 5 Paylines to check:
    // Line 0: top row (row 0 across all cols)
    // Line 1: middle row (row 1 across all cols)
    // Line 2: bottom row (row 2 across all cols)
    // Line 3: diagonal down top-left to bottom-right (row 0,col 0; row 1,col 1; row 2,col 2)
    // Line 4: diagonal up bottom-left to top-right (row 2,col 0; row 1,col 1; row 0,col 2)

    let totalPayoutFactor = 0;
    const itemsMatched: string[] = [];
    const matchedLines: number[] = [];

    // Line 0: Top Row
    if (board[0][0].id === board[1][0].id && board[1][0].id === board[2][0].id) {
      totalPayoutFactor += board[0][0].multiplier;
      itemsMatched.push(board[0][0].name);
      matchedLines.push(0);
    }
    // Line 1: Middle Row
    if (board[0][1].id === board[1][1].id && board[1][1].id === board[2][1].id) {
      totalPayoutFactor += board[0][1].multiplier;
      itemsMatched.push(board[0][1].name);
      matchedLines.push(1);
    }
    // Line 2: Bottom Row
    if (board[0][2].id === board[1][2].id && board[1][2].id === board[2][2].id) {
      totalPayoutFactor += board[0][2].multiplier;
      itemsMatched.push(board[0][2].name);
      matchedLines.push(2);
    }
    // Line 3: Diagonal Down
    if (board[0][0].id === board[1][1].id && board[1][1].id === board[2][2].id) {
      totalPayoutFactor += board[0][0].multiplier;
      itemsMatched.push(board[0][0].name);
      matchedLines.push(3);
    }
    // Line 4: Diagonal Up
    if (board[0][2].id === board[1][1].id && board[1][1].id === board[2][0].id) {
      totalPayoutFactor += board[0][2].multiplier;
      itemsMatched.push(board[0][2].name);
      matchedLines.push(4);
    }

    // Secondary evaluation - 2 matching adjacent on middle row pays a small partial prize (0.5x bet)
    if (matchedLines.length === 0) {
      if (board[0][1].id === board[1][1].id || board[1][1].id === board[2][1].id) {
        totalPayoutFactor = 0.5;
        itemsMatched.push("2-Match Bonus");
      }
    }

    if (totalPayoutFactor > 0) {
      const finalWin = parseFloat((betAmount * totalPayoutFactor).toFixed(2));
      sound.playWin();
      setWinAmount(finalWin);
      setWinningLineIds(matchedLines);
      
      const matchedString = itemsMatched.length > 0 ? itemsMatched.join(' + ') : 'Match';
      setWinMessage(`🎉 WIN! Match on ${matchedString}!`);

      // Trigger high-intensity shake & pulsing on #slots_cabin_box
      setIsWinCelebration(true);
      setTimeout(() => {
        setIsWinCelebration(false);
      }, 3000);

      // Refounds the win payout via callback
      const gameLabel = `Slots (${gameInfo.title})` as any;
      updateBalance(finalWin, gameLabel, totalPayoutFactor, 'win');
    } else {
      setWinAmount(0);
      setWinMessage('No match. Try again!');
    }
  };

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

  return (
    <div id="slots_page_wrapper" className={`flex flex-col h-full bg-gradient-to-b ${gameInfo.themeColor} overflow-y-auto no-scrollbar relative`}>
      {/* Decorative starry backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent)] pointer-events-none" />

      {/* Slots Header */}
      <div id="slots_header" className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60 backdrop-blur sticky top-0 z-30">
        <button 
          id="slots_back_btn"
          onClick={onBack} 
          className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition duration-200"
        >
          <span className="text-gold-accent font-semibold font-mono">{"<"}</span> Lobby
        </button>
        <div className="text-center">
          <h2 className="text-xs font-display font-black text-gold-accent tracking-widest gold-text-glow leading-none mb-1">SLOTS</h2>
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold font-mono">{gameInfo.provider}</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setShowPaytable(prev => !prev);
          }}
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-white/20 hover:bg-white/10 text-white font-medium transition
            ${showPaytable ? 'bg-gold-500/20 border-gold-500' : 'bg-white/5'}
          `}
        >
          <HelpCircle size={12} /> Paytable
        </button>
      </div>

      <div id="slots_content_body" className="flex flex-col p-4 gap-4 flex-1 z-10">
        
        {/* Swapper Slider for selecting slots machine on the fly */}
        <div id="slots_swapper_strip" className="flex justify-center bg-black/50 border border-white/5 rounded-2xl p-1 gap-1">
          {SLOT_GAMES.map((game) => (
            <button
              key={game.id}
              disabled={isSpinning}
              onClick={() => {
                sound.playClick();
                setActiveGameId(game.id);
              }}
              className={`flex-1 py-2 text-[9px] font-display font-black tracking-wider text-center rounded-xl transition duration-300 uppercase leading-tight
                ${activeGameId === game.id 
                  ? 'bg-gold-500 text-black font-extrabold shadow-[0_0_10px_rgba(234,179,8,0.25)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {game.id === 'ras_reckoning' ? "Ra's Rec" : game.id === 'book_abyss' ? "Book Abyss" : "Buffalo Song"}
            </button>
          ))}
        </div>

        {/* Big Game Label Banner */}
        <div className="text-center my-1.5">
          <h1 className="text-xl font-display font-black text-white tracking-wider drop-shadow-md">{gameInfo.title}</h1>
          <p className="text-[10px] text-gold-bright uppercase tracking-widest mt-0.5 opacity-80">96.7% RTP • Progressive Jackpot</p>
        </div>

        {/* The Slot Machine Cabin */}
        <div 
          id="slots_cabin_box" 
          className={`bg-black/80 border-4 rounded-3xl p-4 flex flex-col relative overflow-hidden backdrop-blur transition-all duration-300
            ${isWinCelebration 
              ? 'animate-win-shake animate-gold-pulse-glow border-gold-400 shadow-[0_0_40px_rgba(250,204,21,0.85)]' 
              : 'border-gold-600 gold-glow'
            }
          `}
        >
          {/* Machine lights flashing decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500 via-yellow-300 to-gold-500 animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500 via-yellow-300 to-gold-500 animate-pulse" />

          {/* Lines helper visualization on the side for slots players */}
          <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around text-[8px] font-mono font-bold text-gold-accent opacity-50 select-none">
            <span>①</span> <span>④</span> <span>②</span> <span>⑤</span> <span>③</span>
          </div>
          <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around text-[8px] font-mono font-bold text-gold-accent opacity-50 select-none">
            <span>①</span> <span>⑤</span> <span>②</span> <span>④</span> <span>③</span>
          </div>

          {/* Reels Display (Grid of 3 columns x 3 rows) */}
          <div id="slots_reels_matrix" className="grid grid-cols-3 gap-3 bg-dark-950 p-2.5 rounded-2xl relative border-2 border-dark-800">
            {/* Horizontal win line overlay lines */}
            <AnimatePresence>
              {winningLineIds.includes(0) && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} className="absolute left-0 right-0 top-[18%] h-0.5 bg-red-500 z-20 shadow-[0_0_8px_red]" />
              )}
              {winningLineIds.includes(1) && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} className="absolute left-0 right-0 top-[50%] -translate-y-1/2 h-0.5 bg-red-500 z-20 shadow-[0_0_8px_red]" />
              )}
              {winningLineIds.includes(2) && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} className="absolute left-0 right-0 bottom-[18%] h-0.5 bg-red-500 z-20 shadow-[0_0_8px_red]" />
              )}
              {winningLineIds.includes(3) && (
                <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full z-20 pointer-events-none stroke-red-500 stroke-[2] drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]">
                  <line x1="10" y1="10" x2="100%" y2="100%" />
                </motion.svg>
              )}
              {winningLineIds.includes(4) && (
                <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full z-20 pointer-events-none stroke-red-500 stroke-[2] drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]">
                  <line x1="10" y1="100%" x2="100%" y2="10" />
                </motion.svg>
              )}
            </AnimatePresence>

            {reels.map((column, colIdx) => (
              <div 
                key={colIdx} 
                id={`slots_col_${colIdx}`}
                className="flex flex-col gap-3.5 bg-dark-900 border border-white/[0.04] p-1 rounded-xl relative overflow-hidden"
              >
                <AnimatePresence mode="popLayout">
                  {column.map((symbol, rowIdx) => (
                    <motion.div
                      key={`${colIdx}-${rowIdx}-${symbol?.id || 'empty'}`}
                      initial={isSpinning ? { y: -60, opacity: 0.8 } : { scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={isSpinning ? { y: 60, opacity: 0.2 } : {}}
                      transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                      className={`h-[68px] rounded-xl flex flex-col items-center justify-center p-2 border relative transition duration-300
                        ${isSpinning ? 'blur-[1px]' : ''}
                        ${winningLineIds.length > 0 ? 'bg-dark-950/45 border-dark-700/50' : 'bg-dark-950/85 border-white/[0.04] hover:bg-dark-800'}
                      `}
                    >
                      <span className="text-3xl leading-none filter drop-shadow-sm mb-1">{symbol?.image || '💎'}</span>
                      <span 
                        className="text-[8px] font-bold uppercase tracking-wider font-display font-semibold truncate max-w-full leading-none"
                        style={{ color: symbol?.color || '#ffffff' }}
                      >
                        {symbol?.name || 'Item'}
                      </span>

                      {/* Small floating payout sign marker */}
                      <span className="absolute bottom-1 right-1.5 text-[6px] font-mono text-gray-500 font-bold">
                        x{symbol?.multiplier || '1'}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Results screen of slot cabin */}
          <div className="mt-3.5 px-3 py-2 bg-dark-950 border border-white/5 rounded-xl text-center flex flex-col items-center justify-center min-h-[48px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {winAmount > 0 ? (
                <motion.div
                  key="win-alert"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-[10px] font-semibold tracking-widest text-emerald-400 font-display flex items-center justify-center gap-1 mb-0.5 uppercase">
                    <Sparkles size={11} className="animate-spin-slow text-yellow-400" />
                    Pristine Win
                  </p>
                  <strong className="text-lg font-display font-black text-gold-accent gold-text-glow leading-none">
                    +${winAmount.toFixed(2)}
                  </strong>
                  <p className="text-[8px] text-gray-400 font-mono mt-0.5">Ratio Multiplier: {(winAmount / betAmount).toFixed(2)}x</p>
                </motion.div>
              ) : isSpinning ? (
                <motion.div key="spinning-alert" className="flex items-center gap-1.5 text-xs text-gold-accent font-semibold flex-col py-1">
                  <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[9px] uppercase tracking-widest font-display text-gold-accent/80">REELS SPINNING</span>
                </motion.div>
              ) : winMessage ? (
                <motion.p key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-semibold text-gray-400">
                  {winMessage}
                </motion.p>
              ) : (
                <motion.p key="idle" className="text-[10px] uppercase font-display text-gray-500 tracking-wider">
                  Set bet & click SPARK SPIN
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Paytable Drawer Modal inside container */}
        <AnimatePresence>
          {showPaytable && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-black/95 border-2 border-gold-600 rounded-3xl p-4 text-xs font-sans text-gray-300 shadow-xl flex flex-col gap-3 relative"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                <span className="font-display text-gold-accent font-black text-xs tracking-wider uppercase">🎰 SYMBOL MULTIPLIERS</span>
                <button 
                  onClick={() => setShowPaytable(false)}
                  className="text-[10px] font-bold text-gray-400 hover:text-white px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10"
                >
                  Hide
                </button>
              </div>
              <p className="text-[9px] text-gray-400">Winning rows: 3 identical symbols in any horizontal payline or diagonal payline. Matches of 2 can award partial recovery gains.</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                {gameInfo.symbols.map((sym) => (
                  <div key={sym.id} className="flex items-center justify-between py-1 border-b border-white/[0.03] text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-lg leading-none">{sym.image}</span>
                      <strong className="text-white font-medium text-xs font-mono">{sym.name}</strong>
                    </span>
                    <span className="font-mono text-gold-accent font-semibold">{sym.multiplier}x bet</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Betting Panel Controls */}
        <div id="slots_bets_board" className="bg-black/45 p-4 rounded-2xl border border-white/5 mt-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Spin Bet ($)</span>
            <span className="font-mono text-gray-300">Wallet: <strong className="text-white">${balance}</strong></span>
          </div>

          <div className="flex gap-1 bg-black/60 rounded-xl p-1 border border-white/5">
            <input
              type="number"
              disabled={isSpinning}
              value={betAmount === 0 ? '' : betAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setBetAmount(isNaN(val) ? 0 : Math.max(0, val));
              }}
              className="bg-transparent text-white font-mono font-bold text-sm h-9 pl-2 flex-1 focus:outline-none min-w-[50px]"
            />
            <button 
              disabled={isSpinning}
              onClick={() => adjustBet(0.5)}
              className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gray-400 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition"
            >
              1/2
            </button>
            <button 
              disabled={isSpinning}
              onClick={() => adjustBet(2)}
              className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gray-400 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition"
            >
              2x
            </button>
            <button 
              disabled={isSpinning}
              onClick={() => adjustBet(-1)}
              className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gold-accent bg-white/5 hover:bg-white/10 disabled:opacity-50 transition"
            >
              Max
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-500 font-semibold text-center mt-2.5 bg-red-500/10 py-1 rounded-lg border border-red-500/20">{errorMsg}</p>
          )}

          {/* Big Action Spin button */}
          <div className="mt-3.5">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-3.5 font-display font-black tracking-widest text-xs uppercase rounded-xl transition duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.01] transform active:scale-95
                ${isSpinning 
                  ? 'bg-gold-500/40 text-black/50 cursor-not-allowed border border-white/10' 
                  : 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-dark-950 font-black shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.5)]'
                }
              `}
            >
              <RefreshCw size={14} className={`stroke-[2.5] ${isSpinning ? 'animate-spin' : ''}`} />
              SPIN REELS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
