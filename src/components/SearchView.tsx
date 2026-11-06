import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search, Trash2, UserRound, X } from 'lucide-react';
import { ApiGame } from '../types';
import FallbackImage from './FallbackImage';

const TOP_GAMES_URL = '/api/games/TOP.json';

const STARTER_SEARCHES = [
  'All',
  'Today',
  'Live broadcast',
  'Popular',
  'Not checked',
  'GTA 5',
  'Free Fire',
  'Minecraft',
  'GamerFleet',
  'PUBG',
  'World of tanks',
  'Clash Royale',
];

const TOP_CREATORS = [
  { name: 'MrBeast', initials: 'MB', colors: 'from-sky-500 to-indigo-900' },
  { name: 'GamerFleet', initials: 'GF', colors: 'from-orange-500 to-rose-950' },
  { name: 'Village...', initials: 'VT', colors: 'from-stone-400 to-red-950' },
  { name: 'BearGaming', initials: 'BG', colors: 'from-cyan-400 to-blue-950' },
  { name: 'KillerPro', initials: 'KP', colors: 'from-violet-400 to-blue-950' },
  { name: 'GameZone', initials: 'GZ', colors: 'from-emerald-400 to-emerald-950' },
  { name: 'PlayMaster', initials: 'PM', colors: 'from-amber-300 to-orange-950' },
  { name: 'NinjaPlay', initials: 'NP', colors: 'from-fuchsia-400 to-purple-950' },
];

interface SearchViewProps {
  onBack: () => void;
}

