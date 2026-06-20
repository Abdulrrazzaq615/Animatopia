import React, { useState, FormEvent } from 'react';
import { User, WatchlistItem, Anime } from '../types';
import { MapPin, Sparkles, Award, Edit, UserCheck, Play, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileSectionProps {
  user: User;
  onUpdateBio: (displayName: string, bio: string) => void;
  watchlist: WatchlistItem[];
  animeList: Anime[];
}

export default function ProfileSection({
  user,
  onUpdateBio,
  watchlist,
  animeList
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(user.displayName);
  const [editedBio, setEditedBio] = useState(user.bio);

  const handleSubmitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editedDisplayName.trim()) return;

    onUpdateBio(editedDisplayName, editedBio);
    setIsEditing(false);
  };

  // Watchlist calculations helper
  const watchingCount = watchlist.filter((w) => w.status === 'watching').length;
  const completedCount = watchlist.filter((w) => w.status === 'completed').length;
  const planCount = watchlist.filter((w) => w.status === 'plan_to_watch').length;

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto pb-24">
      {/* Cover picture layout */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.05] shadow-xl">
        <div className="h-44 bg-gradient-to-tr from-brand-purple via-[#151125] to-[#ffb7c5]/20 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6b35_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Profile Card detail row */}
        <div className="p-6 bg-brand-card relative pt-16">
          <img
            src={user.avatarUrl}
            className="w-24 h-24 rounded-full border-4 border-brand-orange object-cover absolute -top-12 left-6 z-10 shadow-2xl block"
            alt={user.displayName}
          />

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-white">{user.displayName}</h2>
                <span className="text-xs bg-brand-bg px-2 py-0.5 rounded font-mono text-brand-sakura border border-[#ffb7c5]/5">
                  @{user.username}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                <span>{user.location}</span>
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 border border-[#ffb7c5]/20 hover:border-brand-orange rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all self-start sm:self-auto"
            >
              <Edit className="w-3.5 h-3.5 text-brand-orange" />
              <span>Edit Profile</span>
            </button>
          </div>

          <p className="text-sm text-gray-200 mt-5 leading-relaxed whitespace-pre-line font-sans max-w-2xl bg-brand-bg/40 p-4 rounded-xl border border-white/[0.02]">
            {user.bio}
          </p>

          <div className="flex items-center gap-6 mt-6 border-t border-[#ffb7c5]/10 pt-5">
            <div className="flex items-center gap-1.5 text-sm font-mono text-white">
              <span className="font-bold text-brand-orange">{user.followersCount}</span>
              <span className="text-gray-400 text-xs">followers</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-mono text-white">
              <span className="font-bold text-brand-orange">{user.followingCount}</span>
              <span className="text-gray-400 text-xs">following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Bio Form Overlay dialog if isEditing */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-brand-card w-full max-w-sm rounded-2xl overflow-hidden border border-[#ffb7c5]/20 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                <h3 className="font-display font-bold text-white text-base">Edit User Bio</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white text-base font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 uppercase font-mono">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editedDisplayName}
                    onChange={(e) => setEditedDisplayName(e.target.value)}
                    className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 uppercase font-mono">Biography</label>
                  <textarea
                    required
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange resize-none h-24"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-sakura hover:text-brand-bg text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Watchlist statistics card distribution */}
        <div className="bg-brand-card rounded-2xl p-5 border border-white/[0.04]">
          <h3 className="text-white font-display font-bold text-sm mb-4">Watchlist Stats</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Play className="w-3.5 h-3.5" /> Watching
              </span>
              <span className="font-bold text-white">{watchingCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-green-400">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
              <span className="font-bold text-white">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Award className="w-3.5 h-3.5" /> Plan to Watch
              </span>
              <span className="font-bold text-white">{planCount}</span>
            </div>
          </div>
        </div>

        {/* Badge reward system visualizer */}
        <div className="col-span-1 md:col-span-2 bg-brand-card rounded-2xl p-5 border border-white/[0.04]">
          <h3 className="text-white font-display font-bold text-sm mb-4">Kaimosi Badges</h3>
          <div className="flex flex-wrap gap-2.5">
            {user.badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 bg-brand-purple/40 text-brand-sakura border border-brand-sakura/20 px-3.5 py-2 rounded-xl text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
