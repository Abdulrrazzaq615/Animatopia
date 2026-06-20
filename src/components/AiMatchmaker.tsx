import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Send, CheckCircle2, Bookmark, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, WatchlistItem, Post } from '../types';

interface AiMatchmakerProps {
  currentUser: User;
  watchlist: WatchlistItem[];
  animeList: { id: string; title: string; genres: string[] }[];
  onAddPost: (post: Post) => void;
}

const PRESET_GENRES = [
  'Shonen (Action)',
  'Sci-Fi & Cyberpunk',
  'Supernatural Fantasy',
  'Slice of Life & Chill',
  'Seinen (Dark / Psychological)',
  'Mecha & Robots'
];

export default function AiMatchmaker({ currentUser, watchlist, animeList, onAddPost }: AiMatchmakerProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Shonen (Action)', 'Sci-Fi & Cyberpunk']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleGetAiRecommendation = async () => {
    setIsLoading(true);
    setAiResponse('');

    const watchingTitles = watchlist
      .map((item) => {
        const title = animeList.find((a) => a.id === item.animeId)?.title || 'Unknown Anime';
        return `${title} (${item.status.replace('_', ' ')})`;
      })
      .slice(0, 5)
      .join(', ');

    const promptText = `
User Profile:
- Name: ${currentUser.displayName}
- Bio: ${currentUser.bio}
- Location: ${currentUser.location}
- Selected Favorite Genres: ${selectedGenres.join(', ')}
- Current Watchlist Snapshot: ${watchingTitles || 'No watchlist items yet'}

Please give a hyper-personalized anime recommendation tailored to this user. Give 1 or 2 specific titles with cool explanations. Mix in some light-hearted Otaku passion or standard Kenyan street slang if matching the Kaimosi/Chavakali group context, but make it very engaging!
`;

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (data.response) {
        setAiResponse(data.response);
      } else {
        setAiResponse('💡 *Kurama AI Bot:* Yo! Nimepata hitilafu ndogo kwa server lakini usijali mdau, jaribu tena nikutafutie anime ya nguvu kabisa!');
      }
    } catch (err) {
      console.error(err);
      setAiResponse('💡 *Kurama AI Bot:* Aiya! Connection imedrop kidogo wakati nachaji chakra yangu. Jaribu tena baada ya sekunde kadhaa!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareToFeed = () => {
    if (!aiResponse) return;

    const newPost: Post = {
      id: `ai_recs_${Date.now()}`,
      userId: currentUser.id,
      content: `🤖 *My AI Recommendations from Kurama matchmaker:* \n\n${aiResponse.replace('💡 *Kurama AI Bot:*', '')}\n\nJoin the Watch Club! 🔥 #AnimatopiaAI #KaimosiOtakus`,
      createdAt: new Date().toISOString(),
      likesCount: 5, // AI posts always get quick love
      isLikedByUser: false,
      comments: [
        {
          id: `ai_c_${Date.now()}`,
          userId: 'user_wanjiku',
          content: 'Woah! Kurama AI holds pure truth, this list looks amazing. Added to my watchlist immediately! 🌸✨',
          createdAt: new Date().toISOString()
        }
      ]
    };

    onAddPost(newPost);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <div className="bg-brand-card border border-[#ffb7c5]/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-brand-orange/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-purple/5 rounded-full blur-3xl -z-10" />

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
          Kurama AI Suggestion Engine
        </h3>
        <span className="text-[9px] font-bold font-mono bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-1.5 py-0.5 rounded">
          Sync Active
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4 font-sans leading-relaxed">
        Let our local digital Nine-Tails examine your taste profile & watchlist history to summon your next absolute watch list addition!
      </p>

      {/* Option selectors */}
      <div className="mb-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-sakura block mb-2">
          Toggle Your Core Likes
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`py-1.5 px-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-brand-purple/20 border-brand-orange text-white shadow shadow-brand-orange/10'
                    : 'bg-brand-bg/50 border-white/[0.04] text-gray-400 hover:text-white hover:border-white/[0.1]'
                }`}
              >
                <span className="truncate">{genre}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specs bar */}
      <div className="bg-[#151125]/60 rounded-xl p-3 border border-white/[0.02] flex items-center justify-between gap-4 mb-4 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Bookmark className="w-3.5 h-3.5 text-brand-sakura" />
          <span>History: <strong className="text-white">{watchlist.length} titles</strong></span>
        </div>
        <div className="w-1 border-r border-white/[0.05] h-4" />
        <div className="flex items-center gap-1.5 text-gray-400">
          <Heart className="w-3.5 h-3.5 text-brand-orange" />
          <span>Faves Tracked: <strong className="text-white">{selectedGenres.length} genres</strong></span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={isLoading || selectedGenres.length === 0}
        onClick={handleGetAiRecommendation}
        className="w-full bg-gradient-to-r from-brand-orange to-brand-purple hover:brightness-110 active:scale-[0.98] text-white py-2.5 px-4 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-orange/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Summoning recommendations...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-white" />
            <span>Get Personalized AI Recs</span>
          </>
        )}
      </button>

      {/* Response Box */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-4 p-4 bg-[#1a152d]/80 border border-brand-orange/20 rounded-xl relative text-left"
          >
            <div className="text-[10px] text-brand-sakura uppercase font-mono font-bold tracking-wider mb-2 flex justify-between items-center">
              <span>Kurama Recommendation output</span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-sheng-green animate-ping" />
            </div>

            <div className="text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap max-h-48 overflow-y-auto pr-1">
              {aiResponse}
            </div>

            <div className="mt-3 pt-3 border-t border-white/[0.05] flex gap-2">
              <button
                type="button"
                onClick={handleShareToFeed}
                className="flex-1 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple text-brand-sakura py-1.5 px-3 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {hasCopied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-brand-sheng-green" />
                    <span>Shared to Feed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 text-brand-orange" />
                    <span>Post Recs to Feed</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGetAiRecommendation}
                className="p-1 px-2.5 bg-white/[0.04] hover:bg-white/[0.1] text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Regenerate"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
