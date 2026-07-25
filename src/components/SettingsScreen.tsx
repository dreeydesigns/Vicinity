import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, User } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsScreenProps {
  user: UserType;
  vibe: string;
  onSave: (bio: string, avatarUrl: string, vibe: string) => void;
  onBack: () => void;
}

export function SettingsScreen({ user, vibe: initialVibe, onSave, onBack }: SettingsScreenProps) {
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [vibe, setVibe] = useState(initialVibe);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(bio, avatarUrl, vibe);
    onBack();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
        <button onClick={handleSave} className="text-violet-600 font-semibold px-2">
          Save
        </button>
      </div>

      <div className="p-6 overflow-y-auto">
        {/* Photo Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-violet-100 flex items-center justify-center border-4 border-white shadow-sm">
                <User size={48} className="text-violet-400" />
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-3 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-colors"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*"
              capture="user"
              className="hidden" 
              onChange={handlePhotoUpload}
            />
          </div>
          <p className="text-sm text-slate-500">Tap to change photo</p>
        </div>

        {/* Bio Edit */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            About Me
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio..."
            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all min-h-[120px] resize-none shadow-sm"
          />
        </div>

        {/* Vibe Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            App Vibe
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'default', label: 'Default', bg: 'bg-violet-500' },
              { id: 'sunset', label: 'Sunset', bg: 'bg-orange-500' },
              { id: 'neon', label: 'Neon', bg: 'bg-fuchsia-500' },
              { id: 'midnight', label: 'Midnight', bg: 'bg-slate-800' }
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setVibe(v.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  vibe === v.id ? 'border-violet-500 bg-violet-50' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${v.bg} mb-2 shadow-sm`} />
                <span className={`text-xs font-semibold ${vibe === v.id ? 'text-violet-700' : 'text-slate-500'}`}>
                  {v.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
