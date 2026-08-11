import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Sun, Sunset, Moon, DollarSign } from 'lucide-react';
import { ItineraryDay } from '../types';
import { ActivityCard } from './ActivityCard';

interface ItineraryProps {
  days: ItineraryDay[];
  costSummary?: {
    flights: string;
    hotels: string;
    activities: string;
    transport: string;
    total: string;
    budget: string;
    withinBudget: boolean;
  };
  onQuickAction?: (actionPrompt: string) => void;
}

export const Itinerary: React.FC<ItineraryProps> = ({
  days,
  costSummary,
  onQuickAction
}) => {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const toggleAll = (expand: boolean) => {
    const nextState: Record<number, boolean> = {};
    days.forEach((d) => {
      nextState[d.dayNumber] = expand;
    });
    setExpandedDays(nextState);
  };

  return (
    <div className="my-5 space-y-4">
      
      {/* Cost Summary Header */}
      {costSummary && (
        <div className="brutal-card p-4 bg-white space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2.5px] border-black pb-2.5">
            <div className="flex items-center gap-2 font-heading">
              <div className="p-1 rounded-md bg-[#FFE600] border border-black shadow-[1px_1px_0px_#000]">
                <DollarSign className="w-4 h-4 text-black stroke-[3]" />
              </div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Budget Breakdown & Allocation</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-700 font-mono font-bold">Cap: {costSummary.budget}</span>
              <span className="font-black text-black bg-[#00E599] px-2.5 py-0.5 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#000] font-heading">
                Total: {costSummary.total}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Flights</span>
              <span className="font-black text-slate-900 text-xs font-mono">{costSummary.flights}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Hotels</span>
              <span className="font-black text-slate-900 text-xs font-mono">{costSummary.hotels}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Food & Sights</span>
              <span className="font-black text-slate-900 text-xs font-mono">{costSummary.activities}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-bold text-slate-600 uppercase block font-heading">Transport</span>
              <span className="font-black text-slate-900 text-xs font-mono">{costSummary.transport}</span>
            </div>
          </div>
        </div>
      )}

      {/* Itinerary Header & Controls */}
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-xs font-black text-slate-900 uppercase tracking-widest font-heading flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
          Day-by-Day Itinerary ({days.length} Days)
        </span>

        <div className="flex items-center gap-3 text-xs font-black font-heading">
          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="text-slate-900 hover:underline cursor-pointer"
          >
            EXPAND ALL
          </button>
          <span className="text-black">•</span>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="text-slate-900 hover:underline cursor-pointer"
          >
            COLLAPSE ALL
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {days.map((day) => {
          const isOpen = !!expandedDays[day.dayNumber];

          return (
            <div
              key={day.dayNumber}
              className="brutal-card overflow-hidden bg-white border-[2.5px] border-black shadow-[3.5px_3.5px_0px_#000000]"
            >
              {/* Day Accordion Header */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-[2px] border-black font-black text-xs flex items-center justify-center text-black shadow-[2px_2px_0px_#000] font-heading shrink-0">
                    D{day.dayNumber}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 font-heading">{day.title}</div>
                    <div className="text-xs font-semibold text-slate-600">{day.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-slate-900 font-mono bg-[#00F0FF] border-[1.5px] border-black rounded-lg px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000] hidden sm:inline-block">
                    Est: {day.estimatedDayCost}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black stroke-[3]" />
                  )}
                </div>
              </button>

              {/* Timeline */}
              {isOpen && (
                <div className="p-4 pt-2 border-t-[2.5px] border-black bg-[#F4F4F0] space-y-3">
                  
                  {day.morning.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-black uppercase tracking-wider font-heading">
                        <Sun className="w-3.5 h-3.5 text-amber-600 stroke-[3]" /> Morning Experience
                      </div>
                      <div className="space-y-2">
                        {day.morning.map((act) => (
                          <ActivityCard key={act.id} activity={act} />
                        ))}
                      </div>
                    </div>
                  )}

                  {day.afternoon.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-black uppercase tracking-wider font-heading">
                        <Sunset className="w-3.5 h-3.5 text-orange-600 stroke-[3]" /> Afternoon Activity
                      </div>
                      <div className="space-y-2">
                        {day.afternoon.map((act) => (
                          <ActivityCard key={act.id} activity={act} />
                        ))}
                      </div>
                    </div>
                  )}

                  {day.evening.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-black uppercase tracking-wider font-heading">
                        <Moon className="w-3.5 h-3.5 text-indigo-700 stroke-[3]" /> Evening & Dining
                      </div>
                      <div className="space-y-2">
                        {day.evening.map((act) => (
                          <ActivityCard key={act.id} activity={act} />
                        ))}
                      </div>
                    </div>
                  )}

                  {onQuickAction && (
                    <div className="pt-3 flex items-center justify-end gap-2 border-t-[2px] border-black/20">
                      <button
                        type="button"
                        onClick={() => onQuickAction(`Make Day ${day.dayNumber} cheaper`)}
                        className="text-xs font-bold text-black bg-white hover:bg-[#FFE600] px-2.5 py-1 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Make Day {day.dayNumber} cheaper
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickAction(`Add more food experiences to Day ${day.dayNumber}`)}
                        className="text-xs font-bold text-black bg-white hover:bg-[#00F0FF] px-2.5 py-1 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Add food spots
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

