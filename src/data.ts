import { GameInfo, SlotSymbol, ChatMessage } from './types';
import aviatrixLogo from '../assets/images/providers/Property-1=2-Aviatrix.png';
import ezugiLogo from '../assets/images/providers/Property-1=23-Ezugi (1).png';
import amigoGamingLogo from '../assets/images/providers/Property-1=5-Amigo_Gaming.png';
import playtechLogo from '../assets/images/providers/Property-1=54-Playtech (1).png';
import evolutionLogo from '../assets/images/providers/Property-1=57-Evolution (1).png';
import jiliLogo from '../assets/images/providers/Property-1=66-Jili.png';
import pocketGamesSoftLogo from '../assets/images/providers/Property-1=75-Pocket_Games_Soft.png';
import smartSoftLogo from '../assets/images/providers/SmartSoft.png';
import spribeLogo from '../assets/images/providers/Spribe.png';

// Standard slot game symbols by theme
export const RAS_RECKONING_SYMBOLS: SlotSymbol[] = [
  { id: 'ra', name: 'Golden Ra', multiplier: 25, image: '☀️', color: '#facc15' },
  { id: 'pharaoh', name: 'Pharaoh', multiplier: 12, image: '👑', color: '#fb923c' },
  { id: 'anubis', name: 'Anubis', multiplier: 8, image: '🐺', color: '#a0aec0' },
  { id: 'eye', name: 'Eye of Horus', multiplier: 5, image: '👁️', color: '#22d3ee' },
  { id: 'scarab', name: 'Scarab', multiplier: 4, image: '🪲', color: '#10b981' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const BOOK_OF_ABYSS_SYMBOLS: SlotSymbol[] = [
  { id: 'queen_abyss', name: 'Abyss Queen', multiplier: 30, image: '😈', color: '#ec4899' },
  { id: 'book', name: 'Book of Abyss', multiplier: 15, image: '📖', color: '#10b981' },
  { id: 'skull_coin', name: 'Skull Coin', multiplier: 10, image: '🪙', color: '#ffd700' },
  { id: 'potion', name: 'Dark Potion', multiplier: 6, image: '🧪', color: '#a855f7' },
  { id: 'crystal', name: 'Abyss Crystal', multiplier: 4, image: '🔮', color: '#e0f2fe' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#f97316' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const BUFFALO_SONG_SYMBOLS: SlotSymbol[] = [
  { id: 'buffalo', name: 'Young Buffalo', multiplier: 35, image: '🦬', color: '#ea580c' },
  { id: 'eagle', name: 'Golden Eagle', multiplier: 15, image: '🦅', color: '#fde047' },
  { id: 'wolf', name: 'Timberwolf', multiplier: 10, image: '🐺', color: '#94a3b8' },
  { id: 'cougar', name: 'Cougar', multiplier: 7, image: '🐆', color: '#cca711' },
  { id: 'cactus', name: 'Prickly Cactus', multiplier: 4, image: '🌵', color: '#22c55e' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const SLAYERS_INC_SYMBOLS: SlotSymbol[] = [
  { id: 'katana', name: 'Katana', multiplier: 30, image: '🗡️', color: '#10b981' },
  { id: 'mask', name: 'Slayer Mask', multiplier: 15, image: '🥷', color: '#f43f5e' },
  { id: 'shuriken', name: 'Shuriken', multiplier: 10, image: '🎯', color: '#fde047' },
  { id: 'ninja', name: 'Shadow Ninja', multiplier: 6, image: '👤', color: '#94a3b8' },
  { id: 'slash', name: 'Slash', multiplier: 4, image: '⚡', color: '#cca711' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const VAMP_PARTY_SYMBOLS: SlotSymbol[] = [
  { id: 'vamp', name: 'Vampire', multiplier: 35, image: '🧛', color: '#a855f7' },
  { id: 'coffin', name: 'Coffin', multiplier: 15, image: '⚰️', color: '#64748b' },
  { id: 'wine', name: 'Blood Chalice', multiplier: 10, image: '🍷', color: '#ef4444' },
  { id: 'bat', name: 'Shadow Bat', multiplier: 7, image: '🦇', color: '#475569' },
  { id: 'fang', name: 'Fangs', multiplier: 4, image: '🦷', color: '#cbd5e1' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const REEL_RAMPAGE_SYMBOLS: SlotSymbol[] = [
  { id: 'rebel', name: 'Red Rebel', multiplier: 40, image: '🧑‍🎤', color: '#f97316' },
  { id: 'gasmask', name: 'Gas Mask', multiplier: 20, image: '😷', color: '#22c55e' },
  { id: 'grenade', name: 'Rampage Grenade', multiplier: 10, image: '💣', color: '#374151' },
  { id: 'spray', name: 'Spray Can', multiplier: 6, image: '🎨', color: '#ec4899' },
  { id: 'spikes', name: 'Iron Spikes', multiplier: 4, image: '⚙️', color: '#94a3b8' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const DRAGON_INFERNO_SYMBOLS: SlotSymbol[] = [
  { id: 'dragon', name: 'Golden Dragon', multiplier: 45, image: '🐉', color: '#facc15' },
  { id: 'fire', name: 'Inferno Fire', multiplier: 20, image: '🔥', color: '#ef4444' },
  { id: 'ingot', name: 'Gold Ingot', multiplier: 12, image: '🏮', color: '#f97316' },
  { id: 'coin', name: 'Lucky Coin', multiplier: 8, image: '🪙', color: '#eab308' },
  { id: 'yinyang', name: 'Yin Yang', multiplier: 5, image: '☯️', color: '#1e293b' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const LUCKY_JUNGLE_SYMBOLS: SlotSymbol[] = [
  { id: 'leopard', name: 'Lucky Leopard', multiplier: 35, image: '🐆', color: '#cca711' },
  { id: 'parrot', name: 'Rainbow Parrot', multiplier: 15, image: '🦜', color: '#10b981' },
  { id: 'monkey', name: 'Golden Monkey', multiplier: 10, image: '🐒', color: '#ea580c' },
  { id: 'banana', name: 'Jungle Banana', multiplier: 6, image: '🍌', color: '#facc15' },
  { id: 'lotus', name: 'Pink Lotus', multiplier: 4, image: '🌸', color: '#ec4899' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const ATHENAS_MILLIONS_SYMBOLS: SlotSymbol[] = [
  { id: 'owl', name: 'Athena Owl', multiplier: 50, image: '🦉', color: '#cbd5e1' },
  { id: 'shield', name: 'Aegis Shield', multiplier: 25, image: '🛡️', color: '#facc15' },
  { id: 'pillar', name: 'Temple Pillar', multiplier: 15, image: '🏛️', color: '#e2e8f0' },
  { id: 'urn', name: 'Golden Amphora', multiplier: 8, image: '🏺', color: '#ca8a04' },
  { id: 'olive', name: 'Olive Branch', multiplier: 5, image: '🌿', color: '#22c55e' },
  { id: 'ace', name: 'A', multiplier: 2, image: '🅰️', color: '#f43f5e' },
  { id: 'king', name: 'K', multiplier: 1.5, image: '🇰', color: '#a855f7' },
  { id: 'queen', name: 'Q', multiplier: 1, image: '🇶', color: '#ec4899' },
  { id: 'jack', name: 'J', multiplier: 0.5, image: '🇯', color: '#3b82f6' }
];

export const SLOT_GAMES: GameInfo[] = [
  {
    id: 'ras_reckoning',
    title: "RA'S RECKONING",
    provider: "PLAY'N GO",
    bannerUrl: "https://cdn.vara-567.com/api/games/assets/EVOASIA/code_EA163%20Blackjack%20VIP%2027.jpg",
    themeColor: "from-amber-600 to-red-950",
    accentColor: "#facc15",
    minBet: 5,
    symbols: RAS_RECKONING_SYMBOLS,
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
    symbols: BOOK_OF_ABYSS_SYMBOLS,
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
    symbols: BUFFALO_SONG_SYMBOLS,
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
    symbols: BOOK_OF_ABYSS_SYMBOLS,
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
    symbols: RAS_RECKONING_SYMBOLS,
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
    symbols: DRAGON_INFERNO_SYMBOLS,
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
    symbols: SLAYERS_INC_SYMBOLS,
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
    symbols: VAMP_PARTY_SYMBOLS,
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
    symbols: REEL_RAMPAGE_SYMBOLS,
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
    symbols: SLAYERS_INC_SYMBOLS,
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
    symbols: RAS_RECKONING_SYMBOLS,
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
    symbols: DRAGON_INFERNO_SYMBOLS,
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
    symbols: DRAGON_INFERNO_SYMBOLS,
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
    symbols: LUCKY_JUNGLE_SYMBOLS,
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
    symbols: ATHENAS_MILLIONS_SYMBOLS,
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
