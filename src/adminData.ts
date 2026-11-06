import { Player, LiveBet, FinancialRequest, Agent, DailyStatistic } from './adminTypes';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'usr-1001',
    username: 'chandu9cha',
    email: 'chandu@auraoptix.com',
    balance: 12500.50,
    depositsTotal: 15000,
    withdrawalsTotal: 2000,
    status: 'online',
    country: 'India',
    registeredAt: '2026-01-15',
    lastLogin: '22 Jun 19:30',
    roundsPlayed: 1420,
    totalBet: 58000,
    totalWin: 47500,
    currentIp: '152.56.132.110',
    referrerCode: 'SUPER_VIP',
    ggr: 10500 // (58000 - 47500)
  },
  {
    id: 'usr-1002',
    username: 'gowtham_vip',
    email: 'gowtham.r@gmail.com',
    balance: 8430.00,
    depositsTotal: 9000,
    withdrawalsTotal: 1210,
    status: 'online',
    country: 'Singapore',
    registeredAt: '2026-02-11',
    lastLogin: '22 Apr 10:41',
    roundsPlayed: 850,
    totalBet: 24000,
    totalWin: 16780,
    currentIp: '162.158.88.112',
    referrerCode: 'AGENT_TEST',
    ggr: 7220
  },
  {
    id: 'usr-1003',
    username: 'alex_jackpot',
    email: 'alex.gold@yahoo.com',
    balance: 450.20,
    depositsTotal: 500,
    withdrawalsTotal: 0,
    status: 'online',
    country: 'Canada',
    registeredAt: '2026-06-01',
    lastLogin: '22 Jun 19:15',
    roundsPlayed: 120,
    totalBet: 2300,
    totalWin: 2250,
    currentIp: '198.8.85.121',
    referrerCode: 'SUPER_VIP',
    ggr: 50
  },
  {
    id: 'usr-1004',
    username: 'niko_bellic',
    email: 'niko@libertycity.it',
    balance: 0.00,
    depositsTotal: 3000,
    withdrawalsTotal: 2900,
    status: 'offline',
    country: 'Croatia',
    registeredAt: '2026-03-20',
    lastLogin: '21 Jun 14:22',
    roundsPlayed: 1100,
    totalBet: 34000,
    totalWin: 33900,
    currentIp: '94.250.12.18',
    referrerCode: 'AGENT_WHITE',
    ggr: 100
  },
  {
    id: 'usr-1005',
    username: 'harpreet_singh',
    email: 'harpreet.s@outlook.com',
    balance: 31200.00,
    depositsTotal: 50000,
    withdrawalsTotal: 15000,
    status: 'online',
    country: 'Malaysia',
    registeredAt: '2026-05-18',
    lastLogin: '22 Jun 18:45',
    roundsPlayed: 4500,
    totalBet: 198000,
    totalWin: 182000,
    currentIp: '115.135.244.92',
    referrerCode: 'AG_PARTNER',
    ggr: 16000
  },
  {
    id: 'usr-1006',
    username: 'testwhite',
    email: 'agent.white@gmail.com',
    balance: 350.00,
    depositsTotal: 1000,
    withdrawalsTotal: 650,
    status: 'offline',
    country: 'USA',
    registeredAt: '2026-04-01',
    lastLogin: '18 Jun 08:30',
    roundsPlayed: 50,
    totalBet: 1200,
    totalWin: 850,
    currentIp: '64.233.160.22',
    ggr: 350
  },
  {
    id: 'usr-1007',
    username: 'malicious_user',
    email: 'spammer999@proton.me',
    balance: 1.50,
    depositsTotal: 50,
    withdrawalsTotal: 0,
    status: 'banned',
    country: 'Nigeria',
    registeredAt: '2026-06-10',
    lastLogin: '19 Jun 01:12',
    roundsPlayed: 5,
    totalBet: 50,
    totalWin: 1.50,
    currentIp: '102.89.2.45',
    ggr: 48.50
  },
  {
    id: 'usr-1008',
    username: 'sarah_spin',
    email: 'sarah.spin@me.com',
    balance: 1420.00,
    depositsTotal: 2500,
    withdrawalsTotal: 1000,
    status: 'offline',
    country: 'Australia',
    registeredAt: '2026-02-28',
    lastLogin: '20 Jun 22:10',
    roundsPlayed: 1950,
    totalBet: 68000,
    totalWin: 66580,
    currentIp: '101.160.2.14',
    referrerCode: 'AGENT_TEST',
    ggr: 1420
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'ag-101',
    username: 'testwhite',
    activeUsersCount: 3,
    commissionRate: 5.00,
    totalDeposits: 5200,
    totalPaid: 260,
    lastLoginIp: '64.233.160.22',
    status: 'Active'
  },
  {
    id: 'ag-102',
    username: 'vip_affiliate',
    activeUsersCount: 12,
    commissionRate: 12.50,
    totalDeposits: 28400,
    totalPaid: 3550,
    lastLoginIp: '82.165.12.91',
    status: 'Active'
  },
  {
    id: 'ag-103',
    username: 'loto_agent88',
    activeUsersCount: 0,
    commissionRate: 7.00,
    totalDeposits: 0,
    totalPaid: 0,
    lastLoginIp: '190.23.44.11',
    status: 'Blocked'
  },
  {
    id: 'ag-104',
    username: 'asia_top_broker',
    activeUsersCount: 45,
    commissionRate: 15.00,
    totalDeposits: 148500,
    totalPaid: 22275,
    lastLoginIp: '210.14.88.23',
    status: 'Active'
  }
];

