import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, Swords, Gamepad2, Award, Sparkles, TrendingUp, Flame, ChevronRight, Zap, Target, Activity } from 'lucide-react';
import { UserProfile, TaskChallenge } from '../types';
import { MOCK_CHALLENGES } from '../lessonsData';
import CoinShop from './CoinShop';
import AdBanner from './AdBanner';

interface DashboardProps {
  profile: UserProfile;
  onChangeView: (view: string) => void;
  onClaimDailyReward: () => void;
  claimedStreak: boolean;
  onResetStreak: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function Dashboard({ profile, onChangeView, onClaimDailyReward, claimedStreak, onResetStreak, onUpdateProfile }: DashboardProps) {
  const getAvatarBorderClass = () => {
    switch (profile.activeAvatarBorder) {
      case 'golden':
        return 'bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse border border-yellow-250';
      case 'neon-glow':
        return 'bg-gradient-to-tr from-fuchsia-400 via-purple-600 to-cyan-400 shadow-[0_0_25px_rgba(168,85,247,0.7)] animate-pulse';
      case 'cyber-shield':
        return 'bg-gradient-to-tr from-red-500 via-orange-600 to-yellow-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-bounce';
      default:
        return 'bg-gradient-to-tr from-cyan-400 to-pink-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]';
    }
  };

  // Dynamic personalized pathway recommendation text
  const getRecommendation = () => {
    switch (profile.levelPath.skill) {
      case 'Beginner':
        return {
          title: 'Master Home Row Index Keys',
          desc: 'Our AI coach recommends building muscle memory around F and J anchoring points.',
          action: 'Begin Lessons',
          view: 'lessons'
        };
      case 'Intermediate':
        return {
          title: 'Punctuation and Caps Fluency',
          desc: 'Work on incorporating the Shift key and semicolon positions into word strings.',
          action: 'Take Typing Test',
          view: 'test'
        };
      case 'Advanced':
        if (profile.levelPath.purpose === 'Coding') {
          return {
            title: 'Python Array and Dict Syntax',
            desc: 'Typing curly braces and loops seamlessly triggers substantial coding gains.',
            action: 'Practice Coding syntax',
            view: 'lessons'
          };
        }
        return {
          title: 'Advanced Speed Endurance Para',
          desc: 'Build consistency beyond 100 WPM on longer detailed layouts.',
          action: 'Enter Speed Drills',
          view: 'lessons'
        };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Hero Profile Section using Immersive UI border styles */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className={`w-16 h-16 rounded-full p-[1.5px] transition-all duration-300 ${getAvatarBorderClass()}`}
            >
              <div className="w-full h-full bg-[#0a0a0c] rounded-full flex items-center justify-center overflow-hidden">
                <img src={profile.avatarUrl} alt="avatar" className="w-11 h-11 object-contain referrerPolicy='no-referrer'" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-display tracking-tight text-white uppercase">{profile.username}</h2>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-400/10 text-cyan-400 rounded border border-cyan-400/30 uppercase">
                  LEVEL {profile.level}
                </span>
                {profile.isGuest && (
                  <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold bg-amber-400/10 text-amber-400 rounded border border-amber-400/30">
                    GUEST TERMINAL
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60 mt-1">Pathway Profile: <span className="text-pink-400 font-semibold">{profile.levelPath.skill}</span> / Goal: <span className="text-cyan-400 font-semibold">{profile.levelPath.purpose}</span></p>
            </div>
          </div>

          {/* XP Progress Bar indicator */}
          <div className="flex-grow max-w-xs w-full">
            <div className="flex justify-between items-center text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">
              <span>XP: {profile.xp} / {profile.level * 400}</span>
              <span>Next Level: {Math.max(0, (profile.level * 400) - profile.xp)} XP</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                style={{ width: `${Math.min(100, (profile.xp / (profile.level * 400)) * 105)}%` }} // subtle level alignment check
              />
            </div>
          </div>

          {/* Coins and streak row */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <span className="block text-[8px] text-white/40 font-bold uppercase tracking-wider">COINS</span>
                <span className="font-mono text-sm text-yellow-101 font-bold">{profile.coins}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Do you want to reset your typing streak to 0?")) {
                  onResetStreak();
                }
              }}
              title="Click to reset streak to 0"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-orange-500/10 rounded-2xl border border-white/10 hover:border-orange-500/20 shadow-inner text-left transition duration-200 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <span className="block text-[8px] text-white/40 font-bold uppercase tracking-wider">STREAK</span>
                <span className="font-mono text-sm text-pink-400 font-bold">{profile.streak} Days</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Claim Box */}
      <AnimatePresence mode="popLayout">
        {!claimedStreak && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Daily Login Bonus Available!</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Maintain your typing streak grids, unlock +50 Coins and +100 XP.</p>
              </div>
            </div>
            <button
              onClick={onClaimDailyReward}
              id="btn-claim-streak"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white text-xs font-medium transition shadow-md shadow-cyan-500/10"
            >
              SYNC DAILY LOGIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Layout of pathways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RECOMMENDED PRACTICE PATH CARD */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div>
            <span className="px-2 py-0.5 text-[9px] font-mono text-cyan-400 bg-cyan-400/10 rounded border border-cyan-400/20 font-bold uppercase">
              RECOMMENDED DISK PATH
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-3">{recommendation.title}</h3>
            <p className="text-white/60 text-xs mt-2 leading-relaxed">{recommendation.desc}</p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex gap-4 text-[11px] text-white/40 font-mono">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-cyan-500" /> GOAL WPM: 50+
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-pink-500" /> REWARD: XP BONUS
              </span>
            </div>
            <button
              onClick={() => onChangeView(recommendation.view)}
              id="btn-dashboard-recommended-action"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              LAUNCH NOW
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RECENT ANALYTICS SNIPPET */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50"></div>
          <div>
            <span className="px-2 py-0.5 text-[9px] font-mono text-pink-400 bg-pink-400/10 rounded border border-pink-400/20 font-bold uppercase">
              SYSTEM PERFORMANCE
            </span>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase font-mono font-bold">Avg Speed</span>
                <span className="font-mono text-lg font-bold text-cyan-400 mt-1 block">
                  {profile.statistics.averageWpm ? `${Math.round(profile.statistics.averageWpm)} WPM` : '--'}
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase font-mono font-bold">Peak Speed</span>
                <span className="font-mono text-lg font-bold text-pink-400 mt-1 block">
                  {profile.statistics.maxWpm ? `${profile.statistics.maxWpm} WPM` : '--'}
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase font-mono font-bold">Accuracy</span>
                <span className="font-mono text-lg font-bold text-green-400 mt-1 block">
                  {profile.statistics.averageAccuracy ? `${Math.round(profile.statistics.averageAccuracy)}%` : '--'}
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-white/40 block uppercase font-mono font-bold">Lessons</span>
                <span className="font-mono text-lg font-bold text-yellow-400 mt-1 block">
                  {profile.statistics.lessonsCompleted} Done
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onChangeView('analytics')}
            id="btn-dashboard-view-analytics"
            className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            COMPUTE HEATMAPS
          </button>
        </div>
      </div>

      {/* CORE LAUNCHPAD MATRIX */}
      <div>
        <h3 className="text-xs font-bold font-mono text-white/40 tracking-wider uppercase mb-4">LAUNCH TERMINALS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Typing test */}
          <button
            onClick={() => onChangeView('test')}
            id="btn-nav-typing-test"
            className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-3xl text-left cursor-pointer transition select-none flex flex-col justify-between h-40 group relative overflow-hidden duration-300 shadow-md"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 w-fit group-hover:bg-cyan-400 group-hover:text-black transition duration-300">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="block text-sm font-extrabold font-display text-white mt-4 group-hover:text-cyan-400 transition">Typing Tests</span>
              <span className="block text-[10px] text-white/50 mt-1">15s to 5m, speed tracking, analytics</span>
            </div>
          </button>

          {/* Lessons */}
          <button
            onClick={() => onChangeView('lessons')}
            id="btn-nav-lessons"
            className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-3xl text-left cursor-pointer transition select-none flex flex-col justify-between h-40 group relative overflow-hidden duration-300 shadow-md"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 w-fit group-hover:bg-pink-400 group-hover:text-black transition duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-extrabold font-display text-white mt-4 group-hover:text-pink-400 transition">Typing Lessons</span>
              <span className="block text-[10px] text-white/50 mt-1">Guided keyboard finger indicators</span>
            </div>
          </button>

          {/* Multiplayer */}
          <button
            onClick={() => onChangeView('multiplayer')}
            id="btn-nav-multiplayer"
            className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-3xl text-left cursor-pointer transition select-none flex flex-col justify-between h-40 group relative overflow-hidden duration-300 shadow-md"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 w-fit group-hover:bg-purple-400 group-hover:text-white transition duration-300">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-extrabold font-display text-white mt-4 group-hover:text-purple-400 transition">Multiplayer Wars</span>
              <span className="block text-[10px] text-white/50 mt-1">Race bots + real typists in real-time</span>
            </div>
          </button>

          {/* Games */}
          <button
            onClick={() => onChangeView('games')}
            id="btn-nav-games"
            className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-3xl text-left cursor-pointer transition select-none flex flex-col justify-between h-40 group relative overflow-hidden duration-300 shadow-md"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400 w-fit group-hover:bg-yellow-400 group-hover:text-black transition duration-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-extrabold font-display text-white mt-4 group-hover:text-yellow-400 transition">Typing Arcade</span>
              <span className="block text-[10px] text-white/50 mt-1">Zombie Horde & meteor storms!</span>
            </div>
          </button>
        </div>
      </div>

      {/* ACTIVE QUESTS AND CHALLENGES */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-extrabold font-mono text-white/80 tracking-wider uppercase flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400/80" />
            DAILY QUEST SYNC
          </h3>
          <span className="text-[10px] font-mono text-pink-400">RESET IN: 16 Hours</span>
        </div>

        <div className="space-y-3">
          {MOCK_CHALLENGES.map((ch, index) => (
            <div
              key={ch.id}
              className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex gap-3">
                <span className="font-mono text-cyan-400/70 font-bold">0{index + 1}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase">{ch.title}</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">{ch.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block font-mono text-xs text-yellow-400 font-bold">+{ch.rewardCoins} Coins</span>
                  <span className="block text-[9px] text-gray-500 font-mono uppercase">Expires in {ch.expiresIn}</span>
                </div>
                <button
                  type="button"
                  id={`btn-dashboard-quest-claim-${index}`}
                  disabled
                  className="px-3 py-1.5 bg-white/10 rounded-lg text-white/40 text-[10px] uppercase font-bold text-center pointer-events-none"
                >
                  ACTIVE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COIN VAULT AND WORKSPACE STORE */}
      <CoinShop profile={profile} onUpdateProfile={onUpdateProfile} />

      {/* AD PLACEMENT */}
      <AdBanner />
    </div>
  );
}
