import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, LineChart, PlayCircle, History, FileText, Upload, Sparkles, ChevronRight, Award } from 'lucide-react';
import { UserProfile, TypingSession } from '../types';

interface TypingTestProps {
  profile: UserProfile;
  onTestFinish: (session: TypingSession) => void;
}

const DEFAULT_TEST_PROMPTS: Record<string, string> = {
  '15': 'Solar wind brings galactic dust to standard core planets in immediate circles of light and sound.',
  '30': 'Quantum computers operate on superpositions of state metrics to execute parallel commands instantly. Superconductors maintain perfect zero resistance flow in magnetic circuits.',
  '60': 'Sleek neon glowing cybernetic designs elevate user interface experiences to high artistic levels. Modern professional software engineering demands rapid muscle memory, accuracy safeguards, and robust testing layouts. Typists unlock unlimited potentials through layout focus.',
  '180': 'The universe expands into infinite emptiness where dark matter coordinates solar system operations. Scientists trace back cosmic microwave background noise to investigate immediate singularities. Deep inside artificial neural architectures, weights align to optimize complex mathematical parameters. Every character you type trains the neural networks of tomorrow.',
  '300': 'Long endurance tests determine ultimate focus thresholds. When typing paragraphs of extensive details, your posture should remain stable, shoulders relaxed, and hand resting spaces suspended slightly above key structures. Maintaining consistency throughout multiple minutes is the primary differentiator of speed typing champions. Focus on typing full complete words instead of looking at mistakes. In doing so, muscle memories compile directly into automatic loops. Flow triggers exceptional performance metrics effortlessly.'
};

