import React, { useState } from 'react';
import { ChevronLeft, Star, Utensils, Calendar, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { VenueOption, TimeSlot } from '../types';

interface ScheduleScreenProps {
  venues: VenueOption[];
  timeSlots: TimeSlot[];
  onBack: () => void;
  onConfirm: (date: string) => void;
}

export function ScheduleScreen({ venues, timeSlots, onBack, onConfirm }: ScheduleScreenProps) {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(venues[0]?.id || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(timeSlots[0]?.start || null);
  const [confirming, setConfirming] = useState(false);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const priceDots = (level: number) => '$'.repeat(level).padEnd(4, '·');

  const getVibeColor = (vibe: string) => {
    const colors: Record<string, string> = {
      casual: 'bg-blue-500',
      romantic: 'bg-pink-500',
      adventurous: 'bg-emerald-500',
      cozy: 'bg-amber-500',
    };
    return colors[vibe] || 'bg-slate-500';
  };

  const handleConfirm = () => {
    if (!selectedVenue || !selectedTime) {
      alert('Select options to confirm your date.');
      return;
    }
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      
      // Simulate scheduling a notification 1 hour before
      const dateTime = new Date(selectedTime).getTime();
      const oneHourBefore = dateTime - 60 * 60 * 1000;
      const now = Date.now();
      
      if (oneHourBefore > now) {
        const timeout = oneHourBefore - now;
        // In a real app we'd use a background task or push notification service
        // For this demo we'll use a setTimeout if the app is still open
        setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Upcoming Date!', {
              body: 'Your date is in 1 hour. Get ready!',
            });
          }
        }, timeout);
      }
      
      // Ask for notification permission if not granted
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      onConfirm(selectedTime);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen relative pb-28">
      <div className="p-5 pt-10">
        <button onClick={onBack} className="p-2 -ml-2 mb-4 text-slate-500 hover:text-slate-800">
          <ChevronLeft size={24} />
        </button>

        <div className="mb-6">
          <h1 className="text-[28px] font-extrabold text-slate-900 mb-1">Where & When?</h1>
          <p className="text-sm text-slate-500">Pick a vibe and we'll set it up ✨</p>
        </div>

        <h2 className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 uppercase">Venues</h2>
        
        <div className="flex flex-col gap-3 mb-8">
          {venues.map((venue, index) => (
            <div
              key={venue.id}
              onClick={() => setSelectedVenue(venue.id)}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all
                ${selectedVenue === venue.id ? 'border-violet-600' : 'border-transparent hover:border-slate-200'}
              `}
            >
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-violet-600 flex items-center gap-1 px-2 py-1 rounded-full z-10 shadow-sm">
                  <Star size={10} className="text-white fill-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">Best Match</span>
                </div>
              )}
              
              <div className="flex p-3">
                {venue.photoUrl ? (
                  <img src={venue.photoUrl} alt={venue.name} className="w-[72px] h-[72px] rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0">
                    <Utensils size={24} />
                  </div>
                )}

                <div className="flex-1 ml-3 flex flex-col justify-center">
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">{venue.name}</h3>
                  <p className="text-xs text-slate-500 mb-1.5 truncate">{venue.address}</p>
                  
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={10} 
                            className={star <= Math.round(venue.rating) ? "text-amber-500 fill-amber-500" : "text-slate-300"} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{venue.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-slate-500">{priceDots(venue.priceLevel)}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-white capitalize ${getVibeColor(venue.vibe)}`}>
                      {venue.vibe}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-0.5">
                      <MapPin size={10} /> {formatDistance(venue.distanceMeters)}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-violet-600 font-medium">{venue.reason}</p>
                </div>

                {selectedVenue === venue.id && (
                  <div className="flex items-center justify-center pl-2">
                    <CheckCircle2 size={24} className="text-violet-600 fill-violet-50" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-[11px] font-bold text-slate-400 tracking-wider mb-3 uppercase">Mutual Free Times</h2>
        
        <div className="flex flex-wrap gap-2.5">
          {timeSlots.map((slot) => (
            <div
              key={slot.start}
              onClick={() => setSelectedTime(slot.start)}
              className={`bg-white rounded-xl p-3 flex flex-col items-center min-w-[90px] cursor-pointer border-2 transition-all
                ${selectedTime === slot.start ? 'border-violet-600 bg-violet-50' : 'border-transparent shadow-sm hover:border-slate-200'}
              `}
            >
              <span className={`text-[10px] font-semibold capitalize mb-1 ${slot.label === 'morning' ? 'text-amber-500' : 'text-slate-400'}`}>
                {slot.label}
              </span>
              <span className={`text-base font-bold mb-0.5 ${selectedTime === slot.start ? 'text-violet-600' : 'text-slate-900'}`}>
                {formatTime(slot.start)}
              </span>
              <span className="text-[11px] text-slate-400">
                {slot.durationMinutes}min
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-slate-50/90 backdrop-blur-md border-t border-slate-200">
        <button
          onClick={handleConfirm}
          disabled={confirming || !selectedVenue}
          className="w-full bg-violet-600 text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[17px] shadow-[0_8px_16px_rgba(124,58,237,0.3)] hover:bg-violet-700 transition-colors disabled:opacity-70 disabled:hover:bg-violet-600"
        >
          {confirming ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Calendar size={20} />
              Confirm Date
            </>
          )}
        </button>
      </div>
    </div>
  );
}
