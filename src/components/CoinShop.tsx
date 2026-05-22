import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, Sparkles, ShieldAlert, Check, HelpCircle, Flame, 
  Crown, UserCheck, Palette, HelpCircle as HelpIcon, Radio, Zap
} from 'lucide-react';
import { UserProfile } from '../types';

interface CoinShopProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function CoinShop({ profile, onUpdateProfile }: CoinShopProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Unlocked items arrays with default fallback
  const unlockedThemes = profile.unlockedThemes || ['neon-dark', 'glass-light', 'retro-terminal', 'cyberpunk-magenta'];
  const streakShields = profile.streakShields || 0;
  const activeAvatarBorder = profile.activeAvatarBorder || 'none';

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const shopThemes = [
    {
      id: 'matrix-green',
      name: 'Matrix Rain Terminal',
      description: 'Hacker theme featuring toxic green digital rain and phosphor overlays.',
      cost: 400,
    },
    {
      id: 'molten-lava',
      name: 'Molten Lava Core',
      description: 'Intense obsidian visual panels driven by dynamic magma fire glows.',
      cost: 500,
    }
  ];

  const shopBorders = [
    {
      id: 'golden',
      name: '👑 Golden Aura Crown',
      description: 'Adds a dynamic royal shimmering golden breathing outline to your profile avatar.',
      cost: 500,
    },
    {
      id: 'neon-glow',
      name: '🔮 Cyber Fuchsia Vortex',
      description: 'Wraps your profile inside a hyper-speed rotating neon cosmic storm.',
      cost: 350,
    },
    {
      id: 'cyber-shield',
      name: '🌋 Volcanic Magma Frame',
      description: 'Surrounds your picture with pulsing embers and fiery tactile shadows.',
      cost: 600,
    }
  ];

  const handleBuyStreakShield = () => {
    const cost = 200;
    if (profile.coins < cost) {
      showError(`Inkem coins leavu mawa! (Insufficient Coins). You need ${cost} coins but have only ${profile.coins}.`);
      return;
    }
    const updated = {
      ...profile,
      coins: profile.coins - cost,
      streakShields: streakShields + 1
    };
    onUpdateProfile(updated);
    showSuccess(`Streak Freeze Shield acquired! 🛡️ Ne streak correct-ga protect ayyindhi code match blocks valla!`);
  };

  const handleBuyTheme = (themeId: 'matrix-green' | 'molten-lava', cost: number, themeName: string) => {
    if (unlockedThemes.includes(themeId)) {
      // Already bought, equip it!
      const updated = {
        ...profile,
        preferences: {
          ...profile.preferences,
          theme: themeId
        }
      };
      onUpdateProfile(updated);
      showSuccess(`"${themeName}" theme equipped successfully template-lo! Enjoy the new visual style!`);
      return;
    }

    if (profile.coins < cost) {
      showError(`Coins thakkuva unnay masteru! 😂 You need ${cost} Coins to unlock "${themeName}".`);
      return;
    }

    const updated = {
      ...profile,
      coins: profile.coins - cost,
      unlockedThemes: [...unlockedThemes, themeId],
      preferences: {
        ...profile.preferences,
        theme: themeId
      }
    };
    onUpdateProfile(updated);
    showSuccess(`Unlocked and equipped "${themeName}" theme! 🪙 Ne coins safely spent!`);
  };

  const handleToggleBorder = (borderId: string, cost: number, borderName: string) => {
    if (activeAvatarBorder === borderId) {
      // Toggle off to none
      const updated = {
        ...profile,
        activeAvatarBorder: 'none'
      };
      onUpdateProfile(updated);
      showSuccess(`Border removed! Unlocks remain stored securely.`);
      return;
    }

    // Check if they need to buy it or already have it
    // For simplicity, once they buy it we change current border, or check coins. 
    // Let's assume selecting a border for first time costs coins unless already equipped. But wait they can buy and equip instantly!
    // To keep it super cool, buying a border changes current activeAvatarBorder. Let's make it so if they click, they unlock and set it!
    if (activeAvatarBorder !== borderId) {
      if (profile.coins < cost) {
        showError(`Border kosam coins thakkuva unnay raa! 🪙 Need ${cost} Coins for the gorgeous "${borderName}".`);
        return;
      }
      const updated = {
        ...profile,
        coins: profile.coins - cost,
        activeAvatarBorder: borderId
      };
      onUpdateProfile(updated);
      showSuccess(`Unlocked and equipped "${borderName}" Avatar Border! 🌟 Absolute golden status checked.`);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-white/[0.02] border border-white/10 space-y-6">
      {/* Dynamic line decorations */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
      <div className="absolute inset-0 bg-radial-at-t from-yellow-500/[0.04] via-transparent to-transparent pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded font-mono text-[9px] font-black uppercase tracking-wider">
            🪙 TYPENOVA COIN VAULT (NEW!)
          </span>
          <h3 className="text-lg font-black font-display text-white mt-2 uppercase tracking-tight flex items-center gap-1.5">
            <Coins className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] animate-bounce" /> Spend Your Coins Here!
          </h3>
          <p className="text-xs text-white/50 mt-1 font-mono">
            Directly use TypeNova Coins earned from lessons, tests, and arcade to customize your terminal workspace.
          </p>
        </div>

        {/* Real-time Coins Counter */}
        <div className="px-5 py-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center gap-3 self-start sm:self-auto">
          <Coins className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
          <div className="text-left font-mono">
            <span className="block text-[8px] text-yellow-400 font-bold uppercase tracking-widest">COIN BALANCE</span>
            <span className="text-lg font-black text-white">{profile.coins}</span>
          </div>
        </div>
      </div>

      {/* Notifications system feedback alerts */}
      <AnimatePresence mode="wait">
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-mono text-center flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
          >
            <Check className="w-4 h-4" /> {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-mono text-center flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(244,63,94,0.1)]"
          >
            <ShieldAlert className="w-4 h-4 animate-shake" /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tanglish description explanation box */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
        <HelpIcon className="w-10 h-10 text-cyan-400 shrink-0 opacity-80" />
        <div className="space-y-1 text-xs text-left">
          <h4 className="font-extrabold text-[#ffffff] uppercase tracking-wide">Coins use avthunnai mawa! (Coins are now extremely useful!)</h4>
          <p className="text-white/70 leading-relaxed">
            Chalaregi type chesthu gain chesina coins tho brand new, dynamic features leverage cheyyi raa! Spend your points to secure 
            your streaks, customize layout theme animations, and unlock beautiful glowing profile borders immediately.
          </p>
        </div>
      </div>

      {/* Shop Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CATEGORY 1: STREAK SHIELD SYSTEMS */}
        <div className="p-5 bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/5 rounded-2xl space-y-4 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">SAFETY NETS</span>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black border border-indigo-500/20 rounded-md uppercase font-mono">ACTIVE SECURITY</span>
            </div>
            <h4 className="text-sm font-extrabold text-white mt-1 uppercase tracking-tight flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" /> Streak Shield Lock
            </h4>
            <p className="text-xs text-white/50 mt-1 lines-clamp-3 leading-relaxed">
              Ne static active streak protect cheyyi! Buy standard shields: if you miss practicing a day, the shield takes the hit instead of your streak!
            </p>
            <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-left font-mono">
              <span className="text-[9px] text-[#ffffff]/60 block uppercase">COLLECTED SHIELDS</span>
              <span className="text-lg font-black text-indigo-400">{streakShields} Active Shields 🛡️</span>
            </div>
          </div>
          <button
            onClick={handleBuyStreakShield}
            id="btn-buy-streak-shield"
            className="w-full mt-4 py-3 bg-indigo-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5"
          >
            BUY FOR 200 COINS <Coins className="w-3.5 h-3.5 text-yellow-300" />
          </button>
        </div>

        {/* CATEGORY 2: PREMIUM HIGH-INTENSITY THEMES */}
        <div className="p-5 bg-gradient-to-br from-emerald-500/5 to-transparent border border-white/5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">VISUAL TERMINALS</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black border border-emerald-500/20 rounded-md uppercase font-mono">PREMIUM DESIGNS</span>
          </div>
          <h4 className="text-sm font-extrabold text-white mt-1 uppercase tracking-tight flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-400" /> Secret Space Themes
          </h4>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Unlock professional hacker terminals with reactive animated backgrounds. Custom styling changes immediately!
          </p>

          <div className="space-y-3 pt-1">
            {shopThemes.map((th) => {
              const earned = unlockedThemes.includes(th.id);
              const isActive = profile.preferences.theme === th.id;
              return (
                <div key={th.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase">{th.name}</span>
                    <span className="font-mono text-[9px] font-black text-emerald-400 uppercase">
                      {earned ? 'UNLOCKED ✅' : `${th.cost} Coins`}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">{th.description}</p>
                  <button
                    onClick={() => handleBuyTheme(th.id as any, th.cost, th.name)}
                    id={`btn-shop-theme-${th.id}`}
                    className={`w-full mt-1.5 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition text-center ${
                      isActive 
                        ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 cursor-default'
                        : earned 
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                          : 'bg-emerald-600 hover:brightness-110 text-white'
                    }`}
                  >
                    {isActive ? 'CURRENTLY ACTIVE' : earned ? 'EQUIP THEME' : 'PURCHASE THEME'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CATEGORY 3: HOLOGRAPHIC AVATAR BORDERS */}
        <div className="p-5 bg-gradient-to-br from-amber-500/5 to-transparent border border-white/5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">PROFILE BORDERS</span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[8px] font-black border border-amber-500/20 rounded-md uppercase font-mono">STATUS ITEMS</span>
          </div>
          <h4 className="text-sm font-extrabold text-white mt-1 uppercase tracking-tight flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-yellow-400 animate-pulse" /> Avatar Cosmetics
          </h4>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Stand out in multiplayer lobbies and leaderboard ranks! Buy flowing haptic energy frames enclosing your photo.
          </p>

          <div className="space-y-3 pt-1">
            {shopBorders.map((bo) => {
              const isActiveBorder = activeAvatarBorder === bo.id;
              return (
                <div key={bo.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase">{bo.name}</span>
                    <span className="font-mono text-[9px] font-black text-amber-400">
                      {isActiveBorder ? 'EQUIPPED' : `${bo.cost} Coins`}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-450 leading-tight">{bo.description}</p>
                  <button
                    onClick={() => handleToggleBorder(bo.id, bo.cost, bo.name)}
                    id={`btn-shop-border-${bo.id}`}
                    className={`w-full mt-1.5 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition text-center ${
                      isActiveBorder
                        ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                        : 'bg-amber-600 hover:brightness-110 text-white'
                    }`}
                  >
                    {isActiveBorder ? 'UNEQUIP FRAME' : 'PURCHASE & EQUIP'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
