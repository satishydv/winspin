import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Users, Shield, Trophy, Flame, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES, CHAT_SENDER_TEMPLATES } from '../data';
import { sound } from '../utils/audio';

interface LiveChatsProps {
  username: string;
  avatarUrl: string;
  balance: number;
}

export default function LiveChats({ username, avatarUrl, balance }: LiveChatsProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputVal, setInputVal] = useState<string>('');
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chats to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Periodic bot chatter or winner simulation
  useEffect(() => {
    const triggerBotMessage = () => {
      // Pick random bot template
      const bot = CHAT_SENDER_TEMPLATES[Math.floor(Math.random() * CHAT_SENDER_TEMPLATES.length)];
      const phrase = bot.phrases[Math.floor(Math.random() * bot.phrases.length)];
      
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const newMsg: ChatMessage = {
        id: Math.random().toString(),
        username: bot.username,
        avatarIndex: bot.avatarIndex,
        message: phrase,
        timestamp: timeStr
      };

      setMessages(prev => [...prev.slice(-30), newMsg]); // Caps buffer limit to 30 messages
    };

    const triggerAnnouncements = () => {
      // Periodic Jackpot win system announcements to simulate live vibrant lobbies
      const r = Math.random();
      const winNames = ['JackpotHunter', 'BetN_Win', 'CoinSeeker', 'FortuneWolf', 'CrownClover', 'ApexSpins'];
      const luckyName = winNames[Math.floor(Math.random() * winNames.length)];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      let sysMsg: ChatMessage;

      if (r < 0.5) {
        // Crash winner announcement
        const mult = parseFloat((Math.random() * 20 + 2).toFixed(2));
        const bet = Math.floor(Math.random() * 40) + 5;
        const totalWin = parseFloat((bet * mult).toFixed(2));
        sysMsg = {
          id: Math.random().toString(),
          username: 'System',
          avatarIndex: 9,
          message: `🎉 ${luckyName} won $${totalWin} (${mult}x) on CRASH!`,
          isSystem: true,
          systemType: 'win',
          winAmount: totalWin,
          winMultiplier: mult,
          timestamp: timeStr
        };
      } else {
        // Slots winner announcement
        const mult = Math.random() > 0.8 ? 50 : 15;
        const bet = Math.floor(Math.random() * 20) + 10;
        const totalWin = parseFloat((bet * mult).toFixed(2));
        sysMsg = {
          id: Math.random().toString(),
          username: 'System',
          avatarIndex: 9,
          message: `💎 ${luckyName} hit a ${mult}x SUPER WIN of $${totalWin} on Slots!`,
          isSystem: true,
          systemType: 'win',
          winAmount: totalWin,
          winMultiplier: mult,
          timestamp: timeStr
        };
      }

      setMessages(prev => [...prev.slice(-30), sysMsg]);
    };

    const chatterInterval = setInterval(triggerBotMessage, 14000); // bot chatter every 14s
    const winInterval = setInterval(triggerAnnouncements, 24000); // jackpot wins every 24s

    return () => {
      clearInterval(chatterInterval);
      clearInterval(winInterval);
    };
  }, []);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sound.playClick();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      username: username || 'GuestPlayer',
      avatarIndex: 8, // Guest default avatar index
      message: inputVal,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Trigger simulated instant replies from bots
    setTimeout(() => {
      const responses = [
        `Nice message @${username}! Good luck today!`,
        `Are you spinning slots right now or crash?`,
        `Nice balance! Let is win some gold together 🍀`,
        `Totally agree!`,
        `Welcome to the lobby!`,
        `Yo, did anyone witness the 35x flight earlier?`
      ];
      const botResponses = [
        { name: 'DegenDave', avatarIndex: 0 },
        { name: 'LuckyDiva', avatarIndex: 1 },
        { name: 'MinesweeperPro', avatarIndex: 2 }
      ];

      const chosenBot = botResponses[Math.floor(Math.random() * botResponses.length)];
      const chosenReply = responses[Math.floor(Math.random() * responses.length)];
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      setMessages(prev => [
        ...prev, 
        {
          id: Math.random().toString(),
          username: chosenBot.name,
          avatarIndex: chosenBot.avatarIndex,
          message: chosenReply,
          timestamp: botTime
        }
      ]);
    }, 1500);
  };

  const AVATAR_COLORS = [
    'bg-amber-500 text-amber-950',
    'bg-purple-500 text-purple-950',
    'bg-teal-500 text-teal-950',
    'bg-indigo-500 text-indigo-950',
    'bg-orange-500 text-orange-950',
    'bg-sky-500 text-sky-950',
    'bg-pink-500 text-pink-950',
    'bg-lime-500 text-lime-950',
    'bg-gold-500 text-black',
  ];

  return (
    <div id="chats_container" className="flex flex-col h-full bg-dark-900 overflow-hidden relative">
      {/* Chats Section Header */}
      <div id="chats_header" className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-gold-accent" />
          <div>
            <h2 className="text-sm font-display font-bold text-white tracking-wide leading-none">PUBLIC ROOM</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Online Lobbies • English</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] text-emerald-400 font-bold font-mono">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          482 Online
        </div>
      </div>

      {/* Messages Scrolling Hub */}
      <div 
        ref={chatScrollRef}
        id="chats_scroll"
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 no-scrollbar bg-[radial-gradient(ellipse_at_bottom,rgba(250,204,21,0.02),transparent)]"
      >
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-2xs md:text-xs flex flex-col text-teal-300 gap-1 shadow-inner relative overflow-hidden"
              >
                {/* Visual sparkly vector indicator inside systems */}
                <div className="absolute right-2 top-2 opacity-10">
                  <Trophy size={20} className="text-yellow-400" />
                </div>
                <div className="flex items-center gap-1.5 font-bold text-gold-accent">
                  <Sparkles size={12} className="text-gold-accent" />
                  <span>WINNER BROADCAST</span>
                  <span className="text-[9px] text-gray-500 font-normal font-mono ml-auto">{msg.timestamp}</span>
                </div>
                <p className="text-white font-medium text-[11px] leading-snug">{msg.message}</p>
              </motion.div>
            );
          }

          const avatarBg = AVATAR_COLORS[msg.avatarIndex % AVATAR_COLORS.length];
          const isMe = msg.username === username;

          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: isMe ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-2.5 items-start max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {/* Mini rounded letter avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 select-none ${avatarBg}`}>
                {msg.username.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-1.5 text-[10px] ${isMe ? 'justify-end' : ''}`}>
                  <span className={`font-semibold ${isMe ? 'text-gold-accent' : 'text-gray-400'}`}>
                    {msg.username}
                  </span>
                  
                  {msg.username === 'Jackpot_King' && (
                    <span className="bg-amber-500/10 text-gold-accent border border-gold-500/20 px-1 py-0.2 rounded-md text-[8px] font-bold">VIP 9</span>
                  )}

                  <span className="text-gray-600 font-mono text-[9px]">{msg.timestamp}</span>
                </div>
                
                {/* Bubble content */}
                <div className={`px-3 py-2 text-xs rounded-2xl leading-normal
                  ${isMe 
                    ? 'bg-gold-500 text-black border border-gold-400 rounded-tr-none font-medium' 
                    : 'bg-dark-800 text-gray-200 border border-dark-700/80 rounded-tl-none'
                  }
                `}>
                  <p>{msg.message}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Typing Footer Action Bar */}
      <div id="chats_action_footer" className="p-3 bg-dark-950 border-t border-dark-800 flex gap-2 items-center sticky bottom-0 z-20 pb-[80px] lg:pb-3">
        <input
          type="text"
          placeholder="Send a chat message..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-dark-900 border border-dark-700 rounded-xl h-10 px-3 text-xs text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 placeholder-gray-500"
        />
        <button
          onClick={handleSend}
          className="h-10 w-10 shrink-0 bg-gold-500 hover:bg-gold-400 text-dark-950 rounded-xl flex items-center justify-center transition active:scale-95 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
        >
          <Send size={14} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
