import React from 'react';
import { Plane, ArrowRight } from 'lucide-react';
import { FlightItem } from '../types';

interface FlightCardProps {
  flight: FlightItem;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <div className="brutal-card p-4 bg-white flex flex-col justify-between space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-[2px] border-black pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00F0FF] border-[2px] border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_#000]">
            <Plane className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 font-heading">{flight.airline}</div>
            <div className="text-[10px] text-slate-700 font-mono font-bold">{flight.flightNo} • {flight.class}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs font-black bg-[#FFE600] text-black border-[2px] border-black rounded-lg px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000] font-heading">
            {flight.price}
          </div>
          <div className="text-[10px] text-slate-700 font-bold mt-0.5">per seat</div>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center justify-between gap-2 text-xs py-1">
        <div>
          <div className="font-black text-sm text-slate-900 font-heading">{flight.fromTime}</div>
          <div className="text-[11px] font-black text-slate-600 uppercase">{flight.fromCode}</div>
        </div>

        <div className="flex-1 flex flex-col items-center px-2">
          <span className="text-[10px] text-slate-900 font-mono font-extrabold">{flight.duration}</span>
          <div className="w-full h-[2px] bg-black my-1 relative flex items-center justify-center">
            <Plane className="w-3.5 h-3.5 text-black absolute transform rotate-90 stroke-[3]" />
          </div>
          <span className="text-[10px] text-slate-700 font-bold">{flight.stops}</span>
        </div>

        <div className="text-right">
          <div className="font-black text-sm text-slate-900 font-heading">{flight.toTime}</div>
          <div className="text-[11px] font-black text-slate-600 uppercase">{flight.toCode}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t-[2px] border-black flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-700 truncate max-w-[150px]">
          {flight.highlights[0] || 'Baggage Included'}
        </span>

        <button
          type="button"
          className="text-xs font-black text-white bg-slate-900 hover:bg-black px-3 py-1 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer font-heading uppercase"
        >
          Select <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

    </div>
  );
};