export const INITIAL_PENDING_REQUESTS: FinancialRequest[] = [
  {
    id: 'tx-2001',
    username: 'chandu9cha',
    amount: 1500,
    type: 'deposit',
    status: 'pending',
    paymentMethod: 'UPI / NetBanking',
    requestedAt: '2026-06-22T06:45:00-07:00'
  },
  {
    id: 'tx-2002',
    username: 'gowtham_vip',
    amount: 750,
    type: 'deposit',
    status: 'pending',
    paymentMethod: 'USDT (TRC-20)',
    requestedAt: '2026-06-22T07:11:00-07:00'
  },
  {
    id: 'tx-2003',
    username: 'harpreet_singh',
    amount: 4500,
    type: 'withdrawal',
    status: 'pending',
    paymentMethod: 'Bank Wire Transfer',
    bankName: 'MayBank Malaysia',
    bankAccount: '******98234-MB',
    requestedAt: '2026-06-22T05:12:00-07:00'
  },
  {
    id: 'tx-2004',
    username: 'alex_jackpot',
    amount: 300,
    type: 'withdrawal',
    status: 'pending',
    paymentMethod: 'Bitcoin (BTC)',
    bankAccount: 'bc1qxy2kg3ut78dhvv7lkjlkvvtwv6sh4pt4n4n08m',
    requestedAt: '2026-06-22T06:58:00-07:00'
  }
];

export const COMPLETED_TRANSACTION_HISTORY: FinancialRequest[] = [
  {
    id: 'tx-1901',
    username: 'chandu9cha',
    amount: 10000,
    type: 'deposit',
    status: 'approved',
    paymentMethod: 'UPI',
    requestedAt: '2026-06-20T12:00:00-07:00'
  },
  {
    id: 'tx-1902',
    username: 'gowtham_vip',
    amount: 2500,
    type: 'deposit',
    status: 'approved',
    paymentMethod: 'USDT (TRC20)',
    requestedAt: '2026-06-20T15:30:00-07:00'
  },
  {
    id: 'tx-1903',
    username: 'niko_bellic',
    amount: 1500,
    type: 'withdrawal',
    status: 'approved',
    paymentMethod: 'Bank Wire',
    bankName: 'Zagrebacka Banka',
    bankAccount: 'HR67-2480-****-9812',
    requestedAt: '2026-06-21T09:15:00-07:00'
  },
  {
    id: 'tx-1904',
    username: 'sarah_spin',
    amount: 500,
    type: 'withdrawal',
    status: 'approved',
    paymentMethod: 'Skrill',
    bankAccount: 'sarah.spin@me.com',
    requestedAt: '2026-06-21T18:40:00-07:00'
  },
  {
    id: 'tx-1905',
    username: 'malicious_user',
    amount: 1000,
    type: 'deposit',
    status: 'rejected',
    paymentMethod: 'Credit Card',
    requestedAt: '2026-06-19T01:00:00-07:00'
  }
];

export const PAST_DAYS_STATS: DailyStatistic[] = [
  { date: '16 Jun', bets: 42000, wins: 38500, ggr: 3500, deposits: 14200, withdrawals: 9500 },
  { date: '17 Jun', bets: 51200, wins: 44000, ggr: 7200, deposits: 18400, withdrawals: 8100 },
  { date: '18 Jun', bets: 48900, wins: 42300, ggr: 6600, deposits: 12100, withdrawals: 11500 },
  { date: '19 Jun', bets: 68500, wins: 59000, ggr: 9500, deposits: 24500, withdrawals: 14000 },
  { date: '20 Jun', bets: 71000, wins: 61500, ggr: 9500, deposits: 19500, withdrawals: 6000 },
  { date: '21 Jun', bets: 94000, wins: 81000, ggr: 13000, deposits: 32000, withdrawals: 18500 },
  { date: '22 Jun (Today)', bets: 125000, wins: 105000, ggr: 20000, deposits: 41000, withdrawals: 12000 }
];

