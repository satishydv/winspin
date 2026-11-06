import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Ban, 
  CheckCircle, 
  Edit, 
  MapPin, 
  Coins, 
  Tv, 
  TrendingUp, 
  UserPlus, 
  UserX, 
  DollarSign, 
  Filter, 
  TrendingDown, 
  UserCheck 
} from 'lucide-react';
import { Player, Agent } from '../adminTypes';

interface PlayerManagementProps {
  players: Player[];
  agents: Agent[];
  onUpdatePlayerStatus: (playerId: string, newStatus: 'online' | 'offline' | 'banned') => void;
  onAdjustPlayerBalance: (playerId: string, adjustmentAmount: number) => void;
  onAddPlayer: (newPlayer: Player) => void;
  onAddAgent: (newAgent: Agent) => void;
  activeSubTab?: 'players' | 'agents' | 'ips';
  isAddingPlayerOverride?: boolean;
  highlightBalanceTransfer?: boolean;
}

export default function PlayerManagement({
  players,
  agents,
  onUpdatePlayerStatus,
  onAdjustPlayerBalance,
  onAddPlayer,
  onAddAgent,
  activeSubTab = 'players',
  isAddingPlayerOverride = false,
  highlightBalanceTransfer = false
}: PlayerManagementProps) {
  const [subTab, setSubTab] = useState<'players' | 'agents' | 'ips'>('players');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Balance adjust modal-like inline state
  const [adjustingPlayerId, setAdjustingPlayerId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('500');

  // New Client Registration Form
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newRegName, setNewRegName] = useState('');
  const [newRegEmail, setNewRegEmail] = useState('');
  const [newRegCountry, setNewRegCountry] = useState('India');
  const [newRegBalance, setNewRegBalance] = useState('1000');

  // Sync props to internal state
  React.useEffect(() => {
    if (activeSubTab) {
      setSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  React.useEffect(() => {
    setIsAddingPlayer(isAddingPlayerOverride);
  }, [isAddingPlayerOverride]);

  React.useEffect(() => {
    if (highlightBalanceTransfer) {
      setSubTab('players');
      if (players.length > 0) {
        setAdjustingPlayerId(players[0].id);
        setAdjustAmount('500');
      }
    } else {
      setAdjustingPlayerId(null);
    }
  }, [highlightBalanceTransfer, players]);

  // New Agent creation Form
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgName, setNewAgName] = useState('');
  const [newAgComm, setNewAgComm] = useState('10.0');

  const countries = ['All', ...Array.from(new Set(players.map(p => p.country)))];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          player.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.currentIp.includes(searchQuery);
    const matchesCountry = countryFilter === 'All' || player.country === countryFilter;
    const matchesStatus = statusFilter === 'All' || player.status === statusFilter;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const handleApplyBalance = (playerId: string) => {
    const amt = parseFloat(adjustAmount);
    if (!isNaN(amt)) {
      onAdjustPlayerBalance(playerId, amt);
      setAdjustingPlayerId(null);
    }
  };

  const handleRegisterPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegName.trim()) return;

    const registeredPlayer: Player = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      username: newRegName.trim().toLowerCase(),
      email: newRegEmail || `${newRegName.trim()}@temp.com`,
      balance: parseFloat(newRegBalance) || 0,
      depositsTotal: parseFloat(newRegBalance) || 0,
      withdrawalsTotal: 0,
      status: 'online',
      country: newRegCountry,
      registeredAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Just registered',
      roundsPlayed: 0,
      totalBet: 0,
      totalWin: 0,
      currentIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.12.54`,
      ggr: 0
    };

    onAddPlayer(registeredPlayer);
    setNewRegName('');
    setNewRegEmail('');
    setNewRegBalance('1000');
    setIsAddingPlayer(false);
  };

  const handleRegisterAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgName.trim()) return;

    const registeredAgent: Agent = {
      id: `ag-${Date.now().toString().slice(-3)}`,
      username: newAgName.trim().toLowerCase(),
      activeUsersCount: 0,
      commissionRate: parseFloat(newAgComm) || 5.0,
      totalDeposits: 0,
      totalPaid: 0,
      lastLoginIp: '127.0.0.1',
      status: 'Active'
    };

    onAddAgent(registeredAgent);
    setNewAgName('');
    setIsAddingAgent(false);
  };

  return (
    <div className="bg-obsidian-900 border border-slate-800/80 rounded-xl p-5 shadow-xl min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-5 gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gold-500" />
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              Identity & Relationship Hub
            </h2>
            <p className="text-slate-400 text-xs font-sans">
              Manage client records, ban state violators, track IP addresses, and evaluate agent networks
            </p>
          </div>
        </div>

        {/* Dashboard inner Switcher */}
        <div className="flex bg-obsidian-950 p-1 rounded-lg border border-slate-850 self-stretch sm:self-auto text-white">
          <button
            onClick={() => setSubTab('players')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
              subTab === 'players' 
                ? 'premium-gradient-glow text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clients ({players.length})
          </button>
          <button
            onClick={() => setSubTab('agents')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
              subTab === 'agents' 
                ? 'premium-gradient-glow text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Agent Hierarchy ({agents.length})
          </button>
          <button
            onClick={() => setSubTab('ips')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
              subTab === 'ips' 
                ? 'premium-gradient-glow text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IP Tracking List
          </button>
        </div>
      </div>

      {subTab === 'players' && (
        <div className="space-y-4">
          {/* Controls & Filters row */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <div className="flex flex-wrap flex-1 items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search user, email, or current IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/80 transition-colors font-sans"
                />
              </div>

              {/* Country Filter */}
              <div className="flex items-center gap-1.5 bg-obsidian-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer font-sans"
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-obsidian-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer font-sans"
                >
                  <option value="All">All Statuses</option>
                  <option value="online">Online Only</option>
                  <option value="offline">Offline Only</option>
                  <option value="banned">Banned Only</option>
                </select>
              </div>
            </div>

            {/* Register New Client Trigger */}
            <button
              onClick={() => setIsAddingPlayer(!isAddingPlayer)}
              className="px-4 py-2 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register Casino Client
            </button>
          </div>

          {/* New Register Form */}
          {isAddingPlayer && (
            <form onSubmit={handleRegisterPlayer} className="p-4 bg-obsidian-950 rounded-xl border border-emerald-neon/20 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Client ID / Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. max_jackpot"
                  value={newRegName}
                  onChange={(e) => setNewRegName(e.target.value)}
                  className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-sans outline-none focus:border-emerald-neon"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. max@auraoptix.com"
                  value={newRegEmail}
                  onChange={(e) => setNewRegEmail(e.target.value)}
                  className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-sans outline-none focus:border-emerald-neon"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Country</label>
                  <select
                    value={newRegCountry}
                    onChange={(e) => setNewRegCountry(e.target.value)}
                    className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-sans outline-none focus:border-emerald-neon"
                  >
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Canada">Canada</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="USA">USA</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Int. Balance (₹)</label>
                  <input
                    type="number"
                    value={newRegBalance}
                    onChange={(e) => setNewRegBalance(e.target.value)}
                    className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-sans outline-none focus:border-emerald-neon"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2 text-xs">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wide transition-all shadow-md active:scale-[0.98]"
                >
                  Create Client
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingPlayer(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors border border-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Player Grid / List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-display font-medium">
                  <th className="py-3 px-3">Username</th>
                  <th className="py-3 px-3">Country</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Available Balance</th>
                  <th className="py-3 px-3 text-right">Deposits / Withdrawals</th>
                  <th className="py-3 px-3 text-right">Total Bet GGR</th>
                  <th className="py-3 px-3 text-center">Rounds</th>
                  <th className="py-3 px-3 text-right">Actions / Adjustments</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500 italic">
                      No clients match your filter configuration.
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map(player => (
                    <tr 
                      key={player.id} 
                      className={`border-b border-slate-850 hover:bg-slate-800/20 transition-all ${
                        player.status === 'banned' ? 'opacity-40 bg-rose-950/5' : ''
                      }`}
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-semibold text-white">{player.username}</p>
                          <p className="text-[10px] text-slate-500">{player.email}</p>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-600" />
                          {player.country}
                        </div>
                      </td>

                      {/* Online status */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          player.status === 'online' ? 'bg-emerald-500/10 text-emerald-neon border border-emerald-neon/15' :
                          player.status === 'offline' ? 'bg-slate-500/10 text-slate-400 border border-slate-800' :
                          'bg-rose-500/10 text-rose-neon border border-rose-neon/15 animate-pulse'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            player.status === 'online' ? 'bg-emerald-neon' :
                            player.status === 'offline' ? 'bg-slate-500' :
                            'bg-rose-neon'
                          }`} />
                          {player.status}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold font-display text-white">
                          ₹{player.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        {player.referrerCode && (
                          <p className="text-[9px] text-amber-500 font-sans">Code: {player.referrerCode}</p>
                        )}
                      </td>

                      {/* Deposits & Withdrawals total */}
                      <td className="py-3 px-3 text-right">
                        <div className="text-[11px]">
                          <span className="text-emerald-neon font-semibold">₹{player.depositsTotal.toLocaleString()}</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-rose-neon font-semibold">₹{player.withdrawalsTotal.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Net revenue profit tracker */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {player.ggr >= 0 ? (
                            <span className="text-emerald-neon font-bold font-display">+₹{player.ggr.toLocaleString()}</span>
                          ) : (
                            <span className="text-rose-neon font-bold font-display">-₹{Math.abs(player.ggr).toLocaleString()}</span>
                          )}
                        </div>
                      </td>

                      {/* Rounds */}
                      <td className="py-3 px-3 text-center text-slate-400 font-display">
                        {player.roundsPlayed}
                      </td>

                      {/* Admin Tools adjustment trigger */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {adjustingPlayerId === player.id ? (
                            <div className="flex items-center gap-1 bg-obsidian-950 p-1 rounded border border-slate-800 animate-fadeIn">
                              <input
                                type="number"
                                value={adjustAmount}
                                onChange={(e) => setAdjustAmount(e.target.value)}
                                className="w-16 bg-transparent border-none text-xs text-white outline-none text-right font-display"
                                placeholder="Amount"
                              />
                              <button
                                onClick={() => handleApplyBalance(player.id)}
                                className="px-1.5 py-0.5 bg-emerald-neon text-slate-950 font-bold rounded text-[10px] hover:bg-emerald-400 transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => onAdjustPlayerBalance(player.id, -parseFloat(adjustAmount))}
                                className="px-1.5 py-0.5 bg-rose-neon text-slate-950 font-bold rounded text-[10px] hover:bg-rose-400 transition-colors"
                              >
                                Dec
                              </button>
                              <button
                                onClick={() => setAdjustingPlayerId(null)}
                                className="px-1 px-1.5 text-slate-500 hover:text-white text-[10px]"
                              >
                                x
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setAdjustingPlayerId(player.id);
                                  setAdjustAmount('500');
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                                title="Adjust balance logs"
                              >
                                <Coins className="h-3.5 w-3.5" />
                              </button>
                              {player.status === 'banned' ? (
                                <button
                                  onClick={() => onUpdatePlayerStatus(player.id, 'offline')}
                                  className="p-1 rounded bg-emerald-neon/10 border border-emerald-neon/30 text-emerald-neon hover:bg-emerald-neon/20 transition-all"
                                  title="Lift user ban"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => onUpdatePlayerStatus(player.id, 'banned')}
                                  className="p-1 rounded bg-rose-neon/10 border border-rose-neon/30 text-rose-neon hover:bg-rose-neon/20 transition-all"
                                  title="Ban client indefinitely"
                                >
                                  <Ban className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'agents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 font-sans">
              Track multi-level tier network referrers, verify deposit traffic commissions, and authorize pay outs.
            </p>
            <button
              onClick={() => setIsAddingAgent(!isAddingAgent)}
              className="px-4 py-2 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Appoint New Agent
            </button>
          </div>

          {isAddingAgent && (
            <form onSubmit={handleRegisterAgent} className="p-4 bg-obsidian-950 rounded-xl border border-amber-500/20 flex flex-wrap gap-4 items-end animate-fadeIn">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Agent Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. agent_white"
                  value={newAgName}
                  onChange={(e) => setNewAgName(e.target.value)}
                  className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-sans outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Proposed Commission %</label>
                <input
                  type="number"
                  placeholder="e.g. 5.0"
                  step="0.1"
                  value={newAgComm}
                  onChange={(e) => setNewAgComm(e.target.value)}
                  className="w-32 bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-sans outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wide transition-all shadow-md active:scale-[0.98]"
                >
                  Confirm Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAgent(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors border border-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Agents List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-display font-medium">
                  <th className="py-3 px-3">Agent User</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Referrals Active</th>
                  <th className="py-3 px-3 text-right">Commission Rate</th>
                  <th className="py-3 px-3 text-right">Total Managed Deposits</th>
                  <th className="py-3 px-3 text-right">Calculated Accrued GGR</th>
                  <th className="py-3 px-3 text-right">Total Paid Fees (₹)</th>
                  <th className="py-3 px-3 text-right">Last login IP</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent.id} className="border-b border-slate-850 hover:bg-slate-800/20 transition-all">
                    <td className="py-3 px-3 font-semibold text-white">
                      {agent.username}
                      <p className="text-[10px] text-slate-500 font-normal">{agent.id}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        agent.status === 'Active' ? 'bg-emerald-500/15 text-emerald-neon' : 'bg-rose-500/15 text-rose-neon'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-200">
                      {agent.activeUsersCount} players
                    </td>
                    <td className="py-3 px-3 text-right text-amber-500 font-bold font-display">
                      {agent.commissionRate.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-200 font-display">
                      ₹{agent.totalDeposits.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-neon font-display font-semibold">
                      ₹{((agent.totalDeposits * (agent.commissionRate / 100)) * 1.8).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-3 text-right font-display text-slate-400">
                      ₹{agent.totalPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                      {agent.lastLoginIp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'ips' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-sans">
            Real-time IP security telemetry. Quickly spot multiple accounts logging from the exact same residential or proxy networks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User IPs */}
            <div className="bg-obsidian-950 p-4 rounded-xl border border-slate-850">
              <h3 className="text-sm font-bold font-display text-white mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-neon animate-ping" />
                Recent User Client IPs
              </h3>
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold">
                    <th className="py-2">User</th>
                    <th className="py-2 text-right">IP Address</th>
                    <th className="py-2 text-right">Last Login</th>
                    <th className="py-2 text-center">Security Status</th>
                  </tr>
                </thead>
                <tbody>
                  {players.slice(0, 6).map(player => (
                    <tr key={player.id} className="border-b border-slate-850/60 hover:bg-slate-800/10 transition-colors">
                      <td className="py-2 font-medium text-slate-300">{player.username}</td>
                      <td className="py-2 text-right font-mono text-rose-400 font-medium">{player.currentIp}</td>
                      <td className="py-2 text-right text-slate-400 text-[11px]">{player.lastLogin}</td>
                      <td className="py-2 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-neon">
                          Online
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Agent IPs */}
            <div className="bg-obsidian-950 p-4 rounded-xl border border-slate-850">
              <h3 className="text-sm font-bold font-display text-white mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Affiliate & Agent Login IPs
              </h3>
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold">
                    <th className="py-2">Agent User</th>
                    <th className="py-2 text-right">Primary IP Address</th>
                    <th className="py-2 text-right font-normal">Accrued Commission</th>
                    <th className="py-2 text-center">Authorized Access</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map(agent => (
                    <tr key={agent.id} className="border-b border-slate-850/60 hover:bg-slate-800/10 transition-colors">
                      <td className="py-2 font-medium text-slate-300">{agent.username}</td>
                      <td className="py-2 text-right font-mono text-amber-400 font-medium">{agent.lastLoginIp}</td>
                      <td className="py-2 text-right text-emerald-neon font-display font-semibold">₹{agent.totalPaid}</td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                          agent.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-neon'
                        }`}>
                          {agent.status === 'Active' ? 'Whitelisted' : 'Geo-Blocked'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
