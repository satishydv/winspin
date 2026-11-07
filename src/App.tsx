import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  MessageSquare,
  Coins,
  Menu,
  LayoutGrid,
  Home,
  Gift,
  ChevronRight,
  ChevronLeft,
  Star,
  Layers,
  Volume2,
  VolumeX,
  Volume1,
  User,
  Zap,
  X,
  Wifi,
  Battery,
  Award,
  Clover,
  Cherry,
  Crown,
  Wallet,
  Plus,
  ArrowUpRight,
  Grip,
  Dices,
  Ticket,
  MessagesSquare,
  Gamepad2,
  Blocks,
  Search,
  Trophy
} from 'lucide-react';
import { GameType, SlotGameId, UserProfile, BetHistoryItem, ApiGame } from './types';
import { PROVIDERS, SLOT_GAMES } from './data';
import { sound } from './utils/audio';

// Subcomponents modular imports
import AdminApp from './AdminApp';
import MinesGame from './components/MinesGame';
import CrashGame from './components/CrashGame';
import SlotsGame from './components/SlotsGame';
import LiveChats from './components/LiveChats';
import PromoOffers from './components/PromoOffers';
import MenuSidebar from './components/MenuSidebar';
import AccountsView from './components/AccountsView';
import AccountStatementView from './components/AccountStatementView';
import WithdrawView from './components/WithdrawView';
import DepositView from './components/DepositView';
import RegisterModal from './components/RegisterModal';
import BonusModal from './components/BonusModal';
import PlayModeModal from './components/PlayModeModal';
import NotFoundView from './components/NotFoundView';
import SportsPlaceholder from './components/SportsPlaceholder';
import FallbackImage from './components/FallbackImage';
import SearchView from './components/SearchView';
import BetsView from './components/BetsView';
import heroImage from '../assets/images/hero/hero.png';
import rocketImage from '../assets/images/cards/rocket.png';
import bombImage from '../assets/images/cards/bomb.png';

