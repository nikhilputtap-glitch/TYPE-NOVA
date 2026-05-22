import { motion } from 'motion/react';
import { Keyboard, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

      <div className="text-center z-10 max-w-md">
        {/* Animated Cybernetic Outer Logo representation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative inline-flex items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition pointer-events-none" />
          <Keyboard className="w-16 h-16 text-cyan-400 stroke-[1.5] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl font-extrabold font-display tracking-tight text-white mb-2"
        >
          TYPE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">NOVA</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white/60 text-sm font-light tracking-wide max-w-xs mx-auto mb-10"
        >
          Sleek. Fast. Gamified.
          <br />
          Experience next-gen typing mastery.
        </motion.p>

        {/* Features row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3 mb-12 text-center"
        >
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center">
            <Activity className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Realtime Stats</span>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center">
            <Cpu className="w-5 h-5 text-pink-400 mb-1" />
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">AI Coach</span>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center">
            <ShieldAlert className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono font-mono">Anti-Cheat</span>
          </div>
        </motion.div>

        {/* Interactive glow button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinish}
          id="btn-splash-enter"
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl text-white font-bold tracking-wider hover:brightness-110 active:brightness-90 transition shadow-lg shadow-pink-500/25 relative overflow-hidden group border border-white/15"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />
          LAUNCH TERMINAL
        </motion.button>
      </div>

      <div className="absolute bottom-4 text-[10px] text-white/20 font-mono tracking-widest uppercase pointer-events-none">
        System Ver 2.0.26 / Local Storage Active
      </div>
    </div>
  );
}
