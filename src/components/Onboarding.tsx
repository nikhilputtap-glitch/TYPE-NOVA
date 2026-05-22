import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Target, Compass, Keyboard as KeyIcon, Clock, ChevronRight, Globe } from 'lucide-react';
import { SkillLevel, KeyboardLayout, DailyGoalMinutes, TrainingPurpose, TypingLanguage, UserProfile } from '../types';

interface OnboardingProps {
  userProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

export default function Onboarding({ userProfile, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [skill, setSkill] = useState<SkillLevel>('Beginner');
  const [purpose, setPurpose] = useState<TrainingPurpose>('Office');
  const [layout, setLayout] = useState<KeyboardLayout>('QWERTY');
  const [goal, setGoal] = useState<DailyGoalMinutes>(10);
  const [lang, setLang] = useState<TypingLanguage>('English');

  const totalSteps = 5;

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Assemble final customized profile pathway
      const finalProfile: UserProfile = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          keyboardLayout: layout,
          language: lang
        },
        levelPath: {
          skill,
          purpose,
          dailyGoal: goal,
          completedLessons: []
        }
      };
      onComplete(finalProfile);
    }
  };

  const currentProgressPercent = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Laser light line */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg bg-[#12131a] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        {/* Dynamic header tracker */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-mono text-cyan-400 tracking-wider">PHASE {step} OF {totalSteps}</span>
          <span className="text-xs text-gray-500">{Math.round(currentProgressPercent)}% SYNCED</span>
        </div>

        {/* Floating progress line indicator */}
        <div className="w-full h-[3px] bg-white/5 rounded-full mb-8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentProgressPercent}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-cyan-400 to-pink-500"
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: TYPING EXPERIENCE COGNITION */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                  <Compass className="w-6 h-6 text-cyan-400" />
                  What is your experience?
                </h3>
                <p className="text-gray-400 text-xs mt-1">We will construct custom tactile exercises targeting this speed level.</p>
              </div>

              <div className="space-y-3">
                {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => {
                  const details = {
                    Beginner: 'Focus on index anchoring, basic finger postures, and standard Home Row placements.',
                    Intermediate: 'Move rapidly towards capital combos, punctuations, numbers, and vocabulary drills.',
                    Advanced: 'Engage code lines, complex syntax formatting, high-tempo speed paragraphs, and competitive runs.'
                  }[level];

                  return (
                    <button
                      key={level}
                      onClick={() => setSkill(level)}
                      className={`w-full p-4 rounded-xl text-left border transition flex items-start gap-4 ${
                        skill === level
                          ? 'bg-cyan-500/10 border-cyan-500 text-white'
                          : 'bg-[#0a0b10] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                        skill === level ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' : 'border-gray-600'
                      }`}>
                        {skill === level && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-100">{level}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{details}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: PREFERRED KEYBOARD LAYOUT */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                  <KeyIcon className="w-6 h-6 text-cyan-400" />
                  Your Keybed Layout?
                </h3>
                <p className="text-gray-400 text-xs mt-1 font-sans">Select layout system. Finger visualizers adapt seamlessly.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(['QWERTY', 'AZERTY', 'DVORAK'] as KeyboardLayout[]).map((lay) => {
                  const label = {
                    QWERTY: 'Standard Latin / Universal layout standard.',
                    AZERTY: 'Primary French and Belgian keybed design setups.',
                    DVORAK: 'Ergonomic focused design minimizing key travel index ratio.'
                  }[lay];

                  return (
                    <button
                      key={lay}
                      onClick={() => setLayout(lay)}
                      className={`p-4 rounded-xl text-left border transition flex items-center justify-between ${
                        layout === lay ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-[#0a0b10] border-white/5 text-gray-400'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm tracking-wide text-slate-100 block">{lay}</span>
                        <span className="text-[11px] text-gray-400 mt-1 block">{label}</span>
                      </div>
                      {layout === lay && <Check className="w-5 h-5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREFERRED TARGET LANGUAGE */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  Practice Language?
                </h3>
                <p className="text-gray-400 text-xs mt-1">Choose target language glossary for generated spelling tests.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['English', 'Telugu', 'Hindi', 'Tamil', 'Urdu', 'Arabic', 'Spanish', 'French'] as TypingLanguage[]).map((la) => (
                  <button
                    key={la}
                    onClick={() => setLang(la)}
                    className={`p-4 rounded-xl text-left border transition flex items-center justify-between ${
                      lang === la ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-[#0a0b10] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-100">{la}</span>
                    {lang === la && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: PRIMARY TRAINING PURPOSE */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-cyan-400" />
                  What is your primary goal?
                </h3>
                <p className="text-gray-400 text-xs mt-1">We tailor vocabulary generators targeting this professional purpose.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['School', 'Coding', 'Office', 'Gaming', 'Competitive'] as TrainingPurpose[]).map((purp) => {
                  const icon = {
                    School: '🎓',
                    Coding: '💻',
                    Office: '💼',
                    Gaming: '🎮',
                    Competitive: '⚡'
                  }[purp];

                  return (
                    <button
                      key={purp}
                      onClick={() => setPurpose(purp)}
                      className={`p-4 rounded-xl text-left border transition flex flex-col justify-between h-28 ${
                        purpose === purp ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-[#0a0b10] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      <div>
                        <span className="block font-semibold text-xs text-slate-200 mt-2">{purp}</span>
                        <span className="text-[10px] text-gray-500 block">Focused dictionary style</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 5: DAILY PRACTICE GOALS */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  Daily Practice Goal?
                </h3>
                <p className="text-gray-400 text-xs mt-1">Consistent daily bursts reinforce motor reflexes significantly.</p>
              </div>

              <div className="space-y-3">
                {([10, 30, 60] as DailyGoalMinutes[]).map((min) => {
                  const type = {
                    10: 'Casual Daily Routine - Quick index drills / micro sessions',
                    30: 'Standard Developer Standard - Steady growth metrics',
                    60: 'Ultimate Competitor Focus - Heavy speed endurance'
                  }[min];

                  return (
                    <button
                      key={min}
                      onClick={() => setGoal(min)}
                      className={`w-full p-4 rounded-xl text-left border transition flex items-center justify-between ${
                        goal === min ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-[#0a0b10] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-slate-100">{min} MINUTES DAILY</span>
                        <span className="text-[10px] text-gray-400 mt-1 block">{type}</span>
                      </div>
                      {goal === min && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continuation Controller */}
        <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-[#0a0b10] hover:bg-white/5 border border-white/5 text-gray-400 rounded-xl font-medium text-xs transition"
            >
              BACK
            </button>
          )}
          <button
            onClick={handleNextStep}
            id={`btn-onboarding-next-${step}`}
            className="flex-grow py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:brightness-110 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-cyan-500/10"
          >
            {step === totalSteps ? 'COMMUNITY SYNCHRONIZE' : 'ANALYZE PHASE'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
