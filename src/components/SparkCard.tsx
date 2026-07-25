import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MapPin, Clock, User } from 'lucide-react';
import { Match } from '../types';

interface SparkCardProps {
  match: Match;
  onDismiss: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function SparkCard({ match, onDismiss, onAccept, onDecline }: SparkCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    async function fetchSummary() {
      setLoadingSummary(true);
      try {
        const response = await fetch('/api/match-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userBio: "I love exploring the city and trying new coffee spots.",
            matchBio: match.user.bio,
            sharedInterests: match.sharedInterests,
          }),
        });
        const data = await response.json();
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch (error) {
        console.error("Failed to fetch match summary", error);
      } finally {
        setLoadingSummary(false);
      }
    }
    fetchSummary();
  }, [match]);

  const getScoreLabel = (score: number) => {
    if (score >= 95) return { label: '🔥 Soul Match', color: 'text-red-500', borderColor: 'border-red-500', bgColor: 'bg-red-500' };
    if (score >= 85) return { label: '✨ High Spark', color: 'text-orange-500', borderColor: 'border-orange-500', bgColor: 'bg-orange-500' };
    if (score >= 75) return { label: '💫 Great Match', color: 'text-yellow-500', borderColor: 'border-yellow-500', bgColor: 'bg-yellow-500' };
    return { label: '🌟 Good Match', color: 'text-green-500', borderColor: 'border-green-500', bgColor: 'bg-green-500' };
  };

  const { label: scoreLabel, color: scoreColorText, borderColor: scoreBorder, bgColor } = getScoreLabel(match.compatibilityScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onDecline}
      />

      <motion.div
        initial={{ y: '100%', scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.8 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-full max-w-sm bg-white rounded-[24px] p-6 flex flex-col items-center shadow-2xl z-10"
      >
        {/* Pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className={`absolute -inset-1 rounded-[26px] border-[3px] ${scoreBorder}`}
        />

        <div className="flex flex-col items-center mb-5">
          <div className={`w-2 h-2 rounded-full mb-2 ${bgColor}`} />
          <h2 className={`text-lg font-bold tracking-widest uppercase mb-1 ${scoreColorText}`}>
            {scoreLabel}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {match.compatibilityScore}% Compatible
          </p>
        </div>

        <div className="flex flex-col items-center mb-4 w-full">
          <div className="mb-4">
            {match.user.avatarUrl ? (
              <img
                src={match.user.avatarUrl}
                alt={match.user.displayName}
                className="w-24 h-24 rounded-full border-[3px] border-slate-100 object-cover shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center text-white border-[3px] border-slate-100">
                <User size={40} />
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-1.5">{match.user.displayName}</h3>
          
          <div className="min-h-[48px] w-full px-4 mb-4">
            {loadingSummary ? (
              <div className="animate-pulse flex flex-col items-center gap-1">
                <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                <div className="h-2.5 bg-slate-200 rounded w-4/5"></div>
              </div>
            ) : summary ? (
              <div className="bg-violet-50 rounded-xl p-3 text-center">
                <p className="text-[11px] font-bold text-violet-500 uppercase tracking-wide mb-1">Why You Match</p>
                <p className="text-sm text-slate-700 italic leading-snug">"{summary}"</p>
              </div>
            ) : match.user.bio ? (
              <p className="text-sm text-slate-500 text-center line-clamp-2">
                {match.user.bio}
              </p>
            ) : null}
          </div>

          {match.sharedInterests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {match.sharedInterests.slice(0, 4).map((interest) => (
                <div key={interest} className="bg-violet-50 px-3 py-1.5 rounded-full">
                  <span className="text-xs font-semibold text-violet-600 capitalize">
                    {interest}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-6 text-slate-500">
          <MapPin size={16} />
          <span className="text-xs">
            {match.triggerDistance <= 50 ? 'Right next to you' : `${Math.round(match.triggerDistance)}m away`}
          </span>
          <span className="mx-1">·</span>
          <Clock size={16} />
          <span className="text-xs">Available now</span>
        </div>

        <div className="flex gap-6 mb-4">
          <button
            onClick={onDecline}
            className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:scale-95 transition-transform"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)] hover:scale-95 transition-transform"
          >
            <Heart size={28} strokeWidth={2.5} fill="currentColor" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Tap ✕ or ✓ — expires in 5 minutes
        </p>
      </motion.div>
    </div>
  );
}
