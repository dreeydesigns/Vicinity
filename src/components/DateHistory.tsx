import React, { useState } from 'react';
import { Star, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Match } from '../types';

interface PastDate {
  id: string;
  matchName: string;
  avatarUrl: string;
  date: string;
  venueName: string;
  rating: number;
  note: string;
}

export function DateHistory() {
  const [history, setHistory] = useState<PastDate[]>([
    {
      id: 'h1',
      matchName: 'Alex',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      date: '2023-10-14T19:00:00Z',
      venueName: 'The Local Roasters',
      rating: 4,
      note: 'Great conversation about hiking. Definitely want to see them again.'
    },
    {
      id: 'h2',
      matchName: 'Jamie',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      date: '2023-09-28T20:00:00Z',
      venueName: 'Central Park',
      rating: 0,
      note: ''
    }
  ]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleUpdate = (id: string, updates: Partial<PastDate>) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Date History</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {history.map(item => (
          <div key={item.id} className="p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-3">
                <img src={item.avatarUrl} alt={item.matchName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-slate-800">{item.matchName}</h4>
                  <p className="text-xs text-slate-500">
                    {new Date(item.date).toLocaleDateString()} • {item.venueName}
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Private Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleUpdate(item.id, { rating: star })}
                        className={`p-1 rounded hover:bg-slate-50 transition-colors ${
                          star <= item.rating ? 'text-yellow-400' : 'text-slate-200'
                        }`}
                      >
                        <Star size={24} fill={star <= item.rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <FileText size={14} /> Private Note
                  </label>
                  <textarea
                    value={item.note}
                    onChange={(e) => handleUpdate(item.id, { note: e.target.value })}
                    placeholder="How did the date go? (Only you can see this)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
