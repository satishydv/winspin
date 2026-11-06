import React, { useState } from 'react';
import { 
  motion 
} from 'motion/react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('chandu');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter a valid administrator handle.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Security password required.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(username);
    }, 1200);
  };

  return (
    <div id="login-viewport" className="min-h-screen bg-obsidian-950 text-slate-100 flex items-center justify-center relative p-4 overflow-hidden cyber-grid">
      
      {/* Aesthetic glowing orbits (Matching VARA567 twilight casino theme) */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Main card box with high-end glassmorphism border and gold-accent outline */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-obsidian-900/90 border border-slate-800/80 rounded-2xl p-6 md:p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Subtle decorative gold-hued top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        {/* Brand Logo & Presentation */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex h-12 w-12 bg-gradient-to-br from-gold-500 to-amber-600 rounded-xl items-center justify-center shadow-[0_4px_15px_rgba(212,175,55,0.25)] font-bold font-display text-slate-950 text-xl mx-auto">
            Ω
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] to-[#AA771C] uppercase leading-none">
              VARA567
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
              Gaming Command Suite
            </p>
          </div>
          <p className="text-slate-400 text-xs font-sans pt-2">
            Authorized Administrator Gateway. Authenticate below to gain ultimate root panel privileges.
          </p>
        </div>

        {/* Notification warnings */}
        {errorMessage ? (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex gap-2"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        ) : (
          <div className="mb-5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-slate-400 text-[11px] font-sans flex gap-2.5 items-start">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-semibold text-slate-300">Protected Workspace</p>
              <p>Demo mode bypass active. Press Sign In securely with the default administrative credentials.</p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* Username administrative handle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Handle ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User className="h-3.5 w-3.5" />
              </span>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-obsidian-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none transition-colors font-semibold"
                placeholder="chandu"
              />
            </div>
          </div>

          {/* Secure password credentials */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="h-3.5 w-3.5" />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none transition-colors font-mono tracking-widest"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-white transition-colors outline-none select-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember state checkbox */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                defaultChecked 
                className="accent-amber-500 rounded bg-slate-950 border-slate-800" 
              />
              <span>Remember security token</span>
            </label>
            <span className="text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> Reset Pin
            </span>
          </div>

          {/* Login Submit button */}
          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold tracking-wider text-xs text-slate-950 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] to-[#AA771C] hover:from-[#FCF6BA] hover:via-[#D4AF37] hover:to-[#B38728] border border-[#BF953F]/40 hover:border-[#D4AF37]/50 transition-all shadow-[0_4px_25px_rgba(212,175,55,0.18)] active:scale-[0.99] flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deploying Security Session...
              </>
            ) : (
              <>
                <span className="uppercase tracking-widest font-black text-[10px]">Sign In Securely</span>
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </>
            )}
          </button>

        </form>

        {/* Bottom card footnotes */}
        <div className="mt-8 pt-5 border-t border-slate-850/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-600" />
            <span>UTC 2026-06-29</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Node: Active</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
