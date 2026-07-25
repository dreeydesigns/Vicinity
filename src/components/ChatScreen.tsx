import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Check, CheckCheck, Smile } from 'lucide-react';
import { Match, Message } from '../types';

interface ChatScreenProps {
  match: Match;
  onBack: () => void;
}

export function ChatScreen({ match, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: match.user.id,
      text: 'Hey! Looks like we both felt the spark ✨',
      timestamp: new Date().toISOString(),
      read: true,
    }
  ]);
  const [inputText, setInputText] = useState(() => localStorage.getItem(`draft_${match.id}`) || '');
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getPrompts = () => {
    if (match.sharedInterests && match.sharedInterests.length > 0) {
      const interest = match.sharedInterests[0];
      return [
        `What's your favorite thing about ${interest}?`,
        `How long have you been into ${interest}?`,
        `Got any good recommendations for ${interest}?`
      ];
    }
    return [
      "What are you looking forward to this week?",
      "What's the best thing that happened to you today?",
      "What's your favorite way to spend a weekend?"
    ];
  };

  useEffect(() => {
    localStorage.setItem(`draft_${match.id}`, inputText);
  }, [inputText, match.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    localStorage.removeItem(`draft_${match.id}`);

    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, read: true } : m));
    }, 1000);

    // Simulate response
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      const responseMessage: Message = {
        id: `m${Date.now() + 1}`,
        senderId: match.user.id,
        text: 'I\'m really looking forward to getting to know you better!',
        timestamp: new Date().toISOString(),
        read: true,
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reaction: emoji } : m));
    setActiveReactionId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative z-20">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3 ml-2">
          <img 
            src={match.user.avatarUrl} 
            alt={match.user.displayName} 
            className="w-10 h-10 rounded-full object-cover border border-slate-100" 
          />
          <div>
            <h2 className="text-base font-bold text-slate-900">{match.user.displayName}</h2>
            <p className="text-[11px] text-green-500 font-medium">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
              {!isMe && (
                <button 
                  onClick={() => setActiveReactionId(msg.id)}
                  className="mr-2 self-end opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 p-1"
                >
                  <Smile size={16} />
                </button>
              )}
              <div className="relative">
                <div 
                  className={`max-w-[75%] min-w-[100px] px-4 py-2.5 rounded-[20px] ${
                    isMe 
                      ? 'bg-violet-600 text-white rounded-br-sm' 
                      : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-sm'
                  }`}
                >
                  <p className="text-[15px]">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 justify-end`}>
                    <span className={`text-[10px] ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      msg.read ? <CheckCheck size={12} className="text-violet-200" /> : <Check size={12} className="text-violet-300" />
                    )}
                  </div>
                </div>
                {msg.reaction && (
                  <div className={`absolute -bottom-3 ${isMe ? '-left-3' : '-right-3'} bg-white shadow-sm border border-slate-100 rounded-full px-1.5 py-0.5 text-sm z-10`}>
                    {msg.reaction}
                  </div>
                )}
                {activeReactionId === msg.id && !isMe && (
                  <div className="absolute -top-10 left-0 bg-white border border-slate-200 shadow-lg rounded-full flex items-center px-2 py-1 gap-1 z-20">
                    {['❤️', '😂', '🔥', '👍'].map(emoji => (
                      <button 
                        key={emoji} 
                        onClick={() => addReaction(msg.id, emoji)}
                        className="hover:bg-slate-100 p-1.5 rounded-full text-base"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        {showPrompts && messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            {getPrompts().map((prompt, i) => (
              <button 
                key={i}
                onClick={() => {
                  setInputText(prompt);
                  setShowPrompts(false);
                }}
                className="whitespace-nowrap px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-100 hover:bg-violet-100 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 bg-violet-600 text-white rounded-full disabled:opacity-50 disabled:bg-slate-300 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
