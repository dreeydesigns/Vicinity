import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, User, Phone, ShieldCheck, Mail, Copy, EyeOff, Key, Loader2, ChevronLeft } from 'lucide-react';
import { WalletContent, Match } from '../types';

interface WalletScreenProps {
  match: Match;
  walletContent: WalletContent | null;
  onBack: () => void;
}

export function WalletScreen({ match, walletContent: initialWalletContent, onBack }: WalletScreenProps) {
  const [wallet, setWallet] = useState<WalletContent | null>(null);
  const [status, setStatus] = useState<'waiting' | 'revealed' | 'both-revealed'>('waiting');
  const [revealing, setRevealing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [userRevealed, setUserRevealed] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (countdown !== null && countdown > 0 && status === 'waiting') {
      interval = window.setInterval(() => {
        setCountdown(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (countdown === 0 && status === 'waiting') {
      // Simulate the other user revealing
      setWallet(initialWalletContent);
      setStatus('both-revealed');
    }
    return () => clearInterval(interval);
  }, [countdown, status, initialWalletContent]);

  const revealMyWallet = () => {
    setRevealing(true);
    // Simulate network delay
    setTimeout(() => {
      setUserRevealed(true);
      setStatus('waiting');
      setCountdown(3); // Wait 3 seconds for the "other person" to reveal
      setRevealing(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-10">
      <div className="p-5 pt-10">
        <button onClick={onBack} className="p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-800">
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-4">
            {status === 'both-revealed' ? (
              <Unlock size={32} className="text-violet-600" />
            ) : (
              <Lock size={32} className="text-slate-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Match Wallet</h1>
          <p className="text-sm text-slate-500 text-center">
            {status === 'both-revealed'
              ? 'Contact info unlocked'
              : status === 'waiting'
              ? 'Waiting for mutual reveal'
              : 'Loading...'}
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 flex flex-col items-center shadow-sm border border-slate-100 mb-5">
          {match.user.avatarUrl ? (
            <div className="w-20 h-20 rounded-full bg-violet-600 p-0.5 mb-3 flex items-center justify-center">
              <img src={match.user.avatarUrl} alt={match.user.displayName} className="w-full h-full rounded-full object-cover border-2 border-white" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center mb-3 text-white border-2 border-white shadow-sm">
              <User size={40} />
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-900 mb-1">{match.user.displayName}</h2>
          {match.user.bio && (
            <p className="text-[13px] text-slate-500 text-center line-clamp-2">
              {match.user.bio}
            </p>
          )}
        </div>

        {status !== 'both-revealed' && (
          <div className="bg-white rounded-[20px] p-6 flex flex-col items-center shadow-sm border border-slate-100 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${userRevealed ? 'bg-violet-600' : 'bg-slate-200'}`} />
              <div className={`w-3 h-3 rounded-full ${status === 'both-revealed' ? 'bg-violet-600' : 'bg-slate-200'}`} />
            </div>
            <p className="text-sm text-slate-500 text-center mb-2">
              {userRevealed
                ? 'You revealed your info · Waiting for your match...'
                : 'Reveal your info to unlock theirs'}
            </p>
            
            {countdown !== null && (
              <p className="text-xs text-slate-400 mb-4">
                Unlocks in {formatCountdown(countdown)}
              </p>
            )}

            {!userRevealed && (
              <button
                onClick={revealMyWallet}
                disabled={revealing}
                className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors mt-2"
              >
                {revealing ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Key size={20} />
                    <span>Reveal My Info</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {status === 'both-revealed' && wallet && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
            
            <div className="flex items-center py-3.5 border-b border-slate-50">
              <div className="w-9 h-9 rounded-[10px] bg-violet-50 flex items-center justify-center text-violet-600 mr-3 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Name</p>
                <p className="text-[15px] font-medium text-slate-900">{wallet.displayName}</p>
              </div>
            </div>

            {wallet.phone && (
              <div 
                className="flex items-center py-3.5 border-b border-slate-50 cursor-pointer"
                onClick={() => copyToClipboard(wallet.phone!)}
              >
                <div className="w-9 h-9 rounded-[10px] bg-violet-50 flex items-center justify-center text-violet-600 mr-3 shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Phone</p>
                  <p className="text-[15px] font-medium text-violet-600">{wallet.phone}</p>
                </div>
                <Copy size={16} className="text-slate-400" />
              </div>
            )}

            {wallet.proxyPhone && (
              <div className="flex items-start py-3.5 border-b border-slate-50">
                <div className="w-9 h-9 rounded-[10px] bg-amber-50 flex items-center justify-center text-amber-500 mr-3 shrink-0 mt-1">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Vicinity Proxy Number</p>
                  <p className="text-[15px] font-medium text-slate-900">{wallet.proxyPhone}</p>
                  <p className="text-[11px] text-amber-500 mt-1">Valid for 24 hours · Use this to call safely</p>
                </div>
              </div>
            )}

            {wallet.email && (
              <div 
                className="flex items-center py-3.5 border-b border-slate-50 cursor-pointer"
                onClick={() => copyToClipboard(wallet.email!)}
              >
                <div className="w-9 h-9 rounded-[10px] bg-violet-50 flex items-center justify-center text-violet-600 mr-3 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-[15px] font-medium text-violet-600">{wallet.email}</p>
                </div>
                <Copy size={16} className="text-slate-400" />
              </div>
            )}

            {wallet.bio && (
              <div className="py-3.5 border-b border-slate-50">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">About</p>
                <p className="text-sm text-slate-700 leading-relaxed">{wallet.bio}</p>
              </div>
            )}

            <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-3 mt-4">
              <EyeOff size={16} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-tight">
                This info is private. Use the proxy number for the first 24 hours.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
