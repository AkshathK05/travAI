import React from 'react';
import { ArrowRight, Sparkles, MapPin, Compass } from 'lucide-react';
import { ChatInput } from './ChatInput';

interface LandingViewProps {
  onSend: (text: string, metadata?: { budget?: string; travelers?: string }) => void;
  disabled?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSend, disabled }) => {
  const samplePrompts = [
    {
      title: 'Japan Food & Culture',
      text: 'Plan a 7-day trip to Japan for two people under ₹1.5 lakh, focused on food and culture.',
      color: 'bg-[#FFE600]',
      tag: 'CULTURE'
    },
    {
      title: 'Bali vs Vietnam',
      text: 'Compare a 5-day holiday in Bali vs Vietnam for ₹80,000.',
      color: 'bg-[#00F0FF]',
      tag: 'COMPARISON'
    },
    {
      title: 'Dubai Luxury Weekend',
      text: '4-day luxury weekend in Dubai with top dining & desert safari.',
      color: 'bg-[#FF5376]',
      tag: 'LUXURY'
    },
    {
      title: 'Swiss Alpine Budget',
      text: 'Backpacking through Switzerland on a budget with scenic train routes.',
      color: 'bg-[#00E599]',
      tag: 'BUDGET'
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto w-full">
      
      {/* Greeting Headline */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-[2.5px] border-black rounded-lg text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_#000000]">
          <Sparkles className="w-4 h-4 stroke-[3]" /> Autonomous AI Travel Planner
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading uppercase leading-tight">
          Where to Next, <span className="bg-[#00F0FF] text-black px-2 py-0.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0px_#000]">Explorer?</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-bold max-w-xl mx-auto">
          Instant multi-city itineraries, live flight & hotel comparisons, and curated food guides in one place.
        </p>
      </div>

      {/* Centered Chat Composer */}
      <div className="w-full mb-10">
        <ChatInput onSend={onSend} disabled={disabled} isLanding={true} />
      </div>

      {/* Neo-Brutalist Prompt Cards */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="text-xs font-black text-slate-800 uppercase tracking-widest px-1 font-heading flex items-center gap-1.5">
          <Compass className="w-4 h-4 stroke-[2.5]" /> Express Trip Templates
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSend(p.text)}
              className="group text-left p-4 rounded-2xl bg-white hover:bg-slate-50 border-[3px] border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="text-sm font-black text-slate-900 font-heading">
                    {p.title}
                  </div>
                  <span className={`text-[10px] font-black ${p.color} text-black border-[1.5px] border-black rounded-md px-1.5 py-0.5 shadow-[1px_1px_0px_#000]`}>
                    {p.tag}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">
                  {p.text}
                </div>
              </div>

              <div className="flex items-center justify-end text-xs font-extrabold text-slate-900 group-hover:text-black">
                <span className="mr-1 group-hover:underline">Plan this</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

