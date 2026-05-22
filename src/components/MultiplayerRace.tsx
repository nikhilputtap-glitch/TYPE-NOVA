import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Users, Play, AlertCircle, Swords, Award, Zap, Smile } from 'lucide-react';
import { UserProfile } from '../types';

interface MultiplayerRaceProps {
  profile: UserProfile;
  onRaceFinish: (xpGained: number, coinsGained: number) => void;
}

interface Rival {
  id: string;
  name: string;
  avatar: string;
  wpm: number;
  progress: number; // 0 to 100
  color: string;
  isMe?: boolean;
}

const CHAT_PHRASES = [
  "gl hf everyone! ⚡",
  "This is my favorite layout! QWERTY power!",
  "Wow, that home row combo was tricky.",
  "Almost there, speed builders!",
  "AZERTY is challenging but so rewarding.",
  "100 WPM incoming, watch out!",
  "My fingers are literally flying today!"
];

export default function MultiplayerRace({ profile, onRaceFinish }: MultiplayerRaceProps) {
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'racing' | 'result'>('lobby');
  const [countdown, setCountdown] = useState(5);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Alpha_Typer', text: 'Hey room, ready for the drag race?', time: '05:26' },
    { sender: 'Quantum_Glitch', text: 'Let’s see if anyone can beat 80 WPM today! Haha', time: '05:26' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [promptText] = useState('TypeNova coordinates high speed cybernetic typing races in immediate spaces.');
  const [typedInput, setTypedInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);

  const [rivals, setRivals] = useState<Rival[]>([]);
  const rivalsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Lobby Rivals
  const setupRivals = () => {
    setRivals([
      { id: 'me', name: profile.username, avatar: profile.avatarUrl, wpm: 0, progress: 0, color: 'border-cyan-400 text-cyan-400', isMe: true },
      { id: 'rival-1', name: 'Alpha_Typer', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Alpha', wpm: 45, progress: 0, color: 'border-pink-500 text-pink-400' },
      { id: 'rival-2', name: 'Quantum_Glitch', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Glitch', wpm: 55, progress: 0, color: 'border-yellow-400 text-yellow-300' },
      { id: 'rival-3', name: 'Byte_Surgeon', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Surgeon', wpm: 35, progress: 0, color: 'border-green-400 text-green-400' }
    ]);
  };

  useEffect(() => {
    setupRivals();
  }, [profile]);

  // Handle active countdown triggers
  useEffect(() => {
    if (gameState === 'countdown') {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((p) => {
          if (p <= 1) {
            setGameState('racing');
            setStartTime(Date.now());
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 5;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [gameState]);

  // Rival progression simulation hook during racing State
  useEffect(() => {
    if (gameState === 'racing') {
      rivalsIntervalRef.current = setInterval(() => {
        setRivals((prevRivals) => {
          let allFinished = true;
          const updated = prevRivals.map((riv) => {
            if (riv.isMe) {
              allFinished = allFinished && (riv.progress >= 100);
              return riv;
            }

            // Random speed fluctuation for bot rivals
            const speedBoost = Math.random() * 5 + 3;
            const newProgress = Math.min(100, riv.progress + speedBoost);

            if (newProgress < 100) {
              allFinished = false;
            }

            // Periodic chat injection during race
            if (Math.random() < 0.15) {
              const phrase = CHAT_PHRASES[Math.floor(Math.random() * CHAT_PHRASES.length)];
              setChatMessages((messages) => [
                ...messages,
                { sender: riv.name, text: phrase, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            }

            return {
              ...riv,
              progress: newProgress,
              wpm: Math.round(riv.wpm + (Math.random() * 4 - 2))
            };
          });

          if (allFinished) {
            handleCompleteRace();
          }

          return updated;
        });
      }, 1200);
    } else {
      if (rivalsIntervalRef.current) clearInterval(rivalsIntervalRef.current);
    }

    return () => {
      if (rivalsIntervalRef.current) clearInterval(rivalsIntervalRef.current);
    };
  }, [gameState]);

  const handleStartMatchmaking = () => {
    setGameState('countdown');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (gameState !== 'racing') return;

    setTypedInput(val);

    // Compute progress ratio
    const currentProgressPercent = Math.min(100, (val.length / promptText.length) * 100);

    setRivals((prev) =>
      prev.map((r) => {
        if (r.isMe) {
          const currentElapsed = (Date.now() - (startTime || Date.now())) / 1000;
          const calculatedWpm = Math.round((val.length / 5) / (currentElapsed / 60)) || 0;
          return {
            ...r,
            progress: currentProgressPercent,
            wpm: calculatedWpm
          };
        }
        return r;
      })
    );

    if (val.length >= promptText.length) {
      handleCompleteRace();
    }
  };

  const handleCompleteRace = () => {
    setGameState('result');
    if (rivalsIntervalRef.current) clearInterval(rivalsIntervalRef.current);
  };

  const handleClaimRaceBonus = () => {
    // Return to lobby
    setGameState('lobby');
    setTypedInput('');
    setStartTime(null);
    setupRivals();
    // Award standard Multiplayer XP and Coins
    onRaceFinish(150, 80);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        sender: profile.username,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT COLUMN: RACING TRACKS / METRICS CARDS */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 border border-cyan-400/20 rounded uppercase">
              Speed Circuit Lobbies
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <Users className="w-4 h-4 text-cyan-400" /> Active lobbies: 142
            </div>
          </div>

          <h2 className="text-xl font-extrabold font-display text-white">🏆 TypeNova Cyber Racers</h2>
          <p className="text-xs text-gray-400 mt-1">Race against AI and global simulated competitors in real-time drag races.</p>
        </div>

        <AnimatePresence mode="wait">
          {/* LOBBY SHEET */}
          {gameState === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 bg-[#12131a] rounded-3xl border border-white/5 space-y-6 text-center flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 mb-2">
                <Swords className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h3 className="font-extrabold font-display text-lg text-white uppercase">1v1 Competitors Drag Race</h3>
                <p className="text-xs text-gray-500 mt-1.5 max-w-sm">
                  Racer slots are currently empty. Click the controller button below to initialize immediate matchmaking.
                </p>
              </div>

              <button
                onClick={handleStartMatchmaking}
                id="btn-trigger-matchmaking"
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-pink-500 hover:brightness-110 text-white font-semibold text-xs rounded-xl tracking-wider uppercase transition relative overflow-hidden shadow-lg shadow-pink-500/15"
              >
                Launch Race Lobby Tunnel
              </button>
            </motion.div>
          )}

          {/* COUNTDOWN SHEET */}
          {gameState === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/10 flex flex-col items-center justify-center min-h-[300px]"
            >
              <h3 className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-4">MATCH FOUND. LAUNCHING CORE DRIVERS...</h3>
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                className="text-8xl font-black font-display text-pink-500"
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}

          {/* ACTIVE RACING STRIP */}
          {gameState === 'racing' && (
            <motion.div
              key="racing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Graphical tracks container */}
              <div className="space-y-4 p-6 bg-[#12131a] rounded-3xl border border-white/5">
                {rivals.map((riv) => (
                  <div key={riv.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span className="font-bold flex items-center gap-1 uppercase truncate max-w-[120px]">
                        <img src={riv.avatar} alt="bot" className="w-4 h-4 object-contain" />
                        {riv.name}
                      </span>
                      <span>{riv.wpm} WPM</span>
                    </div>

                    <div className="h-6 bg-[#0a0b10] rounded-xl relative overflow-hidden border border-white/5 flex items-center pr-3">
                      {/* Interactive tracer element */}
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 absolute top-0 left-0 flex items-center justify-end px-2"
                        animate={{ width: `${riv.progress}%` }}
                        transition={{ duration: 0.8 }}
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse fill-current" />
                      </motion.div>

                      {/* Display racer position percentage label */}
                      <span className="ml-auto text-[9px] font-mono font-bold text-gray-600 relative z-10">
                        {Math.round(riv.progress)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Typing Race focus box */}
              <div className="p-6 bg-[#12131a] border border-white/5 border-b-2 border-b-cyan-400 rounded-3xl space-y-4">
                <div className="relative text-sm font-mono leading-relaxed select-none tracking-wide text-gray-500 h-[100px]">
                  {promptText.split('').map((char, index) => {
                    let color = 'text-gray-500';
                    let underline = '';

                    if (index < typedInput.length) {
                      color = typedInput[index] === char ? 'text-cyan-400' : 'text-red-500 bg-red-500/10';
                    } else if (index === typedInput.length) {
                      color = 'text-white font-bold bg-white/5 border-b-2 border-cyan-400';
                      underline = 'cursor-flicker';
                    }

                    return (
                      <span key={index} className={`${color} ${underline}`}>
                        {char}
                      </span>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={typedInput}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-[#0a0b10] border border-white/5 rounded-2xl text-white font-mono text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  placeholder="MATCH KEY WORDS HERE AS FAST AS POSSIBLE..."
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
            </motion.div>
          )}

          {/* RESULT CARD PANEL */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-8 bg-[#12131a] rounded-3xl border border-white/5 space-y-6 text-center"
            >
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl inline-block text-yellow-400">
                <Award className="w-12 h-12" />
              </div>

              <div>
                <h3 className="font-extrabold font-display text-xl text-white select-none">RACE STANDINGS COMPLETED</h3>
                <p className="text-xs text-gray-500 mt-1">Standings calculations finished. Claim your competitive bonuses below.</p>
              </div>

              <div className="max-w-xs mx-auto space-y-2.5">
                {rivals
                  .sort((a, b) => b.progress - a.progress)
                  .map((riv, i) => (
                    <div key={riv.id} className="p-3 bg-[#0a0b10] border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500">#{i + 1}</span>
                        <span className="text-xs font-bold text-slate-100 uppercase">{riv.name}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-cyan-400">{riv.wpm} WPM</span>
                    </div>
                  ))}
              </div>

              <button
                onClick={handleClaimRaceBonus}
                id="btn-multiplayer-race-claim"
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white text-xs font-semibold tracking-wide uppercase transition shadow-md shadow-cyan-500/15"
              >
                SYNC XP AND STREAK STATUS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: SCROLLING LIVE CHAT MATRIX */}
      <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-[450px]">
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4 pb-2 border-b border-white/5">
            <Smile className="w-4 h-4 text-cyan-400" /> Competitor Live Chat
          </h3>

          {/* Messages block */}
          <div className="space-y-3 overflow-y-auto max-h-[320px] pr-2">
            {chatMessages.map((msg, index) => (
              <div key={index} className="space-y-0.5">
                <div className="flex gap-2 items-center text-[9px] font-mono text-gray-500">
                  <span className="font-bold uppercase text-slate-350 select-none text-slate-400">{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <div className="p-2.5 bg-[#0a0b10] rounded-xl border border-white/5 text-[10px] text-gray-300 leading-relaxed max-w-[90%]">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSendChat} className="flex gap-2 bg-[#0a0b10] p-1 rounded-2xl border border-white/5 input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-grow pl-3 bg-transparent text-xs text-white placeholder-gray-650 focus:outline-none"
          />
          <button
            type="submit"
            id="btn-send-race-chat"
            className="p-2.5 bg-cyan-500 hover:bg-cyan-650 text-white rounded-xl transition"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
}
