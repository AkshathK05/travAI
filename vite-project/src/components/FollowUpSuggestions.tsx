import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FollowUpSuggestionsProps {
  suggestions?: string[];
  onSelect: (prompt: string) => void;
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  suggestions = [
    'Make Day 3 cheaper',
    'Add more food experiences in Osaka',
    'Swap hotel to Shibuya area',
    'Compare Japan with Vietnam for ₹1.5L'
  ],
  onSelect
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="my-3 pt-3 border-t-[2px] border-black/20 space-y-2">
      <div className="text-[11px] font-black text-slate-800 uppercase tracking-widest px-0.5 font-heading flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
        Suggested Follow-Ups & Refinements
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(item.replace(/^[^\w\s]+/, '').trim())}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE600] border-[2px] border-black text-slate-900 shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-black cursor-pointer font-heading"
          >
            <span>{item}</span>
            <ArrowRight className="w-3.5 h-3.5 text-black stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
