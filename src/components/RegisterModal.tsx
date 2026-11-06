import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, ShieldCheck, Check, ArrowLeft, Smartphone, User, Wallet, Gift, MailX, RefreshCw, Headphones } from 'lucide-react';
import { sound } from '../utils/audio';
import registerImage from '../../assets/images/pngs/register.png';
import verifyImage from '../../assets/images/OTP_flow/verify.png';
import correctImage from '../../assets/images/OTP_flow/correct.png';
import wrongImage from '../../assets/images/OTP_flow/wrong.png';

interface RegisterModalProps {
  onRegisterSuccess: (username: string) => void;
  onLoginSuccess?: (username: string) => void;
  initialMode?: 'register' | 'login';
  onNavigateToHome: () => void;
  onToggleMode: (mode: 'register' | 'login') => void;
}

export default function RegisterModal({ onRegisterSuccess, onLoginSuccess, initialMode = 'register', onNavigateToHome, onToggleMode }: RegisterModalProps) {
  // Navigation step within registration
  // 'form' | 'otp' | 'success' | 'failure'
  const [step, setStep] = useState<'form' | 'otp' | 'success' | 'failure'>('form');

  // Mode state: 'register' or 'login'
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Input states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Checkboxes
  const [is18, setIs18] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<{ phone?: string; username?: string; password?: string; age?: string; terms?: string }>({});

  // Reset state when mode changes
  useEffect(() => {
    setMode(initialMode);
    setStep('form');
    setPhoneNumber('');
    setUsername(initialMode === 'login' ? 'test@example.com' : '');
    setPassword(initialMode === 'login' ? 'password123' : '');
    setIs18(false);
    setIsTermsAccepted(true);
    setShowPromoCode(false);
    setPromoCode('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setErrors({});
  }, [initialMode]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Simple phone number check
    if (!phoneNumber || phoneNumber.length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Username check
    if (!username || username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password check
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Must be 18
    if (!is18) {
      newErrors.age = 'You must confirm you are 18 years or older';
    }

    // Terms check
    if (!isTermsAccepted) {
      newErrors.terms = 'You must accept the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = () => {
    const newErrors: typeof errors = {};

    // Username check
    if (!username || username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password check
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlayNow = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (validateForm()) {
      // Transition to OTP step
      setStep('otp');
      try {
        sound.playSuccess();
      } catch (err) { }
    } else {
      try {
        sound.playError();
      } catch (err) { }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (validateLoginForm()) {
      if (onLoginSuccess) {
        onLoginSuccess(username);
      } else {
        onRegisterSuccess(username);
      }
      try {
        sound.playSuccess();
      } catch (err) { }
      onNavigateToHome();
    } else {
      try {
        sound.playError();
      } catch (err) { }
    }
  };

  // OTP verification handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsVerifying(true);

    const code = otpCode.join('');

    // Simulated short latency to feel realistic
    setTimeout(() => {
      setIsVerifying(false);
      if (code === '111111') {
        setStep('success');
        try {
          sound.playWin();
        } catch (err) { }
      } else {
        setStep('failure');
        try {
          sound.playError();
        } catch (err) { }
      }
    }, 1200);
  };

  const handleOtpChange = (index: number, val: string) => {
    // only allow digits
    const cleaned = val.replace(/[^0-9]/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = cleaned.substring(cleaned.length - 1); // keep last digit
    setOtpCode(newOtp);

    // Auto focus next box
    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        const newOtp = [...otpCode];
        newOtp[index - 1] = '';
        setOtpCode(newOtp);
      }
    }
  };

  const handleFinalContinue = () => {
    sound.playClick();
    // Complete registration
    onRegisterSuccess(username || 'LuckySpinner');
    onNavigateToHome();
  };

  return (
    <div id="auth_page_container" className="flex-1 flex flex-col relative h-full bg-[#0a0b0f]">

      {/* Absolute floating Poker Chips & Decorative background glow behind modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e3ff36]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Main Account Modal Card Container */}
      <motion.div
        id="register_modal_card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-[420px] mx-auto h-full flex flex-col overflow-y-auto no-scrollbar"
      >

        {/* ================= STEP 1: REGISTRATION/SIGNIN FORM ================= */}
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key={mode === 'register' ? 'step-form-register' : 'step-form-login'}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col gap-5"
            >
              {/* ================= HEADER BANNER ================= */}
              <div className="-mx-6 -mt-6 relative overflow-hidden bg-gradient-to-r from-[#12141a] via-[#1a131a] to-[#3a1324] pt-5 px-6 pb-1">

                {/* Banner Content */}
                <div className="flex justify-between items-center z-10 relative">
                  <div className="flex flex-col flex-1 pr-2">
                    <h2 className="text-white font-sans font-black text-lg tracking-tight leading-none mb-1.5 uppercase drop-shadow-md">
                      WELCOME<br />BONUS<br />UP TO ₹ 1000
                    </h2>
                    {/* <p className="text-[#8e92a2] font-sans font-bold text-[11px] tracking-wide">
                      <span className="text-white">+ 225</span> Free Spins
                    </p> */}
                  </div>

                  {/* Gift Image Right - Straight (no rotation) */}
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center -mr-2">
                    <img
                      src={registerImage}
                      alt="Welcome Bonus Gift"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>


              {/* ================= REGISTER FORM ================= */}
              {mode === 'register' ? (
                <form onSubmit={handlePlayNow} className="flex flex-col gap-4">

                  {/* 1. PHONE NUMBER INPUT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-sans font-bold tracking-tight">
                      Phone Number
                    </label>

                    {/* Dual selector style phone layout */}
                    <div className="flex gap-2">
                      <div className="bg-[#14161e] text-white border border-[#212431] rounded-xl px-2.5 py-3 text-xs font-sans font-bold flex items-center gap-1.5 shrink-0 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                          <path fill="#fff" d="M1 11H31V21H1z"></path>
                          <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#e06535"></path>
                          <path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#2c6837"></path>
                          <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                          <path d="M16,12.292c-2.048,0-3.708,1.66-3.708,3.708s1.66,3.708,3.708,3.708,3.708-1.66,3.708-3.708-1.66-3.708-3.708-3.708Zm3.041,4.109c-.01,.076,.042,.145,.117,.157-.033,.186-.08,.367-.143,.54-.071-.028-.152,.006-.181,.077-.029,.071,.004,.151,.073,.182-.04,.085-.083,.167-.13,.248l-1.611-1.069-.592-.249c.013-.026,.024-.053,.034-.081l.595,.242,1.895,.383-1.833-.616-.636-.087c.006-.028,.009-.057,.011-.087l.638,.08,1.93-.12-1.93-.12-.638,.08c-.002-.03-.005-.059-.011-.087l.636-.087,1.833-.616-1.895,.383-.595,.242c-.009-.028-.021-.055-.034-.081l.592-.249,1.611-1.069c.047,.081,.09,.163,.13,.248-.07,.031-.103,.111-.073,.182,.029,.071,.11,.105,.181,.077,.063,.173,.111,.354,.143,.54-.075,.012-.127,.081-.117,.157,.01,.076,.078,.129,.154,.121,.008,.092,.013,.185,.013,.279s-.005,.187-.013,.279c-.075-.008-.144,.045-.154,.121Zm-.584-2.462c-.059,.048-.07,.134-.023,.194,.046,.06,.132,.072,.194,.028,.053,.076,.104,.155,.15,.236l-1.731,.861-.512,.388c-.016-.024-.034-.047-.054-.069l.508-.394,1.28-1.45-1.45,1.28-.394,.508c-.022-.019-.045-.038-.069-.054l.388-.512,.861-1.731c.081,.047,.16,.097,.236,.15-.045,.061-.033,.147,.028,.194,.061,.046,.147,.036,.194-.023,.071,.06,.141,.123,.207,.189,.066,.066,.129,.135,.189,.207Zm-2.177-1.133c-.008,.075,.045,.144,.121,.154,.076,.01,.145-.042,.157-.117,.186,.033,.367,.08,.54,.143-.028-.071,.006,.152,.077,.181,.071,.029,.151-.004,.182-.073,.085,.04,.167,.083,.248,.13l-1.069,1.611-.249,.592c-.026-.013-.053-.024-.081-.034l.242-.595,.383-1.895-.616,1.833-.087,.636c-.028-.006-.057-.009-.087-.011l.08-.638-.12-1.93-.12,1.93,.08,.638c-.03,.002-.059,.005-.087,.011l-.087-.636-.616-1.833,.383,1.895,.242,.595c-.028,.009-.055,.021-.081,.034l-.249-.592-1.069-1.611c.081-.047,.163,.09,.248-.13,.031,.07-.111,.103,.182,.073,.071-.029,.105-.11,.077,.181,.173-.063,.354,.111,.54-.143,.012,.075,.081,.127,.157,.117,.076-.01,.129-.078,.121-.154,.092-.008,.185,.013,.279-.013s-.187-.005-.279-.013Zm-3.113,4.368c-.029-.071-.11-.105-.181-.077-.063-.173-.111-.354-.143-.54,.075-.012,.127-.081,.117-.157-.01-.076-.078-.129-.154-.121-.008-.092-.013-.185-.013-.279s.005-.187,.013-.279c.075,.008,.144-.045,.154-.121,.01-.076-.042-.145-.117-.157,.033-.186,.08-.367,.143-.54,.071,.028,.152-.006,.181-.077,.029-.071-.004-.151-.073-.182,.04-.085,.083-.167,.13-.248l1.611,1.069,.592,.249c-.013,.026-.024,.053-.034,.081l-.595-.242-1.895-.383,1.833,.616,.636,.087c-.006,.028-.009,.057-.011,.087l-.638-.08-1.93,.12,1.93,.12,.638-.08c.002,.03,.005,.059,.011,.087l-.636,.087-1.833,.616,1.895-.383,.595-.242c.009,.028,.021,.055,.034,.081l-.592,.249-1.611,1.069c-.047-.081-.09-.163-.13-.248,.07-.031,.103-.111,.073-.182Zm.772-3.63c.048,.059,.134,.07,.194,.023,.06-.046,.072-.132,.028-.194,.076-.053,.155-.104,.236-.15l.861,1.731,.388,.512c-.024,.016-.047,.034-.069,.054l-.394-.508-1.45-1.28,1.28,1.45,.508,.394c-.019,.022-.038,.045-.054,.069l-.512-.388-1.731-.861c.047-.081,.097,.16,.15-.236,.061,.045,.147,.033,.194-.028,.046-.061,.036-.147-.023-.194,.06-.071,.123-.141,.189-.207s.135-.129,.207-.189Zm-.395,4.518c.059-.048,.07-.134,.023-.194-.046-.06-.132-.072-.194-.028-.053-.076-.104-.155-.15-.236l1.731-.861,.512-.388c.016,.024,.034,.047,.054,.069l-.508,.394-1.28,1.45,1.45-1.28,.394-.508c.022,.019,.045,.038,.069,.054l-.388,.512-.861,1.731c-.081-.047-.16-.097-.236-.15,.045-.061,.033-.147-.028-.194-.061-.046-.147-.036-.194,.023-.071-.06-.141-.123-.207-.189-.066-.066-.129-.135-.189-.207Zm2.177,1.133c.008-.075-.045-.144-.121-.154-.076-.01-.145,.042-.157,.117-.186-.033-.367-.08-.54-.143,.028-.071-.006-.152-.077-.181-.071-.029-.151,.004-.182,.073-.085-.04-.167-.083-.248-.13l1.069-1.611,.249-.592c.026,.013,.053,.024,.081,.034l-.242,.595-.383,1.895,.616-1.833,.087-.636c.028,.006,.057,.009,.087,.011l-.08,.638,.12,1.93,.12-1.93-.08-.638c.03-.002,.059-.005,.087-.011l.087,.636,.616,1.833-.383-1.895-.242-.595c.028-.009,.055-.021,.081-.034l.249,.592,1.069,1.611c-.081,.047-.163,.09-.248,.13-.031-.07-.111-.103-.182-.073-.071,.029-.105,.11-.077,.181-.173,.063-.354,.111-.54,.143-.012-.075-.081-.127-.157-.117-.076,.01-.129-.078-.121-.154-.092,.008-.185,.013-.279,.013s-.187-.005-.279-.013Zm2.341-.738c-.048-.059-.134-.07-.194-.023-.06,.046-.072,.132-.028,.194-.076,.053-.155-.104-.236,.15l-.861-1.731-.388-.512c.024-.016,.047-.034,.069-.054l.394,.508,1.45,1.28-1.28-1.45-.508-.394c.019-.022,.038-.045,.054-.069l.512,.388,1.731,.861c-.047,.081-.097,.16-.15,.236-.061-.045-.147-.033-.194,.028-.046,.061-.036,.147,.023,.194-.06,.071-.123,.141-.189,.207s-.135,.129-.207,.189Z" fill="#2c2c6b"></path>
                          <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                        </svg>
                        <span>+91</span>
                      </div>

                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="Enter phone number"
                          className="w-full bg-[#14161e] text-white placeholder-[#515765] border border-[#212431] focus:border-[#e3ff36]/50 rounded-xl pl-9 pr-3 py-3 text-xs font-sans font-medium focus:outline-none transition duration-150"
                        />
                        <Smartphone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#515765]" />
                      </div>
                    </div>
                    {errors.phone && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.phone}</span>
                    )}
                  </div>

                  {/* 2. USERNAME INPUT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-sans font-bold tracking-tight">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full bg-[#14161e] text-white placeholder-[#515765] border border-[#212431] focus:border-[#e3ff36]/50 rounded-xl px-4 py-3 text-xs font-sans font-medium focus:outline-none transition duration-150"
                    />
                    {errors.username && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.username}</span>
                    )}
                  </div>

                  {/* 3. PASSWORD INPUT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-sans font-bold tracking-tight">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-[#14161e] text-white placeholder-[#515765] border border-[#212431] focus:border-[#e3ff36]/50 rounded-xl pl-4 pr-10 py-3 text-xs font-sans font-medium focus:outline-none transition duration-150"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setShowPassword(!showPassword);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-150"
                      >
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.password}</span>
                    )}
                  </div>

                  {/* Checkboxes Group */}
                  <div className="flex flex-col gap-2.5 mt-2.5 select-none">

                    {/* Age restriction agreement */}
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={is18}
                        onChange={() => { sound.playClick(); setIs18(!is18); }}
                        className="sr-only"
                      />
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 mt-0.5 ${is18 ? 'bg-[#e3ff36] border-[#e3ff36] text-black' : 'bg-[#14161e] border-[#212431] group-hover:border-gray-500'
                        }`}>
                        {is18 && <Check size={11} className="stroke-[3.5]" />}
                      </div>
                      <span className="text-[11px] leading-snug text-[#8e92a2] group-hover:text-gray-300 font-sans font-medium">
                        I confirm I am 18 years or older, located in a permitted territory, and have no self-exclusions
                      </span>
                    </label>

                    {/* Terms & conditions agreement */}
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isTermsAccepted}
                        onChange={() => { sound.playClick(); setIsTermsAccepted(!isTermsAccepted); }}
                        className="sr-only"
                      />
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 mt-0.5 ${isTermsAccepted ? 'bg-[#e3ff36] border-[#e3ff36] text-black' : 'bg-[#14161e] border-[#212431] group-hover:border-gray-500'
                        }`}>
                        {isTermsAccepted && <Check size={11} className="stroke-[3.5]" />}
                      </div>
                      <span className="text-[11px] leading-snug text-[#8e92a2] group-hover:text-gray-300 font-sans font-medium">
                        I agree and understand the <span className="text-white underline">Terms & Conditions*</span>
                      </span>
                    </label>

                    {/* Optional Referral Code Toggle */}
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showPromoCode}
                        onChange={() => { sound.playClick(); setShowPromoCode(!showPromoCode); }}
                        className="sr-only"
                      />
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 ${showPromoCode ? 'bg-[#e3ff36] border-[#e3ff36] text-black' : 'bg-[#14161e] border-[#212431] group-hover:border-gray-500'
                        }`}>
                        {showPromoCode && <Check size={11} className="stroke-[3.5]" />}
                      </div>
                      <span className="text-[11px] text-[#8e92a2] group-hover:text-gray-300 font-sans font-medium">
                        Code (Optional)
                      </span>
                    </label>

                    {/* Promo referral input slide down */}
                    <AnimatePresence>
                      {showPromoCode && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Referral or bonus voucher code"
                            className="w-full bg-[#14161e] text-white placeholder-[#515765] border border-[#212431] focus:border-[#e3ff36]/50 rounded-xl px-4 py-2.5 text-xs font-sans font-medium focus:outline-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Validation alerts */}
                    {errors.age && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.age}</span>
                    )}
                    {errors.terms && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.terms}</span>
                    )}
                  </div>

                  {/* Submitting "Play now" button */}
                  <button
                    type="submit"
                    className="w-full bg-[#f4db56] hover:bg-[#e4cb46] text-[#0e0c06] font-sans font-black text-sm tracking-wide py-4 rounded-xl shadow-[0_4px_20px_rgba(244,219,86,0.15)] mt-3 transition duration-150 active:scale-95 leading-none uppercase"
                  >
                    Play now
                  </button>
                </form>
              ) : (
                /* ================= SIGN IN FORM (Exactly requested!) ================= */
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">

                  {/* 1. USERNAME INPUT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-sans font-bold tracking-tight">
                      Username / Phone
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username or phone number"
                      className="w-full bg-[#14161e] text-white placeholder-[#515765] border border-[#212431] focus:border-[#e3ff36]/50 rounded-xl px-4 py-3 text-xs font-sans font-medium focus:outline-none transition duration-150"
                    />
                    {errors.username && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.username}</span>
                    )}
                  </div>

                  {/* 2. PASSWORD INPUT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-sans font-bold tracking-tight">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-[#14161e] text-white placeholder-[#515765] border border-[#212431] focus:border-[#e3ff36]/50 rounded-xl pl-4 pr-10 py-3 text-xs font-sans font-medium focus:outline-none transition duration-150"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setShowPassword(!showPassword);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-150"
                      >
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-rose-500 text-[10px] font-bold pl-1 font-sans">{errors.password}</span>
                    )}
                  </div>

                  {/* Remember Me Switch */}
                  <div className="flex flex-col gap-2.5 mt-1 select-none">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => { sound.playClick(); setRememberMe(!rememberMe); }}
                        className="sr-only"
                      />
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 ${rememberMe ? 'bg-[#e3ff36] border-[#e3ff36] text-black' : 'bg-[#14161e] border-[#212431] group-hover:border-gray-500'
                        }`}>
                        {rememberMe && <Check size={11} className="stroke-[3.5]" />}
                      </div>
                      <span className="text-[11px] text-[#8e92a2] group-hover:text-gray-300 font-sans font-medium">
                        Remember me on this device
                      </span>
                    </label>
                  </div>

                  {/* Submitting "Sign In" button */}
                  <button
                    type="submit"
                    className="w-full bg-[#f4db56] hover:bg-[#e4cb46] text-[#0e0c06] font-sans font-black text-sm tracking-wide py-4 rounded-xl shadow-[0_4px_20px_rgba(244,219,86,0.15)] mt-3 transition duration-150 active:scale-95 leading-none uppercase"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {/* Toggle Account mode links */}
              <div className="flex flex-col items-center gap-1.5 mt-2">
                <p className="text-xs text-[#8e92a2] font-sans font-bold">
                  {mode === 'register' ? (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          sound.playClick();
                          onToggleMode('login');
                          setErrors({});
                        }}
                        className="text-white hover:text-[#e3ff36] transition underline font-black"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => {
                          sound.playClick();
                          onToggleMode('register');
                          setErrors({});
                        }}
                        className="text-white hover:text-[#e3ff36] transition underline font-black"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </p>
                <button
                  onClick={() => sound.playClick()}
                  className="text-[#5c6170] hover:text-gray-400 text-[10px] font-sans font-bold transition underline mt-1"
                >
                  Terms & Conditions*
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: DUMMY OTP VERIFICATION ================= */}
          {step === 'otp' && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex flex-col items-center gap-5"
            >
              {/* Image lock */}
              <div className="w-32 h-32 flex items-center justify-center mt-2 mb-2">
                <img src={verifyImage} alt="Lock" className="w-full h-full object-contain" />
              </div>

              {/* Header */}
              <div className="text-center flex flex-col gap-1.5">
                <h2 className="text-white font-sans font-bold text-2xl tracking-tight leading-none">
                  Verify OTP Sent<br />to Your Phone!
                </h2>
                <p className="text-sm text-gray-400 font-sans mt-2">
                  Please enter the 6-digit code sent to<br />
                  <span className="text-gray-300">{countryCode} {phoneNumber}</span>.
                </p>
              </div>

              {/* Input Box Area */}
              <div className="bg-[#12141a] border border-[#1b1d24] rounded-[24px] p-5 w-full mt-2 flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-lg">📲</span>
                  <span className="text-white font-bold text-sm">OTP Sent</span>
                </div>

                {/* Form submit OTP */}
                <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-6">

                  {/* 6 Block Input Boxes */}
                  <div className="flex justify-center gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        type="text"
                        maxLength={1}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-[42px] h-[52px] text-center text-white text-xl font-mono font-medium bg-[#14161f] border border-[#ff9500]/30 focus:border-[#ff9500] rounded-lg focus:outline-none transition-all duration-150 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-[#ff9500] hover:bg-[#e68600] text-black font-sans font-bold text-[15px] py-3.5 rounded-full mt-2 transition duration-150 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="h-4.5 w-4.5 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Resend timer */}
              <div className="text-center mt-1">
                <p className="text-sm text-gray-500 font-sans font-medium underline cursor-pointer hover:text-gray-400">
                  Resend Code in 0:48s
                </p>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: HIGH-FIDELITY SUCCESS CONFIRMATION ================= */}
          {step === 'success' && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 150 }}
              className="p-6 flex flex-col items-center text-center gap-5"
            >

              {/* Green Shield Image */}
              <div className="w-32 h-32 flex items-center justify-center mt-2 mb-1">
                <img src={correctImage} alt="Success" className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(16,185,129,0.35)]" />
              </div>

              {/* Text content matching Image 3 */}
              <div className="flex flex-col gap-2 max-w-[320px]">
                <h1 className="text-white font-sans font-bold text-2xl leading-tight">
                  Your Phone number was successfully confirmed!
                </h1>
                <p className="text-[13px] text-gray-400 font-sans">
                  Let's start your amazing adventure<br />on Betkin.
                </p>
              </div>

              {/* Continue confirmation CTA Button */}
              <button
                onClick={handleFinalContinue}
                className="w-full bg-[#f4db56] hover:bg-[#e4cb46] text-[#0e0c06] font-sans font-bold text-[15px] py-3.5 rounded-full mt-3 transition duration-150 active:scale-95"
              >
                Continue
              </button>

              {/* Next Steps Box */}
              <div className="bg-[#12141a] border border-[#1b1d24] rounded-2xl p-4 w-full mt-2 text-left">
                <h3 className="text-white font-sans font-bold text-sm mb-3.5">Next Steps:</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1c24] p-2 rounded-full border border-[#252833]"><User size={16} className="text-gray-400" /></div>
                    <span className="text-gray-300 text-[13px] font-medium">Complete Your Profile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1c24] p-2 rounded-full border border-[#252833]"><Wallet size={16} className="text-gray-400" /></div>
                    <span className="text-gray-300 text-[13px] font-medium">Make Your First Deposit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1c24] p-2 rounded-full border border-[#252833]"><Gift size={16} className="text-gray-400" /></div>
                    <span className="text-gray-300 text-[13px] font-medium">Claim Your Welcome Bonus</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 4: HIGH-FIDELITY FAILURE CONFIRMATION ================= */}
          {step === 'failure' && (
            <motion.div
              key="step-failure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 150 }}
              className="p-6 flex flex-col items-center text-center gap-5"
            >

              {/* Red Shield Image */}
              <div className="w-32 h-32 flex items-center justify-center mt-2 mb-1">
                <img src={wrongImage} alt="Error" className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(239,68,68,0.35)]" />
              </div>

              {/* Text content matching Image 4 */}
              <div className="flex flex-col gap-2 max-w-[320px]">
                <h1 className="text-white font-sans font-bold text-2xl leading-tight">
                  Your Phone number was not confirmed!
                </h1>
                <p className="text-[13px] text-gray-400 font-sans">
                  Let's finish setting up your adventure<br />on Betkin.
                </p>
              </div>

              {/* Continue confirmation CTA Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setOtpCode(['', '', '', '', '', '']);
                  setStep('otp');
                }}
                className="w-full bg-[#f4db56] hover:bg-[#e4cb46] text-[#0e0c06] font-sans font-bold text-[15px] py-3.5 rounded-full mt-3 transition duration-150 active:scale-95"
              >
                Continue
              </button>

              <button className="text-[#ef4444] text-[13px] font-sans font-medium underline mt-1 hover:text-red-400 transition">
                Resend Confirmation SMS?
              </button>

              {/* Action Required Box */}
              <div className="bg-[#12141a] border border-[#1b1d24] rounded-2xl p-4 w-full mt-2 text-left">
                <h3 className="text-white font-sans font-bold text-sm mb-3.5">Action Required:</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1c24] p-2 rounded-full border border-[#252833] relative">
                      <MailX size={16} className="text-gray-400" />
                      <div className="absolute -bottom-1 -right-1 bg-[#ef4444] rounded-full p-0.5">
                        <X size={8} className="text-white" />
                      </div>
                    </div>
                    <span className="text-gray-300 text-[13px] font-medium">Check Messages and Spam for Code</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1c24] p-2 rounded-full border border-[#252833]"><RefreshCw size={16} className="text-gray-400" /></div>
                    <span className="text-gray-300 text-[13px] font-medium">Resend Confirmation (Above)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1c24] p-2 rounded-full border border-[#252833]"><Headphones size={16} className="text-gray-400" /></div>
                    <span className="text-gray-300 text-[13px] font-medium">Contact Betkin Support (If needed)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
