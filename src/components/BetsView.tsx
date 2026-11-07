import React, { useMemo, useState } from 'react';
import { CircleDollarSign, Clock3, Gamepad2, Trophy, TrendingDown, TrendingUp } from 'lucide-react';
import { BetHistoryItem } from '../types';

interface BetsViewProps {
  history: BetHistoryItem[];
}

type BetFilter = 'all' | 'win' | 'loss';

const SAMPLE_BETS: BetHistoryItem[] = [
  { id: 'sample-crash-win', game: 'Crash', betAmount: 25, payoutAmount: 45, multiplier: 1.8, outcome: 'win', timestamp: '18:42:16' },
  { id: 'sample-mines-loss', game: 'Mines', betAmount: 10, payoutAmount: 0, multiplier: 0, outcome: 'loss', timestamp: '18:39:03' },
  { id: 'sample-ras-win', game: "Slots (Ra's Reckoning)", betAmount: 20, payoutAmount: 52.5, multiplier: 2.625, outcome: 'win', timestamp: '18:35:48' },
  { id: 'sample-crash-loss', game: 'Crash', betAmount: 15, payoutAmount: 0, multiplier: 0, outcome: 'loss', timestamp: '18:31:22' },
  { id: 'sample-mines-win', game: 'Mines', betAmount: 12.5, payoutAmount: 37.5, multiplier: 3, outcome: 'win', timestamp: '18:27:09' },
  { id: 'sample-abyss-loss', game: 'Slots (Book of Abyss)', betAmount: 5, payoutAmount: 0, multiplier: 0, outcome: 'loss', timestamp: '18:22:51' },
  { id: 'sample-crash-big-win', game: 'Crash', betAmount: 30, payoutAmount: 90, multiplier: 3, outcome: 'win', timestamp: '18:18:34' },
];

const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(amount);