export default function SearchView({ onBack }: SearchViewProps) {
  const [games, setGames] = useState<ApiGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(STARTER_SEARCHES);
  const [showAllCreators, setShowAllCreators] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadTopGames = async () => {
      setIsLoading(true);
      setLoadError(false);

      try {
        const response = await fetch(TOP_GAMES_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load the top games feed');

        const payload: unknown = await response.json();
        if (!Array.isArray(payload)) throw new Error('Top games feed has an unexpected format');

        const parsedGames = payload.filter((game): game is ApiGame => (
          game &&
          typeof game === 'object' &&
          typeof game.game_name === 'string' &&
          typeof game.image === 'string'
        ));

        setGames(parsedGames.filter(game => Number(game.status) === 1));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching top games:', error);
          setLoadError(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadTopGames();
    return () => controller.abort();
  }, [reloadIndex]);

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return games;

    return games.filter(game => [
      game.game_name,
      game.provider,
      game.game_type,
      game.category,
    ].some(value => value?.toLowerCase().includes(query)));
  }, [games, searchQuery]);

  const creatorList = showAllCreators ? TOP_CREATORS : TOP_CREATORS.slice(0, 5);
  const visibleGames = searchQuery.trim() || showAllGames ? filteredGames : filteredGames.slice(0, 8);

  const addCurrentSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setRecentSearches(current => [
      query,
      ...current.filter(search => search.toLowerCase() !== query.toLowerCase() && search !== 'All'),
    ].slice(0, 12));
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#080b09] text-white">
      <form
        onSubmit={addCurrentSearch}
        className="z-20 flex h-[58px] shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#0b100d]/90 px-4 backdrop-blur-xl"
      >
        <button
          type="button"
          aria-label="Back to home"
          onClick={onBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.12] text-white/85 transition hover:bg-white/20 active:scale-95"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[9px] border border-white/[0.04] bg-[#20231f] px-3 shadow-inner shadow-black/30 focus-within:border-emerald-400/50">
          <Search size={16} className="shrink-0 text-white/45" />
          <input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search of Streamers, Video, Games"
            aria-label="Search streamers, videos, and games"
            className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/40"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24 lg:pb-5">
        <div className="flex flex-col gap-6 px-4 pb-5 pt-5">
          <section aria-labelledby="recent-searches-heading" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 id="recent-searches-heading" className="text-[14px] font-semibold tracking-tight text-white/90">
                Recent Searches
              </h2>
              <button
                type="button"
                onClick={() => setRecentSearches([])}
                disabled={recentSearches.length === 0}
                className="flex h-7 items-center gap-1.5 rounded-full border border-[#ffd97d]/35 bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] px-2.5 text-[10px] font-bold text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] transition hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95 disabled:cursor-default disabled:opacity-40"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>

            {recentSearches.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((search, index) => {
                  const isSelected = search === 'All' ? !searchQuery : searchQuery.toLowerCase() === search.toLowerCase();
                  return (
                    <button
                      key={`${search}-${index}`}
                      type="button"
                      onClick={() => setSearchQuery(search === 'All' ? '' : search)}
                      className={`h-[28px] shrink-0 rounded-full border px-3 text-[10px] font-medium transition active:scale-95 ${isSelected
                        ? 'border-emerald-400/80 bg-emerald-500/20 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.18)]'
                        : 'border-white/[0.06] bg-white/[0.045] text-white/65 hover:border-white/15 hover:text-white/85'
                        }`}
                    >
                      {search}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-[11px] text-white/45">
                Searches you make will appear here.
              </p>
            )}
          </section>

          <section aria-labelledby="top-creators-heading" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 id="top-creators-heading" className="text-[14px] font-semibold tracking-tight text-white/90">
                Top Creators
              </h2>
              <button
                type="button"
                onClick={() => setShowAllCreators(value => !value)}
                className="flex h-7 items-center gap-1 rounded-full border border-[#ffd97d]/35 bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] px-2.5 text-[10px] font-bold text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] transition hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95"
              >
                <Plus size={12} />
                {showAllCreators ? 'Show Less' : 'View All'}
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {creatorList.map((creator, index) => (
                <div key={creator.name} className="flex w-[50px] shrink-0 flex-col items-center gap-1.5 text-center">
                  <div className={`relative flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full border-2 border-white/15 bg-gradient-to-br ${creator.colors} shadow-[0_3px_12px_rgba(0,0,0,0.4)]`}>
                    <UserRound size={24} strokeWidth={1.6} className="absolute bottom-0.5 text-white/55" />
                    <span className="absolute top-[8px] text-[9px] font-black tracking-wide text-white drop-shadow">{creator.initials}</span>
                    {index < 5 && <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080b09] bg-emerald-400" />}
                  </div>
                  <span className="w-full truncate text-[9px] font-medium text-white/65">{creator.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="top-categories-heading" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 id="top-categories-heading" className="text-[14px] font-semibold tracking-tight text-white/90">
                {searchQuery.trim() ? 'Search Results' : 'Top Categories'}
              </h2>
              {!searchQuery.trim() && games.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAllGames(value => !value)}
                  className="flex h-7 items-center gap-1 rounded-full border border-[#ffd97d]/35 bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] px-2.5 text-[10px] font-bold text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] transition hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95"
                >
                  <Plus size={12} />
                  {showAllGames ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="aspect-square animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.06]" />
                ))}
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-6 text-center">
                <p className="text-[11px] text-white/55">Top games couldn’t be loaded.</p>
                <button
                  type="button"
                  onClick={() => setReloadIndex(index => index + 1)}
                  className="rounded-full border border-[#ffd97d]/35 bg-gradient-to-b from-[#f2dfa7] via-[#d1af54] to-[#a8822d] px-3 py-1.5 text-[10px] font-bold text-[#0e0c06] shadow-[0_4px_12px_rgba(202,167,83,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] transition hover:from-[#f7e6b5] hover:via-[#dcb85c] hover:to-[#b58c32] active:scale-95"
                >
                  Try Again
                </button>
              </div>
            ) : visibleGames.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {visibleGames.map(game => (
                  <article
                    key={game.game_uid}
                    title={`${game.game_name}${game.provider ? ` · ${game.provider}` : ''}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-[#161a18] shadow-[0_4px_14px_rgba(0,0,0,0.34)]"
                  >
                    <FallbackImage
                      src={game.image}
                      alt={game.game_name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-7 text-center">
                <p className="text-[11px] text-white/55">No games match “{searchQuery.trim()}”.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
