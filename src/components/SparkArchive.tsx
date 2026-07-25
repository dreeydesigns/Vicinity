import React from 'react';
import { X, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { Match } from '../types';

interface SparkArchiveProps {
  onClose: () => void;
  onReconsider: (match: Match) => void;
}

const DUMMY_ARCHIVE: Match[] = [
  {
    id: 'archived_1',
    user: {
      id: 'u4',
      displayName: 'Sam',
      bio: 'Coffee enthusiast and dog lover.',
      avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
      interests: ['Coffee', 'Dogs']
    },
    status: 'declined',
    compatibilityScore: 78,
    sharedInterests: ['Coffee'],
    distance: 2.1
  },
  {
    id: 'archived_2',
    user: {
      id: 'u5',
      displayName: 'Taylor',
      bio: 'Always down for a good book and tea.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      interests: ['Reading', 'Tea']
    },
    status: 'declined',
    compatibilityScore: 65,
    sharedInterests: ['Reading'],
    distance: 5.4
  }
];

export function SparkArchive({ onClose, onReconsider }: SparkArchiveProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="absolute inset-0 z-50 bg-white flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Spark Archive</h2>
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-slate-500 mb-6">
          These are potential matches you previously dismissed. Changed your mind? Reconsider them here.
        </p>

        <div className="space-y-4">
          {DUMMY_ARCHIVE.map(match => (
            <div key={match.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <img 
                  src={match.user.avatarUrl} 
                  alt={match.user.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-slate-800">{match.user.displayName}</h3>
                  <p className="text-xs text-slate-500">{match.compatibilityScore}% Compatible • {match.distance} miles away</p>
                </div>
              </div>
              <button 
                onClick={() => onReconsider(match)}
                className="p-2 bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors"
                title="Reconsider Match"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
