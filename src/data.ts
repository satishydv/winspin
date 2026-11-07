import { GameInfo, ChatMessage } from './types';
import aviatrixLogo from '../assets/images/providers/Property-1=2-Aviatrix.png';
import ezugiLogo from '../assets/images/providers/Property-1=23-Ezugi (1).png';
import amigoGamingLogo from '../assets/images/providers/Property-1=5-Amigo_Gaming.png';
import playtechLogo from '../assets/images/providers/Property-1=54-Playtech (1).png';
import evolutionLogo from '../assets/images/providers/Property-1=57-Evolution (1).png';
import jiliLogo from '../assets/images/providers/Property-1=66-Jili.png';
import pocketGamesSoftLogo from '../assets/images/providers/Property-1=75-Pocket_Games_Soft.png';
import smartSoftLogo from '../assets/images/providers/SmartSoft.png';
import spribeLogo from '../assets/images/providers/Spribe.png';

export const SLOT_GAMES: GameInfo[] = [
  {
    id: 'ras_reckoning',
    title: "RA'S RECKONING",
    provider: "PLAY'N GO",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA163%20Blackjack%20VIP%2027.jpg",
    themeColor: "from-amber-600 to-red-950",
    accentColor: "#facc15",
    minBet: 5,
    category: 'featured'
  },
  {
    id: 'book_abyss',
    title: "BOOK OF ABYSS",
    provider: "JUSTSLOTS",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA101%20Blackjack%20VIP%201.jpg",
    themeColor: "from-purple-900 to-emerald-950",
    accentColor: "#ec4899",
    minBet: 10,
    category: 'featured'
  },
  {
    id: 'buffalo_song',
    title: "YOUNG BUFFALO SONG",
    provider: "EVOPLAY ENTERTAINMENT",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA304%20Extra%20Chilli%20Epic%20Spins.jpg",
    themeColor: "from-orange-800 to-amber-950",
    accentColor: "#f97316",
    minBet: 20,
    category: 'featured'
  },
  {
    id: 'jack_o_wild',
    title: "JACK O' WILD",
    provider: "GAMEART",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA166%20Speed%20VIP%20Blackjack%20M.jpg",
    themeColor: "from-orange-600 to-zinc-900",
    accentColor: "#f59e0b",
    minBet: 10,
    category: 'featured'
  },
  {
    id: 'dazzling_hot',
    title: "20 DAZZLING HOT",
    provider: "EGT DIGITAL",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA100%20Speed%20Baccarat%20S.jpg",
    themeColor: "from-red-600 to-amber-950",
    accentColor: "#dc2626",
    minBet: 15,
    category: 'featured'
  },
  {
    id: 'turbo_diamonds',
    title: "TURBO DIAMONDS",
    provider: "PLATINUM WIN",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA151%20Speed%20VIP%20Blackjack%20F.jpg",
    themeColor: "from-cyan-900 to-blue-950",
    accentColor: "#06b6d4",
    minBet: 25,
    category: 'featured'
  },
  {
    id: 'slayers_inc',
    title: "SLAYERS INC",
    provider: "HACKSAW",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EZUGI/code_221000%20Speed%20Roulette.jpg",
    themeColor: "from-emerald-900 to-zinc-950",
    accentColor: "#10b981",
    minBet: 10,
    category: 'slots'
  },
  {
    id: 'vamp_party',
    title: "VAMP PARTY",
    provider: "PRAGMATIC PLAY",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EZUGI/code_241000%20Roleta%20da%20sorte.jpg",
    themeColor: "from-purple-900 to-fuchsia-950",
    accentColor: "#d946ef",
    minBet: 10,
    category: 'slots'
  },
  {
    id: 'reel_rampage',
    title: "REEL RAMPAGE",
    provider: "SLOTMILL",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EZUGI/code_224100%20Ultimate%20Sic%20Bo.jpg",
    themeColor: "from-amber-800 to-red-950",
    accentColor: "#f97316",
    minBet: 15,
    category: 'slots'
  },
  {
    id: 'steam_runners',
    title: "STEAM RUNNERS",
    provider: "HACKSAW",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EZUGI/code_1%20Gold%20Blackjack%205.jpg",
    themeColor: "from-yellow-700 to-amber-950",
    accentColor: "#cca711",
    minBet: 20,
    category: 'slots'
  },
  {
    id: 'suck',
    title: "SUCK",
    provider: "SHADY LADY",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EZUGI/code_221008%20Skyline%20Roulette.jpg",
    themeColor: "from-pink-800 to-purple-950",
    accentColor: "#ec4899",
    minBet: 10,
    category: 'slots'
  },
  {
    id: 'cash_lamps',
    title: "CASH LAMPS",
    provider: "RED TIGER",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EZUGI/code_228001%20Lucky%207.jpg",
    themeColor: "from-indigo-900 to-blue-950",
    accentColor: "#6366f1",
    minBet: 15,
    category: 'slots'
  },
  {
    id: 'dragon_inferno',
    title: "ULTIMATE GOLDEN DRAGON INFERNO",
    provider: "HOLD & WIN",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&h=533&q=80",
    themeColor: "from-red-800 to-yellow-950",
    accentColor: "#eab308",
    minBet: 25,
    category: 'popular'
  },
  {
    id: 'lucky_jungle',
    title: "LUCKY JUNGLE",
    provider: "BGAMING",
    bannerUrl: "https://images.unsplash.com/photo-1602491453979-02624b5501b1?auto=format&fit=crop&w=400&h=533&q=80",
    themeColor: "from-green-800 to-emerald-950",
    accentColor: "#22c55e",
    minBet: 5,
    category: 'popular'
  },
  {
    id: 'athenas_millions',
    title: "ATHENA'S MILLIONS",
    provider: "PLAY'N GO",
    bannerUrl: "https://images.unsplash.com/photo-1608155686393-8fef966d784d?auto=format&fit=crop&w=400&h=533&q=80",
    themeColor: "from-sky-900 to-slate-950",
    accentColor: "#38bdf8",
    minBet: 20,
    category: 'popular'
  }
];

