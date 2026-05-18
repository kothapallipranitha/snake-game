import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Gamepad2 } from 'lucide-react';

const GRID_W = 20;
const GRID_H = 20;
const SPEED_MS = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [gameState, setGameState] = useState({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 10 },
    gameOver: false,
    score: 0,
    highScore: 0,
    hasStarted: false,
  });

  const dirRef = useRef<Point>({ x: 0, y: -1 });
  const lastProcessedDirRef = useRef<Point>({ x: 0, y: -1 });

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: [{ x: 10, y: 10 }],
      food: {
        x: Math.floor(Math.random() * GRID_W),
        y: Math.floor(Math.random() * GRID_H)
      },
      gameOver: false,
      score: 0,
      hasStarted: false,
    }));
    dirRef.current = { x: 0, y: -1 };
    lastProcessedDirRef.current = { x: 0, y: -1 };
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || !prev.hasStarted) return prev;

      const currentDir = dirRef.current;
      lastProcessedDirRef.current = currentDir;

      const head = prev.snake[0];
      const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_W || newHead.y < 0 || newHead.y >= GRID_H) {
        return { ...prev, gameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      // Self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, gameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Eat food
      if (newHead.x === newFood.x && newHead.y === newFood.y) {
        newScore += 10;
        let safeFood = false;
        while (!safeFood) {
          newFood = {
            x: Math.floor(Math.random() * GRID_W),
            y: Math.floor(Math.random() * GRID_H)
          };
          // eslint-disable-next-line no-loop-func
          safeFood = !newSnake.some(s => s.x === newFood.x && s.y === newFood.y);
        }
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake, food: newFood, score: newScore };
    });
  }, []);

  useEffect(() => {
    const id = setInterval(moveSnake, SPEED_MS);
    return () => clearInterval(id);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Block default scrolling for arrow keys
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
      }

      setGameState(prev => {
          // If game is over wait for restart
          if (prev.gameOver) return prev;

          // Start game on first key press
          if (!prev.hasStarted && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
            return { ...prev, hasStarted: true };
          }
          return prev;
      });

      const lastDir = lastProcessedDirRef.current;

      if (['arrowup', 'w'].includes(key) && lastDir.y !== 1) {
        dirRef.current = { x: 0, y: -1 };
      }
      if (['arrowdown', 's'].includes(key) && lastDir.y !== -1) {
        dirRef.current = { x: 0, y: 1 };
      }
      if (['arrowleft', 'a'].includes(key) && lastDir.x !== 1) {
        dirRef.current = { x: -1, y: 0 };
      }
      if (['arrowright', 'd'].includes(key) && lastDir.x !== -1) {
        dirRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full justify-between items-center mb-6 px-4 bg-gray-900 border border-cyan-500/30 rounded-xl py-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <div className="flex items-center space-x-2">
            <Gamepad2 className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" size={24} />
            <span className="font-mono text-cyan-300 font-bold tracking-widest text-lg z-10">SCORE: {gameState.score}</span>
        </div>
        <div className="flex items-center space-x-2">
            <Trophy className="text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" size={24} />
            <span className="font-mono text-purple-300 font-bold tracking-widest text-lg z-10">HI: {gameState.highScore}</span>
        </div>
      </div>

      <div className="relative w-[360px] h-[360px] bg-gray-950 border-2 border-cyan-800 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(8,145,178,0.3)] ring-4 ring-gray-900">
        {/* Background Grid Lines (Subtle) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
              backgroundImage: `linear-gradient(#0891b2 1px, transparent 1px), linear-gradient(90deg, #0891b2 1px, transparent 1px)`,
              backgroundSize: `${100/GRID_W}% ${100/GRID_H}%`
          }}
        ></div>

        {!gameState.hasStarted && !gameState.gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-cyan-400 font-mono text-xl animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              PRESS ANY ARROW KEY
            </div>
            <div className="text-cyan-700 font-mono text-sm mt-2">TO START DRIFTING</div>
          </div>
        )}

        {gameState.gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="text-red-500 font-mono text-4xl font-black mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
              SYSTEM FAILURE
            </div>
            <div className="text-gray-300 font-mono mb-6">FINAL SCORE: {gameState.score}</div>

            <button
              onClick={resetGame}
              className="flex items-center space-x-2 bg-cyan-950 text-cyan-400 border border-cyan-400 px-6 py-2 rounded-full hover:bg-cyan-900 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.5)] font-bold tracking-wider"
            >
              <RefreshCw size={18} />
              <span>REBOOT</span>
            </button>
          </div>
        )}

        {/* Food */}
        <div
          className="absolute bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]"
          style={{
            left: `${(gameState.food.x / GRID_W) * 100}%`,
            top: `${(gameState.food.y / GRID_H) * 100}%`,
            width: `${100 / GRID_W}%`,
            height: `${100 / GRID_H}%`
          }}
        />

        {/* Snake Body */}
        {gameState.snake.map((segment, i) => {
          const isHead = i === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className={`absolute rounded-sm ${isHead ? 'bg-cyan-300 z-10' : 'bg-cyan-600'} shadow-[0_0_10px_#22d3ee] transition-all duration-75`}
              style={{
                left: `${(segment.x / GRID_W) * 100}%`,
                top: `${(segment.y / GRID_H) * 100}%`,
                width: `${(100 / GRID_W) + 0.1}%`,
                height: `${(100 / GRID_H) + 0.1}%`
              }}
            >
              {isHead && (
                  <div className="w-full h-full relative">
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gray-900 rounded-full shadow-sm" />
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-900 rounded-full shadow-sm" />
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
