import React, { useState } from 'react';
import { Plus, PanelLeft, ChevronDown, Check, Compass, User, Key, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  isLanding?: boolean;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  user?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  selectedModel,
  onSelectModel,
  isLanding = false,
  onOpenApiKeyModal,
  hasApiKey,
  user,
  onSignIn,
  onSignOut,
}) => {
  const [showModelMenu, setShowModelMenu] = useState(false);

  const models = [
    { id: 'Gemini 2.0 Flash', desc: 'Fast, stable & multimodal (Google Gemini API)', recommended: true },
    { id: 'Gemini 1.5 Flash', desc: 'High efficiency & low latency (Google Gemini API)' },
    { id: 'Gemini 1.5 Pro', desc: 'Deep reasoning & complex itineraries' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b-[3px] border-black px-4 py-3 shadow-[0_3px_0px_#000000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Sidebar Toggle & Product Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-white hover:bg-[#FFE600] border-[2.5px] border-black text-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer"
            title="Toggle sidebar"
          >
            <PanelLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Logo Mark */}
          <div
            onClick={onNewChat}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-[2.5px] border-black flex items-center justify-center text-black shadow-[2.5px_2.5px_0px_#000000] group-hover:-translate-y-0.5 transition-transform">
              <Compass className="w-4 h-4 stroke-[3]" />
            </div>

            <span className="text-lg font-black tracking-tight text-slate-900 font-heading uppercase flex items-center gap-1.5">
              Trav<span className="bg-[#FFE600] text-black px-1.5 py-0.5 rounded-lg border-[2px] border-black text-xs font-black shadow-[2px_2px_0px_#000]">AI</span>
            </span>
          </div>

          {/* Model Selector Dropdown */}
          <div className="relative hidden sm:block ml-2">
            <button
              type="button"
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border-[2.5px] border-black text-slate-900 text-xs font-extrabold shadow-[2.5px_2.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />
              <span>{selectedModel}</span>
              <ChevronDown className="w-4 h-4 text-black stroke-[3]" />
            </button>

            {showModelMenu && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_#000000] p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-black text-slate-500 px-2.5 py-1 uppercase tracking-wider font-heading flex items-center justify-between">
                  <span>AI Planning Engine</span>
                  {hasApiKey ? (
                    <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-500">BYOK CONNECTED</span>
                  ) : (
                    <span className="text-amber-700 font-extrabold text-[9px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-500">BYOK REQUIRED</span>
                  )}
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setShowModelMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all border-[2.5px] mb-1.5 ${
                      selectedModel === m.id
                        ? 'bg-[#FFE600] text-black border-black shadow-[3px_3px_0px_#000000]'
                        : 'bg-white text-slate-900 border-black hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-extrabold font-heading flex items-center gap-1.5">
                        <span>{m.id}</span>
                        {m.recommended && (
                          <span className="text-[9px] font-black bg-black text-[#FFE600] px-1 py-0.2 rounded">RECOMMENDED</span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-700 mt-0.5">{m.desc}</div>
                    </div>
                    {selectedModel === m.id && (
                      <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: BYOK API Key Button, New Chat & User Profile */}
        <div className="flex items-center gap-2.5">

          {/* Gemini BYOK API Key Button */}
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-[2.5px] border-black text-xs font-black shadow-[2.5px_2.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase tracking-wide ${
              hasApiKey
                ? 'bg-emerald-300 hover:bg-emerald-400 text-slate-900'
                : 'bg-[#00F0FF] hover:bg-[#66F5FF] text-black animate-pulse'
            }`}
            title="BYOK Model: Bring Your Own Gemini Key"
          >
            <Key className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'BYOK: Key Connected' : 'BYOK: Set Gemini Key'}
            </span>
          </button>

          {!isLanding && (
            <button
              type="button"
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFF066] text-black border-[2.5px] border-black text-xs font-black shadow-[2.5px_2.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase tracking-wide"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l-[2.5px] border-black">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-xl border-[2px] border-black object-cover shadow-[2px_2px_0px_#000000]"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF] border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000]">
                  <User className="w-4 h-4 stroke-[3]" />
                </div>
              )}
              <span className="text-xs font-black text-slate-900 hidden md:inline font-heading uppercase tracking-wider truncate max-w-[100px]">
                {user.displayName?.split(' ')[0] || 'Traveler'}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="p-1.5 rounded-lg bg-white hover:bg-[#FF5376] hover:text-white border-[2px] border-black text-slate-700 shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="border-[2px] border-black rounded-xl bg-white px-3 py-1 text-xs font-black font-heading uppercase shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer ml-1"
              title="Sign in with Google to sync sessions"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
