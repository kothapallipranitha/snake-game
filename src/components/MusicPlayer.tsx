import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Synthetic AI Drift', artist: 'Auto-Gen 01', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Neural Network Groove', artist: 'Deep Seq 4', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Algorithmic Pulse', artist: 'Generative Beats', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.warn('Autoplay prevented', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.warn('Playback prevented', e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  return (
    <div className="flex flex-col bg-gray-900 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-2xl p-6 w-full max-w-sm">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleNext}
      />
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)] border border-purple-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
          <Disc className="text-purple-400" size={24} />
        </div>
        <div className="flex-[1] min-w-0">
            <h3 className="text-purple-300 font-bold truncate text-lg tracking-wide shadow-purple-500 drop-shadow-[0_0_5px_rgba(216,180,254,0.8)]">{currentTrack.title}</h3>
            <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrev} className="text-gray-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlay} className="w-14 h-14 flex items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:bg-cyan-900 transition-all hover:scale-105">
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>
        <button onClick={handleNext} className="text-gray-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-3 text-gray-400">
        <Volume2 size={16} className="text-cyan-600" />
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 border-none outline-none"
        />
      </div>
    </div>
  );
}
