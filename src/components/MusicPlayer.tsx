import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "Synthwave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-pink"
  },
  {
    id: 2,
    title: "Electric Dreams",
    artist: "Digital Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-blue"
  },
  {
    id: 3,
    title: "Cyber City",
    artist: "Glitch Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-green"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Playback failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setProgress(parseFloat(e.target.value));
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div id="music-player-container" className="glass-panel p-6 rounded-3xl w-full max-w-[400px] border border-white/5 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-pink/10 blur-[60px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-blue/10 blur-[60px] rounded-full" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      {/* Visualizer Mock */}
      <div className="flex items-end justify-center gap-1 h-12 mb-8 px-4">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [10, 48, 20, 48, 10] : 4,
              backgroundColor: isPlaying ? ["#ff007a", "#00f3ff", "#39ff14"] : "#333"
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            className="w-1.5 rounded-full"
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
          <Music2 className={`w-8 h-8 text-${currentTrack.color}`} />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-lg truncate leading-tight uppercase tracking-tight">{currentTrack.title}</h3>
          <p className="text-white/40 text-sm font-mono uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4 mb-8">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-white/20">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + (Math.floor(audioRef.current.currentTime % 60)).toString().padStart(2, '0') : "0:00"}</span>
          <span>{audioRef.current?.duration ? Math.floor(audioRef.current.duration / 60) + ":" + (Math.floor(audioRef.current.duration % 60)).toString().padStart(2, '0') : "0:00"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button onClick={prevTrack} className="p-3 text-white/40 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? "bg-white text-black scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-neon-pink text-white shadow-neon-pink"
          }`}
        >
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </button>
        
        <button onClick={nextTrack} className="p-3 text-white/40 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
        <Volume2 className="w-4 h-4 text-white/20" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
