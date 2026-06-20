import React, { useState, useEffect } from 'react';
import { User, Post, Anime, Group, Event, Message, WatchlistItem, WatchlistStatus } from './types';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_ANIME,
  MOCK_POSTS,
  MOCK_GROUPS,
  MOCK_EVENTS,
  DEFAULT_WATCHLIST,
  MOCK_MESSAGES
} from './data';
import Navbar from './components/Navbar';
import FeedSection from './components/FeedSection';
import AnimeSection from './components/AnimeSection';
import GroupsSection from './components/GroupsSection';
import ChatSection from './components/ChatSection';
import ProfileSection from './components/ProfileSection';
import { Sparkles, MapPin, Calendar, Clock, Smile, Award, X, LogIn, Swords, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import noMeetupsPlaceholder from './assets/images/no_meetups_anime_1781978735190.jpg';

export default function App() {
  // Navigation & session state
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [currentUser, setCurrentUser] = useState<User>({ ...CURRENT_USER, isVerified: true });
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Sign In / Sign Up and Verification parameters
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [generatedOTP, setGeneratedOTP] = useState<string>('');
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [authForm, setAuthForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: ''
  });
  const [tempAuthUser, setTempAuthUser] = useState<User | null>(null);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin') {
      // Create user node matching details
      const targetUser: User = {
        id: `user_${Date.now()}`,
        username: authForm.username || 'otaku_chief',
        displayName: authForm.displayName || 'Chief Otaku',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: 'Techie, AMV creator, and otaku regular base!',
        location: 'Kaimosi, Kenya',
        badges: ['Techie Regular'],
        followersCount: 5,
        followingCount: 3,
        isVerified: false
      };
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOTP(code);
      setTempAuthUser(targetUser);
      setAuthMode('verify');
    } else if (authMode === 'signup') {
      const targetUser: User = {
        id: `user_${Date.now()}`,
        username: authForm.username || 'kaimosi_recruit',
        displayName: authForm.displayName || 'Local Hero',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bio: authForm.email ? `Registered under ${authForm.email}` : 'Signed up to our Kaimosi Otaku community!',
        location: 'Kaimosi, Kenya',
        badges: ['Recruit Star'],
        followersCount: 0,
        followingCount: 0,
        isVerified: false
      };
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOTP(code);
      setTempAuthUser(targetUser);
      setAuthMode('verify');
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOTP === generatedOTP && tempAuthUser) {
      const verifiedUser: User = {
        ...tempAuthUser,
        isVerified: true,
        badges: [...tempAuthUser.badges, 'Verified Otaku ⚡']
      };
      setCurrentUser(verifiedUser);
      setUsers([verifiedUser, ...users]);
      setIsAuthModalOpen(false);
      setEnteredOTP('');
      setGeneratedOTP('');
      setOtpError('');
    } else {
      setOtpError('Aiya! Hiyo OTP haijakubaliwa. Try copying the broadcast key exactly.');
    }
  };

  const handleLogout = () => {
    const guestUser: User = {
      id: 'guest_user',
      username: 'kaimosi_guest',
      displayName: 'Guest Otaku',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Welcome to Animatopia! Please Sign Up or Sign In to write posts, share anime videos with custom song overlays, and access AI content matching!',
      location: 'Kaimosi, Kenya',
      badges: ['Initiate Scholar'],
      followersCount: 0,
      followingCount: 0,
      isVerified: false,
    };
    setCurrentUser(guestUser);
    setIsAuthModalOpen(false);
  };

  // Other user profile preview modal state
  const [previewUserId, setPreviewUserId] = useState<string | null>(null);

  // Notifications dropdown hover state
  const [isBellHovered, setIsBellHovered] = useState<boolean>(false);
  const [bellFilter, setBellFilter] = useState<'all' | 'interested' | 'going'>('all');
  const [bellSearchQuery, setBellSearchQuery] = useState<string>('');

  // Real-time local timezone clock handler
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Safe localized representation
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update watchlist or rating action
  const handleUpdateWatchlist = (animeId: string, status: WatchlistStatus, progress: number, rating?: number) => {
    const existing = watchlist.find((item) => item.animeId === animeId);
    let updatedList: WatchlistItem[];

    const matchedAnime = MOCK_ANIME.find((a) => a.id === animeId);
    const maxEp = matchedAnime ? matchedAnime.episodes : 12;

    if (existing) {
      updatedList = watchlist.map((item) => {
        if (item.animeId === animeId) {
          return {
            ...item,
            status,
            progress: Math.min(progress, maxEp),
            rating: rating !== undefined ? rating : item.rating,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      });
    } else {
      updatedList = [
        ...watchlist,
        {
          id: `wl_${Date.now()}`,
          userId: currentUser.id,
          animeId,
          status,
          progress: Math.min(progress, maxEp),
          maxEpisodes: maxEp,
          rating,
          updatedAt: new Date().toISOString()
        }
      ];
    }
    setWatchlist(updatedList);
  };

  const handleRemoveFromWatchlist = (animeId: string) => {
    setWatchlist(watchlist.filter((item) => item.animeId !== animeId));
  };

  // Profile biography card save changes
  const handleUpdateBio = (displayName: string, bio: string) => {
    setCurrentUser({
      ...currentUser,
      displayName,
      bio
    });
  };

  // Follow/Unfollow toggles for other mock users
  const handleToggleFollowUser = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const isNowFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing: isNowFollowing,
            followersCount: isNowFollowing ? u.followersCount + 1 : u.followersCount - 1
          };
        }
        return u;
      })
    );
  };

  const previewUser = previewUserId ? (previewUserId === currentUser.id ? currentUser : users.find((u) => u.id === previewUserId)) : null;

  return (
    <div className="min-h-screen bg-brand-bg text-gray-200 flex flex-col md:flex-row font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Sidebar navigation component */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPreviewUserId(null); // Clear preview when shifting tabs
        }}
        currentUser={currentUser}
        unreadCount={2}
        onOpenAuth={() => {
          setOtpError('');
          setEnteredOTP('');
          setAuthForm({ username: '', displayName: '', email: '', password: '' });
          setAuthMode('signin');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Container Layout */}
      <main className="flex-1 flex flex-col relative min-w-0 md:h-screen md:overflow-y-auto">
        
        {/* Global Dashboard Sticky Header with Local Clock info */}
        <header className="sticky top-0 z-40 bg-brand-bg/85 backdrop-blur-md border-b border-[#ffb7c5]/5 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:hidden">
            <Swords className="w-5 h-5 text-brand-orange" />
            <h1 className="font-display font-bold text-lg text-white">Animatopia</h1>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs bg-brand-card text-brand-sakura font-bold font-mono px-3 py-1 rounded-full border border-white/[0.04]">
              Kaimosi Friends Univ District
            </span>
            <span className="text-xs text-gray-400">Welcome back, Ken Amadi!</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell Icon with Details Hover Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsBellHovered(true)}
              onMouseLeave={() => setIsBellHovered(false)}
            >
              <button
                id="meetup-notification-bell"
                onClick={() => {
                  setActiveTab('groups');
                  setIsBellHovered(false);
                }}
                className="relative p-2 text-gray-400 hover:text-brand-orange hover:bg-brand-card/60 rounded-xl transition-all border border-transparent hover:border-brand-sakura/10 flex items-center justify-center cursor-pointer"
                aria-label="Upcoming Meetups Notification"
              >
                <Bell className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
                {events.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[10px] font-bold font-mono h-4 w-4 rounded-full flex items-center justify-center animate-pulse border border-brand-bg">
                    {events.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isBellHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-brand-card border border-[#ffb7c5]/15 rounded-2xl shadow-2xl overflow-hidden z-50 glassmorphism"
                  >
                    <div className="p-4 border-b border-[#ffb7c5]/15 flex justify-between items-center bg-brand-purple/20">
                      <h4 className="font-display font-bold text-xs text-brand-sakura uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                        Upcoming Meetups
                      </h4>
                      <span className="text-[10px] font-mono bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full border border-brand-orange/10 font-bold">
                        {events.length} Active
                      </span>
                    </div>

                    {/* Meets keyword search input field */}
                    <div className="p-2 border-b border-white/[0.05] bg-brand-bg/60">
                      <div className="relative flex items-center">
                        <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Search meetups by keyword..."
                          value={bellSearchQuery}
                          onChange={(e) => setBellSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-brand-bg border border-[#ffb7c5]/10 rounded-xl pl-8 pr-7 py-1.5 text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/40 focus:bg-brand-bg transition-all font-mono"
                        />
                        {bellSearchQuery && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBellSearchQuery('');
                            }}
                            className="absolute right-2.5 text-gray-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter system toggle button bar */}
                    <div className="flex border-b border-white/[0.05] bg-brand-bg/40 p-1.5 gap-1">
                      {(['all', 'interested', 'going'] as const).map((filterOpt) => {
                        const count = filterOpt === 'all' 
                          ? events.length 
                          : filterOpt === 'interested'
                            ? events.filter(e => e.userRsvp === 'maybe').length
                            : events.filter(e => e.userRsvp === 'going').length;

                        const isActive = bellFilter === filterOpt;
                        return (
                          <button
                            key={filterOpt}
                            onClick={(e) => {
                              e.stopPropagation();
                              setBellFilter(filterOpt);
                            }}
                            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold font-mono transition-all capitalize flex items-center justify-center gap-1 cursor-pointer border ${
                              isActive
                                ? 'bg-brand-orange text-white border-brand-orange shadow'
                                : 'text-gray-400 hover:text-white bg-transparent border-transparent hover:bg-white/[0.04]'
                            }`}
                          >
                            <span>{filterOpt}</span>
                            <span 
                              className={`text-[9px] px-1.5 py-0.1 rounded-md font-mono ${
                                isActive ? 'bg-white/20 text-white' : 'bg-white/[0.07] text-gray-400'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {(() => {
                        const filteredEvents = events.filter((meetup) => {
                          const matchesFilter = bellFilter === 'all' ||
                            (bellFilter === 'interested' && meetup.userRsvp === 'maybe') ||
                            (bellFilter === 'going' && meetup.userRsvp === 'going');

                          const matchesSearch = !bellSearchQuery.trim() || 
                            meetup.title.toLowerCase().includes(bellSearchQuery.trim().toLowerCase());

                          return matchesFilter && matchesSearch;
                        });

                        if (filteredEvents.length === 0) {
                          return (
                            <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2.5">
                              <img
                                src={noMeetupsPlaceholder}
                                alt="Confused Chibi Anime Placeholder"
                                className="w-20 h-20 rounded-2xl object-cover border border-[#ffb7c5]/15 shadow-md bg-brand-bg/50"
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-medium text-gray-300">No meetups match "{bellFilter}" status.</span>
                              {bellFilter !== 'all' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBellFilter('all');
                                  }}
                                  className="text-[10px] text-brand-sakura underline mt-1 cursor-pointer hover:text-brand-orange font-mono font-bold"
                                >
                                  View All ({events.length})
                                </button>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div className="divide-y divide-white/[0.04]">
                            {filteredEvents.map((meetup) => {
                              const groupName = groups.find((g) => g.id === meetup.groupId)?.name || 'Kaimosi Otakus';
                              return (
                                <div
                                  key={meetup.id}
                                  onClick={() => {
                                    setActiveTab('groups');
                                    setIsBellHovered(false);
                                  }}
                                  className="p-4 hover:bg-brand-purple/20 transition-all cursor-pointer flex flex-col gap-1.5 group/item text-left"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <h5 className="font-sans font-bold text-xs text-white group-hover/item:text-brand-orange transition-colors line-clamp-1">
                                      {meetup.title}
                                    </h5>
                                    {meetup.userRsvp && (
                                      <span className="text-[9px] font-mono bg-brand-sheng-green/10 text-brand-sheng-green uppercase px-1.5 py-0.5 rounded font-bold border border-brand-sheng-green/5 whitespace-nowrap">
                                        {meetup.userRsvp === 'maybe' ? 'interested' : meetup.userRsvp}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-brand-sakura font-mono line-clamp-1">
                                    {groupName}
                                  </p>
                                  <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed font-sans">
                                    {meetup.description}
                                  </p>
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1 pt-1.5 border-t border-white/[0.02] flex-wrap gap-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-brand-orange" />
                                      {(() => {
                                        const d = new Date(meetup.startTime);
                                        const EATOptions: Intl.DateTimeFormatOptions = {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: false,
                                          timeZone: 'Africa/Nairobi'
                                        };
                                        return `${d.toLocaleDateString('en-US', EATOptions)} EAT`;
                                      })()}
                                    </span>
                                    <span className="bg-white/[0.04] px-1.5 py-0.5 rounded text-[9px] text-gray-300">
                                      {meetup.rsvpCount} going
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="p-3 bg-brand-bg/40 border-t border-white/[0.04] text-center">
                      <button
                        onClick={() => {
                          setActiveTab('groups');
                          setIsBellHovered(false);
                        }}
                        className="text-[10px] text-brand-sakura hover:text-brand-orange font-bold font-mono transition-colors tracking-tight flex items-center justify-center gap-1 mx-auto"
                      >
                        Navigate to Clubs & Events &rarr;
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-brand-sakura bg-brand-card/90 px-3 py-1.5 rounded-xl border border-[#ffb7c5]/8">
              <Clock className="w-3.5 h-3.5 text-brand-orange animate-spin" style={{ animationDuration: '6s' }} />
              <span>{currentTime || '12:00:00'} EAT</span>
            </div>
          </div>
        </header>

        {/* Content Section based on selected navbar tab */}
        <div className="p-4 md:p-8 flex-1 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {activeTab === 'feed' && (
                <FeedSection
                  posts={posts}
                  setPosts={setPosts}
                  currentUser={currentUser}
                  users={users}
                  onViewUserProfile={(userId) => setPreviewUserId(userId)}
                />
              )}

              {activeTab === 'anime' && (
                <AnimeSection
                  animeList={MOCK_ANIME}
                  watchlist={watchlist}
                  onUpdateWatchlist={handleUpdateWatchlist}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                />
              )}

              {activeTab === 'groups' && (
                <GroupsSection
                  groups={groups}
                  events={events}
                  setGroups={setGroups}
                  setEvents={setEvents}
                />
              )}

              {activeTab === 'chat' && (
                <ChatSection
                  messages={messages}
                  setMessages={setMessages}
                  currentUser={currentUser}
                  users={users}
                  groups={groups}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileSection
                  user={currentUser}
                  onUpdateBio={handleUpdateBio}
                  watchlist={watchlist}
                  animeList={MOCK_ANIME}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* User profile detail preview overlays */}
      <AnimatePresence>
        {previewUserId && previewUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 25 }}
              className="bg-brand-card w-full max-w-md rounded-3xl overflow-hidden border border-[#ffb7c5]/20 shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                <h3 className="font-display font-semibold text-white text-sm">Detailed Profile Preview</h3>
                <button
                  onClick={() => setPreviewUserId(null)}
                  className="text-gray-400 hover:text-white font-bold text-lg"
                >
                  &times;
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 text-center mt-6">
                <img
                  src={previewUser.avatarUrl}
                  className="w-20 h-20 rounded-full border-4 border-brand-orange object-cover shadow-xl"
                  alt={previewUser.displayName}
                />
                <div>
                  <h4 className="text-white font-bold font-display text-base">{previewUser.displayName}</h4>
                  <p className="text-xs text-brand-sakura font-mono mt-1">@{previewUser.username}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-1 justify-center">
                    <MapPin className="w-3 h-3 text-brand-orange" />
                    {previewUser.location}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-300 bg-brand-bg/60 p-4 rounded-xl border border-white/[0.02] mt-4 leading-relaxed font-sans italic text-center">
                "{previewUser.bio}"
              </p>

              <div className="flex items-center justify-center gap-6 mt-4 py-3 border-t border-b border-white/[0.04]">
                <div className="text-center">
                  <p className="text-xs font-mono font-bold text-brand-orange">{previewUser.followersCount}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-mono">followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-mono font-bold text-brand-orange">{previewUser.followingCount}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-mono">following</p>
                </div>
              </div>

              {/* Badges and Follow actions */}
              <div className="flex flex-col gap-4 mt-6">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block mb-2 text-center">AWARDS & CLUBS</span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {previewUser.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-[10px] bg-brand-purple/40 text-brand-sakura border border-[#ffb7c5]/10 px-2.5 py-1 rounded-lg font-bold"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {previewUser.id !== currentUser.id && (
                  <button
                    onClick={() => {
                      handleToggleFollowUser(previewUser.id);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-display transition-all ${
                      previewUser.isFollowing
                        ? 'bg-brand-purple/30 text-brand-sakura border border-brand-sakura/10 hover:bg-brand-orange hover:text-white'
                        : 'bg-brand-orange text-white hover:opacity-90'
                    }`}
                  >
                    {previewUser.isFollowing ? 'Unfollow' : 'Follow User'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTH & VERIFICATION DIALOG MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 selection:bg-brand-orange selection:text-white"
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 30 }}
              className="bg-brand-card w-full max-w-md rounded-3xl overflow-hidden border border-[#ffb7c5]/25 shadow-2xl flex flex-col p-6 text-left"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-brand-orange animate-bounce" />
                  <h3 className="font-display font-bold text-white text-sm">
                    {authMode === 'verify' ? 'Vihiga Otaku Verification' : 'Manage Animatopia Node'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {authMode !== 'verify' ? (
                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center justify-center gap-2 bg-brand-bg/50 p-1.5 rounded-xl border border-white/[0.02]">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        authMode === 'signin' ? 'bg-brand-orange text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Login Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        authMode === 'signup' ? 'bg-brand-orange text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Create Node
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Username (Unique handle)</label>
                    <input
                      type="text"
                      required
                      value={authForm.username}
                      onChange={(e) => setAuthForm({ ...authForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                      placeholder="e.g. naruto_mwangi"
                      className="bg-brand-bg/60 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Display Name (Visible Nickname)</label>
                    <input
                      type="text"
                      required
                      value={authForm.displayName}
                      onChange={(e) => setAuthForm({ ...authForm, displayName: e.target.value })}
                      placeholder="e.g. Mwangi Ken"
                      className="bg-brand-bg/60 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Email (For Sync/Keys)</label>
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        placeholder="e.g. bazu@kaimosi.ac.ke"
                        className="bg-brand-bg/60 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none placeholder-gray-600"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Security Passcode (Password)</label>
                    <input
                      type="password"
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="bg-brand-bg/60 border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2 focus:border-brand-orange focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-orange to-brand-purple hover:brightness-110 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider mt-2 transition-all cursor-pointer"
                  >
                    {authMode === 'signin' ? 'Verify login & Request OTP' : 'Request Security Registration OTP'}
                  </button>

                  <div className="border-t border-white/[0.05] pt-3 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-[10px] text-gray-400 hover:text-red-400 transition-colors bg-white/[0.03] p-2 rounded-lg font-mono cursor-pointer"
                    >
                      🚪 Decouple Session (Sign Out Current Node)
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4 mt-4 text-center">
                  <div className="p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl text-left">
                    <h4 className="text-brand-orange font-bold font-display text-xs mb-1">
                      🔐 OTP Verification Signal Broadcasted!
                    </h4>
                    <p className="text-[10px] text-gray-300">
                      Under Animatopia network protocols, we have broadcasted secure keys to your registered profile node check.
                    </p>
                  </div>

                  {/* Randomized code generated block for direct input convenience */}
                  <div className="p-4 bg-[#10071c] border border-brand-purple/40 rounded-xl relative overflow-hidden text-center">
                    <span className="text-[8px] font-mono text-brand-sakura uppercase block mb-1">Secure Broadcast Channel Key</span>
                    <span className="text-xl font-bold text-white font-mono tracking-widest bg-brand-purple/30 p-2 rounded block">
                      {generatedOTP}
                    </span>
                    <span className="text-[9px] text-[#ffb7c5] block mt-1 font-mono">
                      (Type this 4-digit token below to complete Verification checks)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-w-[160px] mx-auto">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Input 4-digit OTP</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={enteredOTP}
                      onChange={(e) => {
                        setOtpError('');
                        setEnteredOTP(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="0000"
                      className="bg-brand-bg/85 border border-[#ffb7c5]/30 text-center text-lg font-bold font-mono tracking-widest text-[#ffb7c5] rounded-xl py-2 focus:border-brand-orange focus:outline-none placeholder-gray-700"
                    />
                  </div>

                  {otpError && (
                    <p className="text-[10px] text-red-400 font-mono italic animate-pulse">{otpError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="flex-1 bg-white/[0.04] text-gray-300 font-bold py-2 px-3 rounded-lg text-xs cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brand-sheng-green text-[#100c25] font-bold py-2 px-3 rounded-lg text-xs hover:brightness-110 cursor-pointer"
                    >
                      Verify Token
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
