import React from 'react';
import { MapPin, Utensils, Landmark, Compass, Train, ShoppingBag, SunMedium } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityCardProps {
  activity: ActivityItem;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'culture':
        return <Landmark className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'transport':
        return <Train className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'shopping':
        return <ShoppingBag className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'relaxation':
        return <SunMedium className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
    }
  };

  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000000] transition-all hover:bg-slate-50">
      
      {activity.timeSlot && (
        <div className="w-16 shrink-0 text-center py-1 rounded-lg bg-[#FFE600] border-[2px] border-black font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000]">
          {activity.timeSlot}
        </div>
      )}

      <div className="p-1.5 rounded-lg bg-[#00F0FF] border-[1.5px] border-black text-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
        {getCategoryIcon(activity.category)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black text-slate-900 font-heading truncate">
            {activity.title}
          </span>
          <span className="text-[11px] font-black text-slate-900 font-mono shrink-0 bg-[#00E599] border border-black rounded px-1.5 py-0.2 shadow-[1px_1px_0px_#000]">
            {activity.cost}
          </span>
        </div>

        <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-1">
          {activity.description}
        </p>

        <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t-[1.5px] border-black/20 text-[10px] font-bold text-slate-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-900 stroke-[2.5]" />
            <span className="truncate">{activity.location}</span>
          </div>

          <div className="flex items-center gap-1">
            {activity.tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="bg-slate-100 text-black border border-black rounded px-1 text-[9px] font-extrabold">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

