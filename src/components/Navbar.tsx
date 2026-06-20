import { Home, Tv, Users, MessageSquare, User, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType;
  unreadCount: number;
  onOpenAuth: () => void;
}

export default function Navbar({ activeTab, setActiveTab, currentUser, unreadCount, onOpenAuth }: NavbarProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'anime', label: 'Anime Hub', icon: Tv },
    { id: 'groups', label: 'Meetups', icon: Users },
    { id: 'chat', label: 'Sheng Chat', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'profile', label: 'Me', icon: User },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-card border-r border-[#ffb7c5]/10 h-screen sticky top-0 p-6 justify-between shrink-0">
        <div className="flex flex-col gap-8 h-full">
          {/* Logo Brand area */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-brand-orange to-brand-sakura p-2 rounded-xl text-brand-bg shadow-lg shadow-brand-orange/20 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-white m-0">
                Animatopia
              </h1>
              <span className="text-[10px] uppercase tracking-wider text-brand-sakura font-bold font-mono">
                Kaimosi 🇰🇪
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2 flex-grow">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple to-transparent text-white border-l-4 border-brand-orange shadow-md shadow-brand-orange/5'
                      : 'text-gray-400 hover:text-brand-sakura hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-orange' : 'text-gray-400'}`} />
                  <span className="font-display text-sm relative">
                    {item.label}
                    {item.badge !== undefined && (
                      <span className="absolute -right-6 top-1/2 -translate-y-1/2 bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick User summary at bottom - Trigger Modal on click */}
          <div 
            onClick={onOpenAuth}
            className="mt-auto border border-[#ffb7c5]/10 hover:border-brand-orange pt-4 flex flex-col gap-2 bg-[#151125]/40 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
            title="Manage Otaku Account / Verify Status"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded-full border-2 border-brand-orange object-cover"
                />
                {currentUser.isVerified && (
                  <span className="absolute -bottom-1 -right-1 bg-brand-sheng-green text-brand-bg rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#100c25] fill-current" />
                  </span>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate text-white flex items-center gap-1">
                  {currentUser.displayName}
                </p>
                <p className="text-xs text-brand-sakura truncate font-mono flex items-center justify-between">
                  <span>@{currentUser.username}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-[9px] font-mono bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
              <span className="text-gray-400 uppercase">Account Status</span>
              {currentUser.isVerified ? (
                <span className="text-brand-sheng-green font-bold uppercase tracking-tight">Verified Otaku ⚡</span>
              ) : (
                <span className="text-amber-400 font-bold uppercase tracking-tight animate-pulse flex items-center gap-1">
                  <LogIn className="w-2.5 h-2.5" /> Tap to Login/Verify
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Bottom Nav bar for Mobile Devices */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-card/95 backdrop-blur-md border-t border-[#ffb7c5]/10 px-4 py-2 z-50 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 py-1 px-3 relative transition-all duration-200"
            >
              <Icon
                className={`w-5.5 h-5.5 transition-colors ${
                  isActive ? 'text-brand-orange scale-110' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-[10px] font-display transition-colors ${
                  isActive ? 'text-white font-medium' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="absolute right-2 top-0 bg-brand-orange text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        
        {/* Mobile Account Access Button */}
        <button
          onClick={onOpenAuth}
          className="flex flex-col items-center gap-1 py-1 px-3 relative transition-all duration-200"
        >
          <div className="relative">
            <img src={currentUser.avatarUrl} className="w-5.5 h-5.5 rounded-full object-cover border border-brand-orange" />
            {currentUser.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-brand-sheng-green text-brand-bg rounded-full p-0.2">
                <CheckCircle2 className="w-2 h-2 text-[#100c25] fill-current" />
              </span>
            )}
          </div>
          <span className="text-[10px] font-display text-gray-400">
            {currentUser.isVerified ? 'Verified' : 'Access'}
          </span>
        </button>
      </nav>
    </>
  );
}
