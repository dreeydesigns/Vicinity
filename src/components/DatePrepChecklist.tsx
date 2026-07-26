import React from 'react';
import { Battery, Map, Clock, Shirt } from 'lucide-react';
import { motion } from 'motion/react';

interface DatePrepChecklistProps {
  scheduledDate: string;
}

export function DatePrepChecklist({ scheduledDate }: DatePrepChecklistProps) {
  const date = new Date(scheduledDate);
  const now = new Date();
  const timeDiffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Determine which tips to show based on time remaining
  const tips = [];
  if (timeDiffHours <= 24) {
    tips.push({ icon: <Shirt size={16} />, text: "Pick out your outfit" });
  }
  if (timeDiffHours <= 12) {
    tips.push({ icon: <Battery size={16} />, text: "Ensure your phone is charged" });
  }
  if (timeDiffHours <= 2) {
    tips.push({ icon: <Map size={16} />, text: "Review venue details and route" });
    tips.push({ icon: <Clock size={16} />, text: "Leave early to avoid rushing" });
  } else {
    tips.push({ icon: <Map size={16} />, text: "Familiarize yourself with the area" });
    tips.push({ icon: <Clock size={16} />, text: "Set an alarm for the date" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6"
    >
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Date Prep Checklist</h3>
        <p className="text-xs text-slate-500">Tips to get you ready for your date</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl border border-violet-100">
            <div className="p-2 bg-white rounded-full text-violet-600 shadow-sm">
              {tip.icon}
            </div>
            <span className="text-sm font-medium text-slate-700">{tip.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
