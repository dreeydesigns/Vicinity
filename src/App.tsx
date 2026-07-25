/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, Calendar, Wallet, Settings, Activity, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { SparkCard } from './components/SparkCard';
import { WalletScreen } from './components/WalletScreen';
import { ScheduleScreen } from './components/ScheduleScreen';
import { ChatScreen } from './components/ChatScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MiniMap } from './components/MiniMap';
import { ScanningFilters } from './components/ScanningFilters';
import { mockMatch, mockWalletContent, mockVenues, mockTimeSlots } from './data';
import { User } from './types';

type AppState = 'scanning' | 'spark' | 'dashboard' | 'wallet' | 'schedule' | 'chat' | 'settings';

export default function App() {
  const [appState, setAppState] = useState<AppState>('scanning');
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'my_id',
    displayName: 'Me',
    bio: 'Looking for a spark!',
    avatarUrl: '',
    interests: []
  });

  useEffect(() => {
    if (appState === 'scanning' && !showFilters) {
      const timer = setTimeout(() => {
        setAppState('spark');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [appState, showFilters]);

  const handleAcceptMatch = () => {
    setAppState('dashboard');
  };

  const handleDeclineMatch = () => {
    setAppState('scanning');
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Filters applied:', filters);
    // Scanning will restart due to useEffect
  };

  const handleSaveProfile = (bio: string, avatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, bio, avatarUrl }));
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <div className="w-full max-w-[480px] h-full min-h-screen mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col">
        
        <AnimatePresence mode="wait">
          {(appState === 'scanning' || appState === 'spark') && (
            <motion.div 
              key="scanning-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center relative p-6 bg-slate-900"
            >
              <div className="absolute top-6 right-6 z-20 flex gap-4">
                <button 
                  onClick={() => setShowFilters(true)}
                  className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
                >
                  <SlidersHorizontal size={20} />
                </button>
                <button 
                  onClick={() => setAppState('settings')}
                  className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
                >
                  <Settings size={20} />
                </button>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute w-40 h-40 border border-violet-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1 }}
                  className="absolute w-40 h-40 border border-violet-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 2 }}
                  className="absolute w-40 h-40 border border-violet-500 rounded-full"
                />
              </div>

              <div className="z-10 w-24 h-24 bg-violet-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.5)] mb-8">
                <Radar size={40} className="text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2 z-10">Vicinity Active</h1>
              <p className="text-violet-200 text-center text-sm z-10 max-w-[250px]">
                Scanning for compatible matches in your immediate area...
              </p>

              {appState === 'spark' && (
                <SparkCard
                  match={mockMatch}
                  onAccept={handleAcceptMatch}
                  onDecline={handleDeclineMatch}
                  onDismiss={handleDeclineMatch}
                />
              )}

              {showFilters && (
                <ScanningFilters 
                  onClose={() => setShowFilters(false)}
                  onApply={handleApplyFilters}
                />
              )}
            </motion.div>
          )}

          {appState === 'dashboard' && (
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-slate-50 flex flex-col p-6 pt-12 overflow-y-auto"
            >
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Match Accepted!</h1>
              <p className="text-slate-500 mb-6">You and {mockMatch.user.displayName} both felt the spark.</p>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
                <img src={mockMatch.user.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{mockMatch.user.displayName}</h3>
                  <p className="text-sm text-violet-600 font-medium">{mockMatch.compatibilityScore}% Compatible</p>
                </div>
                <button
                  onClick={() => setAppState('chat')}
                  className="w-10 h-10 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center hover:bg-violet-100 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setAppState('wallet')}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:border-violet-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                    <Wallet size={24} />
                  </div>
                  <span className="font-semibold text-slate-700">Match Wallet</span>
                </button>
                <button
                  onClick={() => setAppState('schedule')}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:border-violet-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                    <Calendar size={24} />
                  </div>
                  <span className="font-semibold text-slate-700">Schedule Date</span>
                </button>
              </div>

              <div className="mb-8">
                <MiniMap matches={[mockMatch]} venues={mockVenues} />
              </div>

              <button 
                onClick={() => setAppState('scanning')}
                className="mt-auto mb-4 mx-auto text-sm font-medium text-slate-400 flex items-center gap-2 hover:text-slate-600"
              >
                <Activity size={16} /> Resume Scanning
              </button>
            </motion.div>
          )}

          {appState === 'wallet' && (
            <motion.div 
              key="wallet-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute inset-0 z-20 bg-slate-50 overflow-y-auto"
            >
              <WalletScreen
                match={mockMatch}
                walletContent={mockWalletContent}
                onBack={() => setAppState('dashboard')}
              />
            </motion.div>
          )}

          {appState === 'schedule' && (
            <motion.div 
              key="schedule-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute inset-0 z-20 bg-slate-50 overflow-y-auto"
            >
              <ScheduleScreen
                venues={mockVenues}
                timeSlots={mockTimeSlots}
                onBack={() => setAppState('dashboard')}
                onConfirm={() => {
                  alert('Date Scheduled!');
                  setAppState('dashboard');
                }}
              />
            </motion.div>
          )}

          {appState === 'chat' && (
            <motion.div 
              key="chat-view"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-20 bg-slate-50 overflow-hidden"
            >
              <ChatScreen
                match={mockMatch}
                onBack={() => setAppState('dashboard')}
              />
            </motion.div>
          )}

          {appState === 'settings' && (
            <motion.div 
              key="settings-view"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-20 bg-slate-50 overflow-hidden"
            >
              <SettingsScreen
                user={currentUser}
                onSave={handleSaveProfile}
                onBack={() => setAppState('scanning')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

