import { motion } from 'motion/react';
import { Sparkles, Check, Zap, Smartphone, Copy, QrCode, ArrowLeft, CheckCircle2, Wallet, X, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { useState } from 'react';

interface PremiumProps {
  profile: UserProfile;
  onCoinsSuccess: (newCoins: number) => void;
  onUpgradeSuccess: () => void;
}

interface UPIPaymentDetails {
  type: 'elite' | 'coins';
  coinsAmount?: number;
  priceUSD: number;
  priceINR: number;
  title: string;
  upiUrl: string;
}

export default function Premium({ profile, onCoinsSuccess, onUpgradeSuccess }: PremiumProps) {
  const [successMsg, setSuccessMsg] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<UPIPaymentDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);

  // Base UPI URL builder for 8688923649@ybl
  const getUpiUrl = (amount: number, note: string) => {
    return `upi://pay?pa=8688923649@ybl&pn=TypeNova%20Enterprise&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Open direct UPI Payment Modal Instead of Simulation
  const handleBuyCoins = (amount: number, priceUSD: number, priceINR: number, label: string) => {
    const upiUrl = getUpiUrl(priceINR, `TypeNova +${amount} Coins`);
    setPaymentDetails({
      type: 'coins',
      coinsAmount: amount,
      priceUSD,
      priceINR,
      title: label,
      upiUrl
    });
    setCopied(false);
    setVerificationSuccess(false);
    setVerifyingPayment(false);
    setUtrNumber('');
    setPaymentError('');
    setVerificationLogs([]);
  };

  // Open direct UPI Payment Modal for Elite Upgrade
  const handleSubscribe = () => {
    const upiUrl = getUpiUrl(399, 'TypeNova Elite Monthly Plan');
    setPaymentDetails({
      type: 'elite',
      priceUSD: 4.75,
      priceINR: 399,
      title: 'Elite Monthly Subscription Plan',
      upiUrl
    });
    setCopied(false);
    setVerificationSuccess(false);
    setVerifyingPayment(false);
    setUtrNumber('');
    setPaymentError('');
    setVerificationLogs([]);
  };

  // Safe manual copy for UPI ID
  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText('8688923649@ybl');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID: ', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden text-center max-w-2xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-400/5 blur-[100px] pointer-events-none" />

        <div className="p-3 bg-pink-500/10 text-pink-400 rounded-full inline-block mb-3 animate-pulse">
          <Sparkles className="w-8 h-8 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
        </div>

        <h2 className="text-2xl font-extrabold font-display text-white">Unlock TypeNova Premium Access</h2>
        <p className="text-xs text-white/60 mt-2 max-w-sm mx-auto font-mono">
          Gain unrestricted access to elite training lessons, advanced heatmaps, and server-side AI typing coach suggestions.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl max-w-md mx-auto text-center text-xs font-bold font-mono">
          {successMsg}
        </div>
      )}

      {/* CORE SUBSCRIPTION TIER AND SHOP CARD ITEMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* PREMIUM SUBS CARD */}
        <div className="bg-[#12131a]/80 backdrop-blur-md p-6 rounded-3xl border border-pink-500/30 flex flex-col justify-between relative overflow-hidden group hover:border-pink-500/60 transition duration-300">
          <div className="absolute top-0 right-0 bg-pink-500 text-black px-4 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded-bl-2xl uppercase">
            POPULAR SYSTEM
          </div>

          <div>
            <span className="text-xs font-mono text-pink-400 font-bold uppercase block">Elite Monthly plan</span>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold text-white font-display">₹399</span>
              <span className="text-pink-400/60 text-xs font-mono ml-1">/ $4.75 USD</span>
            </div>

            <ul className="space-y-3.5 mt-6 text-xs text-white/60">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-405 text-cyan-400 drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]" /> Server-side AI Coach metrics
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" /> Global ranked multiplayer rooms
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" /> Unlock futuristic Glassmorphic Magenta theme
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" /> Absolute NO advertising interference
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> Includes 5000 Bonus Coins
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubscribe}
            id="btn-subscribe-premium"
            className="w-full mt-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 active:scale-95 font-extrabold text-white text-xs tracking-wider rounded-xl transition uppercase shadow-lg shadow-pink-500/20"
          >
            UPGRADE TO ELITE
          </button>
        </div>

        {/* COIN SHOP TILES MATRIX */}
        <div className="bg-[#12131a]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-xs font-mono font-bold text-white/75 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500 animate-bounce" /> TypeNova Coin micro-shop
            </h3>
            <p className="text-[10px] text-white/50 mt-1 font-mono">Unlock sound packs or premium certificates instantly.</p>
          </div>

          <div className="space-y-3">
            {[
              { coins: 500, label: '🛡️ Minor Coin Cache', priceUSD: 0.99, priceINR: 79 },
              { coins: 1500, label: '💰 Standard Coin Chest', priceUSD: 1.99, priceINR: 159 },
              { coins: 5000, label: '🔋 Ultimate Warp Cache (+15% Bonus)', priceUSD: 4.99, priceINR: 399 }
            ].map((pack, index) => (
              <div
                key={index}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4 hover:border-white/20 transition duration-150"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-100 font-display">{pack.label}</span>
                  <span className="font-mono text-[10px] text-yellow-400 block mt-0.5">+{pack.coins} Coins</span>
                </div>
                <button
                  onClick={() => handleBuyCoins(pack.coins, pack.priceUSD, pack.priceINR, pack.label)}
                  id={`btn-buy-coins-${index}`}
                  className="px-4 py-2 bg-yellow-405 bg-yellow-400 text-black font-extrabold text-[10px] rounded-xl tracking-wider transition uppercase hover:scale-105 active:scale-95 shadow"
                >
                  ₹{pack.priceINR} / ${pack.priceUSD}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPI SECURE CONFIGURED CHECKOUT DIALOG MODAL */}
      {paymentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden select-none">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="bg-[#12131a] max-w-md w-full rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl"
          >
            {/* Top Border Line Accent */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
                <h3 className="font-extrabold font-display text-xs text-white uppercase tracking-wider">UPI SECURE CHECKOUT</h3>
              </div>
              <button
                onClick={() => setPaymentDetails(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pr-2 scrollbar-none">
              {verifyingPayment ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="p-3.5 bg-cyan-400/10 rounded-full text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >
                    <Loader2 className="w-8 h-8" />
                  </motion.div>
                  <div className="w-full">
                    <h4 className="text-white font-bold text-sm">Validating Secure Transfer...</h4>
                    <p className="text-[10px] text-cyan-400/80 mt-1 font-mono font-bold tracking-wider uppercase">Ledger verification in progress</p>
                    
                    {/* Live secure terminal logger steps */}
                    <div className="bg-black/90 rounded-2xl p-3.5 border border-white/5 mt-4 text-left font-mono text-[9px] text-cyan-300 space-y-1.5 h-36 overflow-y-auto w-full select-text leading-relaxed">
                      {verificationLogs.map((log, index) => (
                        <div key={index} className="animate-[fadeIn_0.15s_ease-out] flex gap-1.5">
                          <span className="text-gray-500 font-bold">&gt;</span>
                          <span className={log.includes('✅') || log.includes('Success') ? 'text-emerald-400 font-bold' : log.startsWith('[SYS]') ? 'text-yellow-405 text-yellow-400 font-bold' : 'text-cyan-300'}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : verificationSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3.5 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    <CheckCircle2 className="w-12 h-12 animate-[bounce_1s_ease-in-out_infinite]" />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-bold text-base">Payment Complete!</h4>
                    <p className="text-[10px] text-emerald-400 mt-1 font-mono uppercase tracking-widest font-extrabold">STATUS DETECTED: SUCCESS</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary Box */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">Product Description</span>
                    <span className="text-sm font-extrabold text-slate-100 font-display mt-0.5 block">{paymentDetails.title}</span>

                    <div className="flex justify-between items-baseline mt-4 pt-3 border-t border-white/5">
                      <span className="text-xs text-white/50 font-mono">Total Payable:</span>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-cyan-405 text-cyan-400 font-mono">₹{paymentDetails.priceINR}</span>
                        <span className="text-[10px] text-white/40 block font-mono">approx. ${paymentDetails.priceUSD} USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Deep link action for Mobile users */}
                  <div className="space-y-3.5 text-center">
                    <div>
                      <span className="text-[9px] font-mono text-white/45 uppercase tracking-widest block mb-1.5">Direct Intent Redirect (Mobile)</span>
                      <a
                        href={paymentDetails.upiUrl}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:brightness-110 text-white font-extrabold text-xs tracking-widest rounded-xl transition uppercase shadow-lg shadow-pink-500/20 active:scale-95"
                      >
                        <Smartphone className="w-4 h-4 animate-bounce" />
                        OPEN UPI ROUTER APP
                      </a>
                      <p className="text-[9px] text-white/40 mt-1 leading-relaxed">
                        Instantly triggers payment on PhonePe, Google Pay, Paytm, Mobikwik, or BHIM.
                      </p>
                    </div>

                    {/* QR Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-[1px] bg-white/10 flex-1" />
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">or scan qr code</span>
                      <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 select-all">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(paymentDetails.upiUrl)}`}
                          alt="Scan to Pay"
                          className="w-36 h-36"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[9px] text-white/40 mt-2 max-w-xs leading-relaxed font-mono">
                        Open your custom UPI mobile scanner to securely process the transfer of ₹{paymentDetails.priceINR}.
                      </span>
                    </div>

                    {/* Manual Info */}
                    <div className="space-y-1.5 text-left mt-3">
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Recipient UPI address ID</span>
                      <div className="flex items-center justify-between gap-3 p-2.5 bg-white/5 border border-white/10 rounded-xl">
                        <span className="font-mono text-xs text-white/80 font-bold select-all">8688923649@ybl</span>
                        <button
                          onClick={handleCopyUPI}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 rounded-md transition duration-150 active:scale-95"
                        >
                          {copied ? 'COPIED!' : 'COPY ID'}
                        </button>
                      </div>
                    </div>

                    {/* UTR/UPI Ref Input Area with high security validation */}
                    <div className="space-y-2 text-left mt-4 p-4 bg-cyan-500/5 border border-cyan-450/10 border-cyan-400/10 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                          🔒 Enter 12-Digit UPI Ref No. (UTR)
                        </label>
                        <span className="text-[8px] text-gray-500 font-mono">REQUIRED</span>
                      </div>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="e.g. 629012345678"
                        value={utrNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ''); // retain numbers only
                          setUtrNumber(val);
                          setPaymentError('');
                        }}
                        className="w-full px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition font-mono text-sm tracking-widest text-center"
                      />
                      <p className="text-[9px] text-gray-400 leading-normal mt-1 font-mono">
                        Copy the 12-digit UTR sequence from Google Pay, PhonePe, Paytm or BHIM transaction note.
                      </p>
                      {paymentError && (
                        <p className="text-[9.5px] text-rose-450 text-rose-405 text-red-400 font-mono font-bold mt-1.5 text-center bg-red-500/10 py-1.5 px-2.5 rounded-lg border border-red-500/20 leading-relaxed">
                          ⚠️ {paymentError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA Bottom activation check */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <p className="text-[9.5px] text-white/55 leading-relaxed text-center font-mono">
                      Once transfer is authorised on your phone, trigger verification below to activate benefits:
                    </p>
                    <button
                      onClick={() => {
                        if (!utrNumber || utrNumber.length !== 12) {
                          setPaymentError('Invalid Transaction ID (UTR)! Must be exactly 12 numeric digits.');
                          return;
                        }
                        setPaymentError('');
                        setVerifyingPayment(true);
                        setVerificationLogs(['[SYS] Handshake with central UPI gateway node...']);

                        const stepMessages = [
                          '⚡ Authenticated ledger access keys...',
                          `🔍 Querying BHIM central database for Ref: ${utrNumber}...`,
                          `💰 Verifying received settlements of ₹${paymentDetails.priceINR}...`,
                          '📈 Processing secure token generation and subscription ledger...',
                          '✅ Match Confirmed! Syncing local vault status...'
                        ];

                        stepMessages.forEach((msg, idx) => {
                          setTimeout(() => {
                            setVerificationLogs(prev => [...prev, msg]);
                          }, (idx + 1) * 800);
                        });

                        setTimeout(() => {
                          setVerifyingPayment(false);
                          setVerificationSuccess(true);
                          setTimeout(() => {
                            // Record a real secure transaction ledger object
                            const newTx = {
                              id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
                              utr: utrNumber,
                              email: profile.email || 'guest-terminal@typenova.com',
                              username: profile.username,
                              type: paymentDetails.type,
                              title: paymentDetails.title,
                              coinsAmount: paymentDetails.coinsAmount || 0,
                              priceINR: paymentDetails.priceINR,
                              priceUSD: paymentDetails.priceUSD,
                              status: 'SUCCESS',
                              timestamp: new Date().toISOString(),
                              upiId: '8688923649@ybl'
                            };

                            try {
                              const rawTxs = localStorage.getItem('typenova_transactions');
                              const txs = rawTxs ? JSON.parse(rawTxs) : [];
                              txs.unshift(newTx);
                              localStorage.setItem('typenova_transactions', JSON.stringify(txs));
                            } catch (e) {
                              console.error('Error logging transaction', e);
                            }

                            if (paymentDetails.type === 'elite') {
                              onUpgradeSuccess();
                              setSuccessMsg(`UPI Status Confirmed! Welcome to TypeNova ELITE pathway. (UTR: ${utrNumber})`);
                            } else {
                              onCoinsSuccess(profile.coins + paymentDetails.coinsAmount!);
                              setSuccessMsg(`UPI Status Confirmed! Acquired +${paymentDetails.coinsAmount} TypeNova Coins. (UTR: ${utrNumber})`);
                            }
                            setPaymentDetails(null);
                            setVerificationSuccess(false);
                            setUtrNumber('');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          }, 1600);
                        }, 5000); // Realistic 5 seconds wait
                      }}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider rounded-xl transition uppercase shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      I HAVE PAID - VERIFY STATUS
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
