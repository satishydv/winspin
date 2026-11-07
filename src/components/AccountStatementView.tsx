import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Search, CreditCard, Gamepad2, Dribbble, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { sound } from '../utils/audio';

type Tab = 'wallet' | 'casino' | 'sports';

export default function AccountStatementView() {
  const [activeTab, setActiveTab] = useState<Tab>('wallet');
  const [fromDate, setFromDate] = useState('2026-06-11');
  const [toDate, setToDate] = useState('2026-07-11');

  const transactions = [
    {
      id: 'TXN_8F4348C1CFED_178367',
      date: '10 Jul 26',
      time: '03:50 PM',
      desc: 'Auto-credited via RAZORPAY',
      type: 'deposit',
      amount: 500,
    },
    {
      id: 'TXN_FB2F28D6CCE5_178366',
      date: '10 Jul 26',
      time: '12:12 PM',
      desc: 'Auto-credited via RAZORPAY',
      type: 'deposit',
      amount: 800,
    },
    {
      id: 'WD#135',
      date: '10 Jul 26',
      time: '11:09 AM',
      desc: 'Withdrawal — HDFC (****9104)',
      type: 'withdrawal',
      amount: 200,
    },
    {
      id: 'WD#134',
      date: '10 Jul 26',
      time: '11:07 AM',
      desc: 'Withdrawal — HDFC (****9104)',
      type: 'withdrawal',
      amount: 150,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0b0f] text-white font-sans overflow-y-auto no-scrollbar p-4 lg:p-6 pb-[65px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e222d] to-[#12141a] border border-[#2a2e39] flex items-center justify-center shrink-0">
          <div className="flex items-end gap-1 h-4">
            <div className="w-1.5 h-full bg-cyan-400 rounded-sm"></div>
            <div className="w-1.5 h-3/4 bg-fuchsia-400 rounded-sm"></div>
            <div className="w-1.5 h-1/2 bg-yellow-400 rounded-sm"></div>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white leading-none mb-1">Account Statement</h1>
          <p className="text-[10px] text-gray-500 font-medium">11 Jun 2026 — 11 Jul 2026</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#12141a] border border-[#1e222d] rounded-xl p-1 mb-6 shadow-inner">
        <button
          onClick={() => { sound.playClick(); setActiveTab('wallet'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all duration-300 ${
            activeTab === 'wallet' ? 'bg-gradient-to-b from-[#f5d996] via-[#dca337] to-[#b88320] text-[#1c1400] shadow-[0_2px_10px_rgba(220,163,55,0.3)] border border-[#ffeaad]' : 'text-gray-400 hover:text-white bg-transparent border border-transparent hover:bg-white/5'
          }`}
        >
          <CreditCard size={14} className={activeTab === 'wallet' ? 'text-[#1c1400] stroke-[2.5]' : 'text-cyan-400'} />
          Wallet
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('casino'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all duration-300 ${
            activeTab === 'casino' ? 'bg-gradient-to-b from-[#f5d996] via-[#dca337] to-[#b88320] text-[#1c1400] shadow-[0_2px_10px_rgba(220,163,55,0.3)] border border-[#ffeaad]' : 'text-gray-400 hover:text-white bg-transparent border border-transparent hover:bg-white/5'
          }`}
        >
          <Gamepad2 size={14} className={activeTab === 'casino' ? 'text-[#1c1400] stroke-[2.5]' : 'text-fuchsia-400'} />
          Casino
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('sports'); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all duration-300 ${
            activeTab === 'sports' ? 'bg-gradient-to-b from-[#f5d996] via-[#dca337] to-[#b88320] text-[#1c1400] shadow-[0_2px_10px_rgba(220,163,55,0.3)] border border-[#ffeaad]' : 'text-gray-400 hover:text-white bg-transparent border border-transparent hover:bg-white/5'
          }`}
        >
          <Dribbble size={14} className={activeTab === 'sports' ? 'text-[#1c1400] stroke-[2.5]' : 'text-red-400'} />
          Sports
        </button>
      </div>

      {/* Date Filters */}
      <div className="bg-gradient-to-br from-[#16181f] to-[#12141a] border border-[#1e222d] shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-2xl p-4 mb-5 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">From</label>
          <div className="relative group">
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-[#0d0e13] border border-[#262a36] rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:border-[#dca337] focus:ring-1 focus:ring-[#dca337]/50 focus:outline-none transition-all [color-scheme:dark] group-hover:border-[#383d4f]"
            />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">To</label>
          <div className="relative group">
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-[#0d0e13] border border-[#262a36] rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:border-[#dca337] focus:ring-1 focus:ring-[#dca337]/50 focus:outline-none transition-all [color-scheme:dark] group-hover:border-[#383d4f]"
            />
          </div>
        </div>
        <button 
          onClick={() => sound.playClick()}
          className="w-full md:w-auto bg-gradient-to-b from-[#f5d996] via-[#dca337] to-[#b88320] hover:from-[#fce0a5] hover:via-[#eaba4c] hover:to-[#c7912a] text-[#1c1400] font-black tracking-wide text-xs px-7 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(220,163,55,0.25)] flex items-center justify-center gap-2 shrink-0 h-[42px] border border-[#ffeaad] active:scale-95"
        >
          <Search size={14} className="text-[#1c1400] stroke-[2.5]" />
          Search
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gradient-to-br from-[#16181f] to-[#101217] border border-[#212530] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-[#313645] transition-all">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#10b981]/5 rounded-full blur-xl group-hover:bg-[#10b981]/10 transition-colors" />
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Deposited</span>
          <span className="text-[15px] font-black text-[#10b981] tracking-tight font-mono relative z-10">₹1,300</span>
        </div>
        <div className="bg-gradient-to-br from-[#16181f] to-[#101217] border border-[#212530] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-[#313645] transition-all">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-colors" />
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Withdrawn</span>
          <span className="text-[15px] font-black text-red-500 tracking-tight font-mono relative z-10">₹350</span>
        </div>
        <div className="bg-gradient-to-br from-[#16181f] to-[#101217] border border-[#212530] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-[#313645] transition-all">
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#dca337]/5 rounded-full blur-xl group-hover:bg-[#dca337]/10 transition-colors" />
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Net</span>
          <span className="text-[15px] font-black text-white tracking-tight font-mono relative z-10">₹950</span>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2.5 mb-4">
        <button className="px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#1c1f28] to-[#14161c] text-gray-300 hover:text-white text-[10px] font-bold border border-[#2a2e39] hover:border-[#383d4f] transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          13 Approved
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#1c1f28] to-[#14161c] text-gray-300 hover:text-white text-[10px] font-bold border border-[#2a2e39] hover:border-[#383d4f] transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          10 Rejected
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-[#0f1116] border border-[#212530] rounded-2xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#dca337]/20 to-transparent z-10" />
        
        {/* Table Header */}
        <div className="flex justify-between items-center p-3.5 border-b border-[#212530] bg-[#16181f]/80 backdrop-blur-sm relative z-20">
          <h2 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3.5 bg-gradient-to-b from-[#f5d996] to-[#b88320] rounded-full inline-block"></span>
            Deposits & Withdrawals
          </h2>
          <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-gradient-to-b from-[#f5d996]/10 to-[#b88320]/10 text-[#dca337] border border-[#dca337]/30 tracking-wider shadow-inner">
            23 RECORDS
          </span>
        </div>
        
        {/* Table Columns */}
        <div className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[100px_1fr_150px] gap-2 px-4 py-2.5 border-b border-[#212530] bg-[#0a0b0f]/80 relative z-20">
          <span className="text-[8.5px] font-black text-gray-500 uppercase tracking-widest">Date</span>
          <span className="text-[8.5px] font-black text-gray-500 uppercase tracking-widest">Description</span>
          <span className="text-[8.5px] font-black text-gray-500 uppercase tracking-widest text-right">Ref / Txn</span>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col relative z-20">
          {transactions.map((txn, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[100px_1fr_150px] gap-2 px-4 py-3.5 border-b border-[#212530]/60 last:border-0 hover:bg-[#181a22] transition-all items-center group cursor-default"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11.5px] font-bold text-gray-200 font-mono tracking-tight group-hover:text-white transition-colors">{txn.date}</span>
                <span className="text-[9px] font-bold text-gray-500">{txn.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${txn.type === 'deposit' ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {txn.type === 'deposit' ? (
                    <ArrowDownRight size={13} className="stroke-[2.5]" />
                  ) : (
                    <ArrowUpRight size={13} className="stroke-[2.5]" />
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-300 truncate group-hover:text-gray-100 transition-colors">{txn.desc}</span>
              </div>
              <div className="text-[10px] font-mono font-medium text-gray-400 group-hover:text-gray-300 text-right truncate transition-colors" title={txn.id}>
                {txn.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
