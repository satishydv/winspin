export interface Player {
  id: string;
  username: string;
  email: string;
  balance: number;
  depositsTotal: number;
  withdrawalsTotal: number;
  status: 'online' | 'offline' | 'banned';
  country: string;
  registeredAt: string;
  lastLogin: string;
  roundsPlayed: number;
  totalBet: number;
  totalWin: number;
  currentIp: string;
  referrerCode?: string;
  ggr: number; // Gross Gaming Revenue = Bets - Wins
}

export interface LiveBet {
  id: string;
  username: string;
  gameName: string;
  gameType: 'Slots' | 'Roulette' | 'Blackjack' | 'Crash' | 'Sports';
  betAmount: number;
  multiplier: number;
  winAmount: number;
  timestamp: string; // ISO String or hours
  status: 'won' | 'lost';
}

export interface FinancialRequest {
  id: string;
  username: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  bankAccount?: string;
  bankName?: string;
  requestedAt: string;
}

export interface Agent {
  id: string;
  username: string;
  activeUsersCount: number;
  commissionRate: number; // e.g. 5 means 5%
  totalDeposits: number;
  totalPaid: number;
  lastLoginIp: string;
  status: 'Active' | 'Blocked';
}

export interface DailyStatistic {
  date: string;
  bets: number;
  wins: number;
  ggr: number;
  deposits: number;
  withdrawals: number;
}

export interface AlertNotification {
  id: string;
  type: 'info' | 'success' | 'warn' | 'danger';
  message: string;
  timestamp: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  clickUrl: string;
  order: number;
  ctaText?: string;
  overlayOpacity?: number; // 0 to 100
  textPosition?: 'left' | 'center' | 'right';
  badgeText?: string;
  badgeColor?: string;
}

