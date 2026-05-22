import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Check, BookOpen, Brain, RotateCcw, Volume2, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { TypingLesson, UserProfile } from '../types';
import { LOCAL_LESSONS } from '../lessonsData';

interface LessonPracticeProps {
  profile: UserProfile;
  onLessonFinish: (lessonId: string, stats: { wpm: number; accuracy: number; durationSeconds: number; errors: number; weakKeys: string[] }) => void;
}

export default function LessonPractice({ profile, onLessonFinish }: LessonPracticeProps) {
  const [activeLesson, setActiveLesson] = useState<TypingLesson>(LOCAL_LESSONS[0]);
  const [typedInput, setTypedInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<number>(0);
  const [completed, setCompleted] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [weakKeys, setWeakKeys] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  // Input ref to keep focus active
  const inputRef = useRef<HTMLInputElement>(null);

  // Mechanical sound generator simulation using Web Audio API oscillator
  const playSound = (type: 'correct' | 'error' | 'success') => {
    if (profile.preferences.soundPack === 'off') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        const soundType = profile.preferences.soundPack;
        if (soundType === 'laser') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } else if (soundType === 'beep') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, ctx.currentTime);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } else { // mechanical type
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(100, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else { // success
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio context may be suspended before user interaction
    }
  };

  // Keyboard Event Listeners for animations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (e.key === ' ') key = ' ';
      setPressedKey(key);

      // Focus textbox
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Sync textbox changes and compute validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (completed) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const currentTargetIndex = val.length - 1;
    const targetChar = activeLesson.promptText[currentTargetIndex];
    const typedChar = val[currentTargetIndex];

    if (typedChar !== undefined) {
      if (typedChar === targetChar) {
        playSound('correct');
      } else {
        playSound('error');
        setErrors((prev) => prev + 1);
        if (targetChar && !weakKeys.includes(targetChar.toLowerCase())) {
          setWeakKeys((prev) => [...prev, targetChar.toLowerCase()]);
        }
      }
    }

    setTypedInput(val);

    // Completion logic check
    if (val.length >= activeLesson.promptText.length) {
      setCompleted(true);
      playSound('success');

      // Calculate performance metrics
      const endTimestamp = Date.now();
      const elapsedSeconds = Math.max(1, (endTimestamp - (startTime || endTimestamp)) / 1000);
      const totalChars = activeLesson.promptText.length;
      const wpmCalculated = Math.round((totalChars / 5) / (elapsedSeconds / 60));
      const accCalculated = Math.round(((totalChars - errors) / totalChars) * 100);

      onLessonFinish(activeLesson.id, {
        wpm: wpmCalculated || 20,
        accuracy: Math.max(0, accCalculated),
        durationSeconds: Math.round(elapsedSeconds),
        errors,
        weakKeys
      });
    }
  };

  const handleReset = () => {
    setTypedInput('');
    setStartTime(null);
    setErrors(0);
    setCompleted(false);
    setWeakKeys([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Dynamic request using AI Coach generative endpoint
  const handleTriggerAiLesson = async () => {
    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          level: profile.levelPath.skill,
          weakLetters: weakKeys.length > 0 ? weakKeys : ['a', 's', 'o', 't'],
          type: 'words'
        })
      });

      if (!response.ok) throw new Error('API down');
      const data = await response.json();

      const newLesson: TypingLesson = {
        id: 'ai-gen-lesson',
        title: data.title || 'AI Personalized Practice',
        difficulty: profile.levelPath.skill,
        type: 'advanced',
        promptText: data.promptText || 'The laser beams hit the home keys.',
        description: data.description || 'Focus keys generated by AI Coach metrics.',
        targetKeys: data.targetKeys || [],
        xpReward: 100
      };

      setActiveLesson(newLesson);
      handleReset();
    } catch {
      // Keep existing lesson
    } finally {
      setAiGenerating(false);
    }
  };

  // Setup virtual keyboard layout keys based on preference
  const getKeyboardRowLayout = () => {
    const layoutType = profile.preferences.keyboardLayout;
    if (layoutType === 'AZERTY') {
      return [
        ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
        ['w', 'x', 'c', 'v', 'b', 'n', ',', ';', '.', '/']
      ];
    }
    if (layoutType === 'DVORAK') {
      return [
        ['\'', ',', '.', 'p', 'y', 'f', 'g', 'r', 'l', '/'],
        ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
        [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z']
      ];
    }
    // QWERTY default
    return [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];
  };

  const keyboardRows = getKeyboardRowLayout();

  // Highlight finger tracking labels on board
  const getActiveKeyFingerLabel = (key: string) => {
    if (key === 'a' || key === 'q' || key === 'z') return { label: 'L.Pinky', color: 'border-pink-500 text-pink-400' };
    if (key === 's' || key === 'w' || key === 'x') return { label: 'L.Ring', color: 'border-purple-500 text-purple-400' };
    if (key === 'd' || key === 'e' || key === 'c') return { label: 'L.Middle', color: 'border-blue-500 text-blue-400' };
    if (key === 'f' || key === 'r' || key === 'v' || key === 'g' || key === 't' || key === 'b') return { label: 'L.Index', color: 'border-cyan-500 text-cyan-400' };
    if (key === ' ') return { label: 'Thumb', color: 'border-green-500 text-green-400' };
    if (key === 'y' || key === 'u' || key === 'h' || key === 'j' || key === 'n' || key === 'm') return { label: 'R.Index', color: 'border-cyan-500 text-cyan-400' };
    if (key === 'i' || key === 'k' || key === ',') return { label: 'R.Middle', color: 'border-blue-500 text-blue-400' };
    if (key === 'o' || key === 'l' || key === '.') return { label: 'R.Ring', color: 'border-purple-500 text-purple-400' };
    return { label: 'R.Pinky', color: 'border-pink-500 text-pink-400' };
  };

  // Find next character to type
  const nextCharNeeded = activeLesson.promptText[typedInput.length]?.toLowerCase() || ' ';
  const currentFingerAdvice = getActiveKeyFingerLabel(nextCharNeeded);

  const displayedLessons = LOCAL_LESSONS.filter(
    (l) => difficultyFilter === 'All' || l.difficulty === difficultyFilter
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 select-none">
      {/* SIDEBAR: LESSONS OR SELECTORS SHEET */}
      <div className="lg:col-span-1 glass-panel p-5 rounded-3xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-white/70 tracking-widest uppercase flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
          Lesson Matrix
        </h3>

        {/* Difficulty filter buttons */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-white/5 rounded-xl border border-white/10">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-center transition duration-150 ${
                difficultyFilter === diff ? 'bg-cyan-500/10 text-cyan-405 text-cyan-450 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Lessons scrolling block */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar">
          {displayedLessons.map((les) => (
            <button
              key={les.id}
              onClick={() => {
                setActiveLesson(les);
                handleReset();
              }}
              className={`w-full p-3.5 rounded-2xl text-left border transition duration-150 flex flex-col ${
                activeLesson.id === les.id
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/50 hover:text-white/80'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-extrabold font-display text-slate-100 line-clamp-1 truncate">{les.title}</span>
                {profile.levelPath.completedLessons.includes(les.id) && (
                  <Check className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 border border-white/5 rounded text-white/45">{les.difficulty}</span>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{les.type}</span>
              </div>
            </button>
          ))}
        </div>

        {/* AI GENERATION DRIVERS */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-pink-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)]" />
            <span className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-wider">AI Coach Generation</span>
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed font-mono">
            Generate custom typing drills focusing uniquely on your weak letter sets: {' '}
            <span className="text-pink-400 font-bold font-mono">{weakKeys.slice(0, 4).join(', ') || 'none'}</span>
          </p>
          <button
            onClick={handleTriggerAiLesson}
            id="btn-trigger-ai-custom-lesson"
            disabled={aiGenerating}
            className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase transition select-none tracking-wider shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5"
          >
            {aiGenerating ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                DREDGING CONTEXT
              </>
            ) : (
              <>
                <Brain className="w-3 h-3" />
                GENERATE FOCUS LESSON
              </>
            )}
          </button>
        </div>
      </div>

      {/* CENTERPANE: ACTIVE TYPING TEST / KEYBOARD */}
      <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
        {/* UPPER INFO PANEL */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-[1.5px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
          <div className="absolute top-0 right-0 p-4 flex gap-2 text-[10px] font-mono text-white/40">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Sound Pack: {profile.preferences.soundPack}
          </div>

          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{activeLesson.difficulty} Lesson Pathway</span>
          <h2 className="text-xl font-extrabold font-display text-white mt-1 uppercase tracking-tight">{activeLesson.title}</h2>
          <p className="text-xs text-white/60 mt-1 leading-relaxed">{activeLesson.description}</p>
        </div>

        {/* CORE INTERACTIVE TYPING BOARD BOX */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="glass-panel p-8 rounded-3xl relative border border-white/15 cursor-text min-h-[160px] flex flex-col justify-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
          {/* Out of focus alert */}
          {document.activeElement !== inputRef.current && !completed && (
            <div className="absolute inset-0 bg-black/50 rounded-3xl backdrop-blur-xs flex items-center justify-center z-10 select-none">
              <span className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase rounded-xl tracking-widest cursor-pointer blink shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                Click here to activate keyboard focus
              </span>
            </div>
          )}

          {/* Prompt displaying area */}
          <div className="relative text-lg md:text-xl font-mono leading-relaxed tracking-wide text-white/20 select-none">
            {/* Display correct and incorrect words characters */}
            {activeLesson.promptText.split('').map((char, index) => {
              let color = 'text-white/20';
              let underline = '';

              if (index < typedInput.length) {
                // Was typed! Correct or wrong?
                color = typedInput[index] === char ? 'text-cyan-400' : 'text-rose-500 bg-rose-500/10 border border-rose-550/20 px-[0.5px] rounded-md';
              } else if (index === typedInput.length) {
                // Active character typing point!
                color = 'text-white font-bold relative bg-white/10 border-b-2 border-cyan-400 rounded px-[0.5px]';
                underline = 'cursor-flicker';
              }

              return (
                <span key={index} className={`${color} ${underline}`}>
                  {char === '\n' ? ' ↵\n' : char}
                </span>
              );
            })}
          </div>

          {/* Invisible active input receptor */}
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            disabled={completed}
            className="absolute opacity-0 pointer-events-none"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {/* FINGER RECOMMENDATIONS GUIDE */}
        {!completed && (
          <div className={`p-4 bg-white/5 border rounded-2xl flex items-center justify-between text-xs tracking-wide border-white/10 ${currentFingerAdvice.color}`}>
            <span className="flex items-center gap-1.5 font-mono uppercase font-bold text-[10px]">
              <Key className="w-4 h-4" /> Next key: "{nextCharNeeded}"
            </span>
            <span className="font-mono uppercase font-bold text-[10px] tracking-wider">Finger Guide: {currentFingerAdvice.label}</span>
          </div>
        )}

        {/* VIRTUAL KEYBOARD GRAPHICAL HEATMAP */}
        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl space-y-2 select-none relative overflow-hidden">
          <div className="absolute top-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
          <div className="flex justify-between text-[10px] font-mono text-white/30 mb-2">
            <span>LIVE KEYBOARD HOLOGRAPHIC PROJECTION</span>
            <span className="text-cyan-400 tracking-wider font-bold uppercase">{profile.preferences.keyboardLayout} Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Layout Version</span>
          </div>

          <div className={`space-y-1 ${profile.preferences.dyslexiaFont ? 'font-dyslexic' : ''}`}>
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((key) => {
                  const isPressed = pressedKey === key;
                  const isNextRequired = nextCharNeeded === key;

                  // Compute neon highlighting border colors
                  let borderStyle = 'border-white/5 bg-white/5 text-white/30';
                  if (isPressed) {
                    borderStyle = 'border-pink-500 text-pink-500 scale-95 shadow-lg shadow-pink-500/10 bg-pink-500/10';
                  } else if (isNextRequired) {
                    borderStyle = 'border-cyan-400 text-cyan-400 scale-102 bg-cyan-400/10 shadow-[0_0_8px_rgba(34,211,238,0.2)] animate-pulse';
                  }

                  return (
                    <div
                      key={key}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-sm font-bold uppercase transition-all duration-75 ${borderStyle}`}
                    >
                      {key}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Spacebar layout row */}
            <div className="flex justify-center mt-1">
              <div
                className={`w-64 h-8 rounded-xl border flex items-center justify-center transition-all ${
                  pressedKey === ' '
                    ? 'border-pink-500 bg-pink-500/10 scale-95'
                    : nextCharNeeded === ' '
                    ? 'border-cyan-405 border-cyan-400 bg-cyan-400/10 shadow-[0_0_8px_rgba(34,211,238,0.2)] animate-pulse'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="text-[10px] font-mono font-bold tracking-widest text-white/20">SPACEBAR</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION CONTROLLERS */}
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <button
            onClick={handleReset}
            id="btn-lesson-restart"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESTART DRILL
          </button>
          <div className="flex items-center gap-4 text-xs font-mono text-white/50">
            <span>Accuracy: <span className="text-emerald-400 font-extrabold">{typedInput.length > 0 ? Math.round(((typedInput.length - errors) / typedInput.length) * 100) : 100}%</span></span>
            <span>Errors: <span className="text-rose-500 font-extrabold">{errors}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
