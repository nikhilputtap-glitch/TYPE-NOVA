import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, Sparkles, UserCheck, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
  onLoginSuccess: (profile: UserProfile, isNewUser: boolean) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [submittedReset, setSubmittedReset] = useState(false);
  const [googleStep, setGoogleStep] = useState<'input' | 'consent' | 'sending' | null>(null);
  const [googleEmail, setGoogleEmail] = useState('nikhilputtap@gmail.com');
  const [googleName, setGoogleName] = useState('Nikhil');
  const [googleProgress, setGoogleProgress] = useState<string[]>([]);

  // Helper to fetch registry accounts
  const getRegisteredAccounts = (): Record<string, any> => {
    try {
      const data = localStorage.getItem('typenova_accounts');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading accounts', e);
      return {};
    }
  };

  // Helper to save accounts
  const saveRegisteredAccounts = (accounts: Record<string, any>) => {
    try {
      localStorage.setItem('typenova_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error('Error saving accounts', e);
    }
  };

  // Generate a mock initial profile upon guest or direct simulation
  const createMockProfile = (name: string, mail: string, guest: boolean): UserProfile => {
    return {
      username: name || 'NovaTyper',
      email: mail || 'guest@typenova.com',
      isGuest: guest,
      avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name || 'guest'}`,
      xp: 0,
      level: 1,
      coins: 50,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      levelPath: {
        skill: 'Beginner',
        purpose: 'Office',
        dailyGoal: 10,
        completedLessons: []
      },
      achievements: [],
      statistics: {
        totalSecondsPlayed: 0,
        lessonsCompleted: 0,
        averageWpm: 0,
        maxWpm: 0,
        averageAccuracy: 0
      },
      preferences: {
        theme: 'neon-dark',
        keyboardLayout: 'QWERTY',
        language: 'English',
        soundPack: 'mechanical',
        dyslexiaFont: false,
        colorBlindMode: false,
        fontSize: 'md',
        oneHandMode: 'off'
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (forgotPassword) {
      setSubmittedReset(true);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const accounts = getRegisteredAccounts();

    if (isLogin) {
      // Login flow
      const existingUser = accounts[trimmedEmail];
      if (!existingUser) {
        setErrorMsg('No user found with this email. Please sign up.');
        return;
      }

      if (existingUser.password !== password) {
        setErrorMsg('Incorrect secure password. Please try again.');
        return;
      }

      // Load user session history and profile
      const userSessions = existingUser.sessions || [];
      localStorage.setItem('typenova_sessions', JSON.stringify(userSessions));
      onLoginSuccess(existingUser.profile, false);
    } else {
      // Signup flow
      if (password.length < 5) {
        setErrorMsg('Password should be at least 5 characters for node protection.');
        return;
      }

      if (accounts[trimmedEmail]) {
        setErrorMsg('An account with this email already exists.');
        return;
      }

      const name = username.trim() || trimmedEmail.split('@')[0] || 'Typer';
      const newProfile = createMockProfile(name, trimmedEmail, false);

      // Register the user
      accounts[trimmedEmail] = {
        email: trimmedEmail,
        password: password,
        profile: newProfile,
        sessions: []
      };
      saveRegisteredAccounts(accounts);

      // Clear current session cache and set newly created state
      localStorage.setItem('typenova_sessions', JSON.stringify([]));
      onLoginSuccess(newProfile, true);
    }
  };

  const handleGuestMode = () => {
    const randomGuestId = Math.floor(1000 + Math.random() * 9000);
    const profile = createMockProfile(`Guest_${randomGuestId}`, '', true);
    localStorage.setItem('typenova_sessions', JSON.stringify([]));
    onLoginSuccess(profile, true); // Guest always goes through dynamic onboarding paths
  };

  const handleStartGoogleLogin = () => {
    setErrorMsg('');
    setGoogleStep('input');
    setGoogleProgress([]);
  };

  const handleGoogleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim().includes('@')) {
      setErrorMsg('Please enter a valid Google Mail address.');
      return;
    }
    setErrorMsg('');
    setGoogleStep('consent');
  };

  const handleGoogleConsentAllowed = () => {
    setGoogleStep('sending');
    setErrorMsg('');
    
    // Simulate high-tech mail dispatch sequence
    const logs = [
      '⚡ [SMTP CLIENT] Initializing Socket 0x7FFF98... Established.',
      '🔒 [TLS] Exchanging cipher key-pairs... 4096-bit connection verified.',
      '🔗 [AUTH] Handshake authorized with Google Mail Relay Service...',
      `📦 [QUEUE] Preparing message envelope for recipient: ${googleEmail.toLowerCase()}`,
      '📝 [PAYLOAD] Injection payload: "TypeNova Terminal Secure Access Notification"',
      `🚀 [DISPATCH] Shipping packet to Google incoming port MX 10...`,
      '📬 [RELAY] Request received. Server acknowledged with MSG ID: <tn-8688923649-ok>',
      '✅ [SUCCESS] Welcome email sent and successfully routed to your primary index mailbox!'
    ];

    setGoogleProgress([]);
    
    logs.forEach((logText, idx) => {
      setTimeout(() => {
        setGoogleProgress(prev => [...prev, logText]);
      }, (idx + 1) * 350);
    });

    // Complete authentication at the end
    setTimeout(() => {
      const targetEmail = googleEmail.trim().toLowerCase();
      const accounts = getRegisteredAccounts();
      
      let googleUser = accounts[targetEmail];
      const isNew = !googleUser;
      
      if (!googleUser) {
        const customName = googleName.trim() || targetEmail.split('@')[0] || 'Google Typer';
        const newProfile = createMockProfile(customName, targetEmail, false);
        googleUser = {
          email: targetEmail,
          password: 'google-oauth-sim-pass-secret',
          profile: newProfile,
          sessions: []
        };
        accounts[targetEmail] = googleUser;
        saveRegisteredAccounts(accounts);
      }

      const userSessions = googleUser.sessions || [];
      localStorage.setItem('typenova_sessions', JSON.stringify(userSessions));
      setGoogleStep(null);
      onLoginSuccess(googleUser.profile, isNew);
    }, (logs.length + 1) * 350 + 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Rings */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#12131a]/85 border border-white/5 p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl shadow-2xl"
      >
        {/* Futuristic accent header lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            {googleStep ? 'GOOGLE CONNECT' : forgotPassword ? 'RESET ACCESS' : isLogin ? 'SIGN IN' : 'CREATE PROFILE'}
          </h2>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">
            {googleStep ? 'SECURE OAUTH TERMINAL' : forgotPassword ? 'Secure Verification Tunnel' : 'TypeNova Gateway System'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center text-xs font-bold font-mono">
            ⚠️ {errorMsg}
          </div>
        )}

        {googleStep === 'input' ? (
          <form onSubmit={handleGoogleSubmitInput} className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 bg-cyan-400/5 border border-cyan-400/10 rounded-2xl text-center mb-2">
              <span className="text-cyan-400 font-bold font-mono text-[10px] block tracking-wider uppercase mb-1">
                🌐 Google Account Link
              </span>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                Connect your Google identity securely to synchronise historic performance records.
              </p>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                placeholder="GOOGLE ACCOUNT EMAIL"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono text-xs"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <UserPlus className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                placeholder="YOUR GOOGLE PROFILE NAME"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              id="btn-google-auth-continue"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 rounded-xl text-white font-medium text-xs tracking-uppercase transition flex items-center justify-center gap-2 font-mono uppercase font-bold"
            >
              🚀 Continue to Authorization
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setGoogleStep(null)}
                id="btn-google-auth-cancel-1"
                className="text-[10px] text-gray-400 hover:text-white underline font-mono tracking-wider uppercase"
              >
                Cancel and Return
              </button>
            </div>
          </form>
        ) : googleStep === 'consent' ? (
          <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 font-display">
                  G
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">Sign in with Google</h4>
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{googleEmail}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-gray-300 font-mono leading-relaxed">
                  TypeNova is requesting consent to access your secure profile info:
                </p>
                <div className="space-y-2 text-[10px] text-gray-400 font-mono pl-1">
                  <div className="flex gap-2 items-start">
                    <span className="text-cyan-400">•</span>
                    <span>Synchronize key metric statistics, level history, and coin records ledger securely on this host.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-cyan-400">•</span>
                    <span>Send validation dispatch alerts and critical session tokens to your email inbox: <strong className="text-white">{googleEmail}</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleGoogleConsentAllowed}
                id="btn-google-auth-allow"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-500 hover:to-pink-600 rounded-xl text-white text-xs tracking-uppercase font-sans font-bold uppercase transition flex items-center justify-center gap-2"
              >
                🔐 Allow Access & Send Secure Email
              </button>
              
              <button
                onClick={() => setGoogleStep('input')}
                id="btn-google-auth-back"
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] tracking-uppercase font-mono uppercase rounded-xl transition"
              >
                Back to Edit Account
              </button>
            </div>
          </div>
        ) : googleStep === 'sending' ? (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 bg-[#050609] border border-cyan-400/20 rounded-2xl font-mono text-[10px] text-cyan-400 space-y-1.5 h-64 overflow-y-auto leading-relaxed overflow-x-hidden">
              <div className="text-[11px] text-white font-bold mb-2 pb-1 border-b border-white/5 flex justify-between items-center">
                <span>⚡ MAIL ROUTING STREAM</span>
                <span className="animate-pulse text-cyan-400">● STATUS: TRANSMITTING</span>
              </div>
              
              {googleProgress.map((msg, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap leading-tight text-white/90"
                >
                  {msg}
                </div>
              ))}
              
              {googleProgress.length < 8 && (
                <div className="animate-pulse pt-2 text-white/30 text-[9px]">
                  Connecting pipeline...
                </div>
              )}
            </div>
            
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase animate-pulse">
                Sending security notification mail...
              </span>
            </div>
          </div>
        ) : forgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {submittedReset ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-sm text-emerald-400">
                <p className="font-medium mb-1">Pass-tunnel Link Sent</p>
                <p className="text-xs text-gray-400">Check your inbox for terminal verification prompts.</p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPassword(false);
                    setSubmittedReset(false);
                  }}
                  id="btn-auth-back-reset"
                  className="mt-4 text-xs text-cyan-400 underline"
                >
                  Return to login
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Mail className="w-5 h-5 line" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="ENTER REGISTERED EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono text-sm"
                  />
                </div>
                <button
                  type="submit"
                  id="btn-auth-reset-request"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-medium text-sm tracking-uppercase transition"
                >
                  SEND RESET LINK
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    Cancel and Return
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <UserPlus className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="DISPLAY NAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono text-xs"
                />
              </div>
            )}

            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono text-xs"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                placeholder="SECURE PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition font-mono text-xs"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  id="btn-auth-forgot"
                  className="text-xs text-gray-400 hover:text-cyan-400 transition"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              id="btn-auth-submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 rounded-xl text-white font-medium transition text-xs flex items-center justify-center gap-2 mt-4"
            >
              {isLogin ? <LogIn className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              {isLogin ? 'AUTHORIZE TERMINAL' : 'INITIALIZE PROFILE'}
            </button>
          </form>
        )}

        {!googleStep && (
          <>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-mono tracking-widest uppercase">OR CONNECT</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Third Party Login Matrix */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleStartGoogleLogin}
                id="btn-auth-google"
                className="py-2.5 bg-[#0a0b10] hover:bg-white/5 border border-white/5 rounded-xl text-white text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.63c-.29 1.5-.1.3-1.12 2.33L12 18v3.91h5.81c3.4-3.13 5.37-7.74 5.37-12.27z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.81-2.91c-1.1.75-2.5 1.22-4.15 1.22-3.2 0-5.9-2.16-6.87-5.07H1.18V18.1C3.17 21.6 7.28 24 12 24z" />
                  <path fill="#FBBC05" d="M5.13 14.33c-.25-.75-.39-1.55-.39-2.33s.14-1.58.39-2.33V4.6H1.18A12.022 12.022 0 000 12c0 2.7.9 5.2 2.42 7.3l2.71-3.97-1.3-.97-1.1-1.07z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.28 0 3.17 2.4 1.18 5.9l3.95 3.07c.97-2.91 3.67-5.22 6.87-5.22z" />
                </svg>
                Google Identity
              </button>

              <button
                onClick={handleGuestMode}
                id="btn-auth-guest"
                className="py-2.5 bg-[#0a0b10] hover:bg-white/5 border border-white/5 rounded-xl text-cyan-400 text-xs font-medium flex items-center justify-center gap-2 transition shadow-inner"
              >
                <UserCheck className="w-4 h-4" />
                Guest Terminal
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setForgotPassword(false);
                }}
                id="btn-auth-switch-mode"
                className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 hover:underline transition font-medium"
              >
                {isLogin ? "DON'T HAVE AN ACCOUNT? REGISTER NOW" : 'ALREADY SIGNED IN? CONNECT TERMINAL'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
