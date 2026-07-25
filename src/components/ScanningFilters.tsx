import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScanningFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function ScanningFilters({ onClose, onApply }: ScanningFiltersProps) {
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const allInterests = [
    'coffee', 'design', 'hiking', 'tech', 'photography', 
    'music', 'travel', 'food', 'art', 'fitness'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleApply = () => {
    onApply({
      ageRange: [minAge, maxAge],
      interests: selectedInterests
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl p-6 relative z-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Scanning Filters</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Age Range: {minAge} - {maxAge}
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Min Age</label>
              <input 
                type="range" 
                min="18" 
                max="99" 
                value={minAge} 
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Max Age</label>
              <input 
                type="range" 
                min="18" 
                max="99" 
                value={maxAge} 
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {allInterests.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    isSelected 
                      ? 'bg-violet-600 text-white border-violet-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={handleApply}
          className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl shadow-[0_8px_16px_rgba(124,58,237,0.3)] hover:bg-violet-700 transition-colors"
        >
          Apply Filters
        </button>
      </motion.div>
    </div>
  );
}
