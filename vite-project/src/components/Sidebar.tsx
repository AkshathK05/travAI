import React, { useState } from 'react';
import { Plus, MessageSquare, Search, X, Compass, SlidersHorizontal, Clock } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  currency: string;
  onSelectCurrency: (curr: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  currency,
  onSelectCurrency
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currencies = ['₹ INR', '$ USD', '€ EUR', '£ GBP', '¥ JPY'];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-[#F4F4F0] border-r-[3px] border-black shadow-[6px_0px_0px_#000000] flex flex-col justify-between transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-white border-b-[3px] border-black space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFE600] border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Compass className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide">Conversations</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white hover:bg-[#FF5376] hover:text-white border-[2px] border-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FFE600] hover:bg-[#FFF066] text-black border-[2.5px] border-black text-xs font-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading uppercase tracking-wide"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Start New Plan</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-700 stroke-[2.5] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous trips..."
              className="w-full bg-white border-[2.5px] border-black rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-900 placeholder-slate-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[3.5px_3.5px_0px_#000]"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider px-1 mb-2 font-heading flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              Saved Travel Sessions ({filteredSessions.length})
            </div>

            <div className="space-y-2">
              {filteredSessions.map((session) => {
                const isActive = activeSessionId === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border-[2.5px] border-black transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-[#FFE600] text-black shadow-[3.5px_3.5px_0px_#000000] -translate-y-0.5'
                        : 'bg-white text-slate-900 shadow-[2.5px_2.5px_0px_#000000] hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_#000000]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`p-1 rounded-md border border-black mt-0.5 shrink-0 ${isActive ? 'bg-black text-white' : 'bg-slate-100 text-black'}`}>
                        <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs leading-snug font-heading truncate">
                          {session.title}
                        </div>
                        <div className="text-[11px] font-medium text-slate-700 truncate mt-1">
                          {session.preview}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mt-2 pt-1.5 border-t border-black/20">
                          <span>{session.createdAt}</span>
                          <span className="bg-white border border-black px-1.5 py-0.2 rounded text-[10px] font-black shadow-[1px_1px_0px_#000]">
                            {session.messageCount} msgs
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredSessions.length === 0 && (
                <div className="text-center p-4 bg-white border-[2px] border-black rounded-xl text-xs font-bold text-slate-500 shadow-[2px_2px_0px_#000]">
                  No matching trip plans found
                </div>
              )}
            </div>
          </div>

          {/* Currency Preference */}
          <div className="pt-3 border-t-[2.5px] border-black space-y-2">
            <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider px-1 flex items-center gap-1.5 font-heading">
              <SlidersHorizontal className="w-3.5 h-3.5 text-black stroke-[2.5]" /> Currency Unit
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => onSelectCurrency(curr)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black font-mono text-center border-[2px] border-black transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-[#00E599] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-slate-900 shadow-[1.5px_1.5px_0px_#000] hover:bg-slate-100'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t-[3px] border-black bg-white">
          <div className="text-[11px] text-slate-900 text-center font-black font-heading tracking-wide uppercase">
            TravAI • Neo-Brutalist Edition
          </div>
        </div>

      </aside>
    </>
  );
};