export const PROVIDERS = [
  { name: 'PTASIA', id: 'PTASIA', logo: playtechLogo },
  { name: 'EVOASIA', id: 'EVOASIA', logo: evolutionLogo },
  { name: 'EZUGI', id: 'EZUGI', logo: ezugiLogo },
  { name: 'SEXY', id: 'SEXY', logo: amigoGamingLogo },
  { name: 'AVIATRIX', id: 'AVIATRIX', logo: aviatrixLogo },
  { name: 'SPRIBE', id: 'SPRIBE', logo: spribeLogo },
  { name: 'TOPBET', id: 'TOPBET', logo: pocketGamesSoftLogo },
  { name: 'IDEAL', id: 'IDEAL', logo: jiliLogo },
  { name: 'INOUT', id: 'INOUT', logo: smartSoftLogo }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  { id: '1', username: 'Jackpot_King', avatarIndex: 0, message: 'Crash rocket got to 45x earlier! Absolutely insane run 🔥', timestamp: '08:18' },
  { id: '2', username: 'LuckyDiva', avatarIndex: 1, message: 'OMG! Just hit big on Book of Abyss slot. $450 with only a $10 bet! 😍', timestamp: '08:18' },
  { id: '3', username: 'MinesweeperPro', avatarIndex: 2, message: 'Who is playing Mines? I usually do 3 mines and clear 10 tiles, payout is good', timestamp: '08:19' },
  { id: 'system-1', username: 'System', avatarIndex: 9, message: '🎉 user_9872 won $2,450.00 (245x) on CRASH!', timestamp: '08:19', isSystem: true, systemType: 'win', winAmount: 2450, winMultiplier: 245 },
  { id: '4', username: 'CoinCollector', avatarIndex: 3, message: 'Need to get some slots spins, Buffalo Song is feeding very well today.', timestamp: '08:20' }
];

export const CHAT_SENDER_TEMPLATES = [
  { username: 'SpinDoc', avatarIndex: 4, phrases: ['Let is spin it up!', 'Almost hit Ra Reckoning grand jackpot', 'Anyone got tips for Crash?', 'Mines are tricky today!'] },
  { username: 'ZeusFist', avatarIndex: 5, phrases: ['Crash crash crash at 1.05x typical haha', 'Woah the multipliers are heated up right now', 'I got a 12.5x payout on Buffalo Song', 'Yes! Just secured a nice bag'] },
  { username: 'LootGamer', avatarIndex: 6, phrases: ['Boom! 15x on Mines!', 'Just claimed my daily 100% reload bonus', 'Gold interface feels premium as requested', 'Nice design, fast spins'] },
  { username: 'RoyalClover', avatarIndex: 7, phrases: ['Who is holding the high score today?', 'I like playing with 5 mines for max returns', 'Hacksaw Gaming games are supreme', 'Is anyone active?'] }
];
