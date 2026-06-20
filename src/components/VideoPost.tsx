import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  Music, Sliders, Disc, Sparkles, AlertCircle
} from 'lucide-react';
import { Post } from '../types';

interface VideoPostProps {
  post: Post;
}

const PRESET_SONGS = [
  { title: 'Shonen Battle Theme ⚔️', artist: 'Hokage beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Vaporwave Night Ride 🏎️', artist: 'Neon Rider', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Kaimosi Lo-Fi Sunset 🌸', artist: 'Chavakali Kid', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'Shinobi Shadow Drums 🥁', artist: 'Uchiha Clan', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
];

export default function VideoPost({ post }: VideoPostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Control States
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // AutoPlay default
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted as standard feed requirement
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Locate the song info
  const matchedSong = PRESET_SONGS.find(s => s.title === post.songTitle);
  const audioUrl = matchedSong?.url || '';
  const songArtist = matchedSong?.artist || 'Unknown Otaku Composer';

  // Toggle play-pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => console.log('Autoplay play blocked: ', err));
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(err => console.log('Audio track sync delay: ', err));
      }
      setIsPlaying(true);
    }
    triggerControlsVisibility();
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;

    if (audioRef.current) {
      audioRef.current.muted = nextMute;
      if (!nextMute && isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
    triggerControlsVisibility();
  };

  // Volume slider update
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  // Timeline Progress updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    videoRef.current.currentTime = val;
    setCurrentTime(val);

    // Synchronize background track if present
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = val % audioRef.current.duration;
    }
  };

  // Full Screen Actions
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen failed: ', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Controls visibility management on mouse movement
  const triggerControlsVisibility = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    // Handle fullscreen escape key updates
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [controlsTimeout]);

  // Synchronize dynamic play states on mount and video updates
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
      
      // Auto playing
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
    
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [post.videoUrl, isMuted, volume]);

  useEffect(() => {
    // Sync audio playing with video state
    if (audioRef.current) {
      if (isPlaying && !isMuted && audioUrl) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, audioUrl]);

  // Helper formatting mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      id={`video-container-${post.id}`}
      ref={containerRef}
      onMouseMove={triggerControlsVisibility}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/95 group/player border border-white/[0.04] select-none"
    >
      {/* 1. Underlying Video Object with CSS Filters */}
      <video
        ref={videoRef}
        src={post.videoUrl}
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer transition-all duration-300"
        style={{
          filter: post.videoEffect === 'vapourwave' ? 'hue-rotate(90deg) saturate(1.8) brightness(1.1) contrast(1.1)' :
                  post.videoEffect === 'retro' ? 'contrast(1.2) brightness(0.9) saturate(0.85) sepia(0.2)' :
                  post.videoEffect === 'mono' ? 'grayscale(1) contrast(1.6)' :
                  post.videoEffect === 'cyberpunk' ? 'hue-rotate(180deg) brightness(1.2) saturate(2) contrast(1.25)' : 'none'
        }}
      />

      {/* Hidden Audio element for custom soundtracks */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop
        />
      )}

      {/* 2. Style Aesthetics Badge Header */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        <span className="bg-black/85 backdrop-blur-md border border-white/10 text-white font-mono text-[9px] px-2.5 py-1 rounded-lg flex items-center gap-1">
          <Sliders className="w-3 h-3 text-brand-orange animate-spin" style={{ animationDuration: '6s' }} />
          <span>Style: <strong className="text-brand-sakura uppercase text-[8px]">{post.videoEffect || 'Original'}</strong></span>
        </span>
        {post.songTitle && (
          <span className="bg-brand-orange/90 text-white border border-brand-orange/30 font-mono text-[9px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md animate-pulse">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Audio Linked</span>
          </span>
        )}
      </div>

      {/* 3. High Fidelity Music Credits Overlay */}
      {post.songTitle && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-black/95 backdrop-blur-md border border-brand-orange/20 p-2 rounded-xl flex items-center gap-3 shadow-lg max-w-[200px] sm:max-w-[250px] transition-all">
            {/* Spinning Vinyl Record Disc */}
            <div className="relative shrink-0">
              <Disc className={`w-8 h-8 text-brand-orange ${isPlaying && !isMuted ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <div className="absolute inset-2 bg-[#120a21] border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
              </div>
            </div>

            {/* Song Credits */}
            <div className="overflow-hidden text-left flex-1 select-none">
              <span className="text-[8px] text-brand-sakura font-mono uppercase block tracking-wider font-bold">Synchronized Track</span>
              <p className="text-[10px] text-white font-bold truncate font-sans leading-tight mt-0.5" title={post.songTitle}>
                {post.songTitle}
              </p>
              <p className="text-[9px] text-gray-400 font-mono truncate">
                by {songArtist}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Playback State Screen Flash Indicator */}
      <div 
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-all bg-black/25 cursor-pointer ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {!isPlaying && (
          <div className="p-4 rounded-full bg-brand-orange/20 border border-brand-orange/40 backdrop-blur-md text-white shadow-xl transform transition-transform group-hover/player:scale-110">
            <Play className="w-8 h-8 text-brand-orange fill-brand-orange" />
          </div>
        )}
      </div>

      {/* 5. Custom Control Surface Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-2.5 transition-all duration-300 z-10 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        {/* Timeline Slider Progress tracker */}
        <div className="flex items-center gap-3">
          <input 
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange hover:h-1.5 transition-all"
            style={{
              background: `linear-gradient(to right, #ff7e40 0%, #ff7e40 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.1) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
            }}
          />
        </div>

        {/* Buttons and adjustments row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause control */}
            <button
              onClick={togglePlay}
              className="text-gray-200 hover:text-brand-orange transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Sound Control Slider Section */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="text-gray-200 hover:text-brand-sakura transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-brand-orange" />}
              </button>
              
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-sakura"
                style={{
                  background: `linear-gradient(to right, #ffb7c5 0%, #ffb7c5 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
            </div>

            {/* Time counters stamp (current elapsed / total length) */}
            <span className="text-[10px] font-mono text-gray-300">
              {formatTime(currentTime)} <span className="text-gray-500">/</span> {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync equalizers design visual element */}
            {isPlaying && !isMuted && post.songTitle && (
              <div className="flex gap-0.5 items-end h-3 mr-1" title="Sound Synced">
                <span className="w-0.5 bg-brand-orange animate-[bounce_1s_infinite_100ms]" style={{ height: '70%' }} />
                <span className="w-0.5 bg-brand-sakura animate-[bounce_1.2s_infinite_300ms]" style={{ height: '100%' }} />
                <span className="w-0.5 bg-brand-orange animate-[bounce_0.8s_infinite_400ms]" style={{ height: '40%' }} />
                <span className="w-0.5 bg-brand-sakura animate-[bounce_1.1s_infinite_200ms]" style={{ height: '85%' }} />
              </div>
            )}

            {/* Fullscreen Trigger */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-200 hover:text-brand-orange transition-colors cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
