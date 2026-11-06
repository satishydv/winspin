import React, { useState } from 'react';
import { 
  Tv, 
  Coins, 
  Sparkles, 
  Trash2, 
  Play, 
  Pause, 
  PlusCircle, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { LiveBet } from '../adminTypes';
import { SIMULATION_PLAYERS, SIMULATION_GAMES } from '../adminData';
import { AnimatePresence, motion } from 'motion/react';

interface LiveBetFeedProps {
  bets: LiveBet[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onClearBets: () => void;
  onAddCustomBet: (bet: LiveBet) => void;
}

export default function LiveBetFeed({
  bets,
  isSimulating,
  onToggleSimulation,
  onClearBets,
  onAddCustomBet
}: LiveBetFeedProps) {
  const [testUser, setTestUser] = useState('');
  const [testAmount, setTestAmount] = useState('50');
  const [testMultiplier, setTestMultiplier] = useState('2.5');
  const [testGameIndex, setTestGameIndex] = useState(0);

  const triggerTestBet = (e: React.FormEvent) => {
    e.preventDefault();
    const user = testUser.trim() || 'AdminTesting_VIP';
    const amount = parseFloat(testAmount) || 100;
    const mult = parseFloat(testMultiplier) || 0.0;
    const win = mult > 0 ? Number((amount * mult).toFixed(2)) : 0;
    const game = SIMULATION_GAMES[testGameIndex];

    const newBet: LiveBet = {
      id: `bet-test-${Date.now()}`,
      username: user,
      gameName: game.name,
      gameType: game.type,
      betAmount: amount,
      multiplier: mult,
      winAmount: win,
      timestamp: new Date().toLocaleTimeString(),
      status: mult > 0 ? 'won' : 'lost'
    };

    onAddCustomBet(newBet);
    setTestUser('');
  };

  const getGameBadgeColor = (type: string) => {
    switch (type) {
      case 'Slots': return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      case 'Roulette': return 'bg-rose-500/15 text-rose-400 border border-rose-500/20';
      case 'Blackjack': return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20';
      case 'Crash': return 'bg-purple-500/15 text-purple-400 border border-purple-500/20';
      case 'Sports': return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Betting Activities Table */}
      <div className="lg:col-span-2 bg-obsidian-900 border border-slate-800/80 rounded-xl p-5 flex flex-col h-[540px] shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`h-3 w-3 rounded-full ${isSimulating ? 'bg-emerald-neon animate-pulse' : 'bg-rose-neon'}`} />
              {isSimulating && (
                <div className="absolute top-0 left-0 h-3 w-3 rounded-full bg-emerald-neon/40 animate-ping" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-gold-500" />
                Live Betting Activity
              </h2>
              <p className="text-slate-400 text-xs font-sans">
                Real-time gameplay stream and transaction logging
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={onToggleSimulation}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold font-sans tracking-wide transition-all border shadow-md active:scale-[0.98] outline-none ${
                isSimulating 
                  ? 'bg-gradient-to-r from-rose-600 to-[#3f1c1c] text-white hover:from-rose-500 hover:to-[#572222] border-rose-500/30 shadow-rose-950/20' 
                  : 'premium-gradient-glow text-white shadow-indigo-950/20'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="h-3 w-3" /> Stop Live Feed
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" /> Start Live Feed
                </>
              )}
            </button>
            <button
              onClick={onClearBets}
              className="px-4 py-1.5 rounded-xl text-xs font-bold font-sans premium-gradient-glow text-white transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] outline-none"
              title="Clear current betting Logs"
            >
              <Trash2 className="h-3 w-3" /> Clear Feed
            </button>
          </div>
        </div>

        {/* Bets Feed Container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {bets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-obsidian-950/40 rounded-lg border border-slate-850 border-dashed">
              <Coins className="h-10 w-10 text-slate-600 mb-2 animate-bounce" />
              <h3 className="text-sm font-semibold text-slate-300 font-display">No Betting Activity Today</h3>
              <p className="text-slate-500 text-xs font-sans max-w-xs mt-1">
                Start the simulation feed above or trigger a test hazard bet from the adjacent workspace setup!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 text-[11px] uppercase tracking-wider font-display font-medium">
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Game / Category</th>
                    <th className="py-2.5 px-3 text-right">Stake</th>
                    <th className="py-2.5 px-3 text-center">Mult</th>
                    <th className="py-2.5 px-3 text-right">Payout / Net GGR</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {bets.slice(0, 30).map((bet) => {
                      const isBigPayout = bet.winAmount >= 1000;
                      return (
                        <motion.tr
                          key={bet.id}
                          initial={{ opacity: 0, x: -15, backgroundColor: 'rgba(245,158,11,0.08)' }}
                          animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`border-b border-slate-850/50 text-xs font-sans transition-colors duration-200 hover:bg-slate-800/20 ${
                            isBigPayout ? 'bg-amber-950/10 border-l-2 border-l-gold-500' : ''
                          }`}
                        >
                          {/* Username */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200 hover:text-gold-400 cursor-pointer">
                                {bet.username}
                              </span>
                              {isBigPayout && (
                                <Sparkles className="h-3.5 w-3.5 text-gold-500 animate-pulse shrink-0" title="Jackpot Payout Alert!" />
                              )}
                            </div>
                          </td>
                          
                          {/* Game Name */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-display ${getGameBadgeColor(bet.gameType)}`}>
                                {bet.gameType}
                              </span>
                              <span className="text-slate-300 truncate max-w-[150px]" title={bet.gameName}>
                                {bet.gameName}
                              </span>
                            </div>
                          </td>
                          
                          {/* Stake */}
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-200">
                            ₹{bet.betAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          
                          {/* Multiplier */}
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-display ${
                              bet.multiplier > 0 
                                ? 'text-emerald-neon bg-emerald-950/20' 
                                : 'text-slate-500 bg-obsidian-950'
                            }`}>
                              {bet.multiplier > 0 ? `${bet.multiplier.toFixed(2)}x` : '-'}
                            </span>
                          </td>
                          
                          {/* Payout & GGR representation */}
                          <td className="py-2.5 px-3 text-right">
                            {bet.status === 'won' ? (
                              <div className="text-emerald-neon font-bold font-display">
                                +₹{bet.winAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </div>
                            ) : (
                              <div className="text-slate-500">
                                ₹0.00
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manual Telemetry / Simulation Controller Panel */}
      <div className="bg-obsidian-900 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-space-between h-[540px] shadow-xl">
        <div className="border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-gold-500" />
            Trigger Simulated Stakes
          </h2>
          <p className="text-slate-400 text-xs font-sans">
            Inject realistic manual bet requests directly into the system logs
          </p>
        </div>

        <form onSubmit={triggerTestBet} className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Player Username Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-sans">
                Target Simulated Player
              </label>
              <input
                type="text"
                value={testUser}
                onChange={(e) => setTestUser(e.target.value)}
                placeholder="Type name (e.g. high_roller_matt)..."
                className="w-full bg-obsidian-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/80 transition-colors font-sans"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {SIMULATION_PLAYERS.slice(0, 5).map(player => (
                  <button
                    key={player}
                    type="button"
                    onClick={() => setTestUser(player)}
                    className="px-2 py-0.5 bg-slate-850 hover:bg-slate-800 rounded text-[10px] text-slate-400 font-sans transition-all"
                  >
                    +{player}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Category Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-sans">
                Select Game Venue
              </label>
              <select
                value={testGameIndex}
                onChange={(e) => setTestGameIndex(parseInt(e.target.value))}
                className="w-full bg-obsidian-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500/80 transition-colors font-sans cursor-pointer"
              >
                {SIMULATION_GAMES.map((game, idx) => (
                  <option key={idx} value={idx}>
                    [{game.type}] {game.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bets and Multipliers Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-sans">
                  Risk / Bet Stake (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500/80 transition-colors font-display font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-sans">
                  Multiplier Outcome (x)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={testMultiplier}
                  onChange={(e) => setTestMultiplier(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500/80 transition-colors font-display font-medium"
                  placeholder="0 for loss streak"
                />
              </div>
            </div>

            {/* Quick Multiplier presets */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTestMultiplier('0')}
                className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-[#3f1c1c] border border-rose-500/30 hover:brightness-110 text-white text-[10px] font-bold font-sans active:scale-[0.96] transition-all"
              >
                Loss (0x)
              </button>
              <button
                type="button"
                onClick={() => setTestMultiplier('1.5')}
                className="flex-1 py-1.5 rounded-lg premium-gradient-glow text-white text-[10px] font-bold font-sans active:scale-[0.96] transition-all"
              >
                Low win (1.5x)
              </button>
              <button
                type="button"
                onClick={() => setTestMultiplier('12.5')}
                className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-[#3a220c] border border-amber-500/30 hover:brightness-110 text-white text-[10px] font-bold font-sans active:scale-[0.96] transition-all"
              >
                Jackpot (12.5x)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 font-sans shadow-lg shadow-indigo-950/30 active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              Pulse Bet Stream Trigger
            </button>
            <p className="text-center text-[10px] text-slate-400 font-sans mt-3">
              This updates overall platform metrics (Today GGR, turnover, active players), and generates live simulation streams.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
