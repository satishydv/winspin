import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Volume2, VolumeX, Shield, RefreshCw, Clock, Search, 
  Home, Star, Sparkles, Trophy, Ticket, Flame, Megaphone, 
  Gamepad2, Cherry, Tv, Gift, Crown, Headphones, ChevronDown, 
  ChevronUp, Send, Check, DollarSign, Activity, HelpCircle, 
  Play, Plus, Minus, Settings, Award
} from 'lucide-react';
import { BetHistoryItem, UserProfile, GameType, SlotGameId } from '../types';
import { SLOT_GAMES } from '../data';
import { sound } from '../utils/audio';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  history: BetHistoryItem[];
  soundEnabled: boolean;
  toggleSound: () => void;
  resetAll: () => void;
  updateUsername: (name: string) => void;
  setView: (view: GameType) => void;
  activeView: GameType;
  updateBalance: (amount: number, gameType: any, multiplier: number, outcome: 'win' | 'loss') => void;
  navigateToSlots: (id: SlotGameId) => void;
  isStatic?: boolean;
}

export default function MenuSidebar({ 
  isOpen, 
  onClose, 
  user, 
  history, 
  soundEnabled, 
  toggleSound, 
  resetAll,
  updateUsername,
  setView,
  activeView,
  updateBalance,
  navigateToSlots,
  isStatic = false
}: MenuSidebarProps) {
  // Navigation states & Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'sport' | 'live'>('sport');
  const [showSandboxSettings, setShowSandboxSettings] = useState<boolean>(false);

  // Modal selector for interactive elements
  const [activeModal, setActiveModal] = useState<
    null | 'lottery' | 'airdrop' | 'challenges' | 'vip' | 'support' | 'favorites' | 'releases'
  >(null);

  // --- Favorite games list persisted in localStorage ---
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('winspin_favorited_game_ids');
    return saved ? JSON.parse(saved) : ['ras_reckoning', 'buffalo_song'];
  });

  useEffect(() => {
    localStorage.setItem('winspin_favorited_game_ids', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    sound.playClick();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(gId => gId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // --- Virtual Sports State ---
  const [sportBetTeam, setSportBetTeam] = useState<'home' | 'draw' | 'away'>('home');
  const [sportBetAmount, setSportBetAmount] = useState<number>(50);
  const [sportBetStatus, setSportBetStatus] = useState<'idle' | 'betting' | 'match' | 'result'>('idle');
  const [sportMatchCommentary, setSportMatchCommentary] = useState<string>('');
  const [sportMatchScore, setSportMatchScore] = useState<string>('0 - 0');
  const [sportResultWin, setSportResultWin] = useState<boolean>(false);
  const [sportWinAmount, setSportWinAmount] = useState<number>(0);

  // --- Simulated Live Casino Dealers chat feeds ---
  const [liveDealerFeeds, setLiveDealerFeeds] = useState<Array<{ id: number; game: string; dealer: string; status: string; viewers: number }>>([
    { id: 1, game: "Roulette Royale VIP", dealer: "Amelia (London)", status: "Placing Bets...", viewers: 4212 },
    { id: 2, game: "Mystic Baccarat Live", dealer: "Kenzo (Tokyo)", status: "Dealing Cards", viewers: 1845 },
    { id: 3, game: "WinSpin Super Blackjack", dealer: "Sophia (Atlantic City)", status: "Dealer holds on soft 17", viewers: 9110 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDealerFeeds(prev => prev.map(feed => {
        const statuses = ["Placing Bets...", "Dealing Cards", "Spinning Wheel...", "Paying Out Winners", "Shuffling Deck"];
        const changeStatus = Math.random() > 0.6;
        return {
          ...feed,
          status: changeStatus ? statuses[Math.floor(Math.random() * statuses.length)] : feed.status,
          viewers: Math.max(100, feed.viewers + Math.floor(Math.random() * 41) - 20)
        };
      }));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // --- Lottery State ---
  const [lotteryTicketCount, setLotteryTicketCount] = useState<number>(1);
  const [userLotteryTickets, setUserLotteryTickets] = useState<number>(() => {
    const saved = localStorage.getItem('winspin_lottery_tickets');
    return saved ? parseInt(saved) : 0;
  });
  const [lotteryStatus, setLotteryStatus] = useState<'idle' | 'drawing' | 'win' | 'loss'>('idle');
  const [lotteryPrize, setLotteryPrize] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('winspin_lottery_tickets', userLotteryTickets.toString());
  }, [userLotteryTickets]);

  // --- Airdrop Coupon Code States ---
  const [airdropMessage, setAirdropMessage] = useState<string>('');
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    const saved = localStorage.getItem('winspin_daily_airdrop_claimed');
    return saved === 'true';
  });

  // --- Support Chat Logic ---
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [supportChat, setSupportChat] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: "Hi! Welcome to WinSpin Live Support. I'm Sophia, your personal VIP companion. How can I assist you with your sandbox account or games?", time: "Now" }
  ]);
  const [isSupportTyping, setIsSupportTyping] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [supportChat, isSupportTyping]);

  // --- Challenges list states ---
  const [challenges, setChallenges] = useState([
    { id: 'mines_roller', title: "Chieftain's Mines Gold", desc: "Bet at least $50 and claim a winning Mines roll", reward: 250, completed: false, claimed: false },
    { id: 'slots_jackpot', title: "Grand Luck Reels", desc: "Spin the slot machines 5 times dynamically", reward: 150, completed: false, claimed: false },
    { id: 'crash_sky', title: "Apex Crash Aviator", desc: "Successfully fly the rocket above 3.5x multiplier", reward: 300, completed: false, claimed: false }
  ]);

  // Handle support smart replies
  const handleSupportSend = (text: string) => {
    if (!text.trim()) return;
    sound.playClick();
    const userMsg = { sender: 'user' as const, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setSupportChat(prev => [...prev, userMsg]);
    setSupportMessage('');
    setIsSupportTyping(true);

    // AI simulated response logic
    setTimeout(() => {
      let replyText = "That's an interesting question! Since this is a Sandbox build, please note all games yield high-return coefficients and are strictly for entertainment. Let me know if you need coins credited!";
      const q = text.toLowerCase();
      if (q.includes('coin') || q.includes('balance') || q.includes('money') || q.includes('free')) {
        replyText = "Need more gold coins? You can claim the free Daily Airdrop in the sidebar to get up to $500.00 instantly! Alternatively, you can always reset your sandbox in the Settings below.";
      } else if (q.includes('level') || q.includes('xp') || q.includes('rank')) {
        replyText = "To level up fast and boost your VIP credentials, turn up your slot spin bets! Winning spins and bets provide experience points (XP) based on coefficients.";
      } else if (q.includes('best game') || lte(q, ['mines', 'slots', 'crash'])) {
        replyText = "Our players highly recommend 'Young Buffalo Song' for slot multipliers, or testing your risk coefficient inside Mines Game! Try setting high mines to earn up to 5,000x multiplier.";
      } else if (q.includes('hello') || q.includes('hi')) {
        replyText = "Hello! Hope you are rolling high stakes today. How can I boost your experience?";
      }

      setSupportChat(prev => [...prev, {
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsSupportTyping(false);
      sound.playSuccess();
    }, 1200);
  };

  const lte = (val: string, items: string[]) => items.some(i => val.includes(i));

  // Virtual match simulation handler
  const playSportMatchSim = () => {
    if (user.balance < sportBetAmount) {
      sound.playError();
      alert("Insufficient funds for this sport bet!");
      return;
    }
    sound.playClick();
    setSportBetStatus('betting');
    setSportMatchScore('0 - 0');
    setSportMatchCommentary("Connecting to Virtual League Server...");
    
    // Stage 1: kickoff
    setTimeout(() => {
      setSportBetStatus('match');
      setSportMatchCommentary("Teams emerge from tunnel. Kick-off whistle blown! Chieftain United controls possession...");
    }, 1200);

    // Stage 2: action
    setTimeout(() => {
      const homeScore = Math.floor(Math.random() * 3);
      const awayScore = Math.floor(Math.random() * 3);
      setSportMatchScore(`${homeScore} - ${awayScore}`);
      
      let winner: 'home' | 'draw' | 'away' = 'draw';
      if (homeScore > awayScore) winner = 'home';
      else if (awayScore > homeScore) winner = 'away';

      const userWon = sportBetTeam === winner;
      setSportResultWin(userWon);
      
      let multiplier = 1.95;
      if (sportBetTeam === 'draw') multiplier = 3.25;
      
      const payout = userWon ? sportBetAmount * multiplier : -sportBetAmount;
      setSportWinAmount(payout);

      if (userWon) {
        setSportMatchCommentary(`STUNNING GOAL! The match ends ${homeScore}-${awayScore}. Your bet on ${sportBetTeam.toUpperCase()} was a massive success!`);
        updateBalance(payout, "Slots (Buffalo Song)", parseFloat(multiplier.toFixed(2)), 'win');
        sound.playWin();
      } else {
        setSportMatchCommentary(`Fulltime whistle. Finale score: ${homeScore}-${awayScore}. Your bet did not pull through this time. Clear of the field!`);
        updateBalance(-sportBetAmount, "Slots (Buffalo Song)", 1, 'loss');
        sound.playError();
      }
      setSportBetStatus('result');
    }, 4000);
  };

  // Immediate Draw Lottery Simulation
  const triggerLotteryDraw = () => {
    if (userLotteryTickets <= 0) {
      sound.playError();
      alert("Please buy at least 1 lottery ticket to start the draw!");
      return;
    }
    sound.playClick();
    setLotteryStatus('drawing');
    
    setTimeout(() => {
      const ticketsRolled = userLotteryTickets;
      setUserLotteryTickets(0);
      
      // Calculate win chance: 28% chance of winning per draw session
      const matched = Math.random() < 0.35;
      if (matched) {
        const prizeAmount = Math.floor(Math.random() * 150) + 120 + (ticketsRolled * 50);
        setLotteryPrize(prizeAmount);
        setLotteryStatus('win');
        updateBalance(prizeAmount, 'Slots (Ra\'s Reckoning)', 5, 'win');
        sound.playWin();
      } else {
        setLotteryStatus('loss');
        sound.playError();
      }
    }, 2200);
  };

  // Claim code check
  const handleClaimCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    sound.playClick();
    if (clean === 'CHIEFTAIN' || clean === 'WINSPIN' || clean === 'GOLD') {
      updateBalance(500, "Slots (Ra's Reckoning)", 5, 'win');
      setAirdropMessage(`Successfully claimed VIP Voucher code! $500.00 added to your balance.`);
      sound.playSuccess();
    } else {
      setAirdropMessage("Invalid balance code. Type CHIEFTAIN or GOLD for test coins!");
      sound.playError();
    }
  };

  const claimDailyAirdrop = () => {
    if (dailyClaimed) return;
    sound.playClick();
    const claimVal = Math.floor(Math.random() * 401) + 100; // $100 - $500
    updateBalance(claimVal, "Slots (Buffalo Song)", 3, 'win');
    setDailyClaimed(true);
    localStorage.setItem('winspin_daily_airdrop_claimed', 'true');
    setAirdropMessage(`Congratulations! You claimed $${claimVal}.00 from the Chieftain daily air-drop!`);
    sound.playWin();
  };

  // Shuffle selections and launch games
  const triggerShufflePick = () => {
    sound.playClick();
    onClose();
    const index = Math.floor(Math.random() * SLOT_GAMES.length);
    const chosenGame = SLOT_GAMES[index];
    
    const toast = document.createElement('div');
    toast.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold-500 to-amber-600 border border-gold-300 text-dark-950 px-4 py-2.5 rounded-full font-sans font-bold text-xs shadow-xl z-50 flex items-center gap-2 animate-bounce";
    toast.innerHTML = `🎲 Random Shuffle Pick: Launching <strong>${chosenGame.title}</strong>!`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      navigateToSlots(chosenGame.id);
      document.body.removeChild(toast);
    }, 1500);
  };

  // Searching query handler
  const filteredSearchList = searchQuery 
    ? SLOT_GAMES.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.provider.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Determine VIP Tier Name
  const getVipTier = (lvl: number) => {
    if (lvl >= 20) return { name: 'Diamond Elite', color: 'from-cyan-400 to-indigo-500 text-cyan-200' };
    if (lvl >= 15) return { name: 'Platinum High-Roller', color: 'from-slate-200 to-blue-300 text-white' };
    if (lvl >= 10) return { name: 'Gold Lord', color: 'from-yellow-400 to-amber-500 text-yellow-100' };
    if (lvl >= 5) return { name: 'Silver Spinner', color: 'from-gray-300 to-zinc-400 text-gray-200' };
    return { name: 'Bronze Novice', color: 'from-orange-400 to-yellow-600 text-orange-200' };
  };

  const vipInfo = getVipTier(user.level);

  const renderSidebarBody = () => {
    return (
      <>
        {/* Header Area with Brand Name Close option */}
        <div className="flex justify-between items-center mb-4 shrink-0 pb-2 border-b border-[#16181d]">
          <div className="flex items-center gap-1.5 select-none">
            <span className="font-sans font-black text-lg text-white tracking-tighter italic">WIN</span>
            <span className="font-sans font-black text-lg text-[#e3ff36] tracking-tighter italic uppercase">SPIN</span>
            <span className="bg-[#e3ff36]/10 border border-[#e3ff36]/20 text-[#e3ff36] text-[8px] px-1 rounded-sm leading-none py-0.5 font-sans font-bold uppercase scale-90 ml-1">Beta</span>
          </div>
          {!isStatic && (
            <button 
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1 h-7 w-7 rounded-full border border-[#1d212a] bg-[#12141a] text-gray-400 hover:text-white flex items-center justify-center transition active:scale-90"
            >
              <X size={14} />
            </button>
          )}
        </div>

            {/* 1. SEARCH CONTAINER BAR */}
            <div className="relative mb-3.5 shrink-0">
              <div className="flex items-center bg-[#16181c] border border-[#212429] rounded-xl px-2.5 py-2.5 transition-all duration-300 focus-within:border-[#e3ff36]/40 focus-within:bg-[#111316]">
                <Search size={14} className="text-[#8e92a2] mr-2 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent text-xs text-white placeholder-[#515765] focus:outline-none w-full font-sans antialiased"
                />
                {searchQuery && (
                  <button 
                    onClick={() => { sound.playClick(); setSearchQuery(''); }}
                    className="p-0.5 text-gray-500 hover:text-white text-[10px] uppercase font-mono font-bold leading-none"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Instant Search matches popup dropdown overlay */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#101217] border border-[#1e222a] rounded-xl p-2.5 z-40 shadow-2xl flex flex-col gap-1.5 max-h-[220px] overflow-y-auto no-scrollbar">
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">Search Matching Games ({filteredSearchList.length})</span>
                  {filteredSearchList.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-gray-500">No games matched your query.</div>
                  ) : (
                    filteredSearchList.map(game => (
                      <button
                        key={game.id}
                        onClick={() => {
                          sound.playClick();
                          setSearchQuery('');
                          navigateToSlots(game.id);
                          onClose();
                        }}
                        className="flex gap-2 p-1.5 bg-[#16181c] hover:bg-[#1f2229] border border-white/5 rounded-lg text-left items-center transition"
                      >
                        <img src={game.bannerUrl} alt="" className="w-7 h-9 rounded object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <h6 className="text-[10px] font-bold text-white truncate uppercase m-0 leading-tight">{game.title}</h6>
                          <span className="text-[8px] text-[#8e92a2] uppercase leading-tight">{game.provider}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 2. SPORT / LIVE TOGGLE HEADERS (Matches reference image perfectly!) */}
            <div className="bg-[#12141a] p-1 rounded-xl flex gap-1 mb-4 shrink-0 select-none border border-[#16191f]">
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveCategory('sport');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11.5px] font-sans font-bold leading-none transition-all duration-300 relative overflow-hidden ${
                  activeCategory === 'sport' 
                    ? 'bg-[#e3ff36] text-black shadow-[0_2px_8px_rgba(227,255,54,0.25)]' 
                    : 'text-[#8e92a2] hover:text-white bg-transparent'
                }`}
              >
                <Activity size={12} className={activeCategory === 'sport' ? 'text-black' : 'text-[#8e92a2]'} />
                <span>Sport</span>
                <span className="text-[8px] opacity-75 font-semibold font-mono tracking-tighter uppercase">VTR</span>
              </button>
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveCategory('live');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11.5px] font-sans font-bold leading-none transition-all duration-300 relative overflow-hidden ${
                  activeCategory === 'live' 
                    ? 'bg-[#e3ff36] text-black shadow-[0_2px_8px_rgba(227,255,54,0.25)]' 
                    : 'text-[#8e92a2] hover:text-white bg-transparent'
                }`}
              >
                <Tv size={12} className={activeCategory === 'live' ? 'text-black' : 'text-[#8e92a2]'} />
                <span>Live</span>
                <span className="bg-red-500 h-1.5 w-1.5 rounded-full animate-ping absolute top-1 right-2 inline-block shrink-0" />
              </button>
            </div>

            {/* 3. SPORT BETTING BOX OR LIVE FEED (Expands category context directly inside sidebar!) */}
            <div className="bg-[#12141a] rounded-2xl border border-[#1a1e27] p-3 mb-4 shrink-0 select-none relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#e3ff36]/[0.02] blur-xl rounded-full" />
              {activeCategory === 'sport' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Chieftain League Cup</span>
                    <span className="bg-[#e3ff36]/10 text-[#e3ff36] text-[8px] font-mono font-bold px-1 rounded uppercase">Live Virtuals</span>
                  </div>

                  {sportBetStatus === 'idle' && (
                    <div className="flex flex-col gap-2">
                      <div className="bg-[#171a22] p-2 rounded-xl text-center border border-[#1b1f29]">
                        <p className="text-[10px] text-gray-300 font-bold leading-normal">Chieftain United vs Spin City FC</p>
                        <p className="text-[9px] text-[#e3ff36] font-extrabold font-mono mt-0.5">EST. MULTIPLIER: {sportBetTeam === 'draw' ? '3.25x' : '1.95x'}</p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-3 gap-1.5 my-1.5">
                        <button 
                          onClick={() => { sound.playClick(); setSportBetTeam('home'); }}
                          className={`py-1.5 rounded-lg text-[9px] font-bold font-mono transition uppercase ${sportBetTeam === 'home' ? 'bg-[#e3ff36]/10 border border-[#e3ff36]/60 text-[#e3ff36]' : 'bg-[#16181e] border border-[#21242c] text-gray-400'}`}
                        >
                          Home
                        </button>
                        <button 
                          onClick={() => { sound.playClick(); setSportBetTeam('draw'); }}
                          className={`py-1.5 rounded-lg text-[9px] font-bold font-mono transition uppercase ${sportBetTeam === 'draw' ? 'bg-[#e3ff36]/10 border border-[#e3ff36]/60 text-[#e3ff36]' : 'bg-[#16181e] border border-[#21242c] text-gray-400'}`}
                        >
                          Draw
                        </button>
                        <button 
                          onClick={() => { sound.playClick(); setSportBetTeam('away'); }}
                          className={`py-1.5 rounded-lg text-[9px] font-bold font-mono transition uppercase ${sportBetTeam === 'away' ? 'bg-[#e3ff36]/10 border border-[#e3ff36]/60 text-[#e3ff36]' : 'bg-[#16181e] border border-[#21242c] text-gray-400'}`}
                        >
                          Away
                        </button>
                      </div>

                      {/* Bet Size control */}
                      <div className="flex items-center justify-between gap-2.5 bg-[#16181f] px-2 py-1.5 rounded-xl border border-[#21242c]">
                        <button 
                          onClick={() => { sound.playClick(); setSportBetAmount(prev => Math.max(10, prev - 10)); }}
                          className="h-5 w-5 bg-dark-900 border border-dark-800 text-gray-400 rounded hover:text-white flex items-center justify-center font-bold font-mono"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-mono font-bold text-white">${sportBetAmount}</span>
                        <button 
                          onClick={() => { sound.playClick(); setSportBetAmount(prev => Math.min(200, prev + 10)); }}
                          className="h-5 w-5 bg-dark-900 border border-dark-800 text-gray-400 rounded hover:text-white flex items-center justify-center font-bold font-mono"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={playSportMatchSim}
                        className="w-full bg-[#e3ff36] hover:bg-[#d5ee32] text-black font-sans font-black text-[10px] py-2 rounded-xl transition uppercase leading-none shadow-md"
                      >
                        Place Virtual Bet
                      </button>
                    </div>
                  )}

                  {sportBetStatus === 'betting' && (
                    <div className="text-center py-4 flex flex-col items-center justify-center">
                      <div className="h-6 w-6 rounded-full border-2 border-t-2 border-slate-500 border-t-[#e3ff36] animate-spin mb-2" />
                      <p className="text-[9.5px] text-gray-400 animate-pulse uppercase tracking-wide">Securing Odds...</p>
                    </div>
                  )}

                  {(sportBetStatus === 'match' || sportBetStatus === 'result') && (
                    <div className="flex flex-col gap-2 p-1.5 bg-[#171a22] rounded-xl border border-white/5">
                      <div className="text-center">
                        <span className="text-[8px] text-[#e3ff36] font-bold uppercase tracking-widest font-mono">LIVE SIMULATION</span>
                        <div className="text-sm font-black font-mono text-white mt-1">{sportMatchScore}</div>
                      </div>
                      <p className="text-[9.5px] text-gray-300 font-sans italic text-center leading-normal">
                        {sportMatchCommentary}
                      </p>
                      
                      {sportBetStatus === 'result' && (
                        <button 
                          onClick={() => { sound.playClick(); setSportBetStatus('idle'); }}
                          className="mt-2 text-center text-[9px] font-mono text-[#e3ff36] hover:underline uppercase"
                        >
                          {"<< Bet Again"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* LIVE FEEDS LISTING */
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block leading-none">HOT MULTIPLAYER TABLES</span>
                  {liveDealerFeeds.map(feed => (
                    <div 
                      key={feed.id}
                      className="bg-[#171a22]/70 border border-[#21242d] hover:border-gray-800 rounded-xl p-2 flex flex-col gap-1 transition"
                    >
                      <div className="flex items-center justify-between text-[9px]">
                        <strong className="text-[#a0a69a] shrink-0 truncate max-w-[130px] font-medium leading-none">{feed.game}</strong>
                        <span className="text-[8.5px] font-mono text-gray-500 font-bold shrink-0">{feed.viewers.toLocaleString()} view</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#12141a]">
                        <span className="text-[8px] text-gray-400 font-medium">Dealer: <strong className="text-gray-300 font-bold">{feed.dealer}</strong></span>
                        <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase">{feed.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. PRIMARY NAVIGATION CATEGORY LINKS (Home, Favorite, Latest Releases, etc.) */}
            <div className="flex flex-col gap-1 mb-4 shrink-0">
              {/* Home */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setView('home');
                  onClose();
                }}
                className={`p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group ${
                  activeView === 'home' 
                    ? 'bg-[#181a1f] text-white border border-[#292d37]' 
                    : 'bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white'
                }`}
              >
                <Home size={14} className={activeView === 'home' ? 'text-[#e3ff36]' : 'text-[#8e92a2] group-hover:text-gray-200'} />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Home</span>
              </button>

              {/* Favorites bookmark dropdown link */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('favorites');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Star size={14} className="text-[#8e92a2] group-hover:text-amber-400" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Favorite</span>
                <span className="text-[9.5px] font-mono font-bold bg-[#14161c] px-1.5 rounded text-gray-500">{favorites.length}</span>
              </button>

              {/* Latest Releases modal link */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('releases');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Sparkles size={14} className="text-[#8e92a2] group-hover:text-purple-400" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Latest Releases</span>
              </button>

              {/* Recently Played */}
              <button 
                onClick={() => {
                  sound.playClick();
                  if (history.length > 0) {
                    const latest = history[0];
                    if (latest.game.toLowerCase().includes('reckoning')) navigateToSlots('ras_reckoning');
                    else if (latest.game.toLowerCase().includes('abyss')) navigateToSlots('book_abyss');
                    else if (latest.game.toLowerCase().includes('buffalo')) navigateToSlots('buffalo_song');
                    else if (latest.game.toLowerCase().includes('mines')) setView('mines');
                    else if (latest.game.toLowerCase().includes('crash')) setView('crash');
                    onClose();
                  } else {
                    alert("You haven't played any games in this session yet!");
                  }
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Clock size={14} className="text-[#8e92a2] group-hover:text-blue-400" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Recently Played</span>
                {history.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />}
              </button>

              {/* Challenges list */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('challenges');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Trophy size={14} className="text-[#8e92a2] group-hover:text-[#e3ff36]" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Challenges</span>
                <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono font-black scale-90">Hot</span>
              </button>
            </div>

            {/* Divider line style */}
            <div className="h-px bg-[#16181d] my-1 shrink-0" />

            {/* 5. SECONDARY PLATFORM PRODUCTS LIST (Lottery with 3D badging, Airdrop, Slots etc.) */}
            <div className="flex flex-col gap-1 mb-4 select-none">
              {/* SHFT Lottery [ 3D ] Link (exactly as pictured!) */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('lottery');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white relative"
              >
                <Ticket size={14} className="text-[#8e92a2] group-hover:text-[#e3ff36]" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">SHFT Lottery</span>
                <span className="bg-[#e3ff36] text-black text-[9px] font-extrabold font-sans scale-90 px-1.5 py-0.5 rounded-md leading-none select-none tracking-tighter uppercase whitespace-nowrap">
                  3d
                </span>
              </button>

              {/* SHFL Airdrop */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('airdrop');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Flame size={14} className="text-[#8e92a2] group-hover:text-orange-500 animate-pulse" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">SHFL Airdrop</span>
              </button>

              {/* Promotions */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setView('promo');
                  onClose();
                }}
                className={`p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group ${
                  activeView === 'promo' 
                    ? 'bg-[#181a1f] text-white border border-[#292d37]' 
                    : 'bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white'
                }`}
              >
                <Megaphone size={14} className={activeView === 'promo' ? 'text-[#e3ff36]' : 'text-[#8e92a2] group-hover:text-pink-400'} />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Promotions</span>
              </button>

              {/* Originals */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setView('crash');
                  onClose();
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Gamepad2 size={14} className="text-[#8e92a2] group-hover:text-emerald-400" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Originals</span>
                <span className="text-[7.5px] font-mono border border-emerald-500/30 text-emerald-400 px-1 rounded-sm uppercase leading-none">Arcade</span>
              </button>

              {/* Slots */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setView('casino');
                  onClose();
                }}
                className={`p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group ${
                  activeView === 'casino'
                    ? 'bg-[#181a1f] text-white border border-[#292d37]' 
                    : 'bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white'
                }`}
              >
                <Cherry size={14} className={activeView === 'casino' ? 'text-[#e3ff36]' : 'text-[#8e92a2] group-hover:text-[#e3ff36]'} />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Slots</span>
              </button>

              {/* Live Casino */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setView('casino');
                  onClose();
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Tv size={14} className="text-[#8e92a2] group-hover:text-blue-400" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Live Casino</span>
              </button>

              {/* Shuffle Picks */}
              <button 
                onClick={triggerShufflePick}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Gift size={14} className="text-[#8e92a2] group-hover:text-[#e3ff36]" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Shuffle Picks</span>
                <span className="text-[8.5px] font-mono text-gray-500 font-bold shrink-0">Try</span>
              </button>
            </div>

            {/* Divider line style */}
            <div className="h-px bg-[#16181d] my-1 shrink-0" />

            {/* 6. BOTTOM VIP & LIVE SUPPORT ELEMENTS */}
            <div className="flex flex-col gap-1 mt-auto pt-2 shrink-0">
              {/* Vip Level Card Link */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('vip');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Crown size={14} className="text-[#e3ff36] group-hover:animate-bounce" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Vip</span>
                <span className="text-[8.5px] font-sans font-black text-white/50">{user.level >= 20 ? 'Elite' : `Tier ${Math.ceil(user.level/5)}`}</span>
              </button>

              {/* Live Support Help Desk Room */}
              <button 
                onClick={() => {
                  sound.playClick();
                  setActiveModal('support');
                }}
                className="p-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-xs text-left group bg-transparent text-[#979da7] hover:bg-[#12141a]/60 hover:text-white"
              >
                <Headphones size={14} className="text-[#8e92a2] group-hover:text-[#e3ff36]" />
                <span className="font-bold flex-1 leading-none tracking-wide text-[12.5px]">Live Support</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
              </button>
            </div>

            {/* Collapsible Sandbox Developer / Sound Settings panel at sub-bottom */}
            <div className="mt-3.5 pt-2 border-t border-[#13151b] select-none shrink-0 text-left">
              <button 
                onClick={() => { sound.playClick(); setShowSandboxSettings(!showSandboxSettings); }}
                className="w-full flex items-center justify-between text-[10px] text-gray-500 font-sans font-bold uppercase tracking-wider mb-1.5 hover:text-white"
              >
                <span className="flex items-center gap-1"><Settings size={10} /> Sandbox Settings</span>
                <span>{showSandboxSettings ? <ChevronUp size={10} /> : <ChevronDown size={10} />}</span>
              </button>

              {showSandboxSettings && (
                <div className="flex flex-col gap-2 mt-1.5 p-2 bg-[#12141a] rounded-xl border border-[#21242d] animate-fade-in">
                  {/* Sound Effect toggle */}
                  <button 
                    onClick={() => { sound.playClick(); toggleSound(); }}
                    className="flex justify-between items-center text-[10px] text-gray-300 hover:text-white w-full pr-1.5 font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      {soundEnabled ? <Volume2 size={11} className="text-[#e3ff36]" /> : <VolumeX size={11} className="text-gray-500" />}
                      Audio effects
                    </span>
                    <span className={`text-[8.5px] font-mono font-bold px-1.5 rounded uppercase ${soundEnabled ? 'text-emerald-400 font-black' : 'text-red-400'}`}>
                      {soundEnabled ? "ON" : "OFF"}
                    </span>
                  </button>

                  <div className="h-px bg-dark-900 border-none" />

                  {/* Account Name input direct edit */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Sandbox User:</span>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={user.username}
                        onChange={(e) => updateUsername(e.target.value)}
                        className="bg-dark-950 border border-dark-800 rounded px-1.5 py-0.5 text-[9px] font-mono text-white focus:outline-none focus:border-[#e3ff36] flex-1"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-dark-900 border-none" />

                  {/* Sandbox Hard Reset button */}
                  <button 
                    onClick={() => {
                      if (confirm("Reset current balance, levels and game history back to factory defaults?")) {
                        sound.playClick();
                        resetAll();
                        onClose();
                      }
                    }}
                    className="w-full text-left py-1 text-[9px] text-gray-500 hover:text-red-400 transition flex items-center gap-1 font-semibold uppercase leading-none"
                  >
                    <RefreshCw size={10} /> Reset Sandbox Progress
                  </button>
                </div>
              )}
            </div>
            
            {/* Soft license details */}
            <div className="mt-3 text-[9.5px] text-gray-600 font-sans tracking-wide leading-none select-none shrink-0 text-center uppercase border-t border-[#13151b] pt-2">
              Secure Sandbox Verified
            </div>
      </>
    );
  };

  return (
    <>
      {isStatic ? (
        <div
          id="casino_layout_sidebar_panel_static"
          className="w-[280px] bg-[#0b0c0f] border-r border-[#191c24]/80 flex flex-col p-4 text-left overflow-y-auto no-scrollbar scroll-smooth shrink-0 h-full relative"
        >
          {renderSidebarBody()}
        </div>
      ) : (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Main Backdrop Glass Mask overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.65 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 z-40 cursor-pointer backdrop-blur-sm"
              />

              {/* SIDEBAR MAIN CONTAINER PANEL */}
              <motion.div
                id="casino_layout_sidebar_panel"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 22, stiffness: 170 }}
                className="absolute left-0 top-0 bottom-0 w-[290px] bg-[#0b0c0f] border-r border-[#191c24]/80 z-50 flex flex-col p-4 shadow-3xl text-left overflow-y-auto no-scrollbar scroll-smooth"
              >
                {renderSidebarBody()}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* DYNAMIC HIGH-INTERACTIVITY SIDEBAR MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e1014] border border-[#21242d] w-full max-w-sm rounded-3xl p-5 relative overflow-hidden text-left shadow-2xl"
            >
              {/* Backglow element background */}
              <div className="absolute top-0 right-0 h-28 w-28 bg-[#e3ff36]/[0.02] blur-2xl rounded-full" />
              
              {/* Modal dismiss top close button */}
              <button 
                onClick={() => { sound.playClick(); setActiveModal(null); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white border border-[#232731] h-7 w-7 rounded-full flex items-center justify-center bg-dark-900 transition hover:scale-105"
              >
                <X size={14} />
              </button>

              {/* -------------------- 1. LOTTERY MODAL -------------------- */}
              {activeModal === 'lottery' && (
                <div className="font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket size={24} className="text-[#e3ff36]" />
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">SHFT Jackpot Lottery</h3>
                      <span className="text-[10px] text-[#e3ff36] font-bold uppercase font-mono tracking-wider">Jackpot Pool: $15,000.00</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-sans">
                    Purchase slot ticket vouchers with your current gold credits pool! Each ticket has high-coefficient randomized numbers matching the prize pool draw!
                  </p>

                  {lotteryStatus === 'idle' && (
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#12141a] p-3 rounded-2xl border border-[#20232c] flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-gray-500 uppercase font-black">Ticket Multipliers</span>
                          <span className="text-[11px] text-white font-bold">$10.00 / Each ticket</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5 bg-dark-950 px-2.5 py-1 rounded-xl border border-dark-850">
                          <button 
                            onClick={() => { sound.playClick(); setLotteryTicketCount(p => Math.max(1, p - 1)); }}
                            className="text-[#e3ff36] font-mono font-black text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-white w-4 text-center">{lotteryTicketCount}</span>
                          <button 
                            onClick={() => { sound.playClick(); setLotteryTicketCount(p => Math.min(10, p + 1)); }}
                            className="text-[#e3ff36] font-mono font-black text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const cost = lotteryTicketCount * 10;
                          if (user.balance < cost) {
                            sound.playError();
                            alert("Insufficient gold credits to purchase tickets!");
                            return;
                          }
                          sound.playClick();
                          setUserLotteryTickets(prev => prev + lotteryTicketCount);
                          updateBalance(-cost, "Slots (Ra's Reckoning)", 1, 'loss');
                          sound.playSuccess();
                        }}
                        className="w-full bg-slate-900 hover:bg-[#e3ff36] hover:text-black border border-[#21242d] hover:border-transparent text-white font-black text-[11px] py-3 rounded-2xl transition uppercase tracking-wide leading-none"
                      >
                        Buy {lotteryTicketCount} Ticket Vouchers (${lotteryTicketCount * 10})
                      </button>

                      <div className="p-3 bg-dark-950 rounded-2xl text-center border border-dark-850 flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-[9px] text-[#8e92a2] uppercase font-bold block leading-none">Your Vouchers</span>
                          <span className="text-sm font-mono font-black text-white mt-1 block">{userLotteryTickets} Tickets</span>
                        </div>
                        <button
                          onClick={triggerLotteryDraw}
                          disabled={userLotteryTickets <= 0}
                          className={`px-4 py-2 rounded-xl text-[10px] font-sans font-black uppercase leading-none transition ${userLotteryTickets > 0 ? 'bg-[#e3ff36] text-black hover:bg-yellow-300 shadow-md' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                          Draw Now
                        </button>
                      </div>
                    </div>
                  )}

                  {lotteryStatus === 'drawing' && (
                    <div className="text-center py-6 flex flex-col items-center justify-center">
                      <div className="h-10 w-10 rounded-full border-4 border-t-4 border-slate-600 border-t-[#e3ff36] animate-spin mb-3" />
                      <p className="text-xs font-black text-[#e3ff36] uppercase tracking-widest animate-pulse">Rolling Draw Cage...</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-sans">Matching combination with system keys</p>
                    </div>
                  )}

                  {lotteryStatus === 'win' && (
                    <div className="text-center py-4">
                      <span className="text-4xl">👑</span>
                      <h4 className="text-lg font-black text-[#e3ff36] uppercase mt-2 font-display">TICKET MATCHED!</h4>
                      <p className="text-xs text-white my-1 font-sans font-bold">You won <span className="text-emerald-400 text-sm font-extrabold font-mono font-black">${lotteryPrize.toFixed(2)}</span>!</p>
                      <p className="text-[10px] text-gray-500 font-sans">Prize payout added to your wallet balance.</p>
                      <button 
                        onClick={() => { sound.playClick(); setLotteryStatus('idle'); }}
                        className="mt-4 bg-[#e3ff36] text-black font-sans font-bold text-[10px] uppercase py-2 px-5 rounded-full"
                      >
                        Success Claim
                      </button>
                    </div>
                  )}

                  {lotteryStatus === 'loss' && (
                    <div className="text-center py-4">
                      <span className="text-4xl">🦉</span>
                      <h4 className="text-sm font-black text-slate-300 uppercase mt-2">NO MULTIPLIERS HIT</h4>
                      <p className="text-[11px] text-gray-500 font-sans my-1 mx-2 leading-relaxed">
                        The ticket code combination did not secure a match this round. Claim free daily coins to try again!
                      </p>
                      <button 
                        onClick={() => { sound.playClick(); setLotteryStatus('idle'); }}
                        className="mt-4 bg-[#1e222b] text-white hover:bg-slate-800 text-[10px] font-bold px-4 py-2 rounded-full uppercase"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------- 2. AIRDROP MODAL -------------------- */}
              {activeModal === 'airdrop' && (
                <div className="font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame size={24} className="text-orange-500" />
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">SHFL Daily Airdrop</h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Sandbox Daily Allowance bonus</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-sans">
                    Claim your daily allowance or input special sandbox codes to instantly top up your wallet balance:
                  </p>

                  <div className="flex flex-col gap-3">
                    {/* Daily checkin */}
                    <div className="bg-[#12141a] p-3.5 rounded-2xl border border-[#20232c] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white font-bold block leading-none">Daily Claim Badge</span>
                        <span className="text-[9px] text-[#e3ff36] font-mono font-bold mt-1.5 block uppercase">{dailyClaimed ? "Already Claimed Today" : "Claimable: up to $500"}</span>
                      </div>
                      <button
                        onClick={claimDailyAirdrop}
                        disabled={dailyClaimed}
                        className={`px-4 py-2 rounded-xl text-[10px] font-sans font-black uppercase transition ${!dailyClaimed ? 'bg-[#e3ff36] text-black hover:bg-yellow-300 font-black shadow-md' : 'bg-gray-800 text-gray-500 cursor-not-allowed font-bold'}`}
                      >
                        {dailyClaimed ? "Claimed" : "Claim Now"}
                      </button>
                    </div>

                    <div className="h-px bg-dark-900 border-none my-1" />

                    {/* Voucher Codes */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Have a VIP Coupon Code?</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          id="voucher_code_input"
                          placeholder="e.g. CHIEFTAIN"
                          className="bg-dark-950 border border-dark-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#e3ff36] flex-1 uppercase"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('voucher_code_input') as HTMLInputElement;
                            if (input) handleClaimCode(input.value);
                          }}
                          className="bg-dark-900 hover:bg-white hover:text-black border border-dark-800 px-4 rounded-xl text-[10px] font-black uppercase text-white transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {airdropMessage && (
                      <p className="text-[10px] font-mono leading-relaxed mt-2 p-2 rounded-xl bg-orange-950/20 text-orange-200 border border-orange-900/30">
                        {airdropMessage}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------- 3. CHALLENGES MODAL -------------------- */}
              {activeModal === 'challenges' && (
                <div className="font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy size={24} className="text-[#e3ff36]" />
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">Daily Level Challenges</h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Complete simple tasks to earn coins</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 mt-4">
                    {challenges.map(chore => (
                      <div 
                        key={chore.id}
                        className="bg-[#12141a] p-3 rounded-2xl border border-[#20232c] flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11.5px] font-sans font-bold text-white uppercase leading-none">{chore.title}</h5>
                          <span className="text-[9.5px] font-mono text-[#e3ff36] font-boldLeading-none">+${chore.reward}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-sans leading-normal">{chore.desc}</p>
                        
                        <div className="flex justify-between items-center mt-1 pt-2 border-t border-[#1a1e27] leading-none">
                          <span className="text-[8.5px] text-gray-400">Sandbox Tracker</span>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setChallenges(prev => prev.map(c => c.id === chore.id ? { ...c, completed: true, claimed: true } : c));
                              updateBalance(chore.reward, "Slots (Buffalo Song)", 1, 'win');
                              sound.playWin();
                            }}
                            disabled={chore.claimed}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition ${
                              chore.claimed 
                                ? 'bg-emerald-500/10 text-emerald-400 cursor-default' 
                                : 'bg-[#e3ff36]/10 hover:bg-[#e3ff36]/20 text-[#e3ff36]'
                            }`}
                          >
                            {chore.claimed ? "Completed & Claimed" : "Simulator: Auto-Complete & Claim"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------- 4. VIP MODAL -------------------- */}
              {activeModal === 'vip' && (
                <div className="font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={24} className="text-[#e3ff36]" />
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">VIP Prestige Lounge</h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Exclusive perks for high spinner tiers</span>
                    </div>
                  </div>

                  {/* Golden Card layout */}
                  <div className={`mt-4 bg-gradient-to-br ${vipInfo.color} p-4 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-dark-950`}>
                    <div className="absolute top-0 right-0 h-28 w-28 bg-white/[0.05] blur-2xl rounded-full" />
                    
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#000]/60">WINSPIN EXCLUSIVE</span>
                        <span className="text-base font-black uppercase tracking-wide mt-0.5">{vipInfo.name}</span>
                      </div>
                      <Crown size={20} className="text-[#000]/40" />
                    </div>

                    <div className="flex justify-between items-center mt-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#000]/50">ACCOUNT STATUS</span>
                        <strong className="text-xs font-mono font-black">{user.username}</strong>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#000]/50">SPIN RANK</span>
                        <strong className="text-xs font-mono font-black">Level {user.level}</strong>
                      </div>
                    </div>
                  </div>

                  <h5 className="text-[10px] text-gray-500 font-bold uppercase mt-4 mb-2 tracking-wide block">Your Active Tiers Benefits:</h5>
                  <div className="flex flex-col gap-2 font-sans text-xs text-gray-300">
                    <div className="flex items-center gap-2.5 bg-[#12141a] p-2 rounded-xl border border-white/5">
                      <span className="text-[#e3ff36]">✔</span>
                      <p><strong>15% Active Cashback</strong> credited directly of slots simulations</p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#12141a] p-2 rounded-xl border border-white/5">
                      <span className="text-[#e3ff36]">✔</span>
                      <p>Boosted <strong>Airdrop Coefficient</strong> multiplier values</p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#12141a] p-2 rounded-xl border border-white/5">
                      <span className="text-[#e3ff36]">✔</span>
                      <p>Dedicated <strong>Sandbox Companion Agent</strong> hostess available</p>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- 5. LIVE SUPPORT CHAT MODAL -------------------- */}
              {activeModal === 'support' && (
                <div className="font-sans flex flex-col h-[400px]">
                  <div className="flex items-center gap-2 mb-3 border-b border-[#1c1f27] pb-3 shrink-0">
                    <div className="relative shrink-0">
                      <Headphones size={22} className="text-[#e3ff36]" />
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-dark-950 inline-block animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">Live Support Agent</h3>
                      <span className="text-[10px] text-emerald-400 font-semibold block leading-none">Sophia - Companion is active online</span>
                    </div>
                  </div>

                  {/* Messages container list */}
                  <div 
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 my-2 no-scrollbar"
                  >
                    {supportChat.map((msg, i) => (
                      <div 
                        key={i}
                        className={`flex flex-col max-w-[85%] text-xs ${
                          msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div className={`p-2.5 rounded-2xl ${
                          msg.sender === 'user' 
                            ? 'bg-[#e3ff36] text-black font-sans font-semibold rounded-tr-none' 
                            : 'bg-[#181a20] text-gray-200 border border-[#20242e] rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[8px] text-gray-500 mt-1">{msg.time}</span>
                      </div>
                    ))}

                    {isSupportTyping && (
                      <div className="self-start flex flex-col items-start max-w-[85%] text-xs">
                        <div className="bg-[#181a20] text-gray-200 border border-[#20242e] p-2.5 rounded-2xl rounded-tl-none">
                          <div className="flex gap-1 items-center h-2 py-1 select-none">
                            <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce shrink-0" style={{ animationDelay: '0ms' }} />
                            <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce shrink-0" style={{ animationDelay: '150ms' }} />
                            <span className="h-1.5 w-1.5 bg-gray-500 rounded-full animate-bounce shrink-0" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reply prompts chips */}
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2 shrink-0 border-t border-[#1c1f27]">
                    <button 
                      onClick={() => handleSupportSend("Can I get more free coins?")}
                      className="whitespace-nowrap px-3 py-1.5 bg-[#16181e] border border-[#21242d] hover:bg-slate-800 rounded-full text-[10px] text-gray-300 transition"
                    >
                      💰 Free Coins?
                    </button>
                    <button 
                      onClick={() => handleSupportSend("How to level up and get VIP status fast?")}
                      className="whitespace-nowrap px-3 py-1.5 bg-[#16181e] border border-[#21242d] hover:bg-slate-800 rounded-full text-[10px] text-gray-300 transition"
                    >
                      👑 Level up fast?
                    </button>
                    <button 
                      onClick={() => handleSupportSend("What is the best slot machine to play?")}
                      className="whitespace-nowrap px-3 py-1.5 bg-[#16181e] border border-[#21242d] hover:bg-slate-800 rounded-full text-[10px] text-gray-300 transition"
                    >
                      🎰 Best slot game?
                    </button>
                  </div>

                  {/* Input container footer */}
                  <div className="flex gap-2 pt-2 border-t border-[#1c1f27] shrink-0">
                    <input 
                      type="text" 
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSupportSend(supportMessage); }}
                      placeholder="Type a support message..."
                      className="bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e3ff36] flex-1"
                    />
                    <button
                      onClick={() => handleSupportSend(supportMessage)}
                      className="bg-[#e3ff36] text-black h-8 w-8 rounded-xl flex items-center justify-center font-bold hover:bg-yellow-300 transition shrink-0"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------- 6. FAVORITES DROPDOWN LIST -------------------- */}
              {activeModal === 'favorites' && (
                <div className="font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={24} className="text-amber-400" />
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">My Bookmark Favorites</h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Your top selected slot cabinets list</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {SLOT_GAMES.map(g => {
                      const isFav = favorites.includes(g.id);
                      return (
                        <div 
                          key={g.id}
                          className="bg-[#12141a] p-2 rounded-2xl border border-[#20232c] flex items-center justify-between gap-3"
                        >
                          <button
                            onClick={() => {
                              sound.playClick();
                              navigateToSlots(g.id);
                              setActiveModal(null);
                              onClose();
                            }}
                            className="flex-1 flex gap-2.5 items-center text-left"
                          >
                            <img src={g.bannerUrl} alt="" className="w-8 h-10 rounded-xl object-cover border border-white/5" />
                            <div className="min-w-0">
                              <h5 className="text-[11.5px] font-sans font-bold text-white uppercase leading-none truncate">{g.title}</h5>
                              <span className="text-[8.5px] text-slate-400 uppercase mt-1 block leading-none">{g.provider}</span>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => toggleFavorite(g.id)}
                            className="p-1 h-7 w-7 text-gray-500 hover:text-amber-400 transition"
                          >
                            <Star size={14} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-amber-400" : "text-gray-500"} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* -------------------- 7. LATEST RELEASES MODAL -------------------- */}
              {activeModal === 'releases' && (
                <div className="font-sans">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={24} className="text-purple-400" />
                    <div>
                      <h3 className="text-sm font-sans font-black text-white uppercase tracking-wide">Hot Off the Press Releases</h3>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">The latest cabinets on the floor</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 mt-4">
                    {SLOT_GAMES.slice(-3).map(g => (
                      <div 
                        key={g.id}
                        className="bg-[#12141a] rounded-2xl border border-[#20232c] p-3 flex gap-3 select-none"
                      >
                        <img src={g.bannerUrl} alt="" className="w-12 h-16 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 flex flex-col justify-center text-left">
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-purple-400">RTP: 98.15%</span>
                          <h4 className="font-display font-black text-xs text-white tracking-wide mt-0.5">{g.title}</h4>
                          <span className="text-[8.5px] text-gray-400 mt-1 uppercase">{g.provider}</span>
                        </div>
                        <button 
                          onClick={() => {
                            sound.playClick();
                            navigateToSlots(g.id);
                            setActiveModal(null);
                            onClose();
                          }}
                          className="h-8 w-8 bg-[#e3ff36]/10 text-[#e3ff36] rounded-xl flex items-center justify-center font-bold hover:bg-[#e3ff36] hover:text-black transition self-center"
                        >
                          <Play size={10} fill="currentColor" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