export const INITIAL_BETS: LiveBet[] = [
  {
    id: 'bet-5001',
    username: 'chandu9cha',
    gameName: 'Book of Ra',
    gameType: 'Slots',
    betAmount: 50,
    multiplier: 4.25,
    winAmount: 212.50,
    timestamp: '22 Jun 19:29:55',
    status: 'won'
  },
  {
    id: 'bet-5002',
    username: 'gowtham_vip',
    gameName: 'European Roulette',
    gameType: 'Roulette',
    betAmount: 1000,
    multiplier: 0.00,
    winAmount: 0.00,
    timestamp: '22 Jun 19:29:41',
    status: 'lost'
  },
  {
    id: 'bet-5003',
    username: 'harpreet_singh',
    gameName: 'Aviator (Crash)',
    gameType: 'Crash',
    betAmount: 500,
    multiplier: 1.84,
    winAmount: 920.00,
    timestamp: '22 Jun 19:29:12',
    status: 'won'
  },
  {
    id: 'bet-5004',
    username: 'alex_jackpot',
    gameName: 'VIP Blackjack',
    gameType: 'Blackjack',
    betAmount: 250,
    multiplier: 2.00,
    winAmount: 500.00,
    timestamp: '22 Jun 19:28:45',
    status: 'won'
  },
  {
    id: 'bet-5005',
    username: 'harpreet_singh',
    gameName: 'Premier League: Arsenal vs Chelsea',
    gameType: 'Sports',
    betAmount: 12000,
    multiplier: 0,
    winAmount: 0,
    timestamp: '22 Jun 19:28:10',
    status: 'lost'
  }
];

export const SIMULATION_PLAYERS = [
  'chandu9cha', 'gowtham_vip', 'alex_jackpot', 'harpreet_singh', 'sarah_spin',
  'high_roller_matt', 'lucky_spin99', 'crypto_whale', 'zeus_gambler', 'roulette_queen'
];

export const SIMULATION_GAMES: { name: string; type: 'Slots' | 'Roulette' | 'Blackjack' | 'Crash' | 'Sports' }[] = [
  { name: 'Gates of Olympus', type: 'Slots' },
  { name: 'Sweet Bonanza', type: 'Slots' },
  { name: 'Lightning Roulette', type: 'Roulette' },
  { name: 'Mega Fire Blaze Roulette', type: 'Roulette' },
  { name: 'Infinite Blackjack', type: 'Blackjack' },
  { name: 'Speed Baccarat', type: 'Blackjack' },
  { name: 'Aviator (Crash)', type: 'Crash' },
  { name: 'Plinko', type: 'Crash' },
  { name: 'La Liga: Real Madrid vs Barcelona', type: 'Sports' },
  { name: 'Wimbledon: Alcaraz vs Djokovic', type: 'Sports' }
];

export const SYSTEM_BONUS_SETTINGS = {
  welcomeBonusPercent: 100,
  welcomeBonusMax: 500,
  wageringRequirements: 35,
  dailyCashbackPercent: 10,
  minDepositForBonus: 20,
  enabledReferralReward: 50
};

export const INITIAL_HERO_BANNERS = [
  {
    id: 'b-demo-1',
    title: 'SPIN & WIN SUNDAYS',
    subtitle: 'Get up to 500% Match Bonus + 200 Free Slots Reels Spins on registration',
    badgeText: 'MEGA OFFER',
    badgeColor: 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
    ctaText: 'Spin Now',
    imageUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/promotions/spin-and-win',
    isActive: true,
    order: 1,
    overlayOpacity: 45,
    textPosition: 'left'
  },
  {
    id: 'b-demo-2',
    title: 'LIVE SPORTS PREMIUM BOOK',
    subtitle: 'Place wagers on live football, tennis and cricket match events with elite ₹ odds',
    badgeText: 'LIVE WAGERING',
    badgeColor: 'bg-blue-500/10 border border-blue-500/30 text-blue-400',
    ctaText: 'Bet Pre-Match',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/sportsbook',
    isActive: true,
    order: 2,
    overlayOpacity: 45,
    textPosition: 'center'
  },
  {
    id: 'b-demo-3',
    title: 'ROYAL CASINO BLACKJACK VIP',
    subtitle: 'Immerse in direct high-stakes dealer card rooms with exclusive cashbacks',
    badgeText: 'VIP CLUB',
    badgeColor: 'bg-purple-500/10 border border-purple-500/30 text-purple-400',
    ctaText: 'Claim Seat',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/live-casino',
    isActive: true,
    order: 3,
    overlayOpacity: 45,
    textPosition: 'right'
  }
];

