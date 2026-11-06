import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, TrendingUp, DollarSign, HelpCircle, Gamepad2, ChevronRight, RefreshCw, Flame, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface CrashGameProps {
  balance: number;
  updateBalance: (amount: number, gameType: 'Mines' | 'Crash' | 'Slots (Ra\'s Reckoning)' | 'Slots (Book of Abyss)' | 'Slots (Buffalo Song)', multiplier: number, outcome: 'win' | 'loss') => void;
  onBack: () => void;
}

interface SimulatedBot {
  name: string;
  betAmount: number;
  cashoutChance: number; // multiplier at which they cash out
  hasCashedOut: boolean;
  cashedOutAt?: number;
}

export default function CrashGame({ balance, updateBalance, onBack }: CrashGameProps) {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'flying' | 'crashed'>('idle');
  const [countdown, setCountdown] = useState<number>(5);
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);
  const [crashPoint, setCrashPoint] = useState<number>(1.00);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Previous crash histories
  const [history, setHistory] = useState<number[]>([1.45, 12.4, 2.11, 4.35, 1.02, 1.95, 3.82, 8.44]);
  // Live simulated bots
  const [bots, setBots] = useState<SimulatedBot[]>([]);
  
  // Canvas drawing reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);
  const stateRef = useRef<'idle' | 'countdown' | 'flying' | 'crashed'>('idle');
  const multRef = useRef<number>(1.00);
  const particlesRef = useRef<{ x: number; y: number; size: number; alpha: number; color: string }[]>([]);

  // Keep state sync with refs for the canvas loop
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    multRef.current = multiplier;
  }, [multiplier]);

  // Handle countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        startFlight();
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, gameState]);

  // Generates bots for the active round
  const generateSimulatedBots = () => {
    const BOT_NAMES = ['DegenDave', 'SlotQueen', 'EtherMaxi', 'BitHustler', 'LuckyStarr', 'RiskyBiz', 'PlinkoKing', 'MineSweeper_X'];
    const selectedBots = BOT_NAMES.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    return selectedBots.map(name => {
      const bet = Math.floor(Math.random() * 50) + 5;
      // Normal distribution of risky cashouts (majority cash out between 1.1x and 3x)
      const isExtreme = Math.random() > 0.85;
      const cashoutChance = isExtreme 
        ? parseFloat((Math.random() * 10 + 3).toFixed(2))
        : parseFloat((Math.random() * 1.8 + 1.1).toFixed(2));

      return {
        name,
        betAmount: bet,
        cashoutChance,
        hasCashedOut: false
      };
    });
  };

  const initRound = () => {
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
    
    // Set crash point with standard crash game formula
    // 10% instant crash (House edge/instant crash), otherwise randomized
    const instantCrash = Math.random() < 0.08;
    let point = 1.00;
    if (!instantCrash) {
      // Exponential distribution approximation:
      // High likelihood of crashing early, exponential tail for high multipliers
      const rand = Math.random();
      point = parseFloat((0.99 / (1 - rand + 0.01)).toFixed(2));
      point = Math.max(1.01, Math.min(120, point)); // Caps at 120x for sanity
    } else {
      point = parseFloat((Math.random() * 0.08 + 1.01).toFixed(2));
    }

    setCrashPoint(point);
    setHasCashedOut(false);
    setMultiplier(1.00);
    setBots(generateSimulatedBots());
    setCountdown(4);
    setGameState('countdown');
    particlesRef.current = [];
  };

  const startFlight = () => {
    setGameState('flying');
    
    // Deduct bet on engine start
    updateBalance(-betAmount, 'Crash', 0, 'loss');

    // Launch background audio synth ticking
    sound.playSpin();

    // Start timer flight increment loop
    const startTime = Date.now();
    const flightLoop = () => {
      if (stateRef.current !== 'flying') return;

      const elapsed = (Date.now() - startTime) / 1000; // in seconds
      
      // Multiplier grows exponentially over elapsed flight time
      // f(t) = e^(0.065 * t)
      const nextMult = parseFloat(Math.exp(0.08 * elapsed).toFixed(2));

      // Trigger simulated bot cashouts
      setBots(prevBots => 
        prevBots.map(bot => {
          if (!bot.hasCashedOut && nextMult >= bot.cashoutChance && bot.cashoutChance <= crashPoint) {
            return {
              ...bot,
              hasCashedOut: true,
              cashedOutAt: bot.cashoutChance
            };
          }
          return bot;
        })
      );

      // Check if crashed
      if (nextMult >= crashPoint) {
        triggerCrash(crashPoint);
      } else {
        setMultiplier(nextMult);
        requestAnimationFrame(flightLoop);
      }
    };

    requestAnimationFrame(flightLoop);
  };

  const triggerCrash = (finalMult: number) => {
    sound.playExplosion();
    setMultiplier(finalMult);
    setGameState('crashed');
    setHistory(prev => [finalMult, ...prev.slice(0, 7)]);
    
    // If user never cashed out, they lose and we already deducted balance
  };

  const handleCashout = () => {
    if (gameState !== 'flying' || hasCashedOut) return;

    sound.playCashout();
    setHasCashedOut(true);
    const winAmount = parseFloat((betAmount * multiplier).toFixed(2));

    // Refounds win money back via callback
    updateBalance(winAmount, 'Crash', multiplier, 'win');
  };

  // Canvas flight renderer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw gridlines
      ctx.strokeStyle = 'rgba(2 Ca, 8a, 4, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridCount = 6;
      for (let i = 1; i < gridCount; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo((w / gridCount) * i, 0);
        ctx.lineTo((w / gridCount) * i, h);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, (h / gridCount) * i);
        ctx.lineTo(w, (h / gridCount) * i);
        ctx.stroke();
      }

      // Draw standard base line
      ctx.strokeStyle = '#252938';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, h - 30);
      ctx.lineTo(w - 30, h - 30);
      ctx.stroke();

      if (stateRef.current === 'flying' || stateRef.current === 'crashed') {
        const padding = 40;
        
        // Progress percentage for drawing (limit drawing coordinates to canvas bounds)
        // Draw logarithmic curve with coordinates
        const progress = Math.min(1, (multRef.current - 1) / 10);
        
        // Start coordinate (bottom-left)
        const startX = padding;
        const startY = h - padding;
        
        // End coordinate (moving towards top-right)
        const endX = padding + (w - padding * 2) * progress * 0.95;
        const endY = h - padding - (h - padding * 2) * progress * 0.95;

        // Draw glowing golden trail line
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(250, 204, 21, 0.5)';
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        // Exponential curve approximation
        ctx.quadraticCurveTo(startX + (endX - startX) * 0.5, startY, endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Handle rocket particles
        if (stateRef.current === 'flying') {
          // Add particles
          if (Math.random() < 0.4) {
            particlesRef.current.push({
              x: endX,
              y: endY,
              size: Math.random() * 4 + 2,
              alpha: 1.0,
              color: Math.random() > 0.4 ? '#facc15' : '#ec4899' // Gold or pink sparks!
            });
          }
        }

        // Draw particles
        particlesRef.current.forEach((p, idx) => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Move and fade particles
          p.x -= 1.5;
          p.y += 0.8;
          p.alpha -= 0.03;
          
          // Remove dead particles
          if (p.alpha <= 0) {
            particlesRef.current.splice(idx, 1);
          }
        });
        ctx.globalAlpha = 1.0; // Reset alpha

        if (stateRef.current === 'flying') {
          // Draw Rocket drawing character / icon representation on top of path
          ctx.fillStyle = '#ffcc00';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#facc15';
          ctx.beginPath();
          ctx.arc(endX, endY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw neon rocket pointer wings
          ctx.fillStyle = '#daab08';
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - 18, endY + 4);
          ctx.lineTo(endX - 14, endY + 12);
          ctx.closePath();
          ctx.fill();
        } else if (stateRef.current === 'crashed') {
          // Big explosion blast symbol at endX, endY
          ctx.fillStyle = '#ef4444';
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#f87171';
          ctx.beginPath();
          ctx.arc(endX, endY, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Drawing text splash
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px var(--font-display)';
          ctx.fillText('💥 BOOM', endX - 22, endY + 3);
        }
      }

      localFrameId = requestAnimationFrame(render);
    };

    localFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(localFrameId);
  }, [gameState]);

  // Handle bet adjustments
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
    <div id="crash_game_wrapper" className="flex flex-col h-full bg-dark-900 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div id="crash_header" className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-950/80 backdrop-blur sticky top-0 z-10">
        <button 
          id="crash_back"
          onClick={onBack} 
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition duration-200"
        >
          <span className="text-gold-accent font-semibold">{"<"}</span> Lobby
        </button>
        <div id="crash_logo_pane" className="text-center">
          <h2 className="text-sm font-display font-black text-purple-400 tracking-wide flex items-center justify-center gap-1">
            <Rocket size={14} className="text-purple-400" />
            CRASH
          </h2>
          <p className="text-[10px] text-gray-400">Avoid instant blast & cashout</p>
        </div>
        <div id="crash_sound" className="w-5 h-5 flex items-center justify-center opacity-40">
          <TrendingUp size={14} className="text-gray-400" />
        </div>
      </div>

      <div id="crash_content" className="flex flex-col p-4 gap-4 flex-1">
        {/* Past history logs strip */}
        <div id="crash_history_bar" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-dark-950/40 p-2 rounded-xl border border-dark-800">
          <span className="text-[9px] uppercase font-bold text-gray-400 font-display px-1">History</span>
          <div className="flex gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border text-center
                  ${h >= 3.0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                  ${h >= 1.5 && h < 3.0 ? 'bg-amber-500/10 border-amber-500/30 text-gold-accent' : ''}
                  ${h < 1.5 ? 'bg-purple-950/40 border-purple-800/30 text-purple-400' : ''}
                `}
              >
                {h.toFixed(2)}x
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Canvas Arena */}
        <div id="crash_canvas_board" className="relative h-[220px] bg-dark-950 rounded-2xl border border-dark-800/80 overflow-hidden flex flex-col items-center justify-center shadow-inner">
          <canvas
            ref={canvasRef}
            width={340}
            height={220}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Large Multiplier Display centered during flight */}
          <div className="z-10 text-center pointer-events-none flex flex-col items-center">
            <AnimatePresence mode="wait">
              {gameState === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <Rocket size={36} className="text-purple-400 animate-float mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Place your virtual bet to launch!</p>
                  <p className="text-[10px] text-gold-accent/70 font-mono">Current house margin: 2.8%</p>
                </motion.div>
              )}

              {gameState === 'countdown' && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-[10px] uppercase font-bold tracking-widest text-purple-400 font-display mb-1 animate-pulse">Launching Starship</p>
                  <p className="text-4xl font-display font-black text-white">{countdown === 0 ? 'GO!' : `${countdown}s`}</p>
                </motion.div>
              )}

              {gameState === 'flying' && (
                <motion.div
                  key="flying"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[8px] tracking-widest text-gold-accent uppercase font-display mb-1">Current Payout</span>
                  <span className="text-4xl font-display font-black tracking-wide text-white">
                    {multiplier.toFixed(2)}x
                  </span>
                  <p className="text-emerald-400 text-xs font-mono font-bold mt-1">
                    Value: ${(betAmount * multiplier).toFixed(2)}
                  </p>
                </motion.div>
              )}

              {gameState === 'crashed' && (
                <motion.div
                  key="crashed"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="px-5 py-1.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full font-display text-[10px] font-black uppercase tracking-wider mb-2 animate-bounce">
                    🚀 CRASHED
                  </div>
                  <span className="text-4xl font-display font-black text-red-500">{multiplier.toFixed(2)}x</span>
                  <p className="text-[10px] text-gray-400 mt-1">Stardust core disintegrated</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User cash out popup congrats */}
          <AnimatePresence>
            {hasCashedOut && gameState === 'flying' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 left-4 right-4 bg-emerald-500 text-dark-950 px-3 py-2 rounded-xl text-center shadow-lg font-display flex items-center justify-between z-20"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2Icon className="w-4 h-4 fill-dark-950" />
                  <span className="text-xs font-bold leading-none">Cashed Out!</span>
                </div>
                <strong className="text-sm font-black font-mono leading-none">
                  +${(betAmount * multiplier).toFixed(2)}
                </strong>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Active Players list */}
        <div id="crash_agents_list" className="bg-dark-950/60 p-3 rounded-xl border border-dark-800 text-xs flex flex-col gap-2">
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase font-display border-b border-dark-800/80 pb-1.5">
            <span className="flex items-center gap-1">
              <Users size={11} className="text-purple-400" />
              Multiplayer Cohort
            </span>
            <span>Multiplier</span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-[80px] overflow-y-auto no-scrollbar">
            {bots.map((bot, idx) => (
              <div 
                key={idx}
                className={`flex justify-between items-center px-2 py-1.5 rounded-lg border text-xs leading-none
                  ${bot.hasCashedOut 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                    : 'bg-dark-900/60 border-dark-800/80 text-gray-400'
                  }
                `}
              >
                <span className="truncate max-w-[80px] font-medium">{bot.name}</span>
                <span className="font-mono font-bold">
                  {bot.hasCashedOut && bot.cashedOutAt ? (
                    <span className="text-emerald-400">{bot.cashedOutAt}x</span>
                  ) : (
                    <span className="text-purple-500 animate-pulse">Flying...</span>
                  )}
                </span>
              </div>
            ))}
            
            {/* User display */}
            <div 
              className={`flex justify-between items-center px-2 py-1.5 rounded-lg border text-xs leading-none col-span-2 font-semibold
                ${hasCashedOut 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                  : (gameState === 'flying' 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400 animate-pulse' 
                    : 'bg-dark-950 border-dark-800 text-gray-400'
                  )
                }
              `}
            >
              <span>👤 Me (${betAmount})</span>
              <span className="font-mono">
                {hasCashedOut ? (
                  <span className="text-emerald-400">Captured: {multiplier.toFixed(2)}x</span>
                ) : (
                  (gameState === 'flying' ? <span className="text-purple-400">In Flight...</span> : <span>Prepared</span>)
                )}
              </span>
            </div>
          </div>
        </div>

        {/* User Betting Panel controls */}
        <div id="crash_bets_panel" className="bg-dark-950/75 p-4 rounded-2xl border border-dark-800">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Prepare Bet ($)</span>
            <span className="font-mono text-gray-300">Balance: <strong className="text-white">${balance}</strong></span>
          </div>

          <div className="flex gap-1 bg-dark-900 rounded-xl p-1 border border-dark-700">
            <input
              type="number"
              disabled={gameState === 'countdown' || gameState === 'flying'}
              value={betAmount === 0 ? '' : betAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setBetAmount(isNaN(val) ? 0 : Math.max(0, val));
              }}
              className="bg-transparent text-white font-mono font-bold text-sm h-9 pl-2 flex-1 focus:outline-none min-w-[50px]"
            />
            <button 
              disabled={gameState === 'countdown' || gameState === 'flying'}
              onClick={() => adjustBet(0.5)}
              className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gray-400 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 transition"
            >
              1/2
            </button>
            <button 
              disabled={gameState === 'countdown' || gameState === 'flying'}
              onClick={() => adjustBet(2)}
              className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gray-400 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 transition"
            >
              2x
            </button>
            <button 
              disabled={gameState === 'countdown' || gameState === 'flying'}
              onClick={() => adjustBet(-1)}
              className="px-2.5 h-8 my-auto rounded-lg text-[10px] font-bold uppercase text-gold-accent bg-dark-800 hover:bg-dark-700 disabled:opacity-50 transition"
            >
              Max
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-500 font-semibold text-center mt-2.5 bg-red-500/10 py-1 rounded-lg border border-red-500/20">{errorMsg}</p>
          )}

          {/* Large Action Launch Button */}
          <div className="mt-3">
            {gameState === 'idle' || gameState === 'crashed' ? (
              <button
                type="button"
                onClick={initRound}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black tracking-widest text-xs uppercase rounded-xl transition duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.5)] flex items-center justify-center gap-1.5 hover:scale-[1.01] transform active:scale-95"
              >
                <Rocket size={14} className="stroke-[2.5]" />
                PLACE BET
              </button>
            ) : gameState === 'countdown' ? (
              <button
                type="button"
                disabled
                className="w-full py-4 bg-dark-800 border border-dark-700 text-gray-500 font-display font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
              >
                <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                Waiting For Liftoff...
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCashout}
                disabled={hasCashedOut}
                className={`w-full py-4 font-display font-black tracking-widest text-xs uppercase rounded-xl transition duration-300 shadow-md flex flex-col items-center justify-center
                  ${hasCashedOut 
                    ? 'bg-dark-800 border border-dark-700 text-gray-500 cursor-not-allowed leading-none'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-dark-950 py-4 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:scale-[1.01] transform active:scale-95 leading-none'
                  }
                `}
              >
                {hasCashedOut ? (
                  <span className="text-sm">✓ CASHED OUT</span>
                ) : (
                  <>
                    <span className="text-[8px] tracking-wider text-[#0e3b26] uppercase font-sans mb-1">DANGER POINT EXPANDING</span>
                    <span className="text-sm font-black">
                      CASHOUT: ${(betAmount * multiplier).toFixed(2)}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom simple helper icon since lucide might use different naming
function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
