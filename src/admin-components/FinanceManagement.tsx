import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  XCircle, 
  Inbox, 
  Check, 
  X, 
  Search, 
  History, 
  DollarSign 
} from 'lucide-react';
import { FinancialRequest, Player } from '../adminTypes';

interface FinanceManagementProps {
  pendingRequests: FinancialRequest[];
  completedHistory: FinancialRequest[];
  players: Player[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onInstantDeposit: (username: string, amount: number, method: string) => void;
}

export default function FinanceManagement({
  pendingRequests,
  completedHistory,
  players,
  onApproveRequest,
  onRejectRequest,
  onInstantDeposit
}: FinanceManagementProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'quick-deposit'>('pending');
  const [playerInput, setPlayerInput] = useState('');
  const [amountInput, setAmountInput] = useState('1000');
  const [methodInput, setMethodInput] = useState('USDT (TRC-20)');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  const depositRequests = pendingRequests.filter(r => r.type === 'deposit');
  const withdrawalRequests = pendingRequests.filter(r => r.type === 'withdrawal');

  const handleQuickDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchingPlayer = players.find(
      p => p.username.toLowerCase() === playerInput.toLowerCase().trim()
    );
    if (!matchingPlayer) {
      alert(`Error: Player username "${playerInput}" not found in current clients.`);
      return;
    }
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid deposit amount greater than ₹0.");
      return;
    }
    onInstantDeposit(matchingPlayer.username, amt, methodInput);
    setPlayerInput('');
    setAmountInput('1000');
    alert(`Success: Instant authorization of ₹${amt} deposit for @${matchingPlayer.username}.`);
  };

  const filteredHistory = completedHistory.filter(txn => {
    return txn.username.toLowerCase().includes(searchHistoryQuery.toLowerCase()) || 
           txn.paymentMethod.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
           txn.id.toLowerCase().includes(searchHistoryQuery.toLowerCase());
  });

  return (
    <div className="bg-obsidian-900 border border-slate-800/80 rounded-xl p-5 shadow-xl min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-5 gap-3">
        <div>
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gold-500" />
            Financial Vault & Authorization Node
          </h2>
          <p className="text-slate-400 text-xs font-sans">
            Approve pending user cash inflows or process bank withdrawal claims immediately
          </p>
        </div>

        {/* Section selectors */}
        <div className="flex bg-obsidian-950 p-1 rounded-lg border border-slate-850 self-stretch sm:self-auto text-white">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
              activeTab === 'pending' 
                ? 'premium-gradient-glow text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Claims ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
              activeTab === 'completed' 
                ? 'premium-gradient-glow text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Historical Auditor ({completedHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('quick-deposit')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold font-display transition-all ${
              activeTab === 'quick-deposit' 
                ? 'premium-gradient-glow text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Express Credit Injection
          </button>
        </div>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Deposit Request Block */}
            <div className="bg-obsidian-950 p-4 rounded-xl border border-slate-850 flex flex-col min-h-[340px]">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-3">
                <span className="text-xs font-bold text-white font-display flex items-center gap-1.5 uppercase">
                  <ArrowUpRight className="h-4 w-4 text-emerald-neon animate-pulse" />
                  Deposit Authorization Queue
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-obsidian-900 border border-slate-800 px-2 py-0.5 rounded">
                  {depositRequests.length} pending
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[300px]">
                {depositRequests.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 italic">
                    <Inbox className="h-8 w-8 text-slate-700 mb-1" />
                    <p className="text-xs font-sans">No pending deposit approvals</p>
                  </div>
                ) : (
                  depositRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className="p-3 bg-obsidian-900 rounded-lg border border-slate-800/80 flex justify-between items-center hover:border-emerald-neon/30 transition-all group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-white">{req.username}</span>
                          <span className="text-[10px] text-slate-400 bg-obsidian-950 border border-slate-850 px-1.5 py-0.2 rounded font-mono">
                            {req.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans">
                          Requested: {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({req.id})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold font-display text-emerald-neon">
                          +₹{req.amount.toLocaleString()}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onApproveRequest(req.id)}
                            className="p-1 rounded bg-emerald-neon text-slate-950 hover:bg-emerald-400 transition-colors"
                            title="Approve / credit player balance"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onRejectRequest(req.id)}
                            className="p-1 rounded bg-rose-neon/15 text-rose-neon hover:bg-rose-neon/30 transition-colors"
                            title="Decline deposit claim"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Withdrawal Request Block */}
            <div className="bg-obsidian-950 p-4 rounded-xl border border-slate-850 flex flex-col min-h-[340px]">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-3">
                <span className="text-xs font-bold text-white font-display flex items-center gap-1.5 uppercase">
                  <ArrowDownRight className="h-4 w-4 text-rose-neon animate-pulse" />
                  Withdrawal Claim Settlement Queue
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-obsidian-900 border border-slate-800 px-2 py-0.5 rounded">
                  {withdrawalRequests.length} pending
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[300px]">
                {withdrawalRequests.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 italic">
                    <Inbox className="h-8 w-8 text-slate-700 mb-1" />
                    <p className="text-xs font-sans">No pending withdrawal settlements</p>
                  </div>
                ) : (
                  withdrawalRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className="p-3 bg-obsidian-900 rounded-lg border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-rose-neon/20 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-xs text-white">@{req.username}</span>
                          <span className="text-[9px] uppercase font-bold text-amber-500 border border-amber-500/20 px-1.5 py-0.2 rounded font-sans">
                            {req.paymentMethod}
                          </span>
                        </div>
                        {req.bankName && (
                          <div className="text-[10px] text-slate-300 font-mono">
                            Bank: {req.bankName} | Acc: {req.bankAccount}
                          </div>
                        )}
                        {!req.bankName && req.bankAccount && (
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]" title={req.bankAccount}>
                            ID: {req.bankAccount}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-500 font-sans">
                          Requested: {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({req.id})
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <span className="text-sm font-bold font-display text-rose-neon">
                          -₹{req.amount.toLocaleString()}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onApproveRequest(req.id)}
                            className="p-1 rounded bg-emerald-neon text-slate-950 hover:bg-emerald-400 transition-colors"
                            title="Approve / payoff user claim"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onRejectRequest(req.id)}
                            className="p-1 rounded bg-rose-neon/15 text-rose-neon hover:bg-rose-neon/30 transition-colors"
                            title="Deny and return locked credits"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <p className="text-xs text-slate-400 font-sans">
              Auditor logs representing processed or canceled casino deposits and user withdrawal settlements.
            </p>
            
            {/* Find in logs */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-600" />
              <input
                type="text"
                placeholder="Audit search username or method..."
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                className="w-full bg-obsidian-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-slate-300">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Target Client</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Payment Provider</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Settlement State</th>
                  <th className="py-2.5 px-3 text-right">Date Executed</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No matching transaction history entries found.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((txn) => (
                    <tr key={txn.id} className="border-b border-slate-850 hover:bg-slate-800/10 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[10px]">
                        {txn.id}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-white">
                        {txn.username}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          txn.type === 'deposit' ? 'text-emerald-neon bg-emerald-950/20' : 'text-slate-400 bg-slate-900'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {txn.paymentMethod}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        ₹{txn.amount.toLocaleString()}
                      </td>
                      <td className="py-[#0] px-3 text-center">
                        <span className={`inline-block px-2 text-[10px] font-bold rounded ${
                          txn.status === 'approved' ? 'bg-emerald-neon/10 text-emerald-neon' : 'bg-rose-500/10 text-rose-neon'
                        }`}>
                          ● {txn.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500">
                        {new Date(txn.requestedAt).toLocaleDateString()} {new Date(txn.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quick-deposit' && (
        <div className="max-w-md mx-auto bg-obsidian-950 p-6 rounded-xl border border-slate-850 shadow-lg my-4">
          <h3 className="text-sm font-bold font-display text-white mb-2 flex items-center gap-1.5 uppercase border-b border-slate-850 pb-2">
            <CheckCircle className="h-4 w-4 text-emerald-neon" />
            Inject Express Credits (Direct GGR)
          </h3>
          <p className="text-slate-400 text-xs font-sans mb-4">
            Bypass standard gateway gateways to immediately deposit funds into a verified player account. This represents manual offline deposits.
          </p>

          <form onSubmit={handleQuickDepositSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 font-sans">
                Verified Username
              </label>
              <input
                type="text"
                required
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                placeholder="e.g. chandu9cha"
                className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 font-sans">
                  Credit Value (₹)
                </label>
                <input
                  type="number"
                  min="5"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-gold-500 font-display font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 font-sans">
                  Method Tag
                </label>
                <select
                  value={methodInput}
                  onChange={(e) => setMethodInput(e.target.value)}
                  className="w-full bg-obsidian-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Manual UPI / Bank Cash">Manual UPI Bank</option>
                  <option value="USDT (TRC-20) Cashier">USDT Cashier</option>
                  <option value="Credit Card Manual Re-adjustment">Cards adjustment</option>
                  <option value="Promotional Voucher Cash">Voucher Cash</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl premium-gradient-glow text-white font-bold text-xs tracking-wide uppercase shadow-lg shadow-indigo-950/25 active:scale-[0.98] transition-all"
              >
                Apply Instant Inflow
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