export default function BetsView({ history }: BetsViewProps) {
  const [filter, setFilter] = useState<BetFilter>('all');
  const isPreview = history.length === 0;
  const sourceHistory = isPreview ? SAMPLE_BETS : history;

  const bets = useMemo(() => {
    const settledBets: BetHistoryItem[] = [];

    // A winning round is recorded as a stake debit followed by its payout.
    // Join that pair so the history shows one result for the actual bet.
    for (let index = 0; index < sourceHistory.length; index += 1) {
      const result = sourceHistory[index];
      const stake = sourceHistory[index + 1];

      if (result.outcome === 'win' && stake?.outcome === 'loss' && stake.game === result.game) {
        settledBets.push({ ...result, betAmount: stake.betAmount });
        index += 1;
      } else {
        settledBets.push(result);
      }
    }

    return settledBets;
  }, [sourceHistory]);

  const filteredBets = filter === 'all' ? bets : bets.filter(bet => bet.outcome === filter);
  const wins = bets.filter(bet => bet.outcome === 'win').length;
  const losses = bets.filter(bet => bet.outcome === 'loss').length;
  const totalWagered = bets.reduce((total, bet) => total + bet.betAmount, 0);
  const netResult = bets.reduce((total, bet) => (
    total + (bet.outcome === 'win' ? bet.payoutAmount - bet.betAmount : -bet.betAmount)
  ), 0);
  const winRate = bets.length ? Math.round((wins / bets.length) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#090a0e] text-white no-scrollbar pb-[65px] lg:pb-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
        <section className="relative overflow-hidden rounded-2xl border border-[#30303a] bg-gradient-to-br from-[#1b1c24] via-[#111219] to-[#0c0d12] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#b98b31]/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#c5a85c]">My activity</p>
              <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-white">Bets</h1>
              <p className="mt-1 max-w-[230px] text-[11px] leading-relaxed text-gray-400">Your game results, stakes, and payouts in one place.</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d2b66d]/25 bg-gradient-to-br from-[#d2b66d]/20 to-[#8a651e]/10 text-[#e5c67a] shadow-inner">
              <Trophy size={23} />
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/[0.06] bg-black/25 px-2.5 py-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-gray-500">Total bets</p>
              <p className="mt-1 text-base font-black text-white">{bets.length}</p>
              <p className="text-[9px] text-gray-500">{formatMoney(totalWagered)} wagered</p>
            </div>
            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-2.5 py-2">
              <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-emerald-300/70"><TrendingUp size={10} /> Wins</p>
              <p className="mt-1 text-base font-black text-emerald-300">{wins}</p>
              <p className="text-[9px] text-emerald-100/45">{winRate}% win rate</p>
            </div>
            <div className="rounded-xl border border-rose-400/10 bg-rose-400/[0.04] px-2.5 py-2">
              <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-rose-300/70"><TrendingDown size={10} /> Losses</p>
              <p className="mt-1 text-base font-black text-rose-300">{losses}</p>
              <p className="text-[9px] text-rose-100/45">{bets.length ? Math.round((losses / bets.length) * 100) : 0}% of bets</p>
            </div>
          </div>

          <div className="relative mt-2 flex items-center justify-between border-t border-white/[0.07] pt-2.5 text-[10px]">
            <span className="font-semibold text-gray-400">Net result</span>
            <span className={`font-black ${netResult >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {netResult >= 0 ? '+' : '−'}{formatMoney(Math.abs(netResult))}
            </span>
          </div>
        </section>

        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-black uppercase tracking-wide text-white">Recent Bets</h2>
          <span className="flex items-center gap-2 text-[10px] font-semibold text-gray-500">
            {isPreview && <span className="rounded-full border border-[#c5a85c]/20 bg-[#c5a85c]/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#d6bd78]">Sample</span>}
            {bets.length} results
          </span>
        </div>

        <div className="flex gap-2 rounded-xl border border-white/[0.06] bg-[#111319] p-1">
          {([
            ['all', 'All Bets'],
            ['win', 'Wins'],
            ['loss', 'Losses'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`flex-1 rounded-lg px-3 py-2 text-[10px] font-bold transition active:scale-[0.98] ${filter === value
                ? 'border border-[#d7bb73]/35 bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] text-[#0e0c06] shadow-[0_2px_8px_rgba(202,167,83,0.18)]'
                : 'border border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredBets.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#090a0c] shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
            <table aria-label="Bet history" className="w-full min-w-[440px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[21%]" />
                <col className="w-[18%]" />
                <col className="w-[19%]" />
              </colgroup>
              <thead className="bg-[#060708]">
                <tr className="border-b border-white/[0.08] text-[8px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  <th className="px-3 py-2.5">Game</th>
                  <th className="px-2 py-2.5">Time</th>
                  <th className="px-2 py-2.5 text-right">Bet</th>
                  <th className="px-3 py-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredBets.map((bet, index) => {
                  const isWin = bet.outcome === 'win';
                  const resultAmount = isWin ? bet.payoutAmount : bet.betAmount;

                  return (
                    <tr
                      key={`${bet.id}-${index}`}
                      className={`border-b border-white/[0.055] text-[9px] transition-colors hover:bg-[#24262b] ${index % 2 === 0 ? 'bg-[#111215]' : 'bg-[#17191d]'}`}
                    >
                      <td className="px-3 py-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md ${isWin ? 'bg-[#17462b] text-[#7cd890]' : 'bg-[#25262b] text-[#aeb2ba]'}`}>
                            <Gamepad2 size={11} />
                          </span>
                          <div className="min-w-0">
                            <p title={bet.game} className="truncate font-bold text-gray-100">{bet.game}</p>
                            <p className={`text-[7px] font-black uppercase tracking-wider ${isWin ? 'text-emerald-400' : 'text-gray-500'}`}>{isWin ? 'Win' : 'Loss'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-gray-400">
                        <span className="flex items-center gap-1"><Clock3 size={9} className="text-gray-600" />{bet.timestamp}</span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-right">
                        <span className="inline-flex items-center justify-end gap-1 font-semibold text-gray-200"><CircleDollarSign size={10} className="text-[#e7bd4c]" />{formatMoney(bet.betAmount)}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        <span className={`inline-flex items-center justify-end gap-1 font-semibold ${isWin ? 'text-emerald-300' : 'text-rose-300'}`}>
                          <CircleDollarSign size={10} className={isWin ? 'text-[#e7bd4c]' : 'text-gray-500'} />
                          {isWin ? '+' : '−'}{formatMoney(resultAmount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#30323a] bg-[#111319]/70 px-5 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c5a85c]/20 bg-[#c5a85c]/10 text-[#c5a85c]">
              <Gamepad2 size={22} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">{filter === 'all' ? 'No bets yet' : `No ${filter === 'win' ? 'wins' : 'losses'} yet`}</h3>
            <p className="mt-1 max-w-[230px] text-[11px] leading-relaxed text-gray-500">Play a game and your results will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
