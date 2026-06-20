import React, { useState, FormEvent } from 'react';
import { Post, User, Comment } from '../types';
import { 
  Heart, MessageCircle, Send, Image as ImageIcon, Sparkles, MapPin, 
  Trash2, Video, Music, Sliders, CheckCircle2, Volume2, VolumeX, Flame,
  MoreVertical, Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AiMatchmaker from './AiMatchmaker';
import VideoPost from './VideoPost';

interface FeedSectionProps {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  currentUser: User;
  users: User[];
  onViewUserProfile: (userId: string) => void;
}

// Preset graphics options for easy attachment simulation
const ATTACHMENT_OPTIONS = [
  { name: 'None', url: '' },
  { name: 'Ghibli Water Forest', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&q=80' },
  { name: 'Kaimosi Tea Fields Dusk', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { name: 'Chavakali Mecha Sketch', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80' },
  { name: 'Kiprop Screening Spot', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80' }
];

// Preset high quality looping videos for the video editor with thumbnail hooks
const PRESET_VIDEOS = [
  {
    title: 'Aesthetic Cyber City 🌆',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-retro-game-arcade-41860-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=120&q=80'
  },
  {
    title: 'Starry Cosmic Skies 🌌',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&q=80'
  },
  {
    title: 'Falling Hack Digital Code 👾',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-code-digital-falling-loop-42861-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&q=80'
  }
];

// High fidelity preset MP3 audio soundtracks (SoundHelix stable testing paths)
const PRESET_SONGS = [
  { title: 'None (Muted) 🔇', url: '' },
  { title: 'Shonen Battle Theme ⚔️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Vaporwave Night Ride 🏎️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Kaimosi Lo-Fi Sunset 🌸', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'Shinobi Shadow Drums 🥁', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
];

// Filter effects configurations
const FILTER_EFFECTS = [
  { id: 'none', label: 'Original Style' },
  { id: 'vapourwave', label: 'Neon Vapourwave' },
  { id: 'retro', label: 'Vintage Shonen' },
  { id: 'mono', label: 'Ink Manga' },
  { id: 'cyberpunk', label: 'High Cyberpunk' }
];

export default function FeedSection({ posts, setPosts, currentUser, users, onViewUserProfile }: FeedSectionProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [attachedImageUrl, setAttachedImageUrl] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Video Composer States
  const [attachVideoMode, setAttachVideoMode] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState(PRESET_VIDEOS[0]);
  const [selectedSong, setSelectedSong] = useState(PRESET_SONGS[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');

  // Muted sound playback sync state per post feed card
  const [mutedStates, setMutedStates] = useState<{ [postId: string]: boolean }>({});

  // Kebab Menu & Reporting States
  const [activeKebabPostId, setActiveKebabPostId] = useState<string | null>(null);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('spam');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [reportedPostIds, setReportedPostIds] = useState<string[]>([]);
  const [reportedPostsLog, setReportedPostsLog] = useState<any[]>([]);
  const [reportSuccessToast, setReportSuccessToast] = useState<string | null>(null);

  const handleSendReport = () => {
    if (!reportingPostId) return;
    
    const newReport = {
      id: `report_${Date.now()}`,
      postId: reportingPostId,
      reason: reportReason,
      details: reportDetails,
      reportedBy: currentUser.username,
      timestamp: new Date().toISOString()
    };

    // Log the report event for moderation
    console.log('[Moderation System] Post reported successfully:', newReport);
    
    // Add to local logs
    setReportedPostsLog([newReport, ...reportedPostsLog]);
    setReportedPostIds([...reportedPostIds, reportingPostId]);
    
    // Reset dialogue interaction state
    setReportingPostId(null);
    setReportReason('spam');
    setReportDetails('');
    
    // Open feedback toast notification
    setReportSuccessToast(`Sent report for post ${reportingPostId}! Thanks for keeping Animatopia clean.`);
    
    // Clear toast notice after 3.5s
    setTimeout(() => {
      setReportSuccessToast((prev) => 
        prev?.includes(reportingPostId) ? null : prev
      );
    }, 3500);
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      content: newPostContent,
      imageUrl: attachedImageUrl || undefined,
      videoUrl: attachVideoMode ? selectedVideo.url : undefined,
      songTitle: attachVideoMode && selectedSong.url ? selectedSong.title : undefined,
      videoEffect: attachVideoMode ? selectedFilter : undefined,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByUser: false,
      comments: [],
      reactions: {
        kawaii: { emoji: '🌸', count: 0, label: 'Kawaii', userIds: [] },
        hype: { emoji: '🔥', count: 0, label: 'Hype', userIds: [] },
        shocked: { emoji: '⚡', count: 0, label: 'Shocked', userIds: [] },
        feels: { emoji: '😭', count: 0, label: 'Feels', userIds: [] }
      }
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setAttachedImageUrl('');
    setAttachVideoMode(false);
    setShowAttachmentMenu(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLikedByUser: !post.isLikedByUser,
            likesCount: post.isLikedByUser ? post.likesCount - 1 : post.likesCount + 1
          };
        }
        return post;
      })
    );
  };

  const handleReactPost = (postId: string, reactionKey: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) return post;

        const defaultReactions: Record<string, { emoji: string; count: number; label: string; userIds: string[] }> = {
          kawaii: { emoji: '🌸', count: 0, label: 'Kawaii', userIds: [] },
          hype: { emoji: '🔥', count: 0, label: 'Hype', userIds: [] },
          shocked: { emoji: '⚡', count: 0, label: 'Shocked', userIds: [] },
          feels: { emoji: '😭', count: 0, label: 'Feels', userIds: [] }
        };

        const reactions = { ...defaultReactions, ...post.reactions };
        const rDetail = { ...reactions[reactionKey] };

        const userIndex = rDetail.userIds.indexOf(currentUser.id);
        let updatedUserIds = [...rDetail.userIds];
        let updatedCount = rDetail.count;

        if (userIndex > -1) {
          updatedUserIds.splice(userIndex, 1);
          updatedCount = Math.max(0, updatedCount - 1);
        } else {
          updatedUserIds.push(currentUser.id);
          updatedCount += 1;
        }

        return {
          ...post,
          reactions: {
            ...reactions,
            [reactionKey]: {
              ...rDetail,
              count: updatedCount,
              userIds: updatedUserIds
            }
          }
        };
      })
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleAddComment = (postId: string, e: FormEvent) => {
    e.preventDefault();
    const input = commentInputs[postId] || '';
    if (!input.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      content: input,
      createdAt: new Date().toISOString()
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
    setExpandedComments({ ...expandedComments, [postId]: true });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getUserDetails = (userId: string): User => {
    if (userId === currentUser.id) return currentUser;
    return users.find((u) => u.id === userId) || currentUser;
  };

  const handleToggleFeedSound = (postId: string) => {
    setMutedStates((prev) => ({
      ...prev,
      [postId]: prev[postId] === false ? true : false
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-24">
      {/* Feed Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-purple/40 to-transparent p-5 rounded-2xl border border-brand-sakura/10">
        <div>
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Local Feed <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            See sketches, meetup plans, and discussions from anime heads in Kaimosi and Chavakali.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-brand-sakura bg-brand-purple/40 px-3 py-1.5 rounded-lg border border-[#ffb7c5]/5 self-start">
          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
          <span>Kaimosi Province</span>
        </div>
      </div>

      {/* AI SUGGESTION ENGINE PANEL */}
      <AiMatchmaker
        currentUser={currentUser}
        watchlist={[]} // Simple sync mock list
        animeList={[]} // Full titles reference
        onAddPost={(newPost) => setPosts([newPost, ...posts])}
      />

      {/* Write Post Composer */}
      <div className="bg-brand-card rounded-2xl p-5 border border-white/[0.05] shadow-xl relative overflow-hidden">
        <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full border-2 border-brand-orange object-cover cursor-pointer"
              onClick={() => onViewUserProfile(currentUser.id)}
            />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Unasoma nini msee? Share a sketch, anime edits, or gossip..."
                className="w-full bg-brand-bg/60 border border-[#ffb7c5]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange text-white placeholder-gray-500 resize-none min-h-[90px]"
              />
            </div>
          </div>

          {/* Attached Image Preview */}
          {attachedImageUrl && (
            <div className="relative rounded-xl overflow-hidden mt-2 border border-[#ffb7c5]/20 max-h-56">
              <img src={attachedImageUrl} alt="Attachment preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setAttachedImageUrl('')}
                className="absolute top-2 right-2 bg-black/70 hover:bg-brand-orange text-white p-1.5 rounded-full transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          {/* Interactive Anime Video Upload & Design Editing Studio */}
          {attachVideoMode && (
            <div className="p-4 bg-brand-bg/85 rounded-xl border border-brand-orange/20 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                <span className="text-xs font-bold text-brand-sakura uppercase font-mono flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-brand-orange" />
                  Otaku AMV Video Edit Studio
                </span>
                <button
                  type="button"
                  onClick={() => setAttachVideoMode(false)}
                  className="text-gray-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* 1. Video Selector */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase">Select Base Loop</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_VIDEOS.map((vid) => {
                    const isSelected = selectedVideo.url === vid.url;
                    return (
                      <button
                        key={vid.title}
                        type="button"
                        onClick={() => setSelectedVideo(vid)}
                        className={`p-1 border bg-[#1c182f] rounded-lg transition-all text-left flex flex-col gap-1 cursor-pointer overflow-hidden ${
                          isSelected ? 'border-brand-orange' : 'border-white/[0.04] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={vid.thumbnail} className="w-full aspect-video rounded object-cover" alt="Thumb" />
                        <span className="text-[9px] text-white truncate px-1">{vid.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Audio Track Overlay Picker */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase">Sync Song / Music Overlay</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SONGS.map((song) => {
                    const isSelected = selectedSong.title === song.title;
                    return (
                      <button
                        key={song.title}
                        type="button"
                        onClick={() => setSelectedSong(song)}
                        className={`py-1 px-2.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-[#1c182f] text-gray-400 border-white/[0.04] hover:text-white'
                        }`}
                      >
                        {song.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Style Filter Effects */}
              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase">Apply Video Aesthetics</label>
                <div className="flex flex-wrap gap-1.5">
                  {FILTER_EFFECTS.map((filter) => {
                    const isSelected = selectedFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`py-1 px-2.5 rounded-lg text-[10px] border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-purple text-brand-sakura border-brand-sakura'
                            : 'bg-[#1c182f] text-gray-400 border-white/[0.04] hover:text-white'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Video Studio Live Rendered Preview */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10 mt-1 max-h-40">
                <video
                  key={`${selectedVideo.url}-${selectedFilter}`}
                  className="w-full h-full object-cover"
                  src={selectedVideo.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    filter: selectedFilter === 'vapourwave' ? 'hue-rotate(90deg) saturate(1.8) brightness(1.1) contrast(1.1)' :
                            selectedFilter === 'retro' ? 'contrast(1.2) brightness(0.9) saturate(0.85) sepia(0.2)' :
                            selectedFilter === 'mono' ? 'grayscale(1) contrast(1.6)' :
                            selectedFilter === 'cyberpunk' ? 'hue-rotate(180deg) brightness(1.2) saturate(2) contrast(1.25)' : 'none'
                  }}
                />
                <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[9px] font-mono text-brand-orange">
                  Live Preview
                </div>
                {selectedSong.url && (
                  <div className="absolute bottom-2 left-2 right-2 bg-[#1a1331]/90 backdrop-blur-sm p-1.5 rounded border border-white/5 flex items-center justify-between gap-2 text-[9px] font-mono text-white">
                    <span className="flex items-center gap-1">
                      <Music className="w-2.5 h-2.5 text-brand-orange" />
                      Overlay: {selectedSong.title}
                    </span>
                    <span className="text-brand-sheng-green font-bold uppercase text-[8px] animate-pulse">Synced</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#ffb7c5]/5 pt-4 flex-wrap gap-2">
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachmentMenu(!showAttachmentMenu);
                    setAttachVideoMode(false);
                  }}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-brand-sakura text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-brand-orange" />
                  <span>Attach Image</span>
                </button>

                {/* Graphic upload choices dropdown */}
                <AnimatePresence>
                  {showAttachmentMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-64 bg-brand-card border border-brand-sakura/20 rounded-xl shadow-2xl z-20 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/[0.05] bg-brand-purple/20">
                        <p className="text-xs font-bold text-gray-300">Choose a Simulated Attachment</p>
                      </div>
                      <div className="flex flex-col max-h-48 overflow-y-auto">
                        {ATTACHMENT_OPTIONS.map((opt) => (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => {
                              setAttachedImageUrl(opt.url);
                              setShowAttachmentMenu(false);
                            }}
                            className={`px-3 py-2 text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              attachedImageUrl === opt.url
                                ? 'bg-brand-purple text-brand-sakura font-bold'
                                : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                            }`}
                          >
                            <span>{opt.name}</span>
                            {opt.url && (
                              <img src={opt.url} className="w-6 h-6 rounded object-cover ml-2" alt="demo" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trigger the Video Editing Suite */}
              <button
                type="button"
                onClick={() => {
                  setAttachVideoMode(!attachVideoMode);
                  setShowAttachmentMenu(false);
                  setAttachedImageUrl('');
                }}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  attachVideoMode 
                    ? 'text-brand-orange bg-brand-orange/10 font-bold' 
                    : 'text-gray-400 hover:text-brand-orange hover:bg-white/[0.03]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Studio</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange/80 hover:from-brand-sakura hover:to-brand-orange hover:text-brand-bg text-white font-medium px-5 py-2 rounded-xl text-xs transition-all duration-300 shadow-md shadow-brand-orange/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="flex flex-col gap-5">
        <AnimatePresence>
          {posts.map((post) => {
            const author = getUserDetails(post.userId);
            const isCommentsExpanded = !!expandedComments[post.id];
            const isAuthorMe = post.userId === currentUser.id;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`bg-brand-card rounded-2xl border overflow-hidden shadow-md group/card transition-all duration-300 ${
                  reportedPostIds.includes(post.id) ? 'border-amber-500/30 bg-[#1a1417]' : 'border-white/[0.05]'
                }`}
              >
                {reportedPostIds.includes(post.id) && (
                  <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-center justify-between text-[11px] text-amber-300">
                    <span className="flex items-center gap-2 font-semibold">
                      <Flag className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>This post was reported for community moderation review.</span>
                    </span>
                    <span className="text-[8px] bg-amber-500/25 text-amber-200 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                      Pending Review
                    </span>
                  </div>
                )}
                {/* Post Header */}
                <div className="p-5 flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={author.avatarUrl}
                        alt={author.displayName}
                        onClick={() => onViewUserProfile(author.id)}
                        className="w-10 h-10 rounded-full border-2 border-[#ffb7c5]/20 hover:border-brand-orange cursor-pointer object-cover transition-colors"
                      />
                      {author.isVerified && (
                        <span className="absolute -bottom-1 -right-1 bg-brand-bg rounded-full p-0.5" title="Verified Member">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-sheng-green fill-brand-bg" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          onClick={() => onViewUserProfile(author.id)}
                          className="font-semibold text-sm text-white hover:text-brand-sakura cursor-pointer flex items-center gap-1"
                        >
                          {author.displayName}
                        </span>
                        <span className="text-[10px] bg-brand-purple/50 text-brand-sakura font-mono px-1.5 py-0.5 rounded border border-[#ffb7c5]/10">
                          @{author.username}
                        </span>
                        {/* High fidelity verification tag banner */}
                        {author.isVerified && (
                          <span className="text-[8px] bg-brand-sheng-green/15 text-brand-sheng-green uppercase px-1.5 py-0.2 rounded font-mono font-bold tracking-tight">
                            Verified Otaku ⚡
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Post Kebab Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveKebabPostId(activeKebabPostId === post.id ? null : post.id)}
                      className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer"
                      title="Post menu"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>
                    
                    <AnimatePresence>
                      {activeKebabPostId === post.id && (
                        <>
                          {/* Invisible Click Outside Trigger */}
                          <div 
                            className="fixed inset-0 z-20 bg-transparent cursor-default" 
                            onClick={() => setActiveKebabPostId(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-1 w-44 bg-[#120e21] border border-[#ffb7c5]/20 rounded-xl shadow-2xl z-30 py-1.5 overflow-hidden backdrop-blur-md"
                          >
                            <button
                              onClick={() => {
                                setReportingPostId(post.id);
                                setReportReason('spam');
                                setReportDetails('');
                                setActiveKebabPostId(null);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-amber-400 hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer transition-colors font-medium font-sans"
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>Report Post</span>
                            </button>
                            
                            {isAuthorMe && (
                              <button
                                onClick={() => {
                                  handleDeletePost(post.id);
                                  setActiveKebabPostId(null);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer transition-colors font-medium font-sans border-t border-white/[0.04] mt-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Post</span>
                              </button>
                            )}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Post Body Content */}
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Render Posted Video with Live CSS Filters & Background Song overlays */}
                {post.videoUrl && (
                  <div className="border-t border-b border-[#ffb7c5]/5 p-2 bg-[#0c0a13]">
                    <VideoPost post={post} />
                  </div>
                )}

                {/* Attached Static Image */}
                {post.imageUrl && !post.videoUrl && (
                  <div className="border-t border-b border-[#ffb7c5]/5 max-h-[350px] overflow-hidden bg-brand-bg/40">
                    <img src={post.imageUrl} alt="Shared asset" className="w-full h-full object-cover animate-fade-in" />
                  </div>
                )}

                {/* Quick actions row */}
                <div className="px-5 py-3 bg-[#151125]/40 border-t border-[#ffb7c5]/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        post.isLikedByUser ? 'text-brand-orange animate-bounce font-bold' : 'text-gray-400 hover:text-brand-orange'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLikedByUser ? 'fill-current' : ''}`} />
                      <span className="font-mono font-bold">{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-sakura transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-mono font-bold">{post.comments.length}</span>
                    </button>
                  </div>

                  {/* Anime-themed Emoji Reactions */}
                  <div className="flex items-center gap-1.5 bg-black/25 p-1 rounded-xl border border-white/[0.03]">
                    {['kawaii', 'hype', 'shocked', 'feels'].map((key) => {
                      const reaction = post.reactions?.[key] || { 
                        emoji: key === 'kawaii' ? '🌸' : key === 'hype' ? '🔥' : key === 'shocked' ? '⚡' : '😭', 
                        count: 0, 
                        label: key === 'kawaii' ? 'Kawaii' : key === 'hype' ? 'Hype' : key === 'shocked' ? 'Shocked' : 'Feels', 
                        userIds: [] 
                      };
                      const userReacted = reaction.userIds.includes(currentUser.id);
                      return (
                        <button
                          key={key}
                          onClick={() => handleReactPost(post.id, key)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] transition-all duration-200 cursor-pointer ${
                            userReacted
                              ? 'bg-brand-orange/20 border border-brand-orange/40 text-[#ffb7c5] font-bold scale-[1.03]'
                              : reaction.count > 0
                              ? 'bg-white/[0.03] border border-white/[0.05] text-gray-300 hover:bg-white/[0.08]'
                              : 'bg-transparent text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/[0.02]'
                          }`}
                          title={`${reaction.label}`}
                        >
                          <span className="text-xs transform scale-100 hover:scale-130 transition-transform">{reaction.emoji}</span>
                          <span className="font-mono font-bold text-[9px]">{reaction.count}</span>
                          <span className="hidden sm:inline-block text-[8px] opacity-65 uppercase tracking-wide">{reaction.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comments Section */}
                {isCommentsExpanded && (
                  <div className="p-5 border-t border-[#ffb7c5]/5 bg-brand-bg/20">
                    {post.comments.length > 0 && (
                      <div className="flex flex-col gap-4 mb-4">
                        {post.comments.map((comment) => {
                          const commenter = getUserDetails(comment.userId);
                          return (
                            <div key={comment.id} className="flex gap-3 items-start text-xs">
                              <img
                                src={commenter.avatarUrl}
                                alt={commenter.displayName}
                                onClick={() => onViewUserProfile(commenter.id)}
                                className="w-8 h-8 rounded-full border border-white/[0.05] object-cover cursor-pointer"
                              />
                              <div className="flex-1 bg-[#151125]/80 p-3 rounded-2xl border border-white/[0.03]">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    onClick={() => onViewUserProfile(commenter.id)}
                                    className="font-semibold text-white hover:text-brand-sakura cursor-pointer flex items-center gap-1"
                                  >
                                    {commenter.displayName}
                                    {commenter.isVerified && (
                                      <CheckCircle2 className="w-3 h-3 text-brand-sheng-green" />
                                    )}
                                  </span>
                                  <span className="text-[9px] text-gray-500 font-mono">
                                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-gray-300 mt-1 leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Comment Input Form */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center gap-2">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName}
                        className="w-7 h-7 rounded-full border border-brand-orange object-cover"
                      />
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        placeholder="Andika jibu hapa..."
                        className="flex-1 bg-brand-bg/50 border border-[#ffb7c5]/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-sakura placeholder-gray-500 text-white"
                      />
                      <button
                        type="submit"
                        disabled={!(commentInputs[post.id] || '').trim()}
                        className="p-2 bg-brand-purple/60 text-brand-sakura rounded-xl hover:bg-brand-sakura hover:text-brand-bg transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 6. REPORT & MODERATION CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {reportingPostId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              className="bg-[#151125] w-full max-w-md rounded-2xl border border-[#ffb7c5]/30 p-6 text-left shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.05]">
                <div className="flex items-center gap-2 text-amber-400">
                  <Flag className="w-4 h-4" />
                  <h3 className="font-sans font-bold text-white text-sm">
                    Report Post for Moderation
                  </h3>
                </div>
                <button
                  onClick={() => setReportingPostId(null)}
                  className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="my-4 text-xs text-[#ebd9e0] space-y-4">
                <p>
                  Help us keep Animatopia safe and friendly! Please choose the category that fits best:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: 'spam', label: '🚨 Spam / Promotion' },
                    { id: 'off_topic', label: '🚫 Not Anime Related' },
                    { id: 'inappropriate', label: '🔞 Inappropriate content' },
                    { id: 'harassment', label: '⚔️ Harassment/Abuse' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setReportReason(item.id)}
                      className={`p-2.5 rounded-xl border text-left text-[11px] font-medium transition-all cursor-pointer ${
                        reportReason === item.id
                          ? 'border-brand-orange bg-brand-orange/10 text-white font-bold scale-[1.02]'
                          : 'border-white/[0.04] bg-white/[0.02] text-gray-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Additional Context (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide specific details about why this violates guidelines..."
                    className="bg-brand-bg/90 border border-[#ffb7c5]/15 text-white text-xs rounded-lg px-3 py-2 w-full focus:border-brand-orange focus:outline-none placeholder-gray-600 resize-none font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setReportingPostId(null)}
                  className="bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReport}
                  className="bg-brand-orange hover:bg-brand-orange/80 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-brand-orange/10"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Success Toast Notification */}
      <AnimatePresence>
        {reportSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
            className="fixed bottom-6 left-1/2 bg-brand-card border-2 border-brand-sheng-green px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 max-w-sm backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-brand-sheng-green/15 flex items-center justify-center text-brand-sheng-green shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white uppercase tracking-tight">Report Logged successfully</p>
              <p className="text-[10px] text-gray-300 leading-normal font-sans mt-0.5">{reportSuccessToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

