import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Award, ShieldAlert, Sparkles, CheckCircle, Zap, ShieldCheck, Mail, LogOut, CheckSquare, ReceiptText, CreditCard, Download, FileJson, DownloadCloud } from 'lucide-react';
import { MOCK_ACHIEVEMENTS } from '../lessonsData';
import { useState } from 'react';

interface ProfileProps {
  profile: UserProfile;
  onLogout: () => void;
}

export default function Profile({ profile, onLogout }: ProfileProps) {
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  const [certificationUnlocked, setCertificationUnlocked] = useState(profile.xp >= 100);
  const [downloadingBundle, setDownloadingBundle] = useState(false);

  const handleExportProfileBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        profile: profile,
        sessions: localStorage.getItem('typenova_sessions') ? JSON.parse(localStorage.getItem('typenova_sessions')!) : [],
        transactions: getTransactions(),
        exportedAt: new Date().toISOString(),
        host: window.location.host
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `typenova_profile_${profile.username.toLowerCase()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadOfflineApp = () => {
    setDownloadingBundle(true);
    setTimeout(() => {
      try {
        const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeNova Offline Terminal v2.0</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #050609;
            color: #ffffff;
        }
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between p-6">
    <div class="max-w-3xl mx-auto w-full mt-10">
        <!-- Logo Header -->
        <div class="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
            <div class="flex items-center gap-3">
                <span class="text-2xl font-extrabold italic tracking-tight font-sans">TYPE<span class="text-cyan-400">NOVA</span></span>
                <span class="text-[9px] font-mono bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">OFFLINE TERMINAL</span>
            </div>
            <span class="text-[10px] text-white/40 font-mono tracking-widest uppercase">NODE STATE: OFFLINE LOCK</span>
        </div>

        <!-- Offline Info Panel -->
        <div class="p-6 bg-[#0c0d14] border border-cyan-400/15 rounded-3xl mb-8 space-y-4">
            <span class="text-[10px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">Local Account Data Linked</span>
            <h1 class="text-xl font-bold font-mono uppercase text-white">Sync Verified: ${profile.username}</h1>
            <p class="text-xs text-slate-400 leading-relaxed font-mono">
                Current Level: <strong class="text-white">Level ${profile.level}</strong> | Experience: <strong class="text-white">${profile.xp} XP</strong> | Peak Speed: <strong class="text-white">${profile.statistics.maxWpm || 60} WPM</strong>
            </p>
        </div>

        <!-- Mini Interactive Offline Practice Widget -->
        <div class="p-8 bg-[#0a0b10] border border-white/5 rounded-3xl space-y-6">
            <div class="flex items-center justify-between">
                <span class="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">🚀 Quick Practice Relay</span>
                <span class="text-[10px] text-white/30 font-mono uppercase" id="stats-wpm">WPM: 0</span>
            </div>
            
            <p id="target-text" class="text-lg font-mono text-white/50 leading-relaxed max-w-xl select-none">
                the quick brown fox jumps over the lazy dog as code flows through the system terminals.
            </p>

            <textarea id="typing-input" placeholder="Start typing the text above to test offline latency..." class="w-full h-24 bg-[#050609] border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-cyan-500 text-white font-mono text-sm leading-relaxed transition resize-none"></textarea>

            <div class="flex justify-between items-center pt-2">
                <button onclick="resetOfflineWidget()" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white font-mono uppercase font-bold rounded-xl transition">
                    🔄 Reset Arena
                </button>
                <span class="text-[9px] text-white/40 font-mono uppercase" id="accuracy-stat">Accuracy: 100%</span>
            </div>
        </div>
    </div>

    <!-- Offline Footer Info -->
    <div class="text-center text-white/25 text-[9px] font-mono uppercase tracking-widest py-8">
        © 2026 TypeNova Portable Engine / Compiled for ${profile.email || 'Guest User'}
    </div>

    <script>
        const target = document.getElementById('target-text');
        const input = document.getElementById('typing-input');
        const wpmDisplay = document.getElementById('stats-wpm');
        const accDisplay = document.getElementById('accuracy-stat');

        let startTime = null;

        input.addEventListener('input', () => {
            if (!startTime) startTime = Date.now();
            const text = target.innerText;
            const typed = input.value;

            // Simple highlighting algorithm
            let formatted = '';
            let correctCount = 0;

            for (let i = 0; i < text.length; i++) {
                if (i < typed.length) {
                    if (text[i] === typed[i]) {
                        formatted += '<span class="text-cyan-400">' + text[i] + '</span>';
                        correctCount++;
                    } else {
                        formatted += '<span class="text-pink-500 underline decoration-pink-500/45 bg-pink-500/10">' + text[i] + '</span>';
                    }
                } else {
                    formatted += '<span class="text-white/50">' + text[i] + '</span>';
                }
            }
            target.innerHTML = formatted;

            // Live metrics
            const parsedMinutes = (Date.now() - startTime) / 60000;
            const wordCount = typed.length / 5;
            const currentWpm = parsedMinutes > 0 ? Math.round(wordCount / parsedMinutes) : 0;
            const overallAccuracy = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;

            wpmDisplay.innerText = 'WPM: ' + currentWpm;
            accDisplay.innerText = 'Accuracy: ' + overallAccuracy + '%';

            if (typed.trim() === text.trim()) {
                alert('Mission Accomplished Offline! Final speed reached: ' + currentWpm + ' WPM!');
                resetOfflineWidget();
            }
        });

        function resetOfflineWidget() {
            input.value = '';
            startTime = null;
            target.innerHTML = "the quick brown fox jumps over the lazy dog as code flows through the system terminals.";
            wpmDisplay.innerText = 'WPM: 0';
            accDisplay.innerText = 'Accuracy: 100%';
        }
    </script>
</body>
</html>`;

        const fullBlob = new Blob([offlineHtml], { type: 'text/html' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(fullBlob);
        element.download = `typenova_offline_${profile.username.toLowerCase()}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setDownloadingBundle(false);
      } catch (err) {
        setDownloadingBundle(false);
        console.error(err);
      }
    }, 1200);
  };

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

      {/* OFFLINE EXPORT & APP BUNDLE REGISTRY */}
      <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-5">
        <h3 className="text-sm font-bold font-mono text-gray-400 tracking-wider uppercase flex items-center gap-2">
          <DownloadCloud className="w-5 h-5 text-cyan-400" />
          Offline Companion & Export Center
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          Download your complete typing metrics history to keep local backups, or export the self-contained portable offline version of TypeNova to practice anytime without internet credentials.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-sans">
          {/* Option 1: Account / Profile JSON Export */}
          <div className="p-5 bg-[#0a0b10] border border-white/5 rounded-2xl flex flex-col justify-between gap-4 hover:border-white/10 transition">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-xs text-white uppercase font-mono">Profile & Ledger Backup</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                Download a fully verified JSON configuration containing your stats, streak history, achievements, and transaction keys.
              </p>
            </div>
            <button
              onClick={handleExportProfileBackup}
              id="btn-export-profile-json"
              className="py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 font-bold font-mono text-xs rounded-xl tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Data Backup (.json)
            </button>
          </div>

          {/* Option 2: Self-Contained Offline Web App Template */}
          <div className="p-5 bg-[#0a0b10] border border-white/5 rounded-2xl flex flex-col justify-between gap-4 hover:border-white/10 transition">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="font-bold text-xs text-white uppercase font-mono">Offline App Terminal</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                Export a standalone, custom-packaged static companion application (.html) to start typing races completely offline.
              </p>
            </div>
            <button
              onClick={handleDownloadOfflineApp}
              id="btn-download-offline-html"
              disabled={downloadingBundle}
              className="py-2.5 bg-gradient-to-r from-cyan-500/15 to-pink-500/15 hover:from-cyan-500/25 hover:to-pink-500/25 border border-white/5 hover:border-white/10 text-white font-bold font-mono text-xs rounded-xl tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              {downloadingBundle ? 'Compiling Terminal...' : 'Download Offline App (.html)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
