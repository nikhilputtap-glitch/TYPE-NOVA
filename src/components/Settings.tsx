import { motion } from 'motion/react';
import { UserProfile, KeyboardLayout, TypingLanguage } from '../types';
import { Settings as SettingsIcon, Keyboard, Volume2, Globe, Eye, HelpCircle } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onChangePreferences: (preferences: UserProfile['preferences']) => void;
}

export default function Settings({ profile, onChangePreferences }: SettingsProps) {
  const handleUpdatePreference = <K extends keyof UserProfile['preferences']>(
    key: K,
    value: UserProfile['preferences'][K]
  ) => {
    onChangePreferences({
      ...profile.preferences,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 border border-cyan-400/20 rounded uppercase">
          System Control Panel
        </span>
        <h2 className="text-xl font-extrabold font-display text-white mt-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" /> Core Calibration Settings
        </h2>
        <p className="text-xs text-gray-400 mt-1">Configure layout, tactile sound packs, accessible interfaces, and typography scales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LAYOUT AND LOCALE */}
        <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
            <Keyboard className="w-4 h-4 text-cyan-500" /> Keyboard & Languages
          </h3>

          <div className="space-y-4">
            {/* Keyboard Layout Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase">Tactile Keyboard Layout</label>
              <div className="grid grid-cols-3 gap-2">
                {(['QWERTY', 'AZERTY', 'DVORAK'] as KeyboardLayout[]).map((lay) => (
                  <button
                    key={lay}
                    onClick={() => handleUpdatePreference('keyboardLayout', lay)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                      profile.preferences.keyboardLayout === lay
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400'
                        : 'bg-[#0a0b10] border-white/5 text-gray-500 hover:border-white/10'
                    }`}
                  >
                    {lay}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase block">Target glossary language</label>
              <div className="grid grid-cols-2 gap-2">
                {(['English', 'French', 'Spanish', 'Telugu'] as TypingLanguage[]).map((la) => (
                  <button
                    key={la}
                    onClick={() => handleUpdatePreference('language', la)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition ${
                      profile.preferences.language === la
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400'
                        : 'bg-[#0a0b10] border-white/5 text-gray-500 hover:border-white/10'
                    }`}
                  >
                    {la}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SOUND PACKS AND AUDIO HAPTICS */}
        <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
            <Volume2 className="w-4 h-4 text-pink-500" /> Audio sound packs
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-bold uppercase">Tactile Sound packs</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'off', label: '📴 Sound Packs: off' },
                { id: 'mechanical', label: '⌨️ Mechanical Key' },
                { id: 'laser', label: '🔫 Cyber Laser' },
                { id: 'beep', label: '📟 Vintage Beep' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleUpdatePreference('soundPack', s.id as any)}
                  className={`py-3 px-3.5 rounded-xl text-xs font-semibold border transition text-left ${
                    profile.preferences.soundPack === s.id
                      ? 'bg-pink-500/15 border-pink-500 text-pink-400'
                      : 'bg-[#0a0b10] border-white/5 text-gray-500 hover:border-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACCESSIBILITY FEATURES CONTROLS */}
        <div className="p-6 bg-[#12131a] border border-white/5 rounded-3xl space-y-4 md:col-span-2">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
            <Eye className="w-4 h-4 text-cyan-400 animate-pulse" /> Accessible interfaces
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dyslexic Font Toggle button */}
            <div className="p-4 bg-[#0a0b10] rounded-2xl border border-white/5 space-y-3">
              <div>
                <span className="block text-xs font-bold text-slate-200">Dyslexia-friendly Font</span>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Overrides standard typography layouts with OpenDyslexic spaced blocks.</p>
              </div>
              <button
                onClick={() => handleUpdatePreference('dyslexiaFont', !profile.preferences.dyslexiaFont)}
                id="btn-settings-dyslexia"
                className={`py-2 px-4 rounded-xl text-xs font-bold border w-full transition uppercase ${
                  profile.preferences.dyslexiaFont
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 border-white/5 text-gray-400'
                }`}
              >
                {profile.preferences.dyslexiaFont ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Font Zoom Controller */}
            <div className="p-4 bg-[#0a0b10] rounded-2xl border border-white/5 space-y-3">
              <div>
                <span className="block text-xs font-bold text-slate-200">Adjustable Font Size</span>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Increases display size ratio inside practice sheets for readability.</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['sm', 'md', 'lg'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleUpdatePreference('fontSize', sz as any)}
                    className={`py-1 rounded-lg text-xs font-bold uppercase transition ${
                      profile.preferences.fontSize === sz
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* One Hand Keyboard Mode */}
            <div className="p-4 bg-[#0a0b10] rounded-2xl border border-white/5 space-y-3">
              <div>
                <span className="block text-xs font-bold text-slate-200">One-Hand Keybed Mode</span>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Redistributes key triggers towards Left or Right bounds for accessibility.</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['off', 'left', 'right'] as const).map((one) => (
                  <button
                    key={one}
                    onClick={() => handleUpdatePreference('oneHandMode', one as any)}
                    className={`py-1 rounded-lg text-[10px] uppercase font-bold transition ${
                      profile.preferences.oneHandMode === one
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {one}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
