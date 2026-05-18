import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans relative overflow-hidden">
      {/* Global Cyberpunk Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-100px)'
          }}
      ></div>

      {/* Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center py-8 px-4 h-full">

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 max-w-full drop-shadow-[0_0_15px_rgba(216,180,254,0.5)] mb-2 mt-4">
            NEON SNAKE
          </h1>
          <p className="text-cyan-200/60 tracking-[0.3em] font-mono text-sm uppercase">Cybernetic Entertainment System</p>
        </header>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24 w-full">
          {/* Left Column: Snake Game */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <SnakeGame />
          </div>

          {/* Right Column: Music Player */}
          <div className="flex-1 flex justify-center lg:justify-start pt-4 lg:pt-16">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}
