import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MessageCircle, Send } from 'lucide-react';

interface PostDateFeedbackProps {
  matchName: string;
  onSubmit: (rating: number, note: string) => void;
  onDismiss: () => void;
}

export function PostDateFeedback({ matchName, onSubmit, onDismiss }: PostDateFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">How was your date?</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Let us know how things went with {matchName}. This feedback is strictly anonymous.</p>
        
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
              <Star size={32} className={`${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <MessageCircle size={16} className="absolute top-3 left-3 text-slate-400" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add some private notes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all min-h-[100px] resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => onSubmit(rating, note)}
            disabled={rating === 0}
            className="flex-[2] py-3 font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:hover:bg-violet-600 flex items-center justify-center gap-2"
          >
            <Send size={16} /> Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
