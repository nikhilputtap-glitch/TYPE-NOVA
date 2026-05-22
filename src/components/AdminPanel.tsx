import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserX, PlusCircle, BellRing, Settings, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([
    { username: 'Spamtyper99', email: 'spam@bot.com', status: 'Active', flagCount: 12 },
    { username: 'Alpha_Typer', email: 'alpha@typenova.com', status: 'Active', flagCount: 0 },
    { username: 'Quantum_Glitch', email: 'glitch@gmail.com', status: 'Active', flagCount: 2 }
  ]);
  const [msgInput, setMsgInput] = useState('');
  const [pushedMessage, setPushedMessage] = useState('');

  const handleBanUser = (username: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.username === username ? { ...u, status: u.status === 'Active' ? 'BANNED' : 'Active' } : u))
    );
  };

  const handleSendPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setPushedMessage(msgInput);
    setMsgInput('');
    setTimeout(() => setPushedMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 border border-cyan-400/20 rounded uppercase">
          Moderation Core
        </span>
        <h2 className="text-xl font-extrabold font-display text-white mt-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" /> Administrative Command Terminal
        </h2>
        <p className="text-xs text-gray-400 mt-1">Surgical user profile administration, anti-cheat status tracking, pushing message triggers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PLAYER CONTROL MODERATION */}
        <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
            <UserX className="w-4 h-4 text-pink-500" /> Player Profile Moderation
          </h3>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.username}
                className="p-3 bg-[#0a0b10] border border-white/5 rounded-2xl flex items-center justify-between gap-4 select-none"
              >
                <div>
                  <span className="block font-bold text-xs text-white uppercase">{u.username}</span>
                  <span className="text-[9px] text-gray-500 block">Anti-Cheat Flags: {u.flagCount}</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <span className={`text-[9px] font-mono font-semibold uppercase ${u.status === 'Active' ? 'text-green-400' : 'text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded'}`}>
                    {u.status}
                  </span>
                  <button
                    onClick={() => handleBanUser(u.username)}
                    id={`btn-moderator-ban-${u.username}`}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition ${
                      u.status === 'Active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-green-500/15 text-green-400 hover:bg-green-500 hover:text-black'
                    }`}
                  >
                    {u.status === 'Active' ? 'BAN CONTROL' : 'REINITIALIZE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BROADCAST PUSH NOTIFICATION DRIVERS */}
        <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
            <BellRing className="w-4 h-4 text-cyan-400" /> Live terminal broadcasting
          </h3>

          <form onSubmit={handleSendPushNotification} className="space-y-4 select-none">
            <div className="relative">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="ENTER BROADCAST ALERTS..."
                className="w-full p-3 bg-[#0a0b10] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              id="btn-trigger-broadcast"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs rounded-xl tracking-wider uppercase transition shadow-md shadow-cyan-500/15"
            >
              TRIGGER BROADCAST ALERT
            </button>
          </form>

          <AnimatePresence>
            {pushedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-xl text-center text-[10px] uppercase font-mono font-bold"
              >
                📡 SUCCESS: Broadcasted alarm: "{pushedMessage}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
