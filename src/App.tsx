import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Keyboard, BookOpen, Play, Swords, Gamepad2, TrendingUp, User, Settings,
  Sparkles, ShieldCheck, Flame, Volume2, Coins, Landmark, LogOut
} from 'lucide-react';

import Splash from './components/Splash';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LessonPractice from './components/LessonPractice';
import TypingTest from './components/TypingTest';
import MultiplayerRace from './components/MultiplayerRace';
import GameCenter from './components/GameCenter';
import Analytics from './components/Analytics';
import ProfileView from './components/Profile';
import SettingsView from './components/Settings';
import PremiumView from './components/Premium';
import AdminPanel from './components/AdminPanel';

import { UserProfile, TypingSession, UserPreferences } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('splash');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionHistory, setSessionHistory] = useState<TypingSession[]>([]);
  const [claimedStreak, setClaimedStreak] = useState(false);

  // AI coach reports status
  const [aiCoachReport, setAiCoachReport] = useState<any>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);

  // Load profile from local storage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem('typenova_profile');
    const savedSessions = localStorage.getItem('typenova_sessions');

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Auto-migrate: If the user manually requested the streak to start from 0
      // or if it was initialized to 1 or 2 by default previously, let's update it to 0!
      if (parsed.streak === 1 || parsed.streak === 2) {
        parsed.streak = 0;
        localStorage.setItem('typenova_profile', JSON.stringify(parsed));
      }
      setProfile(parsed);
      setCurrentView('dashboard'); // bypass splash/auth if already authenticated!
    }
    if (savedSessions) {
      setSessionHistory(JSON.parse(savedSessions));
    }
  }, []);

  // Synchronize claimedStreak state based on profile's lastStreakClaimedDate dynamically
  useEffect(() => {
    if (profile) {
      const todayStr = new Date().toISOString().split('T')[0];
      setClaimedStreak(profile.lastStreakClaimedDate === todayStr);
    } else {
      setClaimedStreak(false);
    }
  }, [profile]);

  // Save profile state updates dynamically
  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('typenova_profile', JSON.stringify(newProfile));

    // If the user has a registered account, sync profile changes to persistent accounts registry
    if (!newProfile.isGuest && newProfile.email) {
      try {
        const rawAccounts = localStorage.getItem('typenova_accounts');
        const accounts = rawAccounts ? JSON.parse(rawAccounts) : {};
        const userEmailKey = newProfile.email.toLowerCase();
        if (accounts[userEmailKey]) {
          accounts[userEmailKey].profile = newProfile;
          localStorage.setItem('typenova_accounts', JSON.stringify(accounts));
        }
      } catch (e) {
        console.error('Error syncing profile update to database accounts', e);
      }
    }
  };

  const handleSplashFinish = () => {
    setCurrentView('auth');
  };

  const handleLoginSuccess = (user: UserProfile, isNewUser: boolean) => {
    saveProfile(user);
    if (isNewUser) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleOnboardingComplete = (onboardProfile: UserProfile) => {
    saveProfile(onboardProfile);
    setCurrentView('dashboard');
  };

  // Sync dyslexia font selection to global page style body
  useEffect(() => {
    if (profile) {
      if (profile.preferences.dyslexiaFont) {
        document.body.classList.add('font-dyslexic');
      } else {
        document.body.classList.remove('font-dyslexic');
      }
    }
  }, [profile?.preferences.dyslexiaFont]);

  // Claim Streak bonus
  const handleClaimStreakBonus = () => {
    if (!profile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const updated: UserProfile = {
      ...profile,
      coins: profile.coins + 50,
      xp: profile.xp + 100,
      streak: profile.streak + 1,
      lastStreakClaimedDate: todayStr
    };
    saveProfile(updated);
    setClaimedStreak(true);
  };

  // Triggering AI Coach feedback server audit proxy
  const handleTriggerAiCoach = async () => {
    if (!profile) return;
    setLoadingCoach(true);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statistics: profile.statistics,
          sessionHistory: sessionHistory.slice(-5), // latest 5 sessions
          preferences: profile.preferences
        })
      });

      if (!res.ok) throw new Error('Coach API failed');
      const data = await res.json();
      setAiCoachReport(data);
    } catch (err) {
      // API down or mock fallback triggered directly from server
      console.warn("API fallback triggered, creating local simulated report.");
    } finally {
      setLoadingCoach(false);
    }
  };

  // Handle Typing Session Logs completions
  const handleRecordTypingSession = (session: TypingSession) => {
    if (!profile) return;

    const newSessions = [...sessionHistory, session];
    setSessionHistory(newSessions);
    localStorage.setItem('typenova_sessions', JSON.stringify(newSessions));

    // Sync session histories to corresponding account database record if logged in with real email
    if (!profile.isGuest && profile.email) {
      try {
        const rawAccounts = localStorage.getItem('typenova_accounts');
        const accounts = rawAccounts ? JSON.parse(rawAccounts) : {};
        const userEmailKey = profile.email.toLowerCase();
        if (accounts[userEmailKey]) {
          accounts[userEmailKey].sessions = newSessions;
          localStorage.setItem('typenova_accounts', JSON.stringify(accounts));
        }
      } catch (e) {
        console.error('Error syncing sessions update to database accounts', e);
      }
    }

    // Calculate core aggregate metrics changes
    const totalLessonsNew = profile.statistics.lessonsCompleted + (session.type === 'lesson' ? 1 : 0);
    const wpmPeakNew = Math.max(profile.statistics.maxWpm, session.wpm);
    const wpmAvgNew = Math.round(
      (profile.statistics.averageWpm * sessionHistory.length + session.wpm) / (sessionHistory.length + 1)
    );
    const accAvgNew = Math.round(
      (profile.statistics.averageAccuracy * sessionHistory.length + session.accuracy) / (sessionHistory.length + 1)
    );

    // Calculate level thresholds based on added XP
    const calculatedXpEarned = Math.round((session.wpm * 2) + (session.accuracy));
    const finalXpNew = profile.xp + calculatedXpEarned;
    const finalLevelNew = Math.floor(finalXpNew / 400) + 1; // 400 XP levels

    const updatedProfile: UserProfile = {
      ...profile,
      xp: finalXpNew,
      level: finalLevelNew,
      coins: profile.coins + (session.accuracy === 100 ? 50 : 20), // complete accuracy coin chest bonuses
      statistics: {
        totalSecondsPlayed: profile.statistics.totalSecondsPlayed + session.durationSeconds,
        lessonsCompleted: totalLessonsNew,
        averageWpm: wpmAvgNew || 40,
        maxWpm: wpmPeakNew || 50,
        averageAccuracy: accAvgNew || 95
      }
    };

    saveProfile(updatedProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('typenova_profile');
    localStorage.removeItem('typenova_sessions');
    setProfile(null);
    setSessionHistory([]);
    setCurrentView('auth');
  };

  // Direct render checks
  if (currentView === 'splash') {
    return <Splash onFinish={handleSplashFinish} />;
  }

  if (currentView === 'auth') {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'onboarding' && profile) {
    return <Onboarding userProfile={profile} onComplete={handleOnboardingComplete} />;
  }

  const getThemeClasses = () => {
    if (!profile) return {
      bg: 'bg-[#0a0a0c] text-white',
      header: 'bg-white/5 border-b border-white/10',
      logo: 'text-cyan-400',
      glowTop: 'bg-cyan-500/10',
      glowBottom: 'bg-purple-600/10'
    };
    switch (profile.preferences.theme) {
      case 'neon-dark':
        return {
          bg: 'bg-[#0a0a0c] text-white',
          header: 'bg-white/5 border-b border-white/10',
          logo: 'text-cyan-400',
          glowTop: 'bg-cyan-500/10',
          glowBottom: 'bg-purple-600/10'
        };
      case 'glass-light':
        return {
          bg: 'bg-[#f4f6fa] text-slate-900',
          header: 'bg-[#ffffff]/85 border-b border-slate-200/80',
          logo: 'text-blue-500',
          glowTop: 'bg-blue-500/5',
          glowBottom: 'bg-indigo-500/5'
        };
      case 'retro-terminal':
        return {
          bg: 'bg-[#040804] text-green-400 font-mono',
          header: 'bg-black/90 border-b border-green-500/20',
          logo: 'text-green-500',
          glowTop: 'bg-green-500/5',
          glowBottom: 'bg-green-600/5'
        };
      case 'cyberpunk-magenta':
        return {
          bg: 'bg-[#0b0110] text-[#ff00a0]',
          header: 'bg-black/80 border-b border-pink-500/20',
          logo: 'text-pink-500',
          glowTop: 'bg-pink-500/10',
          glowBottom: 'bg-purple-600/10'
        };
      case 'matrix-green':
        return {
          bg: 'bg-black text-[#00ff41] font-mono',
          header: 'bg-black border-b border-emerald-500/30',
          logo: 'text-[#00ff41] font-bold shadow-[0_0_10px_rgba(0,255,65,0.3)]',
          glowTop: 'bg-emerald-500/15',
          glowBottom: 'bg-emerald-600/10'
        };
      case 'molten-lava':
        return {
          bg: 'bg-[#0a0202] text-[#ff4500]',
          header: 'bg-[#150505]/95 border-b border-red-600/30',
          logo: 'text-[#ff5500] font-black',
          glowTop: 'bg-red-500/20',
          glowBottom: 'bg-orange-600/10'
        };
      default:
        return {
          bg: 'bg-[#0a0a0c] text-white',
          header: 'bg-white/5 border-b border-white/10',
          logo: 'text-cyan-400',
          glowTop: 'bg-cyan-500/10',
          glowBottom: 'bg-purple-600/10'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col justify-between relative overflow-hidden transition-colors duration-300`}>
      {/* Background radial glow layers - Pure Immersive UI layout */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${theme.glowTop} blur-[130px] rounded-full`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${theme.glowBottom} blur-[160px] rounded-full`}></div>
      </div>

      {/* GLOWING HEADER NAVIGATION PANEL */}
      <header className={`sticky top-0 z-50 ${theme.header} backdrop-blur-xl px-6 py-4 flex items-center justify-between relative z-10 select-none`}>
        <div className="flex items-center gap-7">
          {/* Logo */}
          <button onClick={() => setCurrentView('dashboard')} id="btn-header-logo-home" className="flex items-center gap-2 font-display font-bold text-lg text-white italic tracking-tight">
            <Keyboard className={`w-5 h-5 ${theme.logo} not-italic drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`} />
            TYPE<span className={theme.logo.includes('text') ? theme.logo : 'text-cyan-400'}>NOVA</span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded text-[9px] font-medium not-italic tracking-widest text-white/50 border border-white/10 ml-2">ELITE v2.0</span>
          </button>

          {/* Nav links */}
          {profile && (
            <nav className="hidden md:flex items-center gap-5 text-xs font-mono font-bold tracking-wider">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'lessons', label: 'Lessons' },
                { id: 'test', label: 'Tests' },
                { id: 'multiplayer', label: 'Multiplayer' },
                { id: 'games', label: 'Arcade' },
                { id: 'analytics', label: 'Analytics' }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  id={`btn-header-nav-${link.id}`}
                  className={`transition hover:text-white uppercase px-2 py-1 rounded ${
                    currentView === link.id ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* User stats widget bar */}
        {profile && (
          <div className="flex items-center gap-4 text-xs font-mono select-none">
            {/* Subscription status badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-inner ${
              profile.isElite 
                ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/20 text-pink-400 border-pink-500/30' 
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}>
              <Sparkles className={`w-3 h-3 ${profile.isElite ? 'text-pink-400 animate-pulse' : 'text-gray-500'}`} />
              <span className="text-[9px] tracking-wider uppercase font-extrabold font-mono">
                {profile.isElite ? 'ELITE MEMBER' : 'FREE ACCOUNT'}
              </span>
            </div>

            {/* Coins Indicator styled after top bar telemetry widget */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
              <Coins className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
              <span className="font-bold text-white/90">{profile.coins}</span>
              <div className="w-px h-3 bg-white/20"></div>
              <span className="text-[9px] uppercase text-white/40 tracking-wider font-bold">COINS</span>
            </div>

            {/* Streak Indicator styled after the mockup streak element */}
            <button
              onClick={() => {
                if (window.confirm("Do you want to reset your typing streak to 0?")) {
                  const updatedProfile = { ...profile, streak: 0 };
                  saveProfile(updatedProfile);
                }
              }}
              title="Click to reset streak to 0"
              className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-orange-500/10 px-3 py-1.5 rounded-full border border-white/10 hover:border-orange-500/25 shadow-inner transition cursor-pointer"
            >
              <span className="text-orange-500 font-bold">🔥 {profile.streak}</span>
              <div className="w-px h-3 bg-white/20"></div>
              <span className="text-[9px] uppercase text-white/40 tracking-wider font-bold">STREAK</span>
            </button>

            {/* Profile trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('profile')}
                id="btn-header-avatar"
                className="w-9 h-9 rounded-full border-2 border-cyan-400 p-[1px] shadow-[0_0_10px_rgba(34,211,238,0.3)] overflow-hidden transition hover:scale-105"
              >
                <div className="w-full h-full bg-[#12131a] rounded-full flex items-center justify-center">
                  <img src={profile.avatarUrl} alt="nav-avatar" className="w-6 h-6 object-contain referrerPolicy='no-referrer'" />
                </div>
              </button>

              {/* Settings button */}
              <button
                onClick={() => setCurrentView('settings')}
                id="btn-header-settings"
                className="p-1.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Custom micro link to Premium subscriptions */}
              <button
                onClick={() => setCurrentView('premium')}
                id="btn-header-premium"
                className="p-1.5 hover:bg-white/5 rounded-xl text-pink-400 hover:text-pink-300 transition"
              >
                <Sparkles className="w-4 h-4 fill-current fill-pink-500 animate-pulseFixed" />
              </button>

              {/* Admin Panel check */}
              <button
                onClick={() => setCurrentView('admin')}
                id="btn-header-admin"
                className="p-1.5 hover:bg-white/5 rounded-xl text-gray-500 hover:text-slate-350 transition"
              >
                <Landmark className="w-4 h-4" />
              </button>

              {/* Seamless secure logout button */}
              <button
                onClick={handleLogout}
                id="btn-header-logout"
                title="Disconnect Gateway Session"
                className="p-1.5 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CORE DISPLAY WINDOW VIEW */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {profile && (
              <>
                {currentView === 'dashboard' && (
                  <Dashboard
                    profile={profile}
                    onChangeView={setCurrentView}
                    onClaimDailyReward={handleClaimStreakBonus}
                    claimedStreak={claimedStreak}
                    onResetStreak={() => {
                      const updatedProfile = { ...profile, streak: 0 };
                      saveProfile(updatedProfile);
                    }}
                    onUpdateProfile={saveProfile}
                  />
                )}
                {currentView === 'lessons' && (
                  <LessonPractice
                    profile={profile}
                    onChangeView={setCurrentView}
                    onLessonFinish={(lid, stats) => {
                      // Construct standard completed metrics session represent
                      const session: TypingSession = {
                        id: `lesson-${Date.now()}`,
                        timestamp: Date.now(),
                        type: 'lesson',
                        durationSeconds: stats.durationSeconds,
                        wpm: stats.wpm,
                        accuracy: stats.accuracy,
                        cpm: stats.wpm * 5,
                        errorsCount: stats.errors,
                        consistencyScore: Math.round(stats.accuracy),
                        weakKeys: stats.weakKeys
                      };
                      handleRecordTypingSession(session);

                      // Save completed lesson ID to profile pathway
                      if (!profile.levelPath.completedLessons.includes(lid)) {
                        const updated: UserProfile = {
                          ...profile,
                          levelPath: {
                            ...profile.levelPath,
                            completedLessons: [...profile.levelPath.completedLessons, lid]
                          }
                        };
                        saveProfile(updated);
                      }
                    }}
                  />
                )}
                {currentView === 'test' && (
                  <TypingTest
                    profile={profile}
                    onTestFinish={(session) => {
                      handleRecordTypingSession(session);
                    }}
                  />
                )}
                {currentView === 'multiplayer' && (
                  <MultiplayerRace
                    profile={profile}
                    onRaceFinish={(xp, coins) => {
                      const updated: UserProfile = {
                        ...profile,
                        xp: profile.xp + xp,
                        coins: profile.coins + coins
                      };
                      saveProfile(updated);
                      setCurrentView('dashboard');
                    }}
                  />
                )}
                {currentView === 'games' && (
                  <GameCenter
                    onEarnReward={(xp, coins) => {
                      const updated: UserProfile = {
                        ...profile,
                        xp: profile.xp + xp,
                        coins: profile.coins + coins
                      };
                      saveProfile(updated);
                      setCurrentView('dashboard');
                    }}
                  />
                )}
                {currentView === 'analytics' && (
                  <Analytics
                    profile={profile}
                    sessions={sessionHistory}
                    onTriggerAiCoach={handleTriggerAiCoach}
                    aiCoachReport={aiCoachReport}
                    loadingCoach={loadingCoach}
                  />
                )}
                {currentView === 'profile' && (
                  <ProfileView profile={profile} onLogout={handleLogout} />
                )}
                {currentView === 'settings' && (
                  <SettingsView
                    profile={profile}
                    onChangePreferences={(newPrefs) => {
                      saveProfile({
                        ...profile,
                        preferences: newPrefs
                      });
                    }}
                  />
                )}
                {currentView === 'premium' && (
                  <PremiumView
                    profile={profile}
                    onCoinsSuccess={(coinsNew) => {
                      saveProfile({
                        ...profile,
                        coins: coinsNew
                      });
                    }}
                    onUpgradeSuccess={() => {
                      saveProfile({
                        ...profile,
                        isElite: true,
                        preferences: {
                          ...profile.preferences,
                          theme: 'cyberpunk-magenta' as any
                        }
                      });
                    }}
                  />
                )}
                {currentView === 'admin' && (
                  <AdminPanel />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER AREA */}
      <footer className="py-6 border-t border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between text-white/30 text-[10px] font-bold uppercase tracking-widest px-8 gap-4 relative z-10 select-none">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <span>SYSTEM: ONLINE</span>
          <span className="hidden sm:inline">●</span>
          <span>SERVER: CLOUD-RUN-TOKYO</span>
          <span className="hidden sm:inline">●</span>
          <span>LATENCY: 8ms</span>
          <span className="hidden sm:inline">●</span>
          <span>SYNC: LOCAL INTENDED</span>
        </div>
        <div className="flex items-center gap-4">
          <span>© 2026 TYPENOVA ELITE PROTOCOL</span>
        </div>
      </footer>
    </div>
  );
}
