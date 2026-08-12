import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, CheckCircle2, ShieldCheck, Sparkles, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { getStoredApiKey, saveApiKey, removeApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existingKey = getStoredApiKey();
      setCurrentKey(existingKey);
      setKeyInput(existingKey);
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) return;

    setIsValidating(true);
    setValidationError(null);

    // Live validation against Google Gemini ListModels API endpoint
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${trimmed}`);
      if (res.status === 400 || res.status === 403) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData?.error?.message || 'Google rejected this API key. Please check your key at Google AI Studio.';
        setValidationError(`Invalid Key: ${message}`);
        setIsValidating(false);
        return;
      }
    } catch (err) {
      console.warn('Network check skipped:', err);
    }

    saveApiKey(trimmed);
    setCurrentKey(trimmed);
    setIsValidating(false);
    if (onKeySaved) onKeySaved();
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleRemove = () => {
    removeApiKey();
    setKeyInput('');
    setCurrentKey('');
    setValidationError(null);
    if (onKeySaved) onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border-[3.5px] border-black rounded-3xl shadow-[8px_8px_0px_#000000] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#FFE600] px-6 py-4 border-b-[3px] border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-[2.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Key className="w-5 h-5 text-black stroke-[3]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-heading uppercase tracking-wide">
                Connect Gemini API
              </h2>
              <p className="text-xs font-bold text-slate-800">
                Link your typed prompt directly to Google Gemini
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Key status badge */}
          {currentKey ? (
            <div className="p-3.5 bg-emerald-50 border-[2.5px] border-black rounded-2xl flex items-center justify-between shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <div>
                  <div className="text-xs font-black text-emerald-900 font-heading uppercase">
                    Gemini API Connected
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 font-mono">
                    Key: {currentKey.substring(0, 6)}••••••••••••{currentKey.slice(-4)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 border-[2px] border-black text-xs font-extrabold flex items-center gap-1 shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
                title="Remove API Key"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Remove</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-[#00F0FF]/15 border-[2.5px] border-black rounded-2xl flex items-start gap-3 shadow-[3px_3px_0px_#000000]">
              <Sparkles className="w-5 h-5 text-slate-900 stroke-[3] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800 font-bold leading-relaxed">
                Enter your Google Gemini API key to enable live AI trip generation. Your queries will be sent directly to the official Gemini model!
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-rose-100 border-[2.5px] border-black rounded-xl text-xs font-extrabold text-rose-800 flex items-start gap-2 shadow-[2.5px_2.5px_0px_#000000]">
              <AlertTriangle className="w-4 h-4 text-rose-600 stroke-[3] shrink-0 mt-0.5" />
              <div>{validationError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900 uppercase font-heading tracking-wider">
                Gemini API Key
              </label>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-[2.5px] border-black rounded-xl text-xs font-mono text-slate-900 font-bold focus:outline-none focus:bg-white shadow-[2.5px_2.5px_0px_#000000]"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600 hover:text-black uppercase font-heading"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-black underline font-heading"
              >
                <span>Get Free Key at Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isValidating}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border-[2.5px] border-black rounded-xl text-xs font-black text-slate-900 shadow-[2.5px_2.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!keyInput.trim() || isValidating}
                  className={`px-5 py-2 border-[2.5px] border-black rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase flex items-center gap-1.5 ${
                    keyInput.trim() && !isValidating
                      ? 'bg-[#FFE600] text-black hover:bg-[#FFF066]'
                      : 'bg-slate-200 text-slate-400 border-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isValidating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isValidating ? 'Verifying...' : 'Save & Connect'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="pt-3 border-t-[2px] border-slate-200 flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0" />
            <span>Your API key is stored locally in your browser session and never sent to external servers.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
