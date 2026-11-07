import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Clock, ArrowUpRight, ArrowDownLeft, Shield, Check, Info, 
  HelpCircle, RefreshCw, Send, Sparkles, AlertCircle, ExternalLink,
  Users, PiggyBank, Gamepad2, Copy, Wallet, Gem, Zap, X, Eye, Edit2, Trash2, Plus
} from 'lucide-react';
import { UserProfile, BetHistoryItem } from '../types';
import { sound } from '../utils/audio';

interface AccountsViewProps {
  user: UserProfile;
  history: BetHistoryItem[];
  updateUsername: (name: string) => void;
  updateBalance: (amount: number, gameType: any, multiplier: number, outcome: 'win' | 'loss') => void;
}

export default function AccountsView({ 
  user, 
  history, 
  updateUsername, 
  updateBalance 
}: AccountsViewProps) {
  // Navigation tabs inside accounts view
  const [activeTab, setActiveTab] = useState<'account' | 'wallet' | 'bets' | 'deposits' | 'withdraw' | 'referrals'>('account');
  
  // Referrals states
  const [referralBalance, setReferralBalance] = useState<number>(1657.42);
  const [referralClaimed, setReferralClaimed] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  
  // Tab states
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [isRollbotAvatar, setIsRollbotAvatar] = useState<boolean>(false);
  const [isPrivateProfile, setIsPrivateProfile] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  
  // Simulated connected states
  const [steamConnected, setSteamConnected] = useState<boolean>(false);
  const [twitchConnected, setTwitchConnected] = useState<boolean>(false);

  // Additional Modals State
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  // Bank Accounts Data State
  const [bankAccounts, setBankAccounts] = useState<any[]>([
    { id: '1', name: 'B chandrakanth', account: '50100231449182', ifsc: 'HDFC0000742' }
  ]);
  const [showBankForm, setShowBankForm] = useState<boolean>(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [bankForm, setBankForm] = useState({ name: '', account: '', ifsc: '' });

  // Deposit currency filter state
  const [depositChain, setDepositChain] = useState<'all' | 'btc' | 'usdt' | 'xrp'>('all');
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Withdrawal states
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);

  // Checklist computation
  const hasBets = history.length > 0;
  const hasDeposited = user.balance > 10000; // Assuming initial balance is around 10k, or tracking dynamic deposit
  const checklistCount = 1 + (hasDeposited ? 1 : 0) + (hasBets ? 1 : 0);

  // Handler for changing username
  const handleUsernameChange = () => {
    if (!newUsername.trim()) return;
    sound.playClick();
    updateUsername(newUsername.trim());
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#c5a85c] border border-[#e5c67a] text-[#0c0e12] px-4 py-2 rounded-full font-sans font-bold text-xs shadow-xl z-50 flex items-center gap-2 animate-bounce";
    toast.innerHTML = `✨ Username updated successfully to <strong>${newUsername}</strong>!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  // Handler for dynamic deposit
  const handleSimulateDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    sound.playWin();
    updateBalance(amount, "Slots (Ra's Reckoning)", 1, 'win'); // simulated deposit adds to wallet balance
    setDepositSuccessMsg(`Successfully credited $${amount.toLocaleString()} to your account via simulated gateway!`);
    
    setTimeout(() => {
      setDepositSuccessMsg(null);
    }, 5000);
  };

  // Handler for withdrawal
  const handleSimulateWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawErrorMsg('Please enter a valid amount.');
      return;
    }
    if (user.balance < amount) {
      sound.playClick();
      setWithdrawErrorMsg('Insufficient balance to perform this withdrawal.');
      return;
    }
    sound.playClick();
    updateBalance(-amount, "Slots (Ra's Reckoning)", 1, 'loss'); // deducts balance
    setWithdrawSuccessMsg(`Withdrawal request of $${amount.toLocaleString()} successfully processed!`);
    setWithdrawErrorMsg(null);
    
    setTimeout(() => {
      setWithdrawSuccessMsg(null);
    }, 5000);
  };

  return (
    <div id="accounts_view_page" className="h-full flex flex-col bg-[#07080a] text-gray-200 overflow-y-auto no-scrollbar pb-[65px]">
      
      {/* 1. HORIZONTAL SCROLLABLE TAB SELECTOR */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-3 border-b border-[#14161d] px-4 bg-[#0a0b0f] sticky top-0 z-10 shrink-0">
        <button 
          onClick={() => { sound.playClick(); setActiveTab('account'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold leading-none select-none transition whitespace-nowrap ${
            activeTab === 'account' 
              ? 'bg-[#1e1f26] text-white border border-[#2d2f3b]' 
              : 'bg-transparent text-[#979da7] hover:text-white'
          }`}
        >
          <User size={13} className={activeTab === 'account' ? 'text-[#c5a85c]' : 'text-gray-400'} />
          <span>Account</span>
        </button>



        <button 
          onClick={() => { sound.playClick(); setActiveTab('referrals'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold leading-none select-none transition whitespace-nowrap ${
            activeTab === 'referrals' 
              ? 'bg-[#1e1f26] text-white border border-[#2d2f3b]' 
              : 'bg-transparent text-[#979da7] hover:text-white'
          }`}
        >
          <Users size={13} className={activeTab === 'referrals' ? 'text-[#c5a85c]' : 'text-gray-400'} />
          <span>Referrals</span>
        </button>
      </div>

      {/* 2. BODY PAGES */}
      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        
        <AnimatePresence mode="wait">
          
          {/* TAB: ACCOUNT */}
          {activeTab === 'account' && (
            <motion.div
              key="account_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Box 1: DUKEBAFOR VIP Progress with Luxury Blue Gemstone */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 flex flex-col gap-3 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="absolute top-0 right-0 h-28 w-28 bg-blue-500/[0.02] blur-2xl rounded-full" />
                
                <div className="flex items-center gap-3">
                  {/* High-Fidelity Shiny Blue Sapphire / Diamond SVG */}
                  <div className="h-14 w-14 shrink-0 bg-blue-950/40 rounded-xl border border-blue-500/20 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                    <svg viewBox="0 0 32 32" className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(59,130,246,0.35)]">
                      <polygon points="16,3 25,11 16,29 7,11" fill="#2563eb" />
                      <polygon points="16,3 21,11 16,16 11,11" fill="#3b82f6" />
                      <polygon points="16,16 21,11 25,11" fill="#1d4ed8" />
                      <polygon points="11,11 16,16 7,11" fill="#1e40af" />
                      <polygon points="16,16 21,11 16,29" fill="#1d4ed8" opacity="0.95" />
                      <polygon points="11,11 16,16 16,29" fill="#1e40af" opacity="0.95" />
                      {/* Facet Highlights */}
                      <polygon points="16,3 16,11 21,11" fill="#60a5fa" opacity="0.7" />
                      <polygon points="11,11 16,11 16,3" fill="#93c5fd" opacity="0.5" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-sans font-black text-xl tracking-wide uppercase leading-tight truncate">
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="bg-[#c5a85c]/15 text-[#c5a85c] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase leading-none border border-[#c5a85c]/20">
                        Level {user.level}
                      </span>
                      <span className="text-[10px] text-gray-500 font-sans">
                        {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* VIP Progress Bar with Luxury Brass Gold Striping */}
                <div className="mt-1">
                  <div className="flex justify-between items-center text-[10.5px] text-gray-400 font-bold tracking-tight mb-1.5">
                    <span>Your VIP Progress</span>
                    <span className="text-[#c5a85c] font-mono">66.21%</span>
                  </div>
                  
                  {/* Luxury Gold Progress Bar Frame */}
                  <div className="h-4 bg-[#0a0b0f] border border-[#1b1f28] rounded-full overflow-hidden p-[1px] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)]">
                    <div 
                      className="h-full rounded-full transition-all duration-500 shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                      style={{ 
                        width: '66.21%',
                        backgroundImage: 'linear-gradient(45deg, #c5a85c 25%, #d9c383 25%, #d9c383 50%, #c5a85c 50%, #c5a85c 75%, #d9c383 75%, #d9c383 100%)',
                        backgroundSize: '12px 12px'
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mt-1.5">
                    <span className="uppercase tracking-wider">Sapphire</span>
                    <span className="uppercase tracking-wider">Bronze</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Get Started Checklist */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex justify-between items-center">
                  <span className="text-white font-sans font-extrabold text-[13.5px] tracking-wide">Get started</span>
                  <div className="flex items-center gap-1.5">
                    {/* Circle 1 */}
                    <div className="h-4 w-4 rounded-full bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06] flex items-center justify-center shadow-sm">
                      <Check size={9} strokeWidth={4} />
                    </div>
                    {/* Circle 2 */}
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center transition ${
                      hasDeposited 
                        ? 'bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06]' 
                        : 'border-2 border-[#2b2e38] bg-transparent text-[#454955]'
                    }`}>
                      <Check size={9} strokeWidth={4} />
                    </div>
                    {/* Circle 3 */}
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center transition ${
                      hasBets 
                        ? 'bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06]' 
                        : 'border-2 border-[#2b2e38] bg-transparent text-[#454955]'
                    }`}>
                      <Check size={9} strokeWidth={4} />
                    </div>
                    <span className="text-[10.5px] text-gray-500 font-bold ml-1">{checklistCount}/3</span>
                  </div>
                </div>

                {/* Step List */}
                <div className="flex flex-col gap-2 mt-1">
                  {/* Step 1: Verify your email */}
                  <div className="bg-[#171a22] border border-[#212532] rounded-xl px-4 py-3.5 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                      {/* Wallet Icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <span className="text-xs font-bold text-gray-200">Verify your email</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06] flex items-center justify-center shadow-sm">
                      <Check size={11} strokeWidth={4} />
                    </div>
                  </div>

                  {/* Step 2: Make first deposit */}
                  <div 
                    onClick={() => {
                      if (!hasDeposited) {
                        sound.playClick();
                        setActiveTab('deposits');
                      }
                    }}
                    className={`border rounded-xl px-4 py-3.5 flex items-center justify-between transition-all ${
                      hasDeposited 
                        ? 'bg-[#171a22] border-[#212532]' 
                        : 'bg-[#171a22] border-[#212532] hover:border-[#caa753]/30 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Banknote Icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                        <rect width="20" height="12" x="2" y="6" rx="2" />
                        <circle cx="12" cy="12" r="2.5" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                      <span className="text-xs font-bold text-gray-200">Make your first deposit</span>
                    </div>
                    {hasDeposited ? (
                      <div className="h-5 w-5 rounded-full bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06] flex items-center justify-center shadow-sm">
                        <Check size={11} strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-[#2b2e38] text-[#454955] flex items-center justify-center">
                        <Check size={11} strokeWidth={4} />
                      </div>
                    )}
                  </div>

                  {/* Step 3: Place first bet */}
                  <div 
                    onClick={() => {
                      if (!hasBets) {
                        sound.playClick();
                        setActiveTab('bets');
                      }
                    }}
                    className={`border rounded-xl px-4 py-3.5 flex items-center justify-between transition-all ${
                      hasBets 
                        ? 'bg-[#171a22] border-[#212532]' 
                        : 'bg-[#171a22] border-[#212532] hover:border-[#caa753]/30 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Coins Icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                        <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1-.2-1.4-.6L7 8.5" />
                        <path d="M3 11V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
                        <circle cx="14" cy="8" r="1.5" />
                      </svg>
                      <span className="text-xs font-bold text-gray-200">Place your first bet</span>
                    </div>
                    {hasBets ? (
                      <div className="h-5 w-5 rounded-full bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06] flex items-center justify-center shadow-sm">
                        <Check size={11} strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-[#2b2e38] text-[#454955] flex items-center justify-center">
                        <Check size={11} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Box 3: Profile Settings */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <span className="text-white font-sans font-extrabold text-[13.5px] tracking-wide">Profile settings</span>
                
                {/* Username input box */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Change Username</span>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter new nickname"
                      maxLength={14}
                      className="flex-1 bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-2.5 text-xs font-sans font-bold text-white focus:outline-none focus:border-[#caa753]/40"
                    />
                    <button 
                      onClick={handleUsernameChange}
                      className="px-5 rounded-xl bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-xs select-none h-[40px] leading-none shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Toggle 1: Use Rollbot */}
                <div className="flex items-center justify-between py-2 border-t border-[#1a1d26] mt-1.5">
                  <span className="text-xs font-semibold text-gray-300">Use profile linked rollbot as char/lottery avatar</span>
                  <button 
                    onClick={() => { sound.playClick(); setIsRollbotAvatar(!isRollbotAvatar); }}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200 shrink-0 ${
                      isRollbotAvatar ? 'bg-gradient-to-r from-[#f2dfa7] to-[#caa753]' : 'bg-[#1e2029]'
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#0a0b0f] transition-transform duration-200 ${
                        isRollbotAvatar ? 'transform translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Private Profile with tooltip */}
                <div className="flex items-center justify-between py-2 border-t border-[#1a1d26] relative">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-300">Private profile</span>
                    <button 
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="text-gray-500 hover:text-white transition"
                    >
                      <Info size={12} />
                    </button>
                    
                    {showTooltip && (
                      <div className="absolute left-0 bottom-full mb-2 w-52 p-2.5 bg-[#171921] border border-[#252835] rounded-xl text-[9.5px] text-gray-400 font-sans z-30 shadow-2xl leading-relaxed">
                        When enabled, your profile data, exact bets, and game level stats are invisible to other sandbox lobby players.
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => { sound.playClick(); setIsPrivateProfile(!isPrivateProfile); }}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200 shrink-0 ${
                      isPrivateProfile ? 'bg-gradient-to-r from-[#f2dfa7] to-[#caa753]' : 'bg-[#1e2029]'
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#0a0b0f] transition-transform duration-200 ${
                        isPrivateProfile ? 'transform translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Box 4: Link Account */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <span className="text-white font-sans font-extrabold text-[13.5px] tracking-wide">Link account</span>

                <div className="flex flex-col gap-2 mt-1">
                  {/* Steam Link Row */}
                  <div className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 flex items-center justify-between transition">
                    <div className="flex items-center gap-3">
                      {/* Steam Icon SVG */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.285 3.414 9.774 8.164 11.337l.955-3.076c-.053-.026-.1-.055-.147-.087-1.127-.75-1.859-1.93-1.859-3.235 0-.173.018-.34.04-.505l-3.32-1.48c-.14.07-.31.107-.48.107-.633 0-1.15-.515-1.15-1.15 0-.633.515-1.15 1.15-1.15.633 0 1.15.515 1.15 1.15 0 .093-.016.183-.037.273l3.29 1.465c.37-.367.854-.627 1.396-.732l1.492-4.99c-.007-.063-.017-.123-.017-.188 0-1.353 1.096-2.45 2.45-2.45s2.45 1.096 2.45 2.45-1.096 2.45-2.45 2.45c-.066 0-.126-.01-.188-.017l-4.985 1.49c-.105.545-.365 1.028-.73 1.397l1.465 3.29c.09-.02.18-.037.273-.037.633 0 1.15.517 1.15 1.15 0 .634-.515 1.15-1.15 1.15-.633 0-1.15-.515-1.15-1.15 0-.17.037-.33.107-.48l-1.48-3.32c-.165.022-.332.04-.505.04-1.306 0-2.485-.732-3.235-1.86-.032-.047-.06-.093-.087-.146l-3.075.955c1.563 4.75 6.053 8.164 11.338 8.164 6.63 0 12-5.37 12-12s-5.37-12-12-12z" />
                      </svg>
                      <span className="text-xs font-bold text-gray-200">Steam</span>
                    </div>
                    <button 
                      onClick={() => {
                        sound.playClick();
                        setSteamConnected(!steamConnected);
                      }}
                      className={`px-4.5 py-1.5 rounded-xl font-sans font-bold text-xs select-none h-[30px] leading-none transition-all duration-200 ${
                        steamConnected 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95'
                      }`}
                    >
                      {steamConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>

                  {/* Twitch Link Row */}
                  <div className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 flex items-center justify-between transition">
                    <div className="flex items-center gap-3">
                      {/* Twitch Icon SVG */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                      </svg>
                      <span className="text-xs font-bold text-gray-200">Twitch</span>
                    </div>
                    <button 
                      onClick={() => {
                        sound.playClick();
                        setTwitchConnected(!twitchConnected);
                      }}
                      className={`px-4.5 py-1.5 rounded-xl font-sans font-bold text-xs select-none h-[30px] leading-none transition-all duration-200 ${
                        twitchConnected 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95'
                      }`}
                    >
                      {twitchConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 5: Personal Details */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <span className="text-white font-sans font-extrabold text-[13.5px] tracking-wide">Personal Details</span>

                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { label: 'Profile Details', onClick: () => setShowProfileModal(true) },
                    { label: 'Password Settings', onClick: () => setShowPasswordModal(true) },
                    { label: 'Bank Accounts', onClick: () => setShowBankModal(true) },
                    { label: 'Address Details', onClick: () => setShowAddressModal(true) }
                  ].map((item, idx) => (
                    <div key={idx} onClick={() => { sound.playClick(); item.onClick(); }} className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 flex items-center justify-between cursor-pointer hover:border-[#caa753]/30 transition">
                      <span className="text-xs font-bold text-gray-200">{item.label}</span>
                      <button className="px-4 py-1.5 rounded-xl font-sans font-bold text-xs select-none h-[30px] flex items-center justify-center leading-none transition-all duration-200 bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 pointer-events-none">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: WALLET */}
          {activeTab === 'wallet' && (
            <motion.div
              key="wallet_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 py-4 w-full max-w-[320px] mx-auto text-sans"
            >
              <div className="flex justify-center items-center relative mb-2 mt-2">
                <h2 className="text-lg font-black text-white tracking-wide">Wallet</h2>
                <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1b1d26] hover:bg-[#252835] transition rounded-lg p-1 text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Internal Tabs */}
              <div className="flex bg-[#12141a] rounded-xl p-1 border border-[#1b1f29] mb-1 shadow-inner">
                <button className="flex-1 py-2.5 text-[11.5px] font-bold bg-[#1e2029] text-white rounded-lg shadow-sm border border-[#2d2f3b]">
                  Balance
                </button>
                <button className="flex-1 py-2.5 text-[11.5px] font-bold text-gray-400 hover:text-gray-200 transition">
                  Transactions
                </button>
              </div>

              {/* Point Balances Box */}
              <div className="bg-[#1a1c26] rounded-2xl p-4 flex shadow-lg relative overflow-hidden border border-[#2b2e3a]">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-400/10 blur-3xl pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 blur-3xl pointer-events-none" />
                
                {/* Free Point */}
                <div className="flex-1 flex flex-col items-center justify-center border-r border-[#2b2e3a] relative z-10 px-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Gem size={14} className="text-cyan-400 fill-cyan-400 drop-shadow-md" />
                    <span className="text-[9.5px] text-gray-400 font-extrabold tracking-widest uppercase">Free Point</span>
                  </div>
                  <span className="text-2xl font-black text-cyan-100 drop-shadow-[0_2px_4px_rgba(34,211,238,0.2)] tracking-tight">
                    350.00
                  </span>
                </div>

                {/* Locked Point */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {/* Coin Icon */}
                    <div className="w-3.5 h-3.5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-200 shadow-sm drop-shadow-md">
                      <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full"></div>
                    </div>
                    <span className="text-[9.5px] text-gray-400 font-extrabold tracking-widest uppercase">Locked Point</span>
                  </div>
                  <span className="text-2xl font-black text-[#facc15] drop-shadow-[0_2px_4px_rgba(250,204,21,0.2)] tracking-tight">
                    21.36
                  </span>
                </div>
              </div>

              {/* Hint Text */}
              <p className="text-center text-[10.5px] text-gray-500 font-medium tracking-wide">
                Locked Point can be used only for by Magic Card.
              </p>

              {/* Stats Box */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 flex flex-col gap-4 shadow-xl mt-1">
                {/* LOCKED */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-extrabold tracking-wider uppercase text-[9.5px]">LOCKED</span>
                  <div className="flex items-center gap-1.5 font-bold font-mono">
                    <span className="text-white text-xs">35.00</span>
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-200 mr-0.5"><div className="w-1 h-1 bg-yellow-100 rounded-full"></div></div>
                    <span className="text-gray-500 text-xs">/ 1000.00</span>
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-200"><div className="w-1 h-1 bg-yellow-100 rounded-full"></div></div>
                  </div>
                </div>

                {/* INCREMENT */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-extrabold tracking-wider uppercase text-[9.5px]">INCREMENT OF LOCKED POINT</span>
                    <Zap size={10} className="text-yellow-500 fill-yellow-500 drop-shadow-md" />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
                    <span className="text-white">1.00</span>
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-200"><div className="w-1 h-1 bg-yellow-100 rounded-full"></div></div>
                    <span className="text-gray-500">/ s</span>
                  </div>
                </div>

                {/* EARNING */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-extrabold tracking-wider uppercase text-[9.5px]">EARNING</span>
                  <div className="flex items-center gap-1.5 font-bold font-mono">
                    <span className="text-emerald-400 text-xs drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">+21.36</span>
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border border-yellow-200"><div className="w-1 h-1 bg-yellow-100 rounded-full"></div></div>
                  </div>
                </div>
              </div>

              {/* Bottom Hint */}
              <p className="text-center text-[10.5px] text-[#4b5563] font-medium tracking-wide">
                You can speed up the incremental performance by:
              </p>
            </motion.div>
          )}

          {/* TAB: DEPOSITS */}
          {activeTab === 'deposits' && (
            <motion.div
              key="deposits_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 text-center items-center py-4"
            >
              {/* Currency pills tags */}
              <div className="flex gap-1.5 select-none shrink-0 bg-[#0f1116] border border-white/5 p-1 rounded-xl w-full max-w-sm mb-2">
                {(['all', 'btc', 'usdt', 'xrp'] as const).map(pill => (
                  <button
                    key={pill}
                    onClick={() => { sound.playClick(); setDepositChain(pill); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold leading-none capitalize transition ${
                      depositChain === pill
                        ? 'bg-[#1e1f26] text-white border border-[#2d2f3b]'
                        : 'text-[#8e92a2] hover:text-white bg-transparent'
                    }`}
                  >
                    {pill === 'all' ? 'All chains' : pill.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Gold Vault/Safe Dial Icon (Extremely high-fidelity custom SVG) */}
              <div className="relative w-40 h-40 flex items-center justify-center my-3 select-none filter drop-shadow-[0_12px_30px_rgba(197,168,92,0.22)]">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <defs>
                    <linearGradient id="vault-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#efd995" />
                      <stop offset="35%" stopColor="#caa753" />
                      <stop offset="100%" stopColor="#573e0a" />
                    </linearGradient>
                    <linearGradient id="vault-inner" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fff8df" />
                      <stop offset="45%" stopColor="#d5b66d" />
                      <stop offset="100%" stopColor="#2c1e05" />
                    </linearGradient>
                    <radialGradient id="dial-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fffbf2" />
                      <stop offset="80%" stopColor="#b69542" />
                      <stop offset="100%" stopColor="#1c1301" />
                    </radialGradient>
                  </defs>
                  
                  {/* Outer heavy metallic vault door */}
                  <rect x="15" y="15" width="90" height="90" rx="14" fill="url(#vault-outer)" stroke="#1a1100" strokeWidth="2.5" />
                  
                  {/* Inside panel */}
                  <rect x="23" y="23" width="74" height="74" rx="9" fill="#15171e" stroke="#caa753" strokeWidth="1.2" />
                  
                  {/* Safe hinge and rivets */}
                  <circle cx="28" cy="28" r="2.5" fill="url(#vault-outer)" />
                  <circle cx="92" cy="28" r="2.5" fill="url(#vault-outer)" />
                  <circle cx="28" cy="92" r="2.5" fill="url(#vault-outer)" />
                  <circle cx="92" cy="92" r="2.5" fill="url(#vault-outer)" />

                  {/* Combination Dial ring */}
                  <circle cx="60" cy="60" r="23" fill="url(#vault-inner)" stroke="#110d02" strokeWidth="2" />
                  <circle cx="60" cy="60" r="17" fill="#1c1d24" />
                  
                  {/* Dial handle/bars */}
                  <rect x="57" y="32" width="6" height="56" rx="3" fill="url(#vault-outer)" stroke="#000" strokeWidth="1" />
                  <rect x="32" y="57" width="56" height="6" rx="3" fill="url(#vault-outer)" stroke="#000" strokeWidth="1" />
                  
                  {/* Dial Center cap */}
                  <circle cx="60" cy="60" r="11" fill="url(#dial-glow)" stroke="#000" strokeWidth="1.2" />
                  <circle cx="60" cy="60" r="5" fill="#131417" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5 max-w-xs">
                <h4 className="text-white font-sans font-extrabold text-lg tracking-wide">No deposits</h4>
                <p className="text-xs text-[#8e92a2] leading-normal font-sans">
                  Make your first sandbox deposit below to simulated reload and unlock unlimited high-roller gaming credits!
                </p>
              </div>

              {/* Fast Simulated Creditor Portal */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 w-full max-w-sm flex flex-col gap-3 mt-2 shadow-xl">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Simulated Deposit Amount ($)</span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#c5a85c]">$</span>
                    <input 
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-[#0a0b0f] border border-[#212532] rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#c5a85c]"
                      placeholder="500"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSimulateDeposit}
                  className="w-full bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-xs select-none py-3.5 rounded-xl leading-none flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} />
                  <span>Make my first deposit</span>
                </button>

                {depositSuccessMsg && (
                  <div className="text-[10.5px] font-bold text-emerald-400 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1.5 text-left leading-normal mt-1 animate-fadeIn">
                    <Check size={12} className="shrink-0" />
                    <span>{depositSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Elegant footer block resembling BETMGM */}
              <div className="border-t border-[#14161d] w-full pt-6 mt-8 text-left">
                <div className="flex items-center gap-1.5 mb-5 select-none opacity-85">
                  <span className="font-sans font-black text-sm text-white tracking-tighter italic">WIN</span>
                  <span className="font-sans font-black text-sm text-[#c5a85c] tracking-tighter italic uppercase">SPIN</span>
                  <span className="text-[8px] text-gray-600 border border-gray-800 rounded px-1 uppercase leading-none py-0.5 ml-2">PRO MASTER</span>
                </div>

                <div className="grid grid-cols-2 gap-6 text-[10.5px]">
                  <div className="flex flex-col gap-2">
                    <span className="font-extrabold text-gray-500 uppercase tracking-widest text-[9px]">PLATFORM</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">Support Help Desk</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">FAQ & Guidelines</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">Partnership Program</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">Airdrops & Coupons</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="font-extrabold text-gray-500 uppercase tracking-widest text-[9px]">ABOUT US</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">AML & Fraud Policy</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">Provably Fair System</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">Responsible Gaming</span>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">Terms & Conditions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: BETS */}
          {activeTab === 'bets' && (
            <motion.div
              key="bets_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-sans font-extrabold text-[13.5px] tracking-wide">My Bet History</span>
                <span className="text-[10px] text-gray-500 font-mono">Real-Time Sessions ({history.length})</span>
              </div>

              {history.length === 0 ? (
                <div className="bg-[#12141a] border border-[#1b1f29] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
                  <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center text-gray-500 border border-white/5 mb-1">
                    <Clock size={16} />
                  </div>
                  <h5 className="text-white font-sans font-bold text-xs uppercase tracking-wide">No bets placed yet</h5>
                  <p className="text-[10.5px] text-gray-500 max-w-xs leading-normal font-sans">
                    Launch slot machines, mines or the crash aviator from the dashboard to place your bets first!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {history.map((bet) => (
                    <div 
                      key={bet.id}
                      className="bg-[#12141a] border border-[#1b1f29] rounded-xl p-3 flex flex-col gap-2 shadow-md relative overflow-hidden"
                    >
                      {/* Left border indicator based on outcome */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        bet.outcome === 'win' ? 'bg-emerald-500' : 'bg-rose-500/45'
                      }`} />

                      <div className="flex justify-between items-center pl-1 text-xs">
                        <strong className="text-white uppercase font-sans tracking-wide truncate max-w-[180px]">{bet.game}</strong>
                        <span className="text-[9.5px] text-gray-500 font-mono">{bet.timestamp}</span>
                      </div>

                      <div className="flex justify-between items-center pl-1 pt-1.5 border-t border-[#1a1d26] text-[11px]">
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="text-[8px] uppercase tracking-wider text-gray-500">BET AMOUNT</span>
                          <span className="font-mono text-gray-300 font-bold">${bet.betAmount.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col gap-0.5 text-center">
                          <span className="text-[8px] uppercase tracking-wider text-gray-500">MULTIPLIER</span>
                          <span className={`font-mono font-bold ${bet.outcome === 'win' ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {bet.multiplier.toFixed(2)}x
                          </span>
                        </div>

                        <div className="flex flex-col gap-0.5 text-right">
                          <span className="text-[8px] uppercase tracking-wider text-gray-500">PAYOUT</span>
                          <span className={`font-mono font-black ${
                            bet.outcome === 'win' ? 'text-[#c5a85c]' : 'text-rose-500/80'
                          }`}>
                            {bet.outcome === 'win' ? `+$${bet.payoutAmount.toLocaleString()}` : `-$${bet.betAmount.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: WITHDRAWALS */}
          {activeTab === 'withdraw' && (
            <motion.div
              key="withdraw_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 text-center items-center py-4"
            >
              {/* ATM money icon */}
              <div className="relative w-36 h-36 flex items-center justify-center my-1 select-none filter drop-shadow-[0_12px_24px_rgba(244,63,94,0.08)]">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <defs>
                    <linearGradient id="withdraw-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#efd995" />
                      <stop offset="60%" stopColor="#caa753" />
                      <stop offset="100%" stopColor="#3d2a04" />
                    </linearGradient>
                  </defs>

                  {/* Cash bundle frame */}
                  <rect x="25" y="35" width="70" height="42" rx="4" fill="#0d1f11" stroke="#22c55e" strokeWidth="2" />
                  <rect x="31" y="41" width="58" height="30" rx="2" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
                  
                  {/* Big Dollar symbol */}
                  <text x="60" y="62" fontSize="22" fontWeight="900" textAnchor="middle" fill="#22c55e" fontFamily="sans-serif">$</text>
                  
                  {/* Arrow taking money out of vault/ATM */}
                  <path d="M60 20 L60 48 M52 38 L60 48 L68 38" fill="none" stroke="url(#withdraw-gold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Hand receiving cash */}
                  <path d="M35 90 C45 88, 55 92, 65 92 C75 92, 85 86, 95 84" fill="none" stroke="url(#withdraw-gold)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Text info */}
              <div className="flex flex-col gap-1.5 max-w-xs">
                <h4 className="text-white font-sans font-extrabold text-lg tracking-wide">Safe Sandbox Withdrawals</h4>
                <p className="text-xs text-[#8e92a2] leading-normal font-sans">
                  Instantly request payout withdrawals of your current virtual winnings directly back into simulated storage.
                </p>
              </div>

              {/* Withdrawal Action form */}
              <div className="bg-[#12141a] rounded-2xl border border-[#1b1f29] p-4 w-full max-w-sm flex flex-col gap-3 shadow-xl mt-1">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-bold text-gray-500 uppercase tracking-wider">Withdrawable Balance</span>
                  <span className="font-mono text-emerald-400 font-extrabold">${user.balance.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Request Amount ($)</span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#c5a85c]">$</span>
                    <input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-[#0a0b0f] border border-[#212532] rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#c5a85c]"
                      placeholder="100"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSimulateWithdraw}
                  className="w-full bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-xs select-none py-3.5 rounded-xl leading-none flex items-center justify-center gap-1.5"
                >
                  <ArrowDownLeft size={13} />
                  <span>Request Virtual Withdrawal</span>
                </button>

                {withdrawSuccessMsg && (
                  <div className="text-[10.5px] font-bold text-emerald-400 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1.5 text-left leading-normal mt-1 animate-fadeIn">
                    <Check size={12} className="shrink-0" />
                    <span>{withdrawSuccessMsg}</span>
                  </div>
                )}

                {withdrawErrorMsg && (
                  <div className="text-[10.5px] font-bold text-rose-400 p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-1.5 text-left leading-normal mt-1 animate-fadeIn">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{withdrawErrorMsg}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: REFERRALS */}
          {activeTab === 'referrals' && (
            <motion.div
              key="referrals_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 text-left"
            >
              {/* Gold Referral Balance Card */}
              <div className="bg-gradient-to-br from-[#caa753] via-[#b58c32] to-[#45310b] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[220px] border border-amber-400/20 shadow-2xl">
                
                {/* Coins Pile Vector SVG */}
                <svg width="240" height="140" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-[-10px] right-[-20px] pointer-events-none opacity-90 mix-blend-screen select-none">
                  <defs>
                    <linearGradient id="coinRim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffe885" />
                      <stop offset="50%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#664600" />
                    </linearGradient>
                    <linearGradient id="coinFace" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f7d060" />
                      <stop offset="100%" stopColor="#b58d1d" />
                    </linearGradient>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f7d060" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f7d060" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  <circle cx="140" cy="80" r="60" fill="url(#glow)" />
                  
                  <g transform="translate(100, 60)">
                    <ellipse cx="20" cy="20" rx="22" ry="9" fill="url(#coinRim)" />
                    <ellipse cx="20" cy="17" rx="22" ry="9" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(140, 50)">
                    <ellipse cx="20" cy="20" rx="22" ry="9" fill="url(#coinRim)" />
                    <ellipse cx="20" cy="17" rx="22" ry="9" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(120, 65)">
                    <ellipse cx="25" cy="22" rx="24" ry="10" fill="url(#coinRim)" />
                    <ellipse cx="25" cy="18" rx="24" ry="10" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  
                  <g transform="translate(70, 75) rotate(-15)">
                    <ellipse cx="15" cy="10" rx="16" ry="7" fill="url(#coinRim)" />
                    <ellipse cx="15" cy="8" rx="16" ry="7" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(160, 70) rotate(20)">
                    <ellipse cx="15" cy="10" rx="16" ry="7" fill="url(#coinRim)" />
                    <ellipse cx="15" cy="8" rx="16" ry="7" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  
                  <g transform="translate(90, 80) rotate(5)">
                    <ellipse cx="20" cy="12" rx="20" ry="8" fill="url(#coinRim)" />
                    <ellipse cx="20" cy="9" rx="20" ry="8" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(130, 78) rotate(-8)">
                    <ellipse cx="20" cy="12" rx="20" ry="8" fill="url(#coinRim)" />
                    <ellipse cx="20" cy="9" rx="20" ry="8" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(110, 88) rotate(12)">
                    <ellipse cx="22" cy="14" rx="22" ry="9" fill="url(#coinRim)" />
                    <ellipse cx="22" cy="10" rx="22" ry="9" fill="url(#coinFace)" stroke="#785c00" strokeWidth="0.5" />
                  </g>
                  
                  <path d="M120 40 L122 46 L128 48 L122 50 L120 56 L118 50 L112 48 L118 46 Z" fill="#fff" opacity="0.9" className="animate-pulse" />
                  <path d="M165 65 L166 69 L170 70 L166 71 L165 75 L164 71 L160 70 L164 69 Z" fill="#fff" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <path d="M85 95 L86 98 L89 99 L86 100 L85 103 L84 100 L81 99 L84 98 Z" fill="#fff" opacity="0.75" className="animate-pulse" style={{ animationDelay: '1s' }} />
                </svg>

                <div className="z-10 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[#f4f4f7] font-sans font-medium text-sm">Referral balance</span>
                    <div className="text-white/60 hover:text-white cursor-pointer transition">
                      <Info size={18} />
                    </div>
                  </div>

                  <h3 className="text-white font-sans font-black text-3xl tracking-tight mt-1 mb-2">
                    ${referralClaimed ? '0.00' : referralBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>

                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-sans font-medium">
                    Your percentage: 15%
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (referralClaimed) return;
                    sound.playCashout();
                    setReferralClaimed(true);
                    updateBalance(referralBalance, 'Referral Commission Claim' as any, 1, 'win');
                    // Notification
                    const notif = document.createElement('div');
                    notif.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-[#caa753] border border-[#e5c67a] text-black px-5 py-3 rounded-full text-xs font-bold z-50 shadow-2xl animate-bounce flex items-center gap-2";
                    notif.innerHTML = `🪙 Claimed $${referralBalance.toFixed(2)} Referral Bonus!`;
                    document.body.appendChild(notif);
                    setTimeout(() => document.body.removeChild(notif), 3000);
                  }}
                  disabled={referralClaimed}
                  className={`w-full py-4 rounded-2xl font-sans font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 leading-none z-10 mt-6 shadow-lg
                    ${referralClaimed 
                      ? 'bg-[#111218]/50 text-gray-500 border border-white/5 cursor-not-allowed' 
                      : 'bg-[#111218] hover:bg-black text-white border border-[#2e313c]/30'
                    }`}
                >
                  {referralClaimed ? 'Claimed' : 'Claim'}
                </button>
              </div>

              {/* Stats Grid Rows */}
              <div className="flex flex-col gap-3">
                
                {/* Stat row 1: Total referrals */}
                <div className="bg-[#111218] border border-[#1b1d24]/60 px-5 py-4.5 rounded-3xl flex items-center gap-4.5 transition-all duration-150 hover:bg-[#14151e]">
                  <div className="h-11 w-11 rounded-full bg-[#161720] border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                    <Users size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-sans font-black text-lg leading-tight">28</span>
                    <span className="text-[#8e92a2] font-sans font-medium text-xs">Total referrals</span>
                  </div>
                </div>

                {/* Stat row 2: Total winnings */}
                <div className="bg-[#111218] border border-[#1b1d24]/60 px-5 py-4.5 rounded-3xl flex items-center gap-4.5 transition-all duration-150 hover:bg-[#14151e]">
                  <div className="h-11 w-11 rounded-full bg-[#161720] border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                    <PiggyBank size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-sans font-black text-lg leading-tight">$2 561</span>
                    <span className="text-[#8e92a2] font-sans font-medium text-xs">Total winnings</span>
                  </div>
                </div>

                {/* Stat row 3: Total bets amount */}
                <div className="bg-[#111218] border border-[#1b1d24]/60 px-5 py-4.5 rounded-3xl flex items-center gap-4.5 transition-all duration-150 hover:bg-[#14151e]">
                  <div className="h-11 w-11 rounded-full bg-[#161720] border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                    <Gamepad2 size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-sans font-black text-lg leading-tight">56</span>
                    <span className="text-[#8e92a2] font-sans font-medium text-xs">Total bets amount</span>
                  </div>
                </div>

              </div>

              {/* Invite Code Box */}
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-white font-sans font-black text-base tracking-wide pl-1">
                  Your invite code
                </h4>

                <div className="bg-[#111218] border border-[#1b1d24]/60 rounded-3xl p-5 relative overflow-hidden flex flex-col gap-1 shadow-2xl min-h-[260px]">
                  
                  {/* Subtle grey/silver metallic 3D spheres at the bottom matching the image */}
                  <div className="absolute bottom-0 right-1/2 translate-x-1/2 pointer-events-none select-none z-0 opacity-80">
                    <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="sphereGrad1" cx="35%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                          <stop offset="35%" stopColor="#a0a5b5" />
                          <stop offset="70%" stopColor="#3a3d4a" />
                          <stop offset="100%" stopColor="#0d0e12" />
                        </radialGradient>
                        <radialGradient id="sphereGrad2" cx="30%" cy="25%" r="75%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                          <stop offset="40%" stopColor="#808595" />
                          <stop offset="80%" stopColor="#252731" />
                          <stop offset="100%" stopColor="#050608" />
                        </radialGradient>
                      </defs>
                      <circle cx="150" cy="90" r="28" fill="url(#sphereGrad2)" />
                      <circle cx="110" cy="180" r="75" fill="url(#sphereGrad1)" />
                      <circle cx="95" cy="55" r="38" fill="url(#sphereGrad1)" />
                    </svg>
                  </div>

                  {/* Code box */}
                  <div className="bg-[#090a0d] border border-[#1b1d24] rounded-2xl p-4.5 flex flex-col gap-1 relative z-10">
                    <span className="text-gray-500 font-sans font-bold text-[10px] uppercase tracking-wide">
                      Code
                    </span>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white font-mono text-xs font-bold tracking-tight">
                        https://vega.com/3j9kx4d
                      </span>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://vega.com/3j9kx4d");
                          sound.playClick();
                          setCopiedCode(true);
                          
                          // Floating Copied feedback
                          const notif = document.createElement('div');
                          notif.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold z-50 shadow-2xl";
                          notif.innerHTML = `📋 Link copied to clipboard!`;
                          document.body.appendChild(notif);
                          setTimeout(() => {
                            document.body.removeChild(notif);
                            setCopiedCode(false);
                          }, 2000);
                        }}
                        className="text-gray-400 hover:text-white transition p-2 rounded-xl bg-[#111218]/80 border border-white/5 hover:border-white/10"
                      >
                        {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* Modals for Personal Details */}
        <AnimatePresence>
          {/* Profile Modal */}
          {showProfileModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#12141a] rounded-2xl border border-[#1b1f29] w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1b1f29]">
                  <h3 className="text-white font-sans font-extrabold text-lg">Profile</h3>
                  <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-white transition p-1">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">First name*</span>
                    <input type="text" defaultValue="Bestha" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Last name*</span>
                    <input type="text" defaultValue="Chandrakanth" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Mobile number <span className="text-gray-500 font-normal">(Read only)</span></span>
                    <input type="text" readOnly defaultValue="9000900955" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-gray-400 cursor-not-allowed focus:outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Email <span className="text-gray-500 font-normal">(Read only)</span></span>
                    <input type="email" readOnly className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-gray-400 cursor-not-allowed focus:outline-none" />
                  </div>
                  
                  <button onClick={() => { sound.playClick(); setShowProfileModal(false); }} className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-sm select-none">
                    Update Profile
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Reset Password Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#12141a] rounded-2xl border border-[#1b1f29] w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1b1f29]">
                  <h3 className="text-white font-sans font-extrabold text-lg">Reset Password</h3>
                  <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white transition p-1">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-xs font-bold text-gray-200">New password*</span>
                    <input type="password" placeholder="Enter password" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40 w-full" />
                    <Eye size={16} className="absolute right-4 top-9 text-gray-500 cursor-pointer hover:text-gray-300" />
                  </div>
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-xs font-bold text-gray-200">Confirm new password*</span>
                    <input type="password" placeholder="Enter confirm password" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40 w-full" />
                    <Eye size={16} className="absolute right-4 top-9 text-gray-500 cursor-pointer hover:text-gray-300" />
                  </div>
                  
                  <button onClick={() => { sound.playClick(); setShowPasswordModal(false); }} className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-sm select-none">
                    Update Password
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Bank Accounts Modal */}
          {showBankModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#12141a] rounded-2xl border border-[#1b1f29] w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1b1f29] shrink-0">
                  <h3 className="text-white font-sans font-extrabold text-lg">Bank Accounts</h3>
                  <button onClick={() => { setShowBankModal(false); setShowBankForm(false); }} className="text-gray-400 hover:text-white transition p-1">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                  {!showBankForm ? (
                    <>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => { 
                            sound.playClick(); 
                            setBankForm({ name: '', account: '', ifsc: '' }); 
                            setEditingBankId(null); 
                            setShowBankForm(true); 
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-xs select-none"
                        >
                          <Plus size={16} /> Add New Bank
                        </button>
                      </div>
                      
                      {bankAccounts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 font-sans text-sm">
                          No bank accounts added yet.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {bankAccounts.map((bank) => (
                            <div key={bank.id} className="bg-[#171a22] border border-[#212532] rounded-xl p-4 flex justify-between items-center transition hover:border-[#caa753]/30">
                              <div className="flex flex-col gap-1">
                                <span className="text-white font-bold text-sm">{bank.name}</span>
                                <span className="text-gray-400 text-xs font-mono">A/C: {bank.account}</span>
                                <span className="text-gray-400 text-xs font-mono">IFSC: {bank.ifsc}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    sound.playClick();
                                    setBankForm({ name: bank.name, account: bank.account, ifsc: bank.ifsc });
                                    setEditingBankId(bank.id);
                                    setShowBankForm(true);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-[#212532] hover:bg-[#caa753]/20 hover:text-[#caa753] flex items-center justify-center text-gray-400 transition"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    sound.playClick();
                                    setBankAccounts(bankAccounts.filter(b => b.id !== bank.id));
                                  }}
                                  className="w-8 h-8 rounded-lg bg-[#212532] hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-gray-400 transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-200">Account Holder Name*</span>
                        <input 
                          type="text" 
                          placeholder="Enter name" 
                          value={bankForm.name}
                          onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                          className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-200">Account Number*</span>
                        <input 
                          type="text" 
                          placeholder="Enter account number" 
                          value={bankForm.account}
                          onChange={(e) => setBankForm({ ...bankForm, account: e.target.value })}
                          className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-gray-200">IFSC Code*</span>
                        <input 
                          type="text" 
                          placeholder="Enter IFSC code" 
                          value={bankForm.ifsc}
                          onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value })}
                          className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" 
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => { sound.playClick(); setShowBankForm(false); }}
                          className="flex-1 py-3.5 rounded-xl bg-[#171a22] border border-[#212532] text-white hover:bg-[#212532] transition-all duration-200 font-sans font-bold text-sm select-none"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            sound.playClick();
                            if (bankForm.name && bankForm.account && bankForm.ifsc) {
                              if (editingBankId) {
                                setBankAccounts(bankAccounts.map(b => b.id === editingBankId ? { ...b, ...bankForm } : b));
                              } else {
                                setBankAccounts([...bankAccounts, { id: Math.random().toString(), ...bankForm }]);
                              }
                              setShowBankForm(false);
                            }
                          }}
                          className="flex-[2] py-3.5 rounded-xl bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-sm select-none"
                        >
                          {editingBankId ? 'Save Changes' : 'Add Bank'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#12141a] rounded-2xl border border-[#1b1f29] w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1b1f29] shrink-0">
                  <h3 className="text-white font-sans font-extrabold text-lg">Add your address</h3>
                  <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-white transition p-1">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Flat, House no., Building, Company, Apartment*</span>
                    <input type="text" placeholder="Address line 1" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Area, Street, Sector, Village*</span>
                    <input type="text" placeholder="Address line 2" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Landmark <span className="text-gray-500 font-normal">(optional)</span></span>
                    <input type="text" placeholder="Enter landmark (optional)" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">City*</span>
                    <input type="text" placeholder="Enter city" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">Country*</span>
                    <input type="text" defaultValue="India" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-200">State*</span>
                    <input type="text" defaultValue="Andaman and Nicobar Islands" className="bg-[#171a22] border border-[#212532] rounded-xl px-3.5 py-3 text-sm font-sans text-white focus:outline-none focus:border-[#caa753]/40" />
                  </div>
                  
                  <button onClick={() => { sound.playClick(); setShowAddressModal(false); }} className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] border border-[#ffd97d]/35 text-[#0e0c06] shadow-[0_4px_16px_rgba(202,167,83,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 transition-all duration-200 font-sans font-bold text-sm select-none shrink-0">
                    Save Address
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
