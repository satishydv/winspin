export type GameType = 'home' | 'crash' | 'mines' | 'slots' | 'promo' | 'chats' | 'history' | 'casino' | 'accounts' | 'account_statement' | 'register' | 'login' | '404' | 'sports' | 'search' | 'admin' | 'withdraw' | 'deposit';

export interface UserProfile {
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  balance: number;
  bonus?: number;
}

export interface BetHistoryItem {
  id: string;
  game: string;
  betAmount: number;
  payoutAmount: number;
  multiplier: number;
  outcome: 'win' | 'loss';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  avatarIndex: number;
  message: string;
  timestamp: string;
  isSystem?: boolean;
  systemType?: 'win' | 'join' | 'info';
  winAmount?: number;
  winMultiplier?: number;
}

export interface SlotSymbol {
  id: string;
  name: string;
  multiplier: number;
  image: string; // Emoji character or label
  color: string;
}

export interface MineCell {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
}

export type SlotGameId = 'ras_reckoning' | 'book_abyss' | 'buffalo_song' | 'slayers_inc' | 'vamp_party' | 'reel_rampage' | 'dragon_inferno' | 'lucky_jungle' | 'athenas_millions' | 'jack_o_wild' | 'dazzling_hot' | 'turbo_diamonds' | 'steam_runners' | 'suck' | 'cash_lamps';

export interface GameInfo {
  id: SlotGameId;
  title: string;
  provider: string;
  bannerUrl: string;
  themeColor: string;
  accentColor: string;
  minBet: number;
  symbols: SlotSymbol[];
  category?: 'featured' | 'slots' | 'popular';
}

export interface ApiGame {
  game_uid: string;
  game_name: string;
  provider?: string;
  game_type: string;
  category?: string;
  status: number;
  image: string;
}
