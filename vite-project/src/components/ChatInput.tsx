import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, DollarSign, Users, Check } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, metadata?: { budget?: string; travelers?: string }) => void;
  disabled?: boolean;
  isLanding?: boolean;
  initialValue?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  isLanding = false,
  initialValue = ''
}) => {
  const [input, setInput] = useState(initialValue);
  const [budget, setBudget] = useState('₹1.5 Lakh');
  const [travelers, setTravelers] = useState('2 Adults');
  const [showBudgetMenu, setShowBudgetMenu] = useState(false);
  const [showTravelersMenu, setShowTravelersMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim(), { budget, travelers });
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const budgetOptions = ['Under ₹50,000', '₹1 Lakh', '₹1.5 Lakh', '₹2.5 Lakh+', 'Flexible'];
  const travelerOptions = ['Solo Traveler', '2 Adults (Couple)', 'Family (3-4)', 'Group (5+)'];

  return (
    <div className={`w-full relative ${isLanding ? 'max-w-2xl mx-auto' : 'max-w-3xl mx-auto'}`}>
      
      {/* Neo-Brutalist Input Container */}
      <div className={`relative bg-white border-[3px] border-black transition-all ${
        isLanding ? 'rounded-2xl p-3 sm:p-4 shadow-[5px_5px_0px_#000000] focus-within:shadow-[7px_7px_0px_#000000]' : 'rounded-xl p-2.5 shadow-[4px_4px_0px_#000000] focus-within:shadow-[6px_6px_0px_#000000]'
      }`}>
        
        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={isLanding ? 2 : 1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLanding
              ? "Plan a trip, compare destinations, find hotels..."
              : "Ask a follow-up or refine your trip..."
          }
          disabled={disabled}
          className="w-full bg-transparent text-slate-900 placeholder-slate-500 text-sm font-bold resize-none focus:outline-none px-1 py-1"
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t-[2.5px] border-black/20 mt-1 px-1">
          
          {/* Options & Metadata Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              title="Attach reference file"
              className="p-1.5 text-black hover:bg-[#FFE600] rounded-lg border-[2px] border-black shadow-[1.5px_1.5px_0px_#000] transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Budget Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowBudgetMenu(!showBudgetMenu);
                  setShowTravelersMenu(false);
                }}
                className="flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg bg-[#FFE600] text-black border-[2px] border-black shadow-[2px_2px_0px_#000000] hover:bg-[#FFF066] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase"
              >
                <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                <span>{budget}</span>
              </button>

              {showBudgetMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border-[3px] border-black rounded-xl shadow-[5px_5px_0px_#000000] p-1.5 z-50">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setBudget(opt);
                        setShowBudgetMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-extrabold rounded-lg flex items-center justify-between mb-1 border-2 ${
                        budget === opt ? 'bg-[#FFE600] text-black border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-slate-900 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt}</span>
                      {budget === opt && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Travelers Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowTravelersMenu(!showTravelersMenu);
                  setShowBudgetMenu(false);
                }}
                className="flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg bg-[#00F0FF] text-black border-[2px] border-black shadow-[2px_2px_0px_#000000] hover:bg-[#66F5FF] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase"
              >
                <Users className="w-3.5 h-3.5 stroke-[3]" />
                <span>{travelers}</span>
              </button>

              {showTravelersMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-52 bg-white border-[3px] border-black rounded-xl shadow-[5px_5px_0px_#000000] p-1.5 z-50">
                  {travelerOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTravelers(opt);
                        setShowTravelersMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-extrabold rounded-lg flex items-center justify-between mb-1 border-2 ${
                        travelers === opt ? 'bg-[#00F0FF] text-black border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-slate-900 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt}</span>
                      {travelers === opt && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || disabled}
            className={`p-2 rounded-xl flex items-center justify-center transition-all border-[2.5px] border-black ${
              input.trim() && !disabled
                ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000000] hover:bg-[#FFF066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer'
                : 'bg-slate-200 text-slate-400 border-slate-400 cursor-not-allowed'
            }`}
            title="Send request"
          >
            <ArrowUp className="w-5 h-5 stroke-[3]" />
          </button>

        </div>

      </div>
    </div>
  );
};