export default function App() {
  // Navigation current view state
  const [view, setViewState] = useState<GameType>('home');
  const [slotsGameId, setSlotsGameId] = useState<SlotGameId>('ras_reckoning');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const featuredGamesRowRef = useRef<HTMLDivElement>(null);
  const slotsGamesRowRef = useRef<HTMLDivElement>(null);

  // Deposit and Withdraw Sandbox modal states
  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);
  const [showPlayModeModal, setShowPlayModeModal] = useState<boolean>(false);
  const [selectedFeaturedSlot, setSelectedFeaturedSlot] = useState<SlotGameId | null>(null);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [depositAmountInput, setDepositAmountInput] = useState<string>('500');
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('200');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string>('');
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string>('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string>('');

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Provider API States
  const [selectedProvider, setSelectedProvider] = useState<string>(PROVIDERS[0].id);
  const [providerGames, setProviderGames] = useState<ApiGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState<boolean>(false);

  // Fetch provider games
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      try {
        const response = await fetch(`/api/games/${selectedProvider}.json`);
        if (!response.ok) throw new Error('Failed to fetch games');
        const data = await response.json();
        setProviderGames(data);
      } catch (error) {
        console.error('Error fetching provider games:', error);
        setProviderGames([]);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchGames();
  }, [selectedProvider]);

  // User details state
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('winspin_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      username: 'LuckySeeker',
      avatarUrl: '',
      level: 1,
      xp: 20,
      xpToNextLevel: 100,
      balance: 1000.00
    };
  });

  const getPathForView = (currentView: GameType) => {
    switch (currentView) {
      case 'home':
        return '/';
      case 'crash':
        return '/crash';
      case 'mines':
        return '/mines';
      case 'slots':
        return '/slots';
      case 'promo':
        return '/promo';
      case 'chats':
        return '/chats';
      case 'casino':
        return '/casino';
      case 'accounts':
        return '/accounts';
      case 'bets':
        return '/bets';
      case 'account_statement':
        return '/account-statement';
      case 'withdraw':
        return '/withdraw';
      case 'deposit':
        return '/deposit';
      case 'sports':
        return '/sports';
      case 'search':
        return '/search';
      case 'admin':
        return '/admin';
      case 'login':
        return '/login';
      case 'register':
        return '/register';
      case '404':
        return '/404';
      default:
        return '/';
    }
  };

  const setView: React.Dispatch<React.SetStateAction<GameType>> = (nextView) => {
    const next = typeof nextView === 'function' ? nextView(view) : nextView;
    setViewState(next);

    const nextPath = getPathForView(next);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ view: next }, '', nextPath);
    }
  };

  const syncViewFromPath = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';

    if (path === '/register') {
      setView('register');
      return;
    }
    if (path === '/login') {
      setView('login');
      return;
    }
    if (path === '/search') {
      setView('search');
      return;
    }
    if (path === '/bets') {
      setView('bets');
      return;
    }

    switch (path) {
      case '/':
      case '/home':
        setView('home');
        break;
      case '/crash':
        setView('crash');
        break;
      case '/mines':
        setView('mines');
        break;
      case '/slots':
        setView('slots');
        break;
      case '/promo':
        setView('promo');
        break;
      case '/chats':
        setView('chats');
        break;
      case '/casino':
        setView('casino');
        break;
      case '/accounts':
        setView('accounts');
        break;
      case '/account-statement':
        setView('account_statement');
        break;
      case '/withdraw':
        setView('withdraw');
        break;
      case '/deposit':
        setView('deposit');
        break;
      case '/sports':
        setView('sports');
        break;
      case '/admin':
        setView('admin');
        break;
      case '/404':
        setView('404');
        break;
      default:
        setView('404');
        break;
    }
  };

  useEffect(() => {
    syncViewFromPath();
    const handlePopState = () => syncViewFromPath();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Welcome promo matching state
  const [hasClaimedWelcome, setHasClaimedWelcome] = useState<boolean>(() => {
    return localStorage.getItem('winspin_claimed_welcome') === 'true';
  });

  // Level Up Splash popup triggers
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [levelUpNum, setLevelUpNum] = useState<number>(0);

  // Notifications drawer simulation
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const [notifs, setNotifs] = useState([
    { id: 1, text: '🎉 Claim your free welcome matching bonus of $500!', read: false },
    { id: 2, text: '🌌 Wild West slots "Buffalo Song" RTP is boosted to 98%!', read: false },
  ]);

  // Session bets history buffer
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>(() => {
    const saved = localStorage.getItem('winspin_bet_history');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Local Storage Syncing
  useEffect(() => {
    localStorage.setItem('winspin_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('winspin_bet_history', JSON.stringify(betHistory));
  }, [betHistory]);

  useEffect(() => {
    localStorage.setItem('winspin_claimed_welcome', hasClaimedWelcome ? 'true' : 'false');
  }, [hasClaimedWelcome]);

  // Unified ledger handler for deductions, victories, XP points
  const updateBalance = (
    amount: number,
    gameType: 'Mines' | 'Crash' | 'Slots (Ra\'s Reckoning)' | 'Slots (Book of Abyss)' | 'Slots (Buffalo Song)',
    multiplier: number,
    outcome: 'win' | 'loss'
  ) => {
    setUser(prev => {
      const nextBalance = parseFloat((prev.balance + amount).toFixed(2));

      // Calculate XP granted on wins or bets
      // Wins grant robust XP relative to value
      // Loss bets grant basic participating XP (1 XP per bet unit)
      const xpEarned = outcome === 'win'
        ? Math.max(5, Math.ceil(amount * multiplier * 0.15))
        : Math.max(2, Math.ceil(Math.abs(amount) * 0.1));

      let nextXp = prev.xp + xpEarned;
      let nextLevel = prev.level;
      let nextXpToNextLevel = prev.xpToNextLevel;

      // Level up algorithm (progressive curve)
      while (nextXp >= nextXpToNextLevel) {
        nextXp -= nextXpToNextLevel;
        nextLevel += 1;
        nextXpToNextLevel = Math.floor(nextXpToNextLevel * 1.3);

        // Trigger congratulations scale modal!
        setLevelUpNum(nextLevel);
        setShowLevelUp(true);
        setTimeout(() => {
          sound.playWin();
        }, 120);
      }

      return {
        ...prev,
        balance: nextBalance,
        xp: nextXp,
        level: nextLevel,
        xpToNextLevel: nextXpToNextLevel
      };
    });

    // Record game results only while a game is active (keep the newest 15 ledger events).
    const newRecord: BetHistoryItem = {
      id: Math.random().toString(),
      game: gameType,
      betAmount: outcome === 'win' ? (amount / multiplier || 10) : Math.abs(amount),
      payoutAmount: outcome === 'win' ? amount : 0,
      multiplier: multiplier,
      outcome: outcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    };

    if (view === 'crash' || view === 'mines' || view === 'slots') {
      setBetHistory(prev => [newRecord, ...prev.slice(0, 14)]);
    }
  };

  // Sound manager link
  const toggleSound = () => {
    const isNowOn = sound.toggle();
    setSoundEnabled(isNowOn);
  };

  // Resets local storage sandbox cache back to preset factory values
  const resetAll = () => {
    localStorage.clear();
    setHasClaimedWelcome(false);
    setBetHistory([]);
    setUser({
      username: 'LuckySpinner',
      avatarUrl: '',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      balance: 1000.00
    });
    setView('home');
  };

  const updateUsername = (name: string) => {
    setUser(prev => ({ ...prev, username: name }));
  };

  // Quick navigation utility helper
  const navigateToSlots = (id: SlotGameId) => {
    sound.playClick();
    setSlotsGameId(id);
    setView('slots');
  };

  if (view === 'admin') {
    return (
      <div className="admin-dashboard-root w-full h-full">
        <AdminApp />
      </div>
    );
  }

  return (
    <div id="lobby_viewport_root" className="w-full max-w-full h-screen h-[100dvh] bg-[#0a0b0f] select-none relative overflow-hidden font-sans flex flex-col">

      {/* Absolute abstract golden floating ambient dust balls in background */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      {/* MOBILE CONFINMENT PHONE SHELL FRAME (centers the mobilepecific canvas perfectly!) */}
      <div
        id="iphone_pro_frame"
        className="
          relative w-full h-full lg:flex-row
          bg-[#0a0b0f]
          flex flex-col overflow-hidden z-10
        "
      >
        {/* DESKTOP PERMANENT SIDEBAR */}
        <div className="hidden lg:block shrink-0 h-full border-r border-[#191c24]/80 bg-[#0b0c0f]">
          <MenuSidebar
            isOpen={true}
            isStatic={true}
            onClose={() => { }}
            user={user}
            history={betHistory}
            soundEnabled={soundEnabled}
            toggleSound={toggleSound}
            resetAll={resetAll}
            updateUsername={updateUsername}
            setView={setView}
            activeView={view}
            updateBalance={updateBalance}
            navigateToSlots={navigateToSlots}
            onOpenRegister={() => setView('register')}
          />
        </div>

        {/* RIGHT CONTENT PANEL (stretches and maintains vertical column on both mobile container and desktop cabinet) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 bg-[#0a0b0f]">

          {/* DESKTOP BRAND WALLET STRIP (Only visible on large screens) */}
          <div id="global_wallet_strip" className="hidden lg:flex px-4 py-2 bg-[#0c0d12] border-b border-[#181a21]/50 justify-between items-center z-30 select-none shrink-0 h-[58px]">
            {/* LEFT AREA: brand, menu, stats */}
            <div className="flex items-center">
              {/* Desktop menu toggle next to WINSPIN branding */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsSidebarOpen(p => !p);
                }}
                className="hidden lg:flex p-1.5 rounded-lg border border-[#1d202a] bg-[#111216]/80 text-gray-400 hover:text-white items-center justify-center transition active:scale-95 cursor-pointer mr-3"
              >
                <Menu size={14} />
              </button>

              {/* Free Bonus badge */}
              <div
                onClick={() => {
                  sound.playClick();
                  const bonusAmount = Math.floor(Math.random() * 201) + 50;
                  setUser(prev => ({ ...prev, balance: parseFloat((prev.balance + bonusAmount).toFixed(2)) }));
                  setNotifs(prev => [
                    { id: Date.now(), text: `🎉 Received free Sandbox Bonus of $${bonusAmount}!`, read: false },
                    ...prev
                  ]);
                  sound.playWin();
                }}
                className="hidden sm:flex bg-gradient-to-r from-indigo-500/15 via-purple-500/20 to-pink-500/15 border border-indigo-500/30 hover:border-purple-500/60 px-3 py-1.5 rounded-xl items-center gap-1.5 cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all duration-150 mr-2 shadow-[0_2px_8px_rgba(99,102,241,0.05)]"
                title="Click to claim random virtual bonus!"
              >
                <Gift size={13} className="text-purple-400 animate-bounce group-hover:scale-110 shrink-0" />
                <span className="text-white font-sans font-extrabold text-[10.5px] tracking-tight whitespace-nowrap">Free Bonus</span>
                <span className="bg-[#e3ff36]/10 text-[#e3ff36] text-[8px] font-mono px-1 rounded scale-90">+Reward</span>
              </div>

              {/* Online indicator */}
              <div className="hidden md:flex bg-[#12141a] border border-[#1d212a] px-3 py-1.5 rounded-xl items-center gap-1.5 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
                <span className="text-gray-400 font-sans text-[9px] uppercase font-bold tracking-wider">Online</span>
                <span className="text-[#10b981] font-mono text-[10.5px] font-black tracking-tight">520</span>
              </div>
            </div>

            {/* RIGHT AREA: actions (Withdraw, Balance, Deposit, Icons, Avatar) */}
            <div className="flex items-center gap-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setView('login');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2a2c33] text-gray-200 hover:text-white hover:bg-[#343740] font-sans font-bold text-[13px] transition-colors shadow-sm border border-[#383d4f] h-[38px] flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setView('register');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#f2d075] to-[#d6a54a] text-[#1c1402] hover:brightness-110 font-sans font-bold text-[13px] transition-colors shadow-[0_2px_10px_rgba(214,165,74,0.3)] h-[38px] flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  {/* Balance Container */}
                  <div className="bg-[#13151b] border border-[#1d212a] pl-1 pr-3 py-1 rounded-[14px] flex items-center gap-2 select-none shadow-inner shrink-0 cursor-pointer hover:bg-[#1a1c24] transition-colors h-[42px]">
                    <div className="w-[32px] h-[32px] rounded-[10px] bg-[#ffcf54] flex items-center justify-center text-[#1a1300] font-black text-[15px] font-mono leading-none shrink-0 select-none">
                      $
                    </div>
                    <span className="text-white font-mono font-bold text-[14px] tracking-tight">
                      {user.balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }).replace('.', ',')}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 ml-0.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>


                  {/* Grid Menu Button */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsSidebarOpen(true);
                    }}
                    className="w-[42px] h-[42px] rounded-[14px] bg-[#2a2c33] border border-[#383d4f] hover:bg-[#343740] flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0 text-gray-400 hover:text-white ml-1"
                  >
                    <LayoutGrid size={18} className="fill-current" />
                  </button>
                </>
              )}
            </div>
          </div>


          {/* MOBILE GLASS BRAND HEADER MATCHING IMAGE AT HIGH-FIDELITY (Only visible on mobile screens) */}
          <div
            id="mobile_brand_header"
            className="lg:hidden flex justify-between items-center px-4 py-2 bg-[#0a0b0e] border-b border-yellow-500/10 z-30 select-none shrink-0 h-[58px]"
          >
            {/* LEFT SIDE: Brand Logo resembling uploaded layout */}
            <div className="flex items-center pt-0.5 gap-1.5">
              <div className="flex items-center">
                <span className="text-[#e3ff36] font-sans font-black tracking-tighter text-[22px] italic uppercase leading-none select-none">VARA</span>
                <span className="text-white font-sans font-black tracking-tighter text-[22px] italic uppercase leading-none select-none">567</span>
              </div>
            </div>

            {/* RIGHT SIDE: Customized Three Button Grid from Image */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setView('login');
                    }}
                    className="px-3 py-1.5 rounded-[9px] bg-[#2a2c33] text-gray-200 font-sans font-bold text-[12px] h-[36px] flex items-center justify-center active:scale-95 transition-transform"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setView('register');
                    }}
                    className="px-3 py-1.5 rounded-[9px] bg-gradient-to-b from-[#f2d075] to-[#d6a54a] text-[#1c1402] font-sans font-bold text-[12px] h-[36px] flex items-center justify-center active:scale-95 transition-transform"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  {/* Balance Container */}
                  <div className="bg-[#13151b] border border-[#1d212a] pl-1 pr-1.5 sm:pr-2 py-1 rounded-[12px] flex items-center gap-1 sm:gap-1.5 select-none shadow-inner shrink-0 cursor-pointer h-[34px] sm:h-[38px]">
                    <div className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] rounded-[9px] bg-[#ffcf54] flex items-center justify-center text-[#1a1300] font-black text-[12px] sm:text-[13px] font-mono leading-none shrink-0 select-none">
                      $
                    </div>
                    <span className="text-white font-mono font-bold text-[11px] sm:text-[12px] tracking-tight">
                      {user.balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }).replace('.', ',')}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 ml-0.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>


                  {/* Grid Menu Button */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsSidebarOpen(true);
                    }}
                    className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-[10px] sm:rounded-[12px] bg-[#2a2c33] border border-[#383d4f] flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0 text-gray-400 hover:text-white"
                  >
                    <LayoutGrid size={15} className="fill-current" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* CORE SCROLLABLE ROUTER CONTAINER MODULE */}
          <div id="phone_body_screen" className="flex-1 overflow-hidden relative flex flex-col min-h-0 min-w-0 bg-dark-900">
            <AnimatePresence mode="wait">
              {view === 'home' && (
                <motion.div
                  key="home_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-[65px] lg:pb-6"
                >

                  {/* LOBBY CONTENT SCROLL */}
                  <div className="flex flex-col p-4 gap-4 flex-1 min-w-0 max-w-full overflow-x-hidden">

                    {/* HERO PROMO WELCOME BANNER (matches image composition exactly!) */}
                    <div
                      id="welcome_promo_hero"
                      className="min-h-[111px] sm:min-h-[156px] bg-gradient-to-br from-amber-600/90 to-red-950/90 border border-gold-500/35 rounded-2xl p-4 flex justify-between relative overflow-hidden shadow-lg select-none shrink-0"
                    >
                      {/* Background gold lighting glow */}
                      <div className="absolute -right-24 -bottom-16 w-56 h-56 bg-gold-400/15 blur-3xl rounded-full" />

                      <div className="flex-1 flex flex-col justify-between align-start relative z-10">
                        <div>
                          {/* Huge Typography text "% 100" matching photo style exactly */}
                          <div className="flex items-baseline gap-1 select-none">
                            <span className="text-xl font-display font-medium text-gold-accent select-none">%</span>
                            <span className="text-4xl font-display font-black text-white text-glow tracking-tighter select-none font-bold">100</span>
                          </div>
                          <h2 className="text-xs font-display font-black text-gold-bright uppercase tracking-wider mt-0.5 leading-none">WELCOME BONUS</h2>
                          <p className="text-[10px] text-zinc-300 mt-2.5 font-sans leading-relaxed">Up To <span className="text-gold-accent font-semibold font-mono">$10,000</span> Affiliate Program</p>
                        </div>

                        {/* Claimable interactive trigger button */}
                        <button
                          onClick={() => {
                            sound.playClick();
                            setView('promo');
                          }}
                          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-dark-950 font-display font-black text-[10px] tracking-wider uppercase rounded-xl transition duration-300 transform active:scale-95 shadow-[0_4px_15px_rgba(234,179,8,0.3)] hover:scale-[1.01] self-start"
                        >
                          Join Now
                        </button>
                      </div>

                      {/* Hero artwork */}
                      <div className="w-[142px] sm:w-[180px] pointer-events-none shrink-0 flex items-center justify-end relative h-[118px] sm:h-[155px] -mr-3 -mb-3 z-20">
                        <img
                          src={heroImage}
                          alt=""
                          className="w-full h-full object-contain object-right filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
                        />
                        <svg viewBox="0 0 200 180" className="hidden">
                          <defs>
                            {/* Gradients for gold glow and metallic details */}
                            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
                              <stop offset="60%" stopColor="#eab308" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="40%" stopColor="#ca8a04" />
                              <stop offset="100%" stopColor="#854d0e" />
                            </linearGradient>
                            <linearGradient id="rubyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f43f5e" />
                              <stop offset="100%" stopColor="#9f1239" />
                            </linearGradient>
                            <linearGradient id="featherYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="100%" stopColor="#ca8a04" />
                            </linearGradient>
                            <linearGradient id="featherPink" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#9d174d" />
                            </linearGradient>
                            <linearGradient id="featherBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#38bdf8" />
                              <stop offset="100%" stopColor="#0369a1" />
                            </linearGradient>
                            <linearGradient id="woodTexture" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#78350f" />
                              <stop offset="50%" stopColor="#451a03" />
                              <stop offset="100%" stopColor="#1e0c02" />
                            </linearGradient>
                          </defs>

                          {/* 1. Behind-Scene Golden Glow Radiance & Magical Sparkles */}
                          <circle cx="105" cy="115" r="75" fill="url(#goldGlow)" />

                          {/* Magic Sparkles (Floating starbursts) */}
                          <path d="M 45,65 L 47,70 L 52,71.5 L 47,73 L 45,78 L 43,73 L 38,71.5 L 43,70 Z" fill="#fef08a" />
                          <path d="M 100,50 L 101.5,54 L 105.5,55 L 101.5,56 L 100,60 L 98.5,56 L 94.5,55 L 98.5,54 Z" fill="#ffd700" />
                          <path d="M 30,120 L 31.5,124 L 35.5,125 L 31.5,126 L 30,130 L 28.5,126 L 24.5,125 L 28.5,124 Z" fill="#ffd700" />
                          <path d="M 85,95 L 86.5,99 L 90.5,100 L 86.5,101 L 85,105 L 83.5,101 L 79.5,100 L 83.5,99 Z" fill="#fef08a" />

                          {/* 2. CHIEFTAIN FEATURES */}

                          {/* Cohesive Vibrant Feathers in hair background sticking out to the right */}
                          {/* Yellow feather */}
                          <path d="M 152,43 C 158,30 178,16 182,34 C 180,48 162,56 150,56 Z" fill="url(#featherYellow)" stroke="#854d0e" strokeWidth="0.75" />
                          <line x1="152" y1="56" x2="175" y2="28" stroke="#78350f" strokeWidth="1.2" />
                          {/* Orange/Red feather */}
                          <path d="M 158,54 C 172,46 189,40 191,56 C 187,70 170,72 154,66 Z" fill="url(#featherPink)" stroke="#5c0628" strokeWidth="0.75" />
                          <line x1="154" y1="66" x2="182" y2="50" stroke="#4c0519" strokeWidth="1.2" />
                          {/* Purple/Blue feather */}
                          <path d="M 153,65 C 172,66 187,70 186,85 C 175,98 160,90 150,78 Z" fill="url(#featherBlue)" stroke="#0f172a" strokeWidth="0.75" />
                          <line x1="150" y1="78" x2="178" y2="76" stroke="#0369a1" strokeWidth="1.2" />

                          {/* Topknot dark hair bun */}
                          <circle cx="147" cy="48" r="14" fill="#1c1917" />
                          <ellipse cx="147" cy="38" rx="8" ry="6" fill="#292524" />

                          {/* Chieftain Head Hair Outline */}
                          <path d="M 120,68 C 115,36 175,36 172,68 C 168,76 122,76 120,68 Z" fill="#292524" />

                          {/* Smiling Chieftain Face (Cute Chibi-Mayan Form) */}
                          <circle cx="146" cy="78" r="23" fill="#fbcfe8" />
                          {/* Face skin shading */}
                          <path d="M 123,78 A 23,23 0 0 0 169,78 Z" fill="#f472b6" opacity="0.15" />

                          {/* Golden Ear Hoops with ruby beads */}
                          <circle cx="121" cy="80" r="6.5" fill="none" stroke="#eab308" strokeWidth="2.5" />
                          <circle cx="121" cy="86.5" r="2" fill="#ef4444" />
                          <circle cx="171" cy="80" r="6.5" fill="none" stroke="#eab308" strokeWidth="2.5" />
                          <circle cx="171" cy="86.5" r="2" fill="#ef4444" />

                          {/* Golden Headband with Ruby Jewel */}
                          <path d="M 124,63 C 131,58 161,58 168,63 L 166,70 C 159,65 131,65 125,70 Z" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.8" />
                          {/* Red Oval Ruby in Headband Center */}
                          <circle cx="146" cy="61" r="5" fill="#a16207" />
                          <ellipse cx="146" cy="61" rx="3.5" ry="2.5" fill="url(#rubyGlow)" />
                          <ellipse cx="144.5" cy="59.5" rx="1" ry="0.6" fill="#ffffff" opacity="0.8" />
                          {/* Headband golden rivets details */}
                          <circle cx="132" cy="63" r="1.2" fill="#fef08a" />
                          <circle cx="138" cy="61.5" r="1.2" fill="#fef08a" />
                          <circle cx="154" cy="61.5" r="1.2" fill="#fef08a" />
                          <circle cx="160" cy="63" r="1.2" fill="#fef08a" />

                          {/* Eyes: Ultra-happy closed curving arcs */}
                          <path d="M 128,73 C 132,69 138,69 141,73" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
                          <path d="M 151,73 C 155,69 161,69 164,73" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />

                          {/* Rosy Cheeks */}
                          <circle cx="127" cy="78" r="3.5" fill="#f43f5e" opacity="0.45" />
                          <circle cx="165" cy="78" r="3.5" fill="#f43f5e" opacity="0.45" />

                          {/* Nose */}
                          <ellipse cx="146" cy="75" rx="4.5" ry="3" fill="#fbcfe8" filter="brightness(0.9)" />

                          {/* Happy Laughing Open Mouth */}
                          <path d="M 134,80 C 134,95 158,95 158,80 Z" fill="#4c0519" stroke="#292524" strokeWidth="1" />
                          {/* White glowing teeth row */}
                          <path d="M 135,80 C 135,84 157,84 157,80 Z" fill="#ffffff" />
                          {/* Pink cute tongue */}
                          <path d="M 141,88 C 141,84 151,84 151,88 Z" fill="#f472b6" />

                          {/* Chieftain Beard & Mustache (Framing big smile) */}
                          <path d="M 127,77 C 132,79 140,75 146,79 C 152,75 160,79 165,77 C 168,81 158,85 146,83 C 134,85 125,81 127,77 Z" fill="#1c1917" />
                          <path d="M 121,80 C 117,100 175,100 171,80 C 168,110 124,110 121,80 Z" fill="#1c1917" />

                          {/* Golden necklaces trim of tunic */}
                          <path d="M 132,98 C 136,108 156,108 160,98 Z" fill="#eab308" />
                          <path d="M 136,98 C 138,104 154,104 156,98 Z" fill="#ef4444" />
                          <circle cx="146" cy="103" r="2.5" fill="#10b981" />

                          {/* 3. EPIC OPENED TREASURE CHEST (Center-Left) */}
                          <g transform="translate(15, 78)">
                            {/* Inside lid glow backing (rising gold rays) */}
                            <path d="M 15,-10 L 105,-15 L 115,25 L 5,20 Z" fill="url(#goldGlow)" opacity="0.6" />

                            {/* Open Chest Lid (pointing upwards and leftwards) */}
                            <g transform="rotate(-15, 60, 20)">
                              {/* Lid back wooden interior */}
                              <path d="M 10,0 C 10,-24 110,-24 110,0 Z" fill="#451a03" stroke="#ca8a04" strokeWidth="1.5" />
                              {/* Wood lining planks */}
                              <line x1="35" y1="-18" x2="35" y2="0" stroke="#270e01" strokeWidth="1" />
                              <line x1="60" y1="-22" x2="60" y2="0" stroke="#270e01" strokeWidth="1" />
                              <line x1="85" y1="-18" x2="85" y2="0" stroke="#270e01" strokeWidth="1" />
                              {/* Gold outer rim lining on lid */}
                              <path d="M 6,-1 C 6,-30 114,-30 114,-1" fill="none" stroke="url(#goldCap)" strokeWidth="3" />
                              {/* Decorative gold rivets on rim */}
                              <circle cx="20" cy="-16" r="1" fill="#fef08a" />
                              <circle cx="40" cy="-24" r="1" fill="#fef08a" />
                              <circle cx="60" cy="-26" r="1" fill="#fef08a" />
                              <circle cx="80" cy="-24" r="1" fill="#fef08a" />
                              <circle cx="100" cy="-16" r="1" fill="#fef08a" />
                            </g>

                            {/* Glowing heap of gold coins inside chest base overflowing */}
                            <ellipse cx="60" cy="18" rx="46" ry="14" fill="#ca8a04" />
                            <ellipse cx="60" cy="15" rx="42" ry="11" fill="url(#goldCap)" />
                            {/* Individual overlapping gold coins */}
                            <circle cx="34" cy="12" r="5.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="45" cy="10" r="6" fill="#ffd700" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="58" cy="8" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="70" cy="11" r="5.5" fill="#ffd700" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="84" cy="14" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />

                            <circle cx="28" cy="16" r="5.5" fill="#ffd700" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="40" cy="15" r="5.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="52" cy="14" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="65" cy="13" r="5.5" fill="#ffd700" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="76" cy="15" r="5.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                            <circle cx="88" cy="18" r="5" fill="#ffd700" stroke="#ca8a04" strokeWidth="0.5" />

                            {/* Chest Body Base */}
                            {/* Base shadow */}
                            <rect x="8" y="20" width="104" height="54" rx="4" fill="#1c1917" opacity="0.35" />
                            {/* Main wood box base */}
                            <rect x="10" y="18" width="100" height="50" rx="2" fill="url(#woodTexture)" stroke="#270e01" strokeWidth="1.5" />

                            {/* Vertical gold brace divider in middle */}
                            <rect x="52" y="18" width="16" height="50" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.5" />
                            {/* Middle divider rivet dots */}
                            <circle cx="60" cy="24" r="1.2" fill="#78350f" />
                            <circle cx="60" cy="36" r="1.2" fill="#78350f" />
                            <circle cx="60" cy="48" r="1.2" fill="#78350f" />
                            <circle cx="60" cy="60" r="1.2" fill="#78350f" />

                            {/* Outer Thick Golden Corner Brackets */}
                            {/* Left Bracket */}
                            <path d="M 10,18 L 22,18 L 22,24 L 14,24 L 14,64 L 22,64 L 22,68 L 10,68 Z" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.5" />
                            {/* Left rivets */}
                            <circle cx="14" cy="22" r="1.2" fill="#78350f" />
                            <circle cx="14" cy="34" r="1.2" fill="#78350f" />
                            <circle cx="14" cy="46" r="1.2" fill="#78350f" />
                            <circle cx="14" cy="58" r="1.2" fill="#78350f" />
                            <circle cx="14" cy="64" r="1.2" fill="#78350f" />

                            {/* Right Bracket */}
                            <path d="M 110,18 L 98,18 L 98,24 L 106,24 L 106,64 L 98,64 L 98,68 L 110,68 Z" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.5" />
                            {/* Right rivets */}
                            <circle cx="106" cy="22" r="1.2" fill="#78350f" />
                            <circle cx="106" cy="34" r="1.2" fill="#78350f" />
                            <circle cx="106" cy="46" r="1.2" fill="#78350f" />
                            <circle cx="106" cy="58" r="1.2" fill="#78350f" />
                            <circle cx="106" cy="64" r="1.2" fill="#78350f" />

                            {/* Top Golden Rim of Base */}
                            <rect x="8" y="18" width="104" height="6" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.5" />

                            {/* Left Panel: Stylized 3D Golden "5" (as requested!) */}
                            <g transform="translate(1, -1)">
                              {/* Thick drop shadow for 3D effect */}
                              <text x="35" y="53" fill="#451a03" fontSize="26" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">5</text>
                              <text x="35" y="52" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.8" fontSize="26" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">5</text>
                              {/* Inner highlight */}
                              <text x="35" y="51" fill="#fef08a" fontSize="26" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" opacity="0.85">5</text>
                            </g>

                            {/* Right Panel: Stylized 3D Golden circle/letter "G" (as requested!) */}
                            <g transform="translate(-1, -1)">
                              {/* Thick drop shadow for 3D effect */}
                              <text x="83" y="53" fill="#451a03" fontSize="24" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">G</text>
                              <text x="83" y="52" fill="url(#goldCap)" stroke="#ca8a04" strokeWidth="0.8" fontSize="24" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">G</text>
                              {/* Inner highlight */}
                              <text x="83" y="51" fill="#fef08a" fontSize="24" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" opacity="0.85">G</text>
                            </g>
                          </g>

                          {/* 4. Little Chieftain arms hugging chest */}
                          {/* Left Arm emerging from sleeve */}
                          <path d="M 124,96 C 114,96 100,102 112,112 C 118,106 124,102 126,98 Z" fill="#fbcfe8" stroke="#ca8a04" strokeWidth="0.2" />
                          <rect x="122" y="94" width="6" height="5" rx="1.5" fill="#ffffff" transform="rotate(-25, 122, 94)" />
                          <rect x="123" y="93" width="6" height="1.8" fill="#eab308" transform="rotate(-25, 123, 93)" />

                          {/* Right Arm hugging the other side */}
                          <path d="M 166,96 C 176,96 186,102 174,112 C 168,106 164,102 162,98 Z" fill="#fbcfe8" stroke="#ca8a04" strokeWidth="0.2" />
                          <rect x="162" y="94" width="6" height="5" rx="1.5" fill="#ffffff" transform="rotate(25, 162, 94)" />
                          <rect x="161" y="93" width="6" height="1.8" fill="#eab308" transform="rotate(25, 161, 93)" />

                          {/* 5. Scattered Gold Coins on the Ground (for maximum visual excitement) */}
                          <circle cx="34" cy="155" r="5" fill="#eab308" stroke="#854d0e" strokeWidth="0.5" />
                          <circle cx="34" cy="155" r="3" fill="#fef08a" />

                          <circle cx="24" cy="158" r="4.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.5" />
                          <circle cx="24" cy="158" r="2.7" fill="#fde047" />

                          <circle cx="44" cy="158" r="5" fill="#eab308" stroke="#854d0e" strokeWidth="0.5" />
                          <ellipse cx="44" cy="158" rx="3.5" ry="2" fill="#ffd700" />

                          <circle cx="15" cy="162" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                          <circle cx="21" cy="161" r="4" fill="#ffd700" stroke="#ca8a04" strokeWidth="0.5" />
                        </svg>
                      </div>
                    </div>

                    {/* QUICK GAME LAUNCHERS: CRASH & MINES */}
                    <div className="grid grid-cols-2 gap-3.5 select-none">
                      {/* CRASH card (purple) */}
                      <button
                        id="lobby_crash_banner"
                        onClick={() => {
                          sound.playClick();
                          setView('crash');
                        }}
                        className="group min-h-[90px] sm:min-h-[112px] border border-purple-500/35 bg-gradient-to-r from-[#3b0764] via-[#581c87] to-[#6d28d9] p-3.5 sm:p-4 rounded-2xl text-left relative overflow-hidden transition-all duration-300 hover:shadow-[0_6px_24px_rgba(168,85,247,0.22)] active:scale-95"
                      >
                        <div className="absolute inset-y-0 right-0 w-1/2 bg-purple-400/10 blur-2xl" />
                        <img
                          src={rocketImage}
                          alt=""
                          className="absolute right-1 bottom-0 w-[46%] max-w-[130px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                        <div className="relative z-10 flex h-full min-h-[80px] flex-col items-start justify-between pr-[42%]">
                          <div>
                            <span className="font-display text-lg font-black uppercase leading-none tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">CRASH</span>
                            <h4 className="mt-2 text-[11px] font-sans font-extrabold leading-none tracking-tight text-white/85">Hit The Mines & Win</h4>
                          </div>
                          <span className="mt-6 sm:mt-7 rounded-lg border border-white/25 bg-white/5 px-4 py-1.5 sm:py-2 text-[10px] font-display font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                            Play Now
                          </span>
                        </div>
                      </button>

                      {/* MINES card (teal) */}
                      <button
                        id="lobby_mines_banner"
                        onClick={() => {
                          sound.playClick();
                          setView('mines');
                        }}
                        className="group min-h-[90px] sm:min-h-[112px] border border-cyan-300/35 bg-gradient-to-r from-[#0f766e] via-[#0891b2] to-[#22d3ee] p-3.5 sm:p-4 rounded-2xl text-left relative overflow-hidden transition-all duration-300 hover:shadow-[0_6px_24px_rgba(34,211,238,0.22)] active:scale-95"
                      >
                        <div className="absolute inset-y-0 right-0 w-1/2 bg-white/20 blur-2xl" />
                        <img
                          src={bombImage}
                          alt=""
                          className="absolute right-0 bottom-0 w-[49%] max-w-[136px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="relative z-10 flex h-full min-h-[80px] flex-col items-start justify-between pr-[42%]">
                          <div>
                            <span className="font-display text-lg font-black uppercase leading-none tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">MINES</span>
                            <h4 className="mt-2 text-[11px] font-sans font-extrabold leading-none tracking-tight text-white/80">Hit The Mines & Win</h4>
                          </div>
                          <span className="mt-6 sm:mt-7 rounded-lg border border-white/30 bg-white/5 px-4 py-1.5 sm:py-2 text-[10px] font-display font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                            Play Now
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* FEATURED GAMES SECTION */}
                    <div id="lobby_featured_shelf" className="select-none flex flex-col gap-3 py-1 min-w-0 max-w-full overflow-visible shrink-0">
                      <div className="flex justify-between items-center gap-2 bg-transparent shrink-0">
                        <span className="min-w-0 shrink font-display font-black text-[18px] min-[380px]:text-[21px] text-[#f7d365] tracking-tight flex items-center gap-2 leading-none">
                          <span className="h-7 w-7 rounded-full bg-gradient-to-r from-[#f7d365] to-[#f69772] flex items-center justify-center shrink-0">
                            <Star size={17} className="text-[#131b2b] fill-[#131b2b]" />
                          </span>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f7d365] to-[#f69772]">Featured</span>
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              sound.playClick();
                              setView('casino');
                            }}
                            className="h-6 px-2 rounded-full border border-[#59dcff]/50 bg-gradient-to-b from-[#35d6f5] via-[#08a9dc] to-[#087bbd] text-[#f1fcff] text-[8px] font-display font-bold tracking-tight shadow-[0_3px_8px_rgba(0,174,224,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:from-[#59e2ff] hover:via-[#19bce9] hover:to-[#0d8bd0] active:scale-95 transition leading-none"
                          >
                            View All
                          </button>

                          {/* Left right indicator arrows */}
                          <div className="flex items-center gap-1 sm:hidden">
                            <button
                              aria-label="Scroll featured games left"
                              onClick={() => {
                                sound.playClick();
                                const row = featuredGamesRowRef.current;
                                if (row) row.scrollBy({ left: -(row.clientWidth * 0.75), behavior: 'smooth' });
                              }}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#f7d365]/70 bg-[#08090c] text-[#f7d365] shadow-[0_2px_8px_rgba(247,211,101,0.2)] transition hover:border-[#fcd34d] hover:bg-[#17130a] active:scale-95"
                            >
                              <ChevronLeft size={14} strokeWidth={3} />
                            </button>
                            <button
                              aria-label="Scroll featured games right"
                              onClick={() => {
                                sound.playClick();
                                const row = featuredGamesRowRef.current;
                                if (row) row.scrollBy({ left: row.clientWidth * 0.75, behavior: 'smooth' });
                              }}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#f7d365]/70 bg-[#08090c] text-[#f7d365] shadow-[0_2px_8px_rgba(247,211,101,0.2)] transition hover:border-[#fcd34d] hover:bg-[#17130a] active:scale-95"
                            >
                              <ChevronRight size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable featured cards grid row */}
                      <div ref={featuredGamesRowRef} className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1.5 min-w-0 max-w-full sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:snap-none md:grid-cols-5 lg:grid-cols-6">
                        {SLOT_GAMES.filter(slot => slot.category === 'featured').map((slot) => {
                          return (
                            <button
                              key={slot.id}
                              id={`lobby_featured_${slot.id}`}
                              onClick={() => {
                                sound.playClick();
                                setSelectedFeaturedSlot(slot.id);
                                setShowPlayModeModal(true);
                              }}
                              className="group w-[30%] min-w-[30%] shrink-0 snap-start sm:w-full sm:min-w-0 aspect-[0.84] rounded-lg overflow-hidden relative border border-white/[0.07] flex flex-col justify-end p-2.5 bg-black hover:border-gold-400/60 hover:scale-[1.025] active:scale-95 duration-300 transform shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
                            >
                              {/* Backdrop game image cover */}
                              <FallbackImage
                                src={slot.bannerUrl}
                                alt={slot.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Vertical dark vignetting removed */}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* SLOTS GAMES SECTION */}
                    <div id="lobby_slots_shelf" className="select-none flex flex-col gap-2.5 mt-1 min-w-0 max-w-full">
                      <div className="flex justify-between items-center gap-2 bg-transparent shrink-0">
                        <span className="min-w-0 shrink font-display font-black text-[18px] min-[380px]:text-[21px] text-[#f7d365] tracking-tight flex items-center gap-2 leading-none">
                          <span className="h-7 w-7 rounded-full bg-gradient-to-r from-[#f7d365] to-[#f69772] flex items-center justify-center shrink-0">
                            <Gamepad2 size={17} className="text-[#131b2b] fill-[#131b2b]" />
                          </span>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f7d365] to-[#f69772]">Slots</span>
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              sound.playClick();
                              setView('casino');
                            }}
                            className="h-6 px-2 rounded-full border border-[#59dcff]/50 bg-gradient-to-b from-[#35d6f5] via-[#08a9dc] to-[#087bbd] text-[#f1fcff] text-[8px] font-display font-bold tracking-tight shadow-[0_3px_8px_rgba(0,174,224,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:from-[#59e2ff] hover:via-[#19bce9] hover:to-[#0d8bd0] active:scale-95 transition leading-none"
                          >
                            View All
                          </button>

                          {/* Left right indicator arrows */}
                          <div className="flex items-center gap-1 sm:hidden">
                            <button
                              aria-label="Scroll slots left"
                              onClick={() => {
                                sound.playClick();
                                const row = slotsGamesRowRef.current;
                                if (row) row.scrollBy({ left: -(row.clientWidth * 0.75), behavior: 'smooth' });
                              }}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#f7d365]/70 bg-[#08090c] text-[#f7d365] shadow-[0_2px_8px_rgba(247,211,101,0.2)] transition hover:border-[#fcd34d] hover:bg-[#17130a] active:scale-95"
                            >
                              <ChevronLeft size={14} strokeWidth={3} />
                            </button>
                            <button
                              aria-label="Scroll slots right"
                              onClick={() => {
                                sound.playClick();
                                const row = slotsGamesRowRef.current;
                                if (row) row.scrollBy({ left: row.clientWidth * 0.75, behavior: 'smooth' });
                              }}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#f7d365]/70 bg-[#08090c] text-[#f7d365] shadow-[0_2px_8px_rgba(247,211,101,0.2)] transition hover:border-[#fcd34d] hover:bg-[#17130a] active:scale-95"
                            >
                              <ChevronRight size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable slots cards grid row */}
                      <div ref={slotsGamesRowRef} className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1.5 min-w-0 max-w-full sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:snap-none md:grid-cols-5 lg:grid-cols-6">
                        {SLOT_GAMES.filter(slot => slot.category === 'slots').map((slot) => {
                          return (
                            <button
                              key={slot.id}
                              id={`lobby_slots_${slot.id}`}
                              onClick={() => navigateToSlots(slot.id)}
                              className="w-[30%] min-w-[30%] shrink-0 snap-start sm:w-full sm:min-w-0 aspect-[3/4] rounded-2xl overflow-hidden relative border border-white/[0.04] flex flex-col justify-end p-2.5 bg-dark-950 hover:border-gold-600/50 hover:scale-[1.03] active:scale-95 duration-300 transform"
                            >
                              {/* Backdrop game image cover */}
                              <FallbackImage
                                src={slot.bannerUrl}
                                alt={slot.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                              />
                              {/* Vertical dark vignetting removed */}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PROVIDERS ROW (exactly as shown in image) */}
                    <div id="lobby_providers_shelf" className="flex flex-col gap-2 select-none shrink-0 mt-1">
                      <div className="flex justify-between items-center gap-2 bg-transparent shrink-0 mb-1">
                        <span className="min-w-0 shrink font-display font-semibold text-[15px] min-[380px]:text-[17px] text-[#f7d365] tracking-tight flex items-center gap-2 leading-none">
                          <span className="h-6 w-6 rounded-full bg-gradient-to-r from-[#f7d365] to-[#f69772] flex items-center justify-center shrink-0">
                            <Blocks size={14} className="text-[#131b2b] fill-[#131b2b]" />
                          </span>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f7d365] to-[#f69772]">Providers</span>
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {PROVIDERS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            aria-label={`Show ${p.name} games`}
                            aria-pressed={selectedProvider === p.id}
                            title={p.name}
                            onClick={() => {
                              sound.playClick();
                              setSelectedProvider(p.id);
                            }}
                            className={`w-[96px] h-10 rounded-lg flex items-center justify-center shrink-0 snap-center select-none transition-all duration-200 border ${selectedProvider === p.id
                                ? 'bg-[#1a1b20] border-[#f7d365] shadow-[0_0_14px_rgba(247,211,101,0.2)]'
                                : 'bg-[#101116] border-white/10 hover:border-[#f7d365]/60 hover:bg-white/5'
                              }`}
                          >
                            <img
                              src={p.logo}
                              alt=""
                              aria-hidden="true"
                              className="max-w-[78px] max-h-[24px] w-auto h-auto object-contain scale-[1.6]"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PROVIDER GAMES SECTION */}
                    <div id="lobby_provider_games_shelf" className="select-none flex flex-col gap-2.5 mt-1">
                      {/* Scrollable provider games cards grid row */}
                      {providerGames.length === 0 && !isLoadingGames ? (
                        <div className="flex items-center justify-center py-12 text-xs text-gray-500 font-display">
                          No games found for this provider.
                        </div>
                      ) : providerGames.length === 0 && isLoadingGames ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 w-full">
                          <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 pb-1.5 transition-all duration-300 ${isLoadingGames ? 'opacity-40 blur-[2px] pointer-events-none scale-[0.98]' : 'opacity-100 blur-none scale-100'}`}>
                          {providerGames.slice(0, 25).map((game) => {
                            return (
                              <button
                                key={game.game_uid}
                                id={`lobby_provider_${game.game_uid}`}
                                onClick={() => {
                                  sound.playClick();
                                  setView('slots'); // Open generic slots view for now
                                }}
                                className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative border border-white/[0.04] flex flex-col justify-end p-2.5 bg-dark-950 hover:border-gold-600/50 hover:scale-[1.03] active:scale-95 duration-300 transform"
                              >
                                {/* Backdrop game image cover */}
                                <FallbackImage
                                  src={game.image}
                                  alt={game.game_name}
                                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                                />
                              </button>
                            );
                          })}
                          </div>
                          
                          <div className="flex justify-center w-full mt-2 mb-4">
                            <button
                              onClick={() => {
                                sound.playClick();
                                setView('casino');
                              }}
                              className="h-10 px-8 rounded-lg bg-black border border-[#f7d365] text-[#f7d365] text-[13px] font-display font-black tracking-tight hover:bg-[#f7d365]/10 active:scale-95 transition leading-none shadow-[0_2px_10px_rgba(247,211,101,0.1)]"
                            >
                              View All {PROVIDERS.find(p => p.id === selectedProvider)?.name} Games
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}

              {/* CRASH ROUTER VIEW */}
              {view === 'crash' && (
                <motion.div
                  key="crash_screen"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <CrashGame
                    balance={user.balance}
                    updateBalance={updateBalance}
                    onBack={() => {
                      sound.playClick();
                      setView('home');
                    }}
                  />
                </motion.div>
              )}

              {/* MINES ROUTER VIEW */}
              {view === 'mines' && (
                <motion.div
                  key="mines_screen"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <MinesGame
                    balance={user.balance}
                    updateBalance={updateBalance}
                    onBack={() => {
                      sound.playClick();
                      setView('home');
                    }}
                  />
                </motion.div>
              )}

              {/* CASINO TABS VIEW (Quick slot machines listing category picker page) */}
              {view === 'casino' && (
                <motion.div
                  key="slots_picker_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar p-4 pb-[65px] lg:pb-4 gap-4"
                >
                  <div className="flex items-center gap-2 border-b border-dark-800 pb-2 bg-transparent sticky top-0 shrink-0 z-10">
                    <h2 className="text-sm font-display font-black text-gold-accent tracking-wide uppercase leading-none">CASINO FLAGG SHIP GAMES</h2>
                  </div>

                  <div className="flex flex-col gap-3.5 flex-1">
                    {SLOT_GAMES.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => navigateToSlots(slot.id)}
                        className={`flex gap-3 bg-gradient-to-r ${slot.themeColor} border border-white/5 rounded-2xl p-2.5 text-left transform active:scale-98 transition duration-200 select-none overflow-hidden relative`}
                      >
                        {/* Vignetting */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />

                        <FallbackImage
                          src={slot.bannerUrl}
                          alt={slot.title}
                          className="w-16 h-20 rounded-xl object-cover shrink-0 z-20 border border-white/10"
                        />

                        <div className="flex-1 flex flex-col justify-center relative z-20">
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-gold-bright">{slot.provider}</span>
                          <h4 className="font-display font-black text-sm text-white tracking-wide mt-0.5">{slot.title}</h4>
                          <p className="text-[10px] text-gray-300 mt-1">Bet Limits: <span className="text-gold-accent font-semibold">${slot.minBet} - $1,000</span></p>
                        </div>

                        <div className="w-8 flex items-center justify-center shrink-0 text-white z-20 font-bold text-xs select-none">
                          {">"}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PROMO TABS VIEW (Rewards spin wheel) */}
              {view === 'promo' && (
                <motion.div
                  key="promo_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <PromoOffers
                    balance={user.balance}
                    updateBalance={updateBalance}
                    hasClaimedWelcome={hasClaimedWelcome}
                    setHasClaimedWelcome={setHasClaimedWelcome}
                  />
                </motion.div>
              )}

              {/* CHATS MULTIPLAYER VIEW */}
              {view === 'chats' && (
                <motion.div
                  key="chats_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <LiveChats
                    username={user.username}
                    avatarUrl={user.avatarUrl}
                    balance={user.balance}
                  />
                </motion.div>
              )}

              {/* INDIVIDUAL LOADED SLOTS VIEW */}
              {view === 'slots' && (
                <motion.div
                  key="active_slots_screen"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <SlotsGame
                    balance={user.balance}
                    initialGameId={slotsGameId}
                    updateBalance={updateBalance}
                    onBack={() => {
                      sound.playClick();
                      setView('home');
                    }}
                  />
                </motion.div>
              )}

              {/* ACCOUNTS VIEW */}
              {view === 'accounts' && (
                <motion.div
                  key="accounts_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <AccountsView
                    user={user}
                    history={betHistory}
                    updateUsername={updateUsername}
                    updateBalance={updateBalance}
                  />
                </motion.div>
              )}

              {/* BETS HISTORY VIEW */}
              {view === 'bets' && (
                <motion.div
                  key="bets_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <BetsView history={betHistory} />
                </motion.div>
              )}

              {/* ACCOUNT STATEMENT VIEW */}
              {view === 'account_statement' && (
                <motion.div
                  key="account_statement_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <AccountStatementView />
                </motion.div>
              )}

              {/* WITHDRAW VIEW */}
              {view === 'withdraw' && (
                <motion.div
                  key="withdraw_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <WithdrawView
                    user={user}
                    setView={setView}
                    updateBalance={updateBalance}
                  />
                </motion.div>
              )}

              {/* DEPOSIT VIEW */}
              {view === 'deposit' && (
                <motion.div
                  key="deposit_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <DepositView
                    user={user}
                    setView={setView}
                    updateBalance={updateBalance}
                  />
                </motion.div>
              )}

              {/* SEARCH VIEW */}
              {view === 'search' && (
                <motion.div
                  key="search_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <SearchView
                    onBack={() => {
                      sound.playClick();
                      setView('home');
                    }}
                  />
                </motion.div>
              )}

              {/* SPORTS VIEW */}
              {view === 'sports' && (
                <motion.div
                  key="sports_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <SportsPlaceholder />
                </motion.div>
              )}

              {/* 404 NOT FOUND VIEW */}
              {view === '404' && (
                <motion.div
                  key="404_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <NotFoundView
                    setView={setView}
                  />
                </motion.div>
              )}

              {/* AUTH PAGES */}
              {(view === 'login' || view === 'register') && (
                <motion.div
                  key="auth_screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-[65px] lg:pb-6"
                >
                  <RegisterModal
                    initialMode={view}
                    onNavigateToHome={() => setView('home')}
                    onToggleMode={(mode) => setView(mode)}
                    onRegisterSuccess={(username) => {
                      updateUsername(username);
                      setIsLoggedIn(true);
                    }}
                    onLoginSuccess={(username) => {
                      updateUsername(username);
                      setIsLoggedIn(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM DEVICE NAVIGATION BAR */}
          <div
            id="global_bottom_navbar"
            className="fixed bottom-0 left-0 right-0 h-[65px] z-30 select-none bg-[#0b111c]/65 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_24px_rgba(0,0,0,0.22)] lg:hidden flex justify-around items-center"
          >
            {/* Menu */}
            <button
              onClick={() => {
                sound.playClick();
                setIsSidebarOpen(true);
              }}
              className="flex-1 h-full flex flex-col items-center justify-center group select-none transition-transform active:scale-95 duration-100 relative"
            >
              {isSidebarOpen && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-gradient-to-r from-transparent via-[#65e4ed] to-transparent"></div>}
              <div className={`flex items-center justify-center transition-colors duration-200 mb-1 ${isSidebarOpen ? 'text-[#65e4ed]' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M3.2 10.2 12 3l8.8 7.2v9.1a1.7 1.7 0 0 1-1.7 1.7H4.9a1.7 1.7 0 0 1-1.7-1.7v-9.1Z" />
                  <path d="M10 14h4v6h-4z" fill="#0b111c" />
                </svg>
              </div>
              <span className={`text-[9px] font-sans font-bold tracking-tight leading-none transition-colors duration-200 ${isSidebarOpen ? 'text-white' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                Menu
              </span>
            </button>

            {/* Casino */}
            <button
              onClick={() => {
                sound.playClick();
                setView('casino');
              }}
              className="flex-1 h-full flex flex-col items-center justify-center group select-none transition-transform active:scale-95 duration-100 relative"
            >
              {(view === 'casino' || view === 'slots' || view === 'home' || view === 'crash' || view === 'mines') && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-gradient-to-r from-transparent via-[#65e4ed] to-transparent"></div>}
              <div className={`flex items-center justify-center transition-colors duration-200 mb-1 ${(view === 'casino' || view === 'slots' || view === 'home' || view === 'crash' || view === 'mines') ? 'text-[#65e4ed]' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                <Gamepad2 size={20} strokeWidth={2.2} />
              </div>
              <span className={`text-[9px] font-sans font-bold tracking-tight leading-none transition-colors duration-200 ${(view === 'casino' || view === 'slots' || view === 'home' || view === 'crash' || view === 'mines') ? 'text-white' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                Casino
              </span>
            </button>

            {/* Bets */}
            <button
              onClick={() => {
                sound.playClick();
                setView('bets');
              }}
              className="flex-1 h-full flex flex-col items-center justify-center group select-none transition-transform active:scale-95 duration-100 relative"
            >
              {view === 'bets' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-gradient-to-r from-transparent via-[#65e4ed] to-transparent"></div>}
              <div className={`flex items-center justify-center transition-colors duration-200 mb-1 ${view === 'bets' ? 'text-[#65e4ed]' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                <Trophy size={20} strokeWidth={2.2} />
              </div>
              <span className={`text-[9px] font-sans font-bold tracking-tight leading-none transition-colors duration-200 ${view === 'bets' ? 'text-white' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                Bets
              </span>
            </button>

            {/* Search */}
            <button
              onClick={() => {
                sound.playClick();
                setView('search');
              }}
              className="flex-1 h-full flex flex-col items-center justify-center group select-none transition-transform active:scale-95 duration-100 relative"
            >
              {view === 'search' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-gradient-to-r from-transparent via-[#65e4ed] to-transparent"></div>}
              <div className={`flex items-center justify-center transition-colors duration-200 mb-1 ${view === 'search' ? 'text-[#65e4ed]' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                <Search size={26} strokeWidth={2.2} />
              </div>
              <span className={`text-[9px] font-sans font-bold tracking-tight leading-none transition-colors duration-200 ${view === 'search' ? 'text-white' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                Search
              </span>
            </button>

            {/* Rewards */}
            <button
              onClick={() => {
                sound.playClick();
                setView('promo');
              }}
              className="flex-1 h-full flex flex-col items-center justify-center group select-none transition-transform active:scale-95 duration-100 relative"
            >
              {view === 'promo' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-gradient-to-r from-transparent via-[#65e4ed] to-transparent"></div>}
              <div className={`flex items-center justify-center transition-colors duration-200 mb-1 ${view === 'promo' ? 'text-[#65e4ed]' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                <Gift size={20} strokeWidth={2.2} />
              </div>
              <span className={`text-[9px] font-sans font-bold tracking-tight leading-none transition-colors duration-200 ${view === 'promo' ? 'text-white' : 'text-[#8392a7] group-hover:text-[#a8bacb]'}`}>
                Rewards
              </span>
            </button>
          </div>

        </div>

        {/* DESKTOP PERMANENT RIGHT CHAT SIDEBAR */}
        <div className="hidden lg:block w-[320px] shrink-0 h-full border-l border-[#191c24]/80 bg-[#0b0c0f] overflow-hidden">
          <LiveChats
            username={user.username}
            avatarUrl={user.avatarUrl}
            balance={user.balance}
          />
        </div>

        {/* LEFT DRAWER DIRECTIVES (Auditor sidebar statistics log drawer) */}
        <MenuSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
          history={betHistory}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          resetAll={resetAll}
          updateUsername={updateUsername}
          setView={setView}
          activeView={view}
          updateBalance={updateBalance}
          navigateToSlots={navigateToSlots}
          onOpenRegister={() => setView('register')}
        />

        {/* LEVEL UP CELEBRATORY FULL SCREEN MODAL */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center select-none"
            >
              <motion.div
                initial={{ scale: 0.82, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.25),transparent)] rounded-3xl p-6 border-2 border-gold-600 shadow-[0_0_35px_rgba(234,179,8,0.3)]"
              >
                <div className="w-16 h-16 rounded-xl bg-gold-500/10 border-2 border-gold-400 text-gold-accent flex items-center justify-center animate-bounce">
                  <Award size={36} className="stroke-[2]" />
                </div>
                <h2 className="text-xl font-display font-black text-gold-accent gold-text-glow tracking-widest leading-none mt-2 uppercase">LEVEL REACHED!</h2>

                {/* Level multiplier displays */}
                <div className="text-5xl font-display font-black text-white px-6 py-2 border-y border-white/10 my-1 font-mono">
                  {levelUpNum}
                </div>

                <p className="text-xs text-slate-300 max-w-[200px] mt-1 leading-relaxed">Congratulations, you graduated in ranks! Reward tiers, cashout perks, and progressive multiplier slots options unlocked.</p>

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowLevelUp(false);
                  }}
                  className="mt-4 px-6 py-2 bg-gold-500 hover:bg-gold-400 text-dark-950 rounded-xl text-xs font-display font-black uppercase tracking-widest hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] transition duration-200"
                >
                  OKAY, UNLOCK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* DEPOSIT MODAL */}
        <AnimatePresence>
          {showDepositModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="bg-[#0f1116] border border-[#ffd333]/30 max-w-sm w-full rounded-2xl p-6 shadow-[0_0_35px_rgba(253,224,71,0.15)] relative overflow-hidden"
              >
                {/* Visual gold neon bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400 shrink-0">
                      <Wallet size={15} className="stroke-[2.5]" />
                    </div>
                    <span className="text-white font-sans font-black text-xs tracking-wider uppercase">Instant Deposit</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowDepositModal(false);
                      setDepositSuccessMsg('');
                    }}
                    className="p-1 text-gray-400 hover:text-white transition rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {depositSuccessMsg ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center text-[#e3ff36]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#e3ff36]/10 flex items-center justify-center border-2 border-[#e3ff36] mb-4 animate-bounce">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-wider mb-2">Deposit Successful!</h4>
                    <p className="text-xs text-gray-400 font-mono font-bold">{depositSuccessMsg}</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Welcome to the WinSpin Sandbox. Click on any preset coupon below or enter a custom amount to add virtual chips instantly.
                    </p>

                    {/* Pre-set triggers */}
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 5000].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            sound.playClick();
                            setDepositAmountInput(val.toString());
                          }}
                          className={`py-2 px-1 text-2xs font-mono font-bold tracking-tight rounded-xl border transition ${depositAmountInput === val.toString()
                              ? 'bg-[#e3ff36] text-black border-[#e3ff36] shadow-md shadow-[#e3ff36]/15'
                              : 'bg-[#15171e] text-gray-300 border-[#232733] hover:border-gray-500'
                            }`}
                        >
                          +${val.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    {/* Custom input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Custom Balance Top-Up</label>
                      <div className="bg-[#14161d] border border-[#232733] focus-within:border-yellow-400 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-white shadow-inner transition-all duration-300">
                        <span className="text-yellow-400 font-mono font-black text-sm">$</span>
                        <input
                          type="number"
                          value={depositAmountInput}
                          onChange={(e) => {
                            setDepositAmountInput(e.target.value);
                          }}
                          className="bg-transparent text-sm font-mono font-bold focus:outline-none w-full text-white"
                          placeholder="Amount"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const amt = parseFloat(depositAmountInput);
                        if (isNaN(amt) || amt <= 0) return;
                        sound.playClick();
                        setUser(prev => ({
                          ...prev,
                          balance: parseFloat((prev.balance + amt).toFixed(2))
                        }));
                        setDepositSuccessMsg(`+$${amt.toLocaleString(undefined, { minimumFractionDigits: 2 })} deposited!`);
                        sound.playWin();
                        setTimeout(() => {
                          setDepositSuccessMsg('');
                          setShowDepositModal(false);
                        }, 1300);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 transition-all text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
                    >
                      <Plus size={14} className="stroke-[3]" />
                      <span>Proceed Deposit</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WITHDRAW MODAL */}
        <AnimatePresence>
          {showWithdrawModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="bg-[#0f1116] border border-[#232733] max-w-sm w-full rounded-2xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.6)] relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#232733] flex items-center justify-center text-gray-300 shrink-0 border border-white/5">
                      <ArrowUpRight size={15} className="stroke-[2.5]" />
                    </div>
                    <span className="text-white font-sans font-black text-xs tracking-wider uppercase">Withdraw Funds</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowWithdrawModal(false);
                      setWithdrawErrorMsg('');
                      setWithdrawSuccessMsg('');
                    }}
                    className="p-1 text-gray-400 hover:text-white transition rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {withdrawSuccessMsg ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center text-emerald-400"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-400 mb-4 animate-bounce">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-wider mb-1">Cashout Completed!</h4>
                    <p className="text-2xs text-gray-400 font-mono font-bold leading-normal">{withdrawSuccessMsg}</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#14161d] p-3 rounded-xl border border-[#232733] flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Withdrawable Balance</span>
                      <span className="text-white font-mono text-xs font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                        ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Pre-set multipliers */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0.25, 0.50, 0.75, 1.00].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => {
                            sound.playClick();
                            const calculated = Math.floor(user.balance * pct);
                            setWithdrawAmountInput(calculated.toString());
                            setWithdrawErrorMsg('');
                          }}
                          className="py-1.5 bg-[#15171e] text-[9px] uppercase font-mono font-black text-gray-400 hover:text-white border border-[#232733] hover:border-gray-500 rounded-lg transition"
                        >
                          {pct * 100}%
                        </button>
                      ))}
                    </div>

                    {/* Custom input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Amount to Withdraw</label>
                      <div className="bg-[#14161d] border border-[#232733] focus-within:border-gray-400 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-white shadow-inner transition-all duration-300">
                        <span className="text-gray-400 font-mono font-black text-sm">$</span>
                        <input
                          type="number"
                          value={withdrawAmountInput}
                          onChange={(e) => {
                            setWithdrawAmountInput(e.target.value);
                            setWithdrawErrorMsg('');
                          }}
                          className="bg-transparent text-sm font-mono font-bold focus:outline-none w-full text-white"
                          placeholder="Amount"
                        />
                      </div>
                      {withdrawErrorMsg && (
                        <p className="text-[10px] text-red-500 font-bold font-sans mt-1 leading-none pl-0.5">⚠️ {withdrawErrorMsg}</p>
                      )}
                    </div>

                    <p className="text-[9.5px] text-gray-500 leading-normal italic pl-0.5">
                      Note: Funds will be debited from your sandbox balance immediately. Cashout processes are processed through instantaneous mock routing.
                    </p>

                    <button
                      onClick={() => {
                        const amt = Math.floor(parseFloat(withdrawAmountInput));
                        if (isNaN(amt) || amt <= 0) {
                          setWithdrawErrorMsg('Please set a valid positive cashout amount.');
                          return;
                        }
                        if (amt > user.balance) {
                          setWithdrawErrorMsg('Limit reached. Insufficient sandbox balance.');
                          return;
                        }
                        sound.playClick();
                        setUser(prev => ({
                          ...prev,
                          balance: parseFloat((prev.balance - amt).toFixed(2))
                        }));
                        setWithdrawSuccessMsg(`Processed $${amt.toLocaleString(undefined, { minimumFractionDigits: 2 })} payout successfully.`);
                        sound.playWin(); // play cash sound
                        setTimeout(() => {
                          setWithdrawSuccessMsg('');
                          setShowWithdrawModal(false);
                        }, 1400);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#1d202b] to-[#12141a] hover:from-[#262c3e] hover:to-[#171a22] border border-[#2d313d] hover:border-gray-500 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 active:scale-95 transition"
                    >
                      <ArrowUpRight size={14} className="stroke-[3.5]" />
                      <span>Confirm Cashout</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PERSISTENT NOTIFICATION DRAWER POPUP */}
        <AnimatePresence>
          {showNotificationPopup && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="fixed right-4 sm:right-6 lg:right-[336px] top-[64px] bg-[#0c0e12] border-2 border-amber-500/20 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-2.5 max-w-[320px] w-full select-none"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-450 font-sans">Active Notifications</span>
                </div>
                <button
                  onClick={() => setShowNotificationPopup(false)}
                  className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto no-scrollbar">
                {notifs.map(n => (
                  <div key={n.id} className="text-[10px] text-gray-300 flex items-start gap-1.5 leading-snug bg-white/5 border border-white/5 p-2 rounded-xl">
                    <span className="text-amber-400 mt-0.5 shrink-0">●</span>
                    <p className="flex-1 font-mono font-semibold">{n.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BonusModal
          isOpen={showBonusModal}
          onClose={() => setShowBonusModal(false)}
          onAccept={() => {
            sound.playWin();
            setShowBonusModal(false);
          }}
        />

        <PlayModeModal
          isOpen={showPlayModeModal}
          onClose={() => {
            sound.playClick();
            setShowPlayModeModal(false);
            setSelectedFeaturedSlot(null);
          }}
          onContinue={(mode) => {
            sound.playClick();
            setShowPlayModeModal(false);
            if (selectedFeaturedSlot) {
              navigateToSlots(selectedFeaturedSlot);
              setSelectedFeaturedSlot(null);
            }
          }}
          cashBalance={user.balance}
        />
      </div>
    </div>
  );
}