export default function TypingTest({ profile, onTestFinish }: TypingTestProps) {
  const [duration, setDuration] = useState<'15' | '30' | '60' | '180' | '300' | 'custom'>('30');
  const [promptText, setPromptText] = useState(DEFAULT_TEST_PROMPTS['30']);
  const [customText, setCustomText] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [testActive, setTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [recentStats, setRecentStats] = useState<TypingSession | null>(null);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync duration selection
  useEffect(() => {
    if (duration !== 'custom') {
      setPromptText(DEFAULT_TEST_PROMPTS[duration]);
      setTimeLeft(parseInt(duration, 10));
    } else {
      setPromptText(customText || 'Enter or upload custom paragraphs to start practice.');
      setTimeLeft(60); // Default 60s for custom texts
    }
    handleReset();
  }, [duration, customText]);

  // Game/Test Timer hook
  useEffect(() => {
    if (testActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          // Log WPM sample periodically for graphs
          if (startTime) {
            const currentElapsed = (Date.now() - startTime) / 1000;
            const currentWpm = Math.round((typedInput.length / 5) / (currentElapsed / 60));
            setWpmHistory((hist) => [...hist, currentWpm || 0]);
          }

          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testActive, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (testCompleted) return;

    if (!testActive) {
      setTestActive(true);
      setStartTime(Date.now());
      setWpmHistory([]);
    }

    // Monitor errors
    const currentTargetIndex = val.length - 1;
    const targetChar = promptText[currentTargetIndex];
    const typedChar = val[currentTargetIndex];

    if (typedChar !== undefined && typedChar !== targetChar) {
      setErrors((prev) => prev + 1);
    }

    setTypedInput(val);

    // Completion by typing target text completely
    if (val.length >= promptText.length) {
      handleComplete(val);
    }
  };

  const handleComplete = (finalInput = typedInput) => {
    setTestActive(false);
    setTestCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const endTimestamp = Date.now();
    const durationSelected = parseInt(duration === 'custom' ? '60' : duration, 10);
    const actualElapsed = Math.min(durationSelected, (endTimestamp - (startTime || endTimestamp)) / 1000);
    const finalElapsed = Math.max(1, actualElapsed);

    const totalChars = finalInput.length;
    const wpmCalculated = Math.round((totalChars / 5) / (finalElapsed / 60));
    const accCalculated = Math.round(((totalChars - errors) / Math.max(1, totalChars)) * 100);
    const cpmCalculated = Math.round(totalChars / (finalElapsed / 60));

    const finalSession: TypingSession = {
      id: `test-${Date.now()}`,
      timestamp: Date.now(),
      type: 'test',
      durationSeconds: Math.round(finalElapsed),
      wpm: wpmCalculated || 15,
      accuracy: Math.max(0, accCalculated),
      cpm: cpmCalculated || 75,
      errorsCount: errors,
      consistencyScore: Math.min(100, Math.max(10, 100 - (errors * 3))),
      weakKeys: []
    };

    setRecentStats(finalSession);
    onTestFinish(finalSession);
  };

  const handleReset = () => {
    setTypedInput('');
    setTestActive(false);
    setTestCompleted(false);
    setStartTime(null);
    setErrors(0);
    setWpmHistory([]);
    setTimeLeft(duration === 'custom' ? 60 : parseInt(duration, 10));
  };

  // Custom File Uploader handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setCustomText(text.slice(0, 1000)); // cap at 1000 characters for typing
        setDuration('custom');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* SELECTION TABS OF DURATION AND CUSTOM IMPORT - Immersive Slate */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 select-none">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
          <span className="text-xs font-mono font-bold text-white/50 uppercase tracking-widest">Test Duration</span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/10">
          {(['15', '30', '60', '180', '300'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setDuration(t)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition duration-150 ${
                duration === t ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white'
              }`}
            >
              {t}s
            </button>
          ))}
          <button
            onClick={() => setDuration('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              duration === 'custom' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* CUSTOM MODE TEXT INPUT AND FILE INSERTER */}
        {duration === 'custom' && !testActive && !testCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl space-y-4"
          >
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="block text-xs font-bold text-slate-100 font-display">Import Custom Text File</span>
                  <p className="text-[10px] text-white/50 mt-0.5">Quickly import a standard .txt file representing your custom practice paragraphs.</p>
                </div>
              </div>
              <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:brightness-110 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition select-none flex items-center gap-1.5 shadow-md">
                <Upload className="w-3.5 h-3.5" />
                UPLOAD TXT
                <input type="file" onChange={handleFileUpload} accept=".txt" className="hidden" />
              </label>
            </div>

            <textarea
              placeholder="PASTE CHOSEN QUOTES, EXAM PARAGRAPHS OR STORY OUTLINES HERE TO INITIALIZE PRACTICE..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xs placeholder-white/20 focus:outline-none focus:border-cyan-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {testCompleted && recentStats ? (
          /* GLOWING METRICS DETAILED REPORTS PANELS */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-panel p-8 rounded-3xl space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 text-[9px] font-mono bg-cyan-400/10 text-cyan-400 font-bold border border-cyan-400/30 rounded uppercase tracking-wider">
                  SESSION CONCLUDED
                </span>
                <h3 className="text-xl font-extrabold font-display text-white mt-2">TYPING PERFORMANCE DIGEST</h3>
              </div>
              <button
                onClick={handleReset}
                id="btn-test-reset-after-complete"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RE-RUN SYSTEM
              </button>
            </div>

            {/* Glowing Big stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center relative overflow-hidden group hover:border-cyan-400/30 transition duration-150">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider font-mono">SPEED</span>
                <span className="font-mono text-3.5xl font-extrabold text-cyan-400 block mt-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">{recentStats.wpm}</span>
                <span className="text-[9px] text-white/40 font-bold mt-1 block tracking-wider font-mono">WORDS PER MIN</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center relative overflow-hidden group hover:border-pink-500/30 transition duration-150">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider font-mono">ACCURACY</span>
                <span className="font-mono text-3.5xl font-extrabold text-pink-400 block mt-1 drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">{recentStats.accuracy}%</span>
                <span className="text-[9px] text-white/40 font-bold mt-1 block tracking-wider font-mono">TYPED CORRECTLY</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center relative overflow-hidden group hover:border-emerald-500/30 transition duration-150">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider font-mono">CPM RATING</span>
                <span className="font-mono text-3.5xl font-extrabold text-emerald-400 block mt-1 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{recentStats.cpm}</span>
                <span className="text-[9px] text-white/40 font-bold mt-1 block tracking-wider font-mono">CHARACTERS PER MIN</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center relative overflow-hidden group hover:border-amber-500/30 transition duration-150">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider font-mono">ERRORS RATING</span>
                <span className="font-mono text-3.5xl font-extrabold text-amber-400 block mt-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{recentStats.errorsCount}</span>
                <span className="text-[9px] text-white/40 font-bold mt-1 block tracking-wider font-mono">MISTYPES PENALTY</span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart of speed fluctuate */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4 relative overflow-hidden">
              <h4 className="text-xs font-mono font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-cyan-400" /> WPM Real-time tracking trend
              </h4>
              <div className="h-44 w-full relative flex items-end">
                {wpmHistory.length > 1 ? (
                  <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Background paths */}
                    <path
                      d={wpmHistory.reduce((acc, curr, index) => {
                        const x = (index / (wpmHistory.length - 1)) * 400;
                        const y = 90 - (curr / 140) * 80; // normalized range
                        return `${acc} ${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />
                    {/* Glow filling */}
                    <path
                      d={wpmHistory.reduce((acc, curr, index) => {
                        const x = (index / (wpmHistory.length - 1)) * 400;
                        const y = 90 - (curr / 140) * 80;
                        return `${acc} ${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '') + ` L 400 100 L 0 100 Z`}
                      fill="url(#chart-glow)"
                    />
                  </svg>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white/30 font-mono">
                    Short tests do not construct sample trends.
                  </div>
                )}
                {/* Axes labels */}
                <div className="absolute left-0 bottom-0 text-[8px] font-mono text-white/30">0s</div>
                <div className="absolute right-0 bottom-0 text-[8px] font-mono text-white/30">{duration}s</div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE TYPING AREA BOX BOARD */
          <div className="space-y-6">
            {/* Countdown / Stats strip */}
            <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 select-none">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
                <span className="font-mono text-sm text-cyan-400 font-bold uppercase tracking-wider">{timeLeft}s REMAINING</span>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono text-white/50">
                <span>WPM: <span className="text-white font-bold">{startTime ? Math.round((typedInput.length / 5) / (((Date.now() - startTime) / 1000) / 60)) || 0 : 0}</span></span>
                <span>Accuracy: <span className="text-white font-bold">{typedInput.length > 0 ? Math.round(((typedInput.length - errors) / typedInput.length) * 100) : 100}%</span></span>
              </div>
            </div>

            {/* Prompt panel */}
            <div
              onClick={() => inputRef.current?.focus()}
              className="glass-panel p-8 rounded-3xl border border-white/10 relative cursor-text min-h-[220px] flex flex-col justify-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
              {document.activeElement !== inputRef.current && (
                <div className="absolute inset-0 bg-black/50 rounded-3xl backdrop-blur-xs flex items-center justify-center z-10 select-none">
                  <span className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase rounded-xl tracking-widest cursor-pointer blink shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    CLICK TO FOCUS FOCUS BOARD
                  </span>
                </div>
              )}

              <div className="text-lg md:text-xl font-mono leading-relaxed select-none tracking-wide text-white/20">
                {promptText.split('').map((char, index) => {
                  let color = 'text-white/20';
                  let underline = '';

                  if (index < typedInput.length) {
                    color = typedInput[index] === char ? 'text-cyan-400 font-medium' : 'text-rose-500 bg-rose-500/10 border border-rose-550/20 rounded-md px-[0.5px]';
                  } else if (index === typedInput.length) {
                    color = 'text-white font-bold relative bg-white/10 rounded border-b-2 border-cyan-400 px-[0.5px]';
                    underline = 'cursor-flicker';
                  }

                  return (
                    <span key={index} className={`${color} ${underline}`}>
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* Invisible input receptor */}
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={handleInputChange}
                className="absolute opacity-0 pointer-events-none"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            {/* Test controllers */}
            <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 select-none">
              <button
                onClick={handleReset}
                id="btn-test-reset"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESTART SHEET
              </button>
              <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                System records accuracy safeguards. Keep typing.
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
