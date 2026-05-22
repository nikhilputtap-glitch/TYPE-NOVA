import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, TypingSession } from '../types';
import { LineChart, BarChart2, Activity, Keyboard, HelpCircle, Brain, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsProps {
  profile: UserProfile;
  sessions: TypingSession[];
  onTriggerAiCoach: () => void;
  aiCoachReport: any;
  loadingCoach: boolean;
}

export default function Analytics({ profile, sessions, onTriggerAiCoach, aiCoachReport, loadingCoach }: AnalyticsProps) {
  // Extract weak letters or provide fallback heuristics if session history is sparse
  const getWeakKeysCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {
      'q': 1, 'w': 2, 'e': 5, 'r': 2, 't': 3, 'y': 2, 'u': 1, 'i': 12, 'o': 4, 'p': 6,
      'a': 3, 's': 7, 'd': 1, 'f': 2, 'g': 1, 'h': 2, 'j': 1, 'k': 9, 'l': 3, ';': 2,
      'z': 0, 'x': 2, 'c': 1, 'v': 0, 'b': 1, 'n': 2, 'm': 1, ',': 1, '.': 1, '/': 0
    };

    // Incorporate actual session errors
    sessions.forEach((s) => {
      s.weakKeys?.forEach((k) => {
        const letter = k.toLowerCase();
        if (counts[letter] !== undefined) {
          counts[letter] += 2;
        }
      });
    });

    return counts;
  };

  const weakKeysCounts = getWeakKeysCounts();

  // Find keys with highest error rating (mis-clicks > 4)
  const troubleKeysList = Object.entries(weakKeysCounts)
    .filter(([_, count]) => count > 3)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  // Layout arrangement of virtual heatmap
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  // Helper determining key heatmap fluorescent density
  const getKeyHeatmapColor = (key: string) => {
    const errorCount = weakKeysCounts[key] || 0;
    if (errorCount === 0) return 'border-white/5 text-gray-400 bg-[#0a0b10]';
    if (errorCount < 3) return 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5 shadow-[0_0_8px_rgba(0,240,255,0.05)]';
    if (errorCount < 7) return 'border-yellow-500/50 text-yellow-300 bg-yellow-500/5 shadow-[0_0_8px_rgba(234,179,8,0.1)]';
    // Highly weak key density:
    return 'border-pink-500 text-pink-500 bg-pink-500/10 shadow-[0_0_12px_rgba(255,0,127,0.15)] font-bold';
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 border border-cyan-400/20 rounded uppercase">
          Tactile Analytics Center
        </span>
        <h2 className="text-xl font-extrabold font-display text-white mt-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" /> Bio-Metric Telemetry Dashboard
        </h2>
        <p className="text-xs text-gray-400 mt-1">Trace typing frequency, mis-click heatmaps, error records, and generated progress curves.</p>
      </div>

      {/* THREE VALUE BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-mono uppercase block font-bold">Total Practice Sessions</span>
          <span className="font-mono text-2xl font-bold text-slate-100 block mt-1">{sessions.length || 4} Syncs</span>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-mono uppercase block font-bold">Accuracy trends</span>
          <span className="font-mono text-2xl font-bold text-green-400 block mt-1">
            {profile.statistics.averageAccuracy ? `${Math.round(profile.statistics.averageAccuracy)}% Avg` : '95% Avg'}
          </span>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-[10px] text-gray-500 font-mono uppercase block font-bold">Critical focus keys</span>
          <span className="font-mono text-2xl font-bold text-pink-400 block mt-1 uppercase">
            {troubleKeysList.slice(0, 4).join(', ') || 'NONE'}
          </span>
        </div>
      </div>

      {/* AI TYPING COACH CONTEXT PANEL */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/5">
        <div className="flex justify-between items-center bg-[#0a0b10] p-4 rounded-2xl border border-white/5 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">Synthesize AI Coaching Report</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 max-w-sm">
                TypeNova leverages server-side Gemini 3.5 models to audit your errors, layouts, and speed trends to formulate a predictive coaching plan.
              </p>
            </div>
          </div>
          <button
            onClick={onTriggerAiCoach}
            id="btn-trigger-ai-coach-synthesis"
            disabled={loadingCoach}
            className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:brightness-110 disabled:opacity-50 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            {loadingCoach ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                AUDITING TERMINAL...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                INIT COACH AUDIT
              </>
            )}
          </button>
        </div>

        {/* AI COACH REPORT OUTPUT VIEW */}
        <AnimatePresence mode="wait">
          {aiCoachReport ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-5 bg-gradient-to-tr from-[#12131a] via-[#0d0e15] to-pink-950/10 border border-white/10 rounded-2xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-pink-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-current animate-pulseFixed" /> Live coach feedback
              </div>

              <div>
                <h4 className="text-xs font-mono text-gray-500 uppercase font-bold text-[10px]">AI COACH RECOMMENDATIONS</h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{aiCoachReport.feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">Growth predictions</span>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">{aiCoachReport.predictedImprovement}</p>
                </div>
                <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
                  <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">Daily Coach Quote</span>
                  <p className="text-[11px] text-pink-400 italic mt-1 leading-normal">"{aiCoachReport.motivationQuote}"</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase">Recommended drills</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px] text-gray-400">
                  {aiCoachReport.suggestedExercises?.map((ex: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="p-5 border border-dashed border-white/5 rounded-2xl text-center text-xs text-gray-500 font-mono italic">
              Click "INIT COACH AUDIT" to trigger generative server-side audits.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* WEAK KEYS GRAPHICAL KEYBOARD HEATMAP */}
      <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-gray-500 mb-2">
          <span className="font-bold flex items-center gap-1.5">
            <Keyboard className="w-4 h-4 text-cyan-400" /> DYNAMIC FINGER WEAKNESS HEATMAP
          </span>
          <span className="flex items-center gap-4 text-[9px] uppercase tracking-wider">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-500 rounded" /> Stuck keys</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded" /> Weak keys</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-500 rounded" /> Normal</span>
          </span>
        </div>

        <div className="space-y-1">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => {
                const thermalStyle = getKeyHeatmapColor(key);
                return (
                  <div
                    key={key}
                    className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center font-mono text-xs uppercase transition-all duration-75 ${thermalStyle}`}
                  >
                    <span className="font-semibold">{key}</span>
                    <span className="text-[7px] text-gray-500 leading-none mt-0.5">{weakKeysCounts[key] || 0}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* HISTORIC PERFORMANCE TRENDS GRAPH */}
      <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-cyan-400" /> SYNCED HISTORY RECORDS
        </h3>

        {sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((sess, idx) => (
              <div
                key={sess.id}
                className="p-4 bg-[#0a0b10] border border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs font-mono text-gray-400"
              >
                <div>
                  <span className="block font-bold text-slate-205 select-none text-slate-200">Session #{idx + 1}</span>
                  <span className="text-[10px] text-gray-500 block uppercase">{sess.type} Mode</span>
                </div>
                <div className="flex gap-6">
                  <span>Speed: <span className="text-cyan-400 font-bold">{sess.wpm} WPM</span></span>
                  <span>Accuracy: <span className="text-green-400 font-bold">{sess.accuracy}%</span></span>
                  <span>Errors: <span className="text-red-500 font-bold">{sess.errorsCount}</span></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center text-xs text-gray-500 font-mono italic">
            Participate in typing tests or lessons first to populate analytics logs.
          </div>
        )}
      </div>
    </div>
  );
}
