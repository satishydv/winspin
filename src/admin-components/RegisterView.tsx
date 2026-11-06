import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Key, 
  ArrowRight, 
  CheckCircle, 
  User, 
  Mail, 
  Globe, 
  Coins, 
  Users, 
  ShieldCheck, 
  UserPlus,
  RefreshCw,
  Gift
} from 'lucide-react';
import { Player, Agent } from '../adminTypes';

interface RegisterViewProps {
  agents: Agent[];
  onAddPlayer: (newPlayer: Player) => void;
  onViewClientList: () => void;
  addSystemAlert: (type: 'info' | 'success' | 'warn' | 'danger', message: string) => void;
}

export default function RegisterView({
  agents,
  onAddPlayer,
  onViewClientList,
  addSystemAlert
}: RegisterViewProps) {
  // Wizard steps: 'otp' | 'details' | 'success'
  const [step, setStep] = useState<'otp' | 'details' | 'success'>('otp');
  
  // Step 1: OTP States
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [testOtpTip, setTestOtpTip] = useState('');

  // Step 2: Details States
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [initialBalance, setInitialBalance] = useState('1000');
  const [referrerCode, setReferrerCode] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Registered Client Info for Success screen
  const [registeredClient, setRegisteredClient] = useState<Player | null>(null);

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  // Request OTP Handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setOtpError('Please enter a valid phone number or email address');
      return;
    }
    
    setIsSendingOtp(true);
    setOtpError('');
    
    // Simulate API network latency
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setCountdown(60);
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setTestOtpTip(generatedCode);
      addSystemAlert('info', `OTP Verification code issued to ${phoneOrEmail.trim()}`);
    }, 800);
  };

  // Verify OTP Handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError('Please enter the 6-digit OTP code');
      return;
    }
    
    // Dummy validation - any OTP works!
    addSystemAlert('success', 'Mobile identity validated successfully.');
    // Try to auto-populate email if they entered email in step 1
    if (phoneOrEmail.includes('@')) {
      setEmail(phoneOrEmail.trim());
    }
    setStep('details');
  };

  // Submit profile details
  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (password && password !== confirmPassword) {
      errors.password = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success registration logic
    const finalEmail = email.trim() || `${username.trim().toLowerCase()}@auraoptix.com`;
    const balanceNum = parseFloat(initialBalance) || 0;
    
    const newPlayer: Player = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      username: username.trim().toLowerCase(),
      email: finalEmail,
      balance: balanceNum,
      depositsTotal: balanceNum,
      withdrawalsTotal: 0,
      status: 'online',
      country: country,
      registeredAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Just registered',
      roundsPlayed: 0,
      totalBet: 0,
      totalWin: 0,
      currentIp: `${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`,
      referrerCode: referrerCode.trim() || undefined,
      ggr: 0
    };

    // Trigger parent append callback
    onAddPlayer(newPlayer);
    setRegisteredClient(newPlayer);
    
    addSystemAlert('success', `New client registration finalized: ${newPlayer.username}`);
    setStep('success');
  };

  // Reset registration wizard
  const handleReset = () => {
    setStep('otp');
    setPhoneOrEmail('');
    setOtpSent(false);
    setOtpCode('');
    setCountdown(60);
    setTestOtpTip('');
    setUsername('');
    setFullName('');
    setEmail('');
    setCountry('India');
    setInitialBalance('1000');
    setReferrerCode('');
    setAssignedAgentId('');
    setPassword('');
    setConfirmPassword('');
    setFormErrors({});
    setRegisteredClient(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper informational banner consistent with other screens */}
      <div className="p-5 bg-obsidian-900 border border-slate-800/80 rounded-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
              <UserPlus className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-base font-bold font-display text-white uppercase tracking-wider">
              Presentation Registration Wizard
            </h2>
          </div>
          <p className="text-slate-400 text-xs font-sans max-w-2xl mt-1">
            Simulate the customer acquisition flow step-by-step. Validate cellular or email identities with instant simulated OTP, appoint custom supervising agents, and register direct accounts.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-mono tracking-wider font-semibold">
          STATUS: PROTOTYPE SANDBOX
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Progress Stepper Header */}
        <div className="flex items-center justify-between mb-8 px-4 font-display">
          <div className="flex flex-col items-center gap-1.5 relative z-10">
            <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step === 'otp' 
                ? 'bg-[#4E5DFD] border-[#4E5DFD] text-white shadow-lg shadow-indigo-500/20' 
                : step === 'details' || step === 'success'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-obsidian-950 border-slate-800 text-slate-500'
            }`}>
              {step !== 'otp' ? '✓' : '1'}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-wider transition-colors duration-300 ${step === 'otp' ? 'text-indigo-400 font-extrabold' : 'text-slate-500'}`}>OTP Auth</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-800/50 mx-2 -mt-4 relative">
            <div className={`absolute left-0 top-0 h-full bg-[#4E5DFD] transition-all duration-500 ${
              step === 'details' ? 'w-1/2' : step === 'success' ? 'w-full' : 'w-0'
            }`} />
          </div>

          <div className="flex flex-col items-center gap-1.5 relative z-10">
            <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step === 'details' 
                ? 'bg-[#4E5DFD] border-[#4E5DFD] text-white shadow-lg shadow-indigo-500/20' 
                : step === 'success'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-obsidian-950 border-slate-800 text-slate-500'
            }`}>
              {step === 'success' ? '✓' : '2'}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-wider transition-colors duration-300 ${step === 'details' ? 'text-indigo-400 font-extrabold' : 'text-slate-500'}`}>Profile Setup</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-800/50 mx-2 -mt-4 relative">
            <div className={`absolute left-0 top-0 h-full bg-[#4E5DFD] transition-all duration-500 ${
              step === 'success' ? 'w-full' : 'w-0'
            }`} />
          </div>

          <div className="flex flex-col items-center gap-1.5 relative z-10">
            <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step === 'success' 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-obsidian-950 border-slate-800 text-slate-500'
            }`}>
              3
            </div>
            <span className={`text-[10px] uppercase font-black tracking-wider transition-colors duration-300 ${step === 'success' ? 'text-emerald-400 font-extrabold' : 'text-slate-500'}`}>Success</span>
          </div>
        </div>

        {/* Card Frame wrapping inputs */}
        <div className="bg-obsidian-900 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: OTP FLOW */}
              {step === 'otp' && (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2 mb-2">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
                      Verify Client Identity
                    </h3>
                    <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
                      For secure signups on the casino network, authorize the cellular telephone number or email.
                    </p>
                  </div>

                  {!otpSent ? (
                    /* Initial form requesting phone/email */
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2 font-display">
                          Phone Number or Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                            <Mail className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. +91 98765 43210 or client@domain.com"
                            value={phoneOrEmail}
                            onChange={(e) => setPhoneOrEmail(e.target.value)}
                            className="w-full bg-obsidian-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        {otpError && (
                          <p className="text-rose-neon text-[10px] mt-1.5 font-sans font-semibold">
                            {otpError}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full py-2.5 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                      >
                        {isSendingOtp ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Dispatching OTP Code...
                          </>
                        ) : (
                          <>
                            Request Verification OTP
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* OTP code submission form */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="bg-[#151433]/40 border border-indigo-500/10 rounded-xl p-4.5 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 font-sans">
                          <span>VERIFICATION DESPATCHED</span>
                          <span className="text-indigo-400 font-mono">{phoneOrEmail}</span>
                        </div>
                        <p className="text-[11px] text-slate-350 leading-relaxed">
                          We've dispatched a simulated secure 6-digit OTP passcode. Because this is a sandbox environment, <b className="text-indigo-400">any 6-digit code will pass</b>. 
                        </p>
                        {testOtpTip && (
                          <div className="pt-2 flex items-center justify-between border-t border-slate-800/40 text-[10px] font-mono">
                            <span className="text-slate-500">Suggested Code:</span>
                            <span className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded font-black tracking-widest">{testOtpTip}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2 font-display">
                          Enter 6-Digit One-Time Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                            <Key className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            pattern="\d{6}"
                            placeholder="e.g. 123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-obsidian-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono tracking-widest text-center"
                          />
                        </div>
                        {otpError && (
                          <p className="text-rose-neon text-[10px] mt-1.5 font-sans font-semibold">
                            {otpError}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-sans">
                        <span className="text-slate-400">
                          {countdown > 0 ? (
                            <>Resend code in <b className="text-slate-200 font-mono">{countdown}s</b></>
                          ) : (
                            <span className="text-emerald-400 font-bold">Ready to dispatch again</span>
                          )}
                        </span>
                        
                        <button
                          type="button"
                          disabled={countdown > 0}
                          onClick={() => {
                            setCountdown(60);
                            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
                            setTestOtpTip(generatedCode);
                            addSystemAlert('info', 'New OTP Code dispatched.');
                          }}
                          className={`font-semibold underline transition-colors cursor-pointer ${
                            countdown > 0 ? 'text-slate-500 no-underline cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
                          }`}
                        >
                          Request New Code
                        </button>
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs tracking-wider border border-slate-800 transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-[2] py-2.5 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                        >
                          Verify OTP
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {/* STEP 2: PROFILE PROFILE DETAILS */}
              {step === 'details' && (
                <motion.div
                  key="details-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
                        Complete Profile Configuration
                      </h3>
                      <p className="text-slate-400 text-[11px] font-sans">
                        Enter basic credentials and configure custom supervisory parameters.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitDetails} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Username */}
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Account Username *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. luckychandu"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          className={`w-full bg-obsidian-950 border rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors ${
                            formErrors.username ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        />
                        {formErrors.username && (
                          <p className="text-rose-neon text-[9px] mt-1 font-semibold">{formErrors.username}</p>
                        )}
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Satish Yadav"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full bg-obsidian-950 border rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors ${
                            formErrors.fullName ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        />
                        {formErrors.fullName && (
                          <p className="text-rose-neon text-[9px] mt-1 font-semibold">{formErrors.fullName}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. satish@example.com (optional)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      {/* Initial balance */}
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Initial Chip Balance (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs font-bold font-mono">
                            ₹
                          </span>
                          <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={initialBalance}
                            onChange={(e) => setInitialBalance(e.target.value)}
                            className="w-full bg-obsidian-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Country Select */}
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Country of Residence
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors"
                        >
                          <option value="India">India</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Canada">Canada</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="USA">USA</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      {/* Appointed Managing Agent */}
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Assigned Supervisor Agent
                        </label>
                        <select
                          value={assignedAgentId}
                          onChange={(e) => setAssignedAgentId(e.target.value)}
                          className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Direct Portal Signup (No Agent)</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              @{agent.username} (Rate: {agent.commissionRate}%)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Referral/Promo Code */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Promo or Referrer Code (Optional)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <Gift className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. WELCOME_BONUS or AGENT_PROMO"
                            value={referrerCode}
                            onChange={(e) => setReferrerCode(e.target.value.toUpperCase())}
                            className="w-full bg-obsidian-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors font-mono tracking-widest"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Simple Passwords mock to enrich the card visual authenticity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850/60 pt-4 mt-2">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Create Account Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 font-display">
                          Confirm Account Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full bg-obsidian-950 border rounded-xl px-3 py-2.5 text-xs text-white font-sans outline-none focus:border-indigo-500 transition-colors ${
                            formErrors.password ? 'border-rose-500' : 'border-slate-800'
                          }`}
                        />
                        {formErrors.password && (
                          <p className="text-rose-neon text-[9px] mt-1 font-semibold">{formErrors.password}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep('otp')}
                        className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs tracking-wider border border-slate-800 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] py-2.5 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                      >
                        Complete Registration
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS CONFIRMATION SCREEN */}
              {step === 'success' && registeredClient && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-125 animate-pulse" />
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 relative z-10">
                      <ShieldCheck className="h-9 w-9" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-display">
                      Client Registry Complete!
                    </h3>
                    <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
                      Identity verified and direct casino player profile compiled successfully in the central registry nodes.
                    </p>
                  </div>

                  {/* Summary of credentials */}
                  <div className="bg-obsidian-950 border border-slate-850 rounded-xl p-5 text-left space-y-3 font-sans max-w-sm mx-auto shadow-inner">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-850/60">
                      <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider font-display">REGISTRY ID</span>
                      <span className="font-mono text-indigo-400 font-bold">{registeredClient.id}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-850/60">
                      <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider font-display">Username</span>
                      <span className="text-white font-bold font-mono">@{registeredClient.username}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-850/60">
                      <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider font-display">Country</span>
                      <span className="text-slate-200 font-semibold">{registeredClient.country}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-850/60">
                      <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider font-display">E-mail Address</span>
                      <span className="text-slate-200 font-semibold truncate max-w-[180px]">{registeredClient.email}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-850/60">
                      <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider font-display">Assigned Agent</span>
                      <span className="text-slate-200">
                        {assignedAgentId ? (
                          <span className="text-amber-400 font-bold">
                            @{agents.find(a => a.id === assignedAgentId)?.username || 'Agent'}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Direct Portal Account</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider font-display">Chip Balance</span>
                      <span className="text-emerald-neon font-bold font-mono">₹{registeredClient.balance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-850 hover:text-white text-slate-300 font-bold text-xs tracking-wider border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      Register Another
                    </button>
                    <button
                      type="button"
                      onClick={onViewClientList}
                      className="flex-[1.5] py-2.5 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                    >
                      View Client Directory
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
