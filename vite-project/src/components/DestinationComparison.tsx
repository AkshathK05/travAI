import React from 'react';
import { Scale, Check, Plane, Building, Utensils, Sun } from 'lucide-react';
import { DestinationComparison as DestCompType } from '../types';

interface DestinationComparisonProps {
  items: DestCompType[];
}

export const DestinationComparison: React.FC<DestinationComparisonProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-5 space-y-3">
      <div className="flex items-center gap-2 px-1 text-xs font-black text-slate-900 uppercase tracking-widest font-heading">
        <Scale className="w-4 h-4 text-black stroke-[3]" />
        <span>Destination Comparison</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((dest) => (
          <div
            key={dest.id}
            className="brutal-card p-4 bg-white flex flex-col justify-between space-y-3 border-[2.5px] border-black shadow-[3.5px_3.5px_0px_#000000]"
          >
            {/* Title */}
            <div className="flex items-center justify-between border-b-[2.5px] border-black pb-2.5">
              <div>
                <div className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                  <span>{dest.flag}</span> {dest.destination}
                </div>
                <div className="text-xs font-bold text-slate-600">{dest.vibe}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black bg-[#00E599] text-black border-[2px] border-black rounded-lg px-2.5 py-0.5 shadow-[1.5px_1.5px_0px_#000] font-heading">
                  {dest.totalEstCost}
                </div>
                <div className="text-[10px] font-bold text-slate-700 mt-0.5">Total 2 Pax</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[1.5px_1.5px_0px_#000] flex items-center gap-2">
                <Plane className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Flight</span>
                  <span className="font-extrabold text-slate-900 font-mono">{dest.flightCost}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[1.5px_1.5px_0px_#000] flex items-center gap-2">
                <Building className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Hotel</span>
                  <span className="font-extrabold text-slate-900 font-mono">{dest.hotelCost}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[1.5px_1.5px_0px_#000] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Food</span>
                  <span className="font-extrabold text-slate-900 font-mono">{dest.foodCost}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[1.5px_1.5px_0px_#000] flex items-center gap-2">
                <Sun className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Weather</span>
                  <span className="font-extrabold text-slate-900">{dest.weather}</span>
                </div>
              </div>
            </div>

            {/* Pros */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider font-heading">Key Highlights</div>
              {dest.pros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-800 font-semibold">
                  <Check className="w-4 h-4 text-black stroke-[3] shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>

            {/* Action */}
            <button
              type="button"
              className="mt-2 w-full py-2 rounded-xl bg-[#FFE600] hover:bg-[#FFF066] text-black border-[2px] border-black text-xs font-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading uppercase"
            >
              Select {dest.destination.split(',')[0]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

