import React, { useState } from 'react';
import { Plus, PanelLeft, ChevronDown, Check, Compass, User, Key, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  isLanding?: boolean;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  selectedModel,
  onSelectModel,
  isLanding = false,
  onOpenApiKeyModal,
  hasApiKey
}) => {
  const [showModelMenu, setShowModelMenu] = useState(false);

  const models = [
    { id: 'Gemini 2.5 Flash', desc: 'Fast & Intelligent (Google Gemini API)', recommended: true },
    { id: 'Gemini 2.0 Flash', desc: 'Real-time Multimodal (Google Gemini API)' },
    { id: 'Gemini 1.5 Pro', desc: 'Deep Reasoning & Complex Itineraries' }
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
                    <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-500">API CONNECTED</span>
                  ) : (
                    <span className="text-amber-700 font-extrabold text-[9px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-500">KEY REQUIRED</span>
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

        {/* Right: API Key Button, New Chat & User Profile */}
        <div className="flex items-center gap-2.5">

          {/* Gemini API Key Button */}
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-[2.5px] border-black text-xs font-black shadow-[2.5px_2.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase tracking-wide ${
              hasApiKey
                ? 'bg-emerald-300 hover:bg-emerald-400 text-slate-900'
                : 'bg-[#00F0FF] hover:bg-[#66F5FF] text-black animate-pulse'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'Gemini Key Connected' : 'Set Gemini API Key'}
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

          <div className="flex items-center gap-2 pl-2 border-l-[2.5px] border-black">
            <div className="w-8 h-8 rounded-xl bg-[#00F0FF] border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000]">
              <User className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-extrabold text-slate-900 hidden md:inline font-heading uppercase tracking-wider">Explorer</span>
          </div>
        </div>

      </div>
    </header>
  );
};
