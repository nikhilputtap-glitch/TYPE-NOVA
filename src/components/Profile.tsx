import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Award, ShieldAlert, Sparkles, CheckCircle, Zap, ShieldCheck, Mail, LogOut, CheckSquare, ReceiptText, CreditCard } from 'lucide-react';
import { MOCK_ACHIEVEMENTS } from '../lessonsData';
import { useState } from 'react';

interface ProfileProps {
  profile: UserProfile;
  onLogout: () => void;
}

export default function Profile({ profile, onLogout }: ProfileProps) {
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  const [certificationUnlocked, setCertificationUnlocked] = useState(profile.xp >= 100);

  // Retrieve previous payment states and coin purchases from localStorage
  const getTransactions = () => {
    try {
      const raw = localStorage.getItem('typenova_transactions');
      const txs = raw ? JSON.parse(raw) : [];
      // Filter strictly by current logged-in user email or guest fallback
      const currentUserEmail = profile.email || 'guest-terminal@typenova.com';
      return txs.filter((t: any) => t.email.toLowerCase() === currentUserEmail.toLowerCase());
    } catch (e) {
      console.error('Failed to parse transactions ledger:', e);
      return [];
    }
  };

  const userTransactions = getTransactions();

  const triggerCertificateSimulation = () => {
    if (!certificationUnlocked) return;
    setDownloadingCertificate(true);
    setTimeout(() => {
      setDownloadingCertificate(false);
      alert(`Download complete! Synced TypeNova Certified Credential for ${profile.username}. Performance verification peak: ${profile.statistics.maxWpm || 60} WPM.`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-full bg-cyan-400/5 blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-450 to-pink-500 p-[2px] shadow-lg">
            <div className="w-full h-full bg-[#12131a] rounded-2xl flex items-center justify-center overflow-hidden">
              <img src={profile.avatarUrl} alt="avatar" className="w-16 h-16 object-contain referrerPolicy='no-referrer'" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-2xl font-extrabold font-display text-white uppercase">{profile.username}</h2>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-pink-500/10 text-pink-400 rounded-md border border-pink-500/20 uppercase">
                LEVEL {profile.level}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 justify-center md:justify-start">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> {profile.email || 'guest-terminal@typenova.com'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          id="btn-trigger-profile-logout"
          className="px-4 py-2 bg-red-500/15 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition uppercase"
        >
          <LogOut className="w-4 h-4" /> DISCONNECT
        </button>
      </div>

      {/* CERTIFICATION DOWNLOAD PANEL */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" /> Verified Certificate
        </div>

        <h3 className="text-lg font-bold font-display text-white">🎓 TypeNova Certificate Credentials</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xl">
          Complete typing pathway courses and exceed 100 XP to qualify for fully verified, resume-ready typing speed certificates.
        </p>

        <div className="bg-[#0a0b10] p-4 rounded-2xl border border-white/5 mt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${certificationUnlocked ? 'bg-cyan-500/10 text-cyan-400' : 'bg-gray-500/10 text-gray-500'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-200">Standard Pathway Certificate</span>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {certificationUnlocked ? `Qualified! Peak recorded speed: ${profile.statistics.maxWpm || 60} WPM.` : 'Locked. Complete more typing exercises or tests to earn 100+ XP.'}
              </p>
            </div>
          </div>

          <button
            onClick={triggerCertificateSimulation}
            disabled={!certificationUnlocked || downloadingCertificate}
            className="w-full md:w-auto px-5 py-2.5 bg-cyan-500 disabled:opacity-50 hover:bg-cyan-600 rounded-xl text-white text-xs font-semibold transition tracking-wide uppercase shadow"
          >
            {downloadingCertificate ? 'Compiling Verification...' : 'Download Certificate'}
          </button>
        </div>
      </div>

      {/* GAMIFICATION BADGES AND ACHIEVEMENTS */}
      <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl">
        <h3 className="text-sm font-bold font-mono text-gray-400 tracking-wider uppercase mb-5 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          Skill Badges Unlocks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = profile.xp >= ach.points * 3; // Simulated unlock ratio
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-[#0a0b10] border-cyan-500/25 shadow-md shadow-cyan-500/5'
                    : 'bg-[#0a0b10]/40 border-white/5 opacity-40'
                }`}
              >
                <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-cyan-500/10 text-cyan-400' : 'bg-gray-500/10 text-gray-500'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white uppercase">{ach.title}</span>
                    {isUnlocked && <CheckSquare className="w-3.5 h-3.5 text-green-400" />}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{ach.description}</p>
                  <span className="text-[9px] font-mono text-pink-400 block mt-1 uppercase font-bold">Value: {ach.points} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECURE TRANSACTION & COIN LEDGER SECTION */}
      <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
            <div>
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-widest">
                Payment & Purchases Ledger
              </h3>
              <span className="text-[10px] text-white/40 block mt-0.5 font-mono">
                Authorised Node: {profile.email || 'guest-terminal@typenova.com'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-md border border-cyan-500/25 uppercase font-bold">
            {userTransactions.length} {userTransactions.length === 1 ? 'Record' : 'Records'} Detected
          </span>
        </div>

        {userTransactions.length === 0 ? (
          <div className="py-8 text-center bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4">
            <CreditCard className="w-8 h-8 text-white/20 mb-2 animate-pulse" />
            <p className="text-xs text-white/60 font-mono">No active transaction credentials registered for this profile.</p>
            <p className="text-[10px] text-white/30 mt-1 max-w-xs leading-relaxed font-mono">
              Upgrade to Premium Elite Access or top up with Coin Packages to unlock ledger statements here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userTransactions.map((tx: any) => (
              <div
                key={tx.id}
                className="p-4 bg-[#0a0b10] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition duration-150"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    tx.type === 'elite' ? 'bg-pink-500/10 text-pink-400' : 'bg-yellow-405/10 bg-yellow-400/10 text-yellow-400'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white tracking-wide">{tx.title}</span>
                      <span className="font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/40 uppercase font-bold tracking-wider">
                        {tx.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/45 mt-1 font-mono">
                      <span>Gateway: {tx.upiId}</span>
                      <span>•</span>
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                  <div className="text-right">
                    <span className="block font-mono text-xs font-extrabold text-cyan-400">
                      ₹{tx.priceINR}
                    </span>
                    <span className="block font-mono text-[9px] text-white/40">
                      ${tx.priceUSD} USD
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 mt-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-emerald-400 text-[9px] font-mono uppercase font-bold">
                    <CheckCircle className="w-3 h-3" /> SECURE SUCCESS
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
