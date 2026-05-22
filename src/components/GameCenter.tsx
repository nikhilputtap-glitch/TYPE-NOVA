import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, ShieldAlert, Swords, Skull, Trophy, Zap, Flame, Compass, ChevronRight } from 'lucide-react';

interface GameCenterProps {
  onEarnReward: (xp: number, coins: number) => void;
}

interface GameWord {
  id: string;
  text: string;
  x: number; // percentage
  y: number; // percentage
}

const DICTIONARY = [
  "neon", "cyber", "shadow", "glitch", "circuit", "laser", "pulse", "grid", "pixel", "plasma",
  "vector", "syntax", "array", "binary", "system", "matrix", "arcade", "zombie", "comet", "meteor"
];

export default function GameCenter({ onEarnReward }: GameCenterProps) {
  const [activeGame, setActiveGame] = useState<'none' | 'zombie' | 'falling'>('none');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [lives, setLives] = useState(5);
  const [words, setWords] = useState<GameWord[]>([]);
  const [typedString, setTypedString] = useState('');

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn dynamic word randomly
  const spawnWord = () => {
    const text = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
    const newWord: GameWord = {
      id: `word-${Date.now()}-${Math.random()}`,
      text,
      x: Math.floor(Math.random() * 60) + 10, // 10% to 70% range
      y: 0
    };
    setWords((prev) => [...prev, newWord]);
  };

  const handleStartGame = (game: 'zombie' | 'falling') => {
    setActiveGame(game);
    setGameState('playing');
    setScore(0);
    setMultiplier(1);
    setLives(5);
    setTypedString('');
    setWords([]);

    // Word spawn loop
    gameLoopRef.current = setInterval(() => {
      // Spawn words periodically
      spawnWord();

      // Progress word positions downward (y axis ticker)
      setWords((prevWords) => {
        let reachedBottom = false;
        const progressed = prevWords.map((w) => {
          const nextY = w.y + 12; // move down step
          if (nextY >= 95) reachedBottom = true;
          return { ...w, y: nextY };
        });

        if (reachedBottom) {
          setLives((p) => {
            if (p <= 1) {
              setGameState('gameover');
              clearInterval(gameLoopRef.current!);
              return 0;
            }
            return p - 1;
          });
          // filter out bottom row words
          return progressed.filter((w) => w.y < 95);
        }

        return progressed;
      });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setTypedString(val);

    // Scan dictionary for typed word matches
    const matchedWord = words.find((w) => w.text === val);

    if (matchedWord) {
      setScore((s) => s + matchedWord.text.length * multiplier * 15);
      setMultiplier((m) => Math.min(5, m + 1));
      setWords((prev) => prev.filter((w) => w.id !== matchedWord.id));
      setTypedString('');
    }
  };

  const handleStopGame = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setActiveGame('none');
    setGameState('idle');
  };

  const handleClaimReward = () => {
    const earnedXp = score / 4 || 10;
    const earnedCoins = score / 10 || 5;
    onEarnReward(Math.round(earnedXp), Math.round(earnedCoins));
    handleStopGame();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 border border-cyan-400/20 rounded uppercase">
          Typing Arcade Game Center
        </span>
        <h2 className="text-xl font-extrabold font-display text-white mt-4 flex items-center gap-2">
          🎮 Retro Arcade Terminal
        </h2>
        <p className="text-xs text-gray-400 mt-1">Accelerate typing speed and finger synchronization through engaging reflex games.</p>
      </div>

      <AnimatePresence mode="wait">
        {activeGame === 'none' ? (
          /* GAME SELECTOR TILES */
          <motion.div
            key="selectors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* ZOMBIE HUNTER ARCADE CARD */}
            <div className="bg-[#12131a] p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-72 relative overflow-hidden group hover:border-pink-500 transition duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-15">
                <Skull className="w-24 h-24 text-pink-500" />
              </div>
              <div>
                <span className="px-2 py-0.5 text-[8px] font-bold font-mono text-pink-500 bg-pink-500/10 rounded uppercase">SHOOTER MODE</span>
                <h3 className="text-lg font-bold font-display text-slate-100 mt-4">🧟 Zombie Typer Defense</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Words emerge across the dark terminal window as hungry zombies. Type words perfectly to launch plasma cannon defense projectiles!
                </p>
              </div>
              <button
                onClick={() => handleStartGame('zombie')}
                id="btn-trigger-zombie-arcade"
                className="w-full py-3 bg-pink-500/20 hover:bg-pink-500 text-pink-400 hover:text-black hover:font-bold font-semibold text-xs rounded-xl tracking-wider transition uppercase"
              >
                Launch Cannon Defense
              </button>
            </div>

            {/* METEOR DEFENDER CARD */}
            <div className="bg-[#12131a] p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-72 relative overflow-hidden group hover:border-cyan-500 transition duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-15">
                <ShieldAlert className="w-24 h-24 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <span className="px-2 py-0.5 text-[8px] font-bold font-mono text-cyan-400 bg-cyan-400/10 rounded uppercase">SURVIVAL MODE</span>
                <h3 className="text-lg font-bold font-display text-slate-100 mt-4">☄️ Falling Meteor Storm</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Comets falling from top orbits pose severe threats to ground matrix servers. Type falling meteor tags before they crash down to retain shields.
                </p>
              </div>
              <button
                onClick={() => handleStartGame('falling')}
                id="btn-trigger-meteor-arcade"
                className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black hover:font-bold font-semibold text-xs rounded-xl tracking-wider transition uppercase"
              >
                Launch Meteor Shields
              </button>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE GAMEPLAY STAGE WINDOW */
          <motion.div
            key="game-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Games header bar */}
            <div className="flex justify-between items-center bg-[#12131a] p-4 rounded-3xl border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 text-[10px] font-mono text-slate-100 uppercase font-black bg-pink-500 rounded">
                  {activeGame === 'zombie' ? 'ZOMBIE MODE' : 'METEOR DEFENSE'}
                </span>
                <span className="text-xs font-mono text-gray-400">Total Score: <span className="text-white font-bold">{score}</span></span>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 text-pink-500 animate-pulse" /> Multiplier: x{multiplier}
                </span>
                <span className="text-red-400 font-bold">Shield Integrity: {lives} / 5</span>
              </div>
            </div>

            {gameState === 'playing' ? (
              /* ACTIVE GAME SPACE WINDOW */
              <div className="h-[300px] bg-[#0a0b10] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                {/* Background retro vector net lines */}
                <div className="absolute inset-x-0 top-0 bottom-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

                {/* Simulated falling game elements */}
                <div className="relative w-full h-[220px]">
                  {words.map((w) => (
                    <motion.div
                      key={w.id}
                      className="absolute p-2 bg-[#12131a]/80 backdrop-blur-md rounded-xl border border-white/10 text-xs font-semibold text-slate-100 flex items-center gap-1 shadow-md shadow-pink-500/5 select-none"
                      style={{ top: `${w.y}%`, left: `${w.x}%` }}
                      animate={{ top: `${w.y}%` }}
                      transition={{ ease: 'linear', duration: 0.1 }}
                    >
                      {activeGame === 'zombie' ? '🧟 ' : '☄️ '}
                      <span className="font-mono uppercase tracking-wider text-pink-400">{w.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Submitting typing prompt trigger */}
                <div className="p-4 bg-[#12131a] border-t border-white/5 flex gap-3 relative z-10 select-none">
                  <input
                    type="text"
                    onChange={handleInputChange}
                    value={typedString}
                    placeholder="Type words to shoot/defend..."
                    className="flex-grow p-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                  <button
                    onClick={handleStopGame}
                    id="btn-quit-game"
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-semibold uppercase transition"
                  >
                    ABORT MISSION
                  </button>
                </div>
              </div>
            ) : (
              /* GAME OVER SCREEN STATS */
              <div className="p-8 bg-[#12131a] rounded-3xl border border-white/5 text-center space-y-6">
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 inline-block rounded-2xl animate-spin">
                  <ShieldAlert className="w-12 h-12" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold font-display text-white select-none">SHIELDS ENERGETICALLY COLLAPSED</h3>
                  <p className="text-xs text-gray-500 mt-1">A meteor crash or zombie infection breached terminal protocols. Here are your standings:</p>
                </div>

                <div className="max-w-xs mx-auto p-4 bg-[#0a0b10] rounded-2xl border border-white/5 flex justify-between select-none">
                  <span className="font-mono text-gray-500">SCORE: {score}</span>
                  <span className="font-mono text-yellow-400 font-bold">XP earned: {Math.round(score / 4)}</span>
                </div>

                <button
                  onClick={handleClaimReward}
                  id="btn-claim-game-reward"
                  className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white text-xs font-semibold tracking-wide uppercase transition shadow-lg shadow-cyan-500/15"
                >
                  CLAIM ACCUMULATED BONUSES
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
