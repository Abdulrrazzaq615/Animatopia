import { useState } from 'react';
import { Anime, WatchlistItem, WatchlistStatus } from '../types';
import { Search, Filter, Tv, Eye, Star, Plus, Check, Play, BookOpen, StarHalf, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimeSectionProps {
  animeList: Anime[];
  watchlist: WatchlistItem[];
  onUpdateWatchlist: (animeId: string, status: WatchlistStatus, progress: number, rating?: number) => void;
  onRemoveFromWatchlist: (animeId: string) => void;
}

export default function AnimeSection({
  animeList,
  watchlist,
  onUpdateWatchlist,
  onRemoveFromWatchlist
}: AnimeSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_watchlist'>('catalog');
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);

  // All unique genres list helper
  const allGenres = ['All', ...new Set(animeList.flatMap((a) => a.genres))];

  // Filtering catalog
  const filteredAnimeList = animeList.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.englishTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || a.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  // Watchlist helpers
  const getWatchlistItem = (animeId: string): WatchlistItem | undefined => {
    return watchlist.find((item) => item.animeId === animeId);
  };

  const selectedAnime = animeList.find((a) => a.id === selectedAnimeId);

  return (
    <div className="flex flex-col gap-6 w-full pb-24">
      {/* Search and Hub Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-purple/40 to-transparent p-6 rounded-2xl border border-brand-sakura/10">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Anime Catalog & Tracker <Tv className="w-5 h-5 text-brand-orange animate-pulse" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Browse global and custom Kenyan anime releases. Record ratings and manage your watch schedule.
          </p>
        </div>
        
        {/* Toggle between catalog and personal watchlist */}
        <div className="flex gap-2 p-1 bg-brand-bg border border-[#ffb7c5]/10 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'catalog'
                ? 'bg-brand-orange text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Catalog ({animeList.length})
          </button>
          <button
            onClick={() => setActiveTab('my_watchlist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'my_watchlist'
                ? 'bg-brand-orange text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Watchlist ({watchlist.length})
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Catalog tools: Search & Genre filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tafuta anime upendavyo..."
                className="w-full bg-brand-card/80 border border-[#ffb7c5]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-brand-card/80 border border-[#ffb7c5]/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-brand-orange cursor-pointer"
              >
                {allGenres.map((genre) => (
                  <option key={genre} value={genre} className="bg-brand-bg">
                    {genre === 'All' ? 'Genre: All' : genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid display list of Anime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimeList.map((anime) => {
              const wlInfo = getWatchlistItem(anime.id);
              return (
                <div
                  key={anime.id}
                  onClick={() => setSelectedAnimeId(anime.id)}
                  className="bg-brand-card rounded-2xl overflow-hidden border border-white/[0.04] hover:border-brand-orange/30 group cursor-pointer transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-brand-orange/5"
                >
                  <div className="relative h-48 overflow-hidden bg-brand-bg shrink-0">
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-brand-sakura flex items-center gap-1 border border-[#ffb7c5]/10">
                      <Star className="w-3 h-3 text-brand-orange fill-brand-orange" />
                      <span>{anime.ratingAverage || 'No rating'}</span>
                    </div>

                    {/* Airing / Completed tag */}
                    <div className={`absolute bottom-2 left-2 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-white select-none ${
                        anime.status === 'Airing'
                          ? 'bg-blue-600'
                          : anime.status === 'Upcoming'
                          ? 'bg-brand-orange'
                          : 'bg-green-600'
                      }`}
                    >
                      {anime.status}
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-display font-medium text-white group-hover:text-brand-orange transition-colors text-sm truncate">
                        {anime.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {anime.synopsis}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {anime.genres.slice(0, 3).map((g) => (
                        <span key={g} className="text-[9px] font-mono bg-brand-bg/40 text-brand-sakura px-2 py-0.5 rounded border border-[#ffb7c5]/5">
                          {g}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.05] pt-3 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                      <span>{anime.episodes ? `${anime.episodes} Ep` : 'Ongoing'}</span>
                      {wlInfo ? (
                        <span className="flex items-center gap-1.5 text-brand-sheng-green text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>{wlInfo.status.replace('_', ' ')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-brand-orange group-hover:underline">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAnimeList.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 text-xs">
                Hakuna anime imepatikana na sifa hizi. Jaribu kutafuta upya!
              </div>
            )}
          </div>
        </>
      ) : (
        /* Watching List Section with detailed tracking triggers */
        <div className="flex flex-col gap-4">
          {watchlist.length > 0 ? (
            watchlist.map((item) => {
              const anime = animeList.find((a) => a.id === item.animeId);
              if (!anime) return null;

              return (
                <div
                  key={item.id}
                  className="bg-brand-card rounded-2xl p-4 border border-white/[0.04] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xl"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-16 h-20 rounded-xl object-cover border border-[#ffb7c5]/15 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{anime.title}</h4>
                      <p className="text-xs text-brand-sakura mt-0.5 font-mono">@{anime.englishTitle}</p>
                      
                      {/* State badge indicator */}
                      <span className={`inline-block mt-2 text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase text-white ${
                        item.status === 'completed'
                          ? 'bg-green-600'
                          : item.status === 'watching'
                          ? 'bg-blue-600'
                          : item.status === 'dropped'
                          ? 'bg-gray-600'
                          : 'bg-yellow-600'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Episode Counter & Score inputs */}
                  <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col gap-1 sm:items-end">
                      <span className="text-[10px] text-gray-500 uppercase font-mono">Episode progress</span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={item.progress <= 0}
                          onClick={() => onUpdateWatchlist(anime.id, item.status, item.progress - 1, item.rating)}
                          className="w-7 h-7 bg-brand-bg rounded-lg flex items-center justify-center font-bold text-gray-300 hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white font-mono">
                          {item.progress} / {anime.episodes || '--'}
                        </span>
                        <button
                          disabled={item.progress >= anime.episodes}
                          onClick={() => {
                            const newProgress = item.progress + 1;
                            const newStatus = newProgress === anime.episodes ? 'completed' : item.status;
                            onUpdateWatchlist(anime.id, newStatus, newProgress, item.rating);
                          }}
                          className="w-7 h-7 bg-brand-bg rounded-lg flex items-center justify-center font-bold text-gray-300 hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 sm:items-end">
                      <span className="text-[10px] text-gray-500 uppercase font-mono">My Rating</span>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                        <select
                          value={item.rating || ''}
                          onChange={(e) => {
                            const score = e.target.value ? Number(e.target.value) : undefined;
                            onUpdateWatchlist(anime.id, item.status, item.progress, score);
                          }}
                          className="bg-brand-bg border border-[#ffb7c5]/5 rounded px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                        >
                          <option value="">--</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} / 10
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromWatchlist(anime.id)}
                      className="text-gray-500 hover:text-red-400 text-xs font-mono px-3 py-1 bg-brand-bg rounded-lg border border-[#ffb7c5]/5 hover:bg-red-400/10 transition-all font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-gray-500 text-xs bg-brand-card rounded-2xl border border-white/[0.04]">
              Watchlist yako iko tupu sasa. Tembelea Catalog na uongeze anime unazotazama!
            </div>
          )}
        </div>
      )}

      {/* Focus Detailed anime Modal Dialog */}
      <AnimatePresence>
        {selectedAnimeId !== null && selectedAnime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-brand-card w-full max-w-2xl rounded-3xl overflow-hidden border border-[#ffb7c5]/20 max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="relative h-56 w-full shrink-0">
                <img src={selectedAnime.bannerUrl} className="w-full h-full object-cover" alt="Banner background" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent" />
                <button
                  onClick={() => setSelectedAnimeId(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-brand-orange text-white w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all"
                >
                  &times;
                </button>
                <div className="absolute bottom-4 left-6 flex gap-4 items-end">
                  <img
                    src={selectedAnime.imageUrl}
                    className="w-20 h-28 object-cover rounded-xl border-2 border-[#ffb7c5]/20 shadow-2xl relative z-10 block"
                    alt="Cover"
                  />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold font-display text-white">{selectedAnime.title}</h3>
                    <p className="text-xs text-brand-sakura font-mono">@{selectedAnime.englishTitle}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {selectedAnime.genres.map((g) => (
                    <span key={g} className="text-xs font-mono bg-brand-bg/50 text-brand-sakura border border-brand-sakura/10 px-3 py-1 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono mb-2">Synopsis</h4>
                  <p className="text-sm text-gray-200 leading-relaxed font-sans">{selectedAnime.synopsis}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#151125]/40 p-4 rounded-2xl border border-white/[0.04]">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Status</span>
                    <span className="text-xs font-bold text-white">{selectedAnime.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Episodes</span>
                    <span className="text-xs font-bold text-white">{selectedAnime.episodes}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Rating Average</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                      {selectedAnime.ratingAverage || '--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Popularity</span>
                    <span className="text-xs font-bold text-white tracking-wide">{selectedAnime.popularity.toLocaleString()}</span>
                  </div>
                </div>

                {/* Manager watchlist controller */}
                <div className="border-t border-[#ffb7c5]/10 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono mb-4">Track this anime</h4>
                  
                  {(() => {
                    const wl = getWatchlistItem(selectedAnime.id);
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(['plan_to_watch', 'watching', 'completed', 'dropped'] as WatchlistStatus[]).map((st) => {
                            const isCurrentStatus = wl?.status === st;
                            return (
                              <button
                                key={st}
                                onClick={() => {
                                  let prog = wl?.progress || 0;
                                  if (st === 'completed') prog = selectedAnime.episodes;
                                  onUpdateWatchlist(selectedAnime.id, st, prog, wl?.rating);
                                }}
                                className={`px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition-all capitalize border ${
                                  isCurrentStatus
                                    ? 'bg-brand-orange border-brand-orange text-white'
                                    : 'bg-brand-bg/50 border-white/[0.05] text-gray-400 hover:text-white hover:bg-brand-purple/30'
                                }`}
                              >
                                {st.replace(/_/g, ' ')}
                              </button>
                            );
                          })}
                        </div>

                        {wl && (
                          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4 bg-brand-bg/40 p-4 rounded-xl border border-white/[0.04]">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">Watched</span>
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={wl.progress <= 0}
                                  onClick={() => onUpdateWatchlist(selectedAnime.id, wl.status, wl.progress - 1, wl.rating)}
                                  className="w-7 h-7 bg-brand-bg rounded-lg font-bold text-white border border-[#ffb7c5]/5 disabled:opacity-30"
                                >
                                  -
                                </button>
                                <span className="text-xs font-mono font-bold text-white">
                                  {wl.progress} / {selectedAnime.episodes}
                                </span>
                                <button
                                  disabled={wl.progress >= selectedAnime.episodes}
                                  onClick={() => {
                                    const nextProg = wl.progress + 1;
                                    const nextStatus = nextProg === selectedAnime.episodes ? 'completed' : wl.status;
                                    onUpdateWatchlist(selectedAnime.id, nextStatus, nextProg, wl.rating);
                                  }}
                                  className="w-7 h-7 bg-brand-bg rounded-lg font-bold text-white border border-[#ffb7c5]/5 disabled:opacity-30"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                onRemoveFromWatchlist(selectedAnime.id);
                                setSelectedAnimeId(null);
                              }}
                              className="text-red-400 hover:underline text-xs"
                            >
                              Tofautisha (Remove)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
