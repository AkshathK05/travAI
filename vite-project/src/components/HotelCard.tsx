import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { HotelItem } from '../types';

interface HotelCardProps {
  hotel: HotelItem;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="brutal-card overflow-hidden bg-white flex flex-col justify-between group">
      
      {/* Hotel Image Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b-[2.5px] border-black">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 bg-[#FFE600] text-black px-2 py-0.5 rounded-lg border-[2px] border-black text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
          <Star className="w-3.5 h-3.5 fill-black stroke-[2.5]" />
          <span>{hotel.rating}</span>
          <span className="text-black/80 font-bold text-[10px]">({hotel.reviewsCount})</span>
        </div>

        {/* Name & Location */}
        <div className="absolute bottom-2.5 left-3 right-3">
          <div className="text-sm font-black text-white font-heading truncate drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.9)]">{hotel.name}</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-200 font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 stroke-[2.5]" />
            <span className="truncate">{hotel.location}</span>
          </div>
        </div>
      </div>

      {/* Hotel Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-800 font-bold bg-[#F4F4F0] p-2.5 rounded-xl border-[2px] border-black shadow-[1.5px_1.5px_0px_#000]">
          "{hotel.highlightQuote}"
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {hotel.amenities.map((item, idx) => (
            <span key={idx} className="text-[10px] bg-white text-black font-extrabold px-2 py-0.5 rounded-md border-[1.5px] border-black shadow-[1px_1px_0px_#000]">
              {item}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t-[2px] border-black flex items-center justify-between">
          <div>
            <span className="text-xs font-black bg-[#FF5376] text-white border-[2px] border-black rounded-lg px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000] font-heading">
              {hotel.pricePerNight}
            </span>
            <span className="text-[10px] text-slate-700 font-extrabold ml-1">/ night</span>
          </div>

          <button
            type="button"
            className="text-xs font-black text-white bg-slate-900 hover:bg-black px-3 py-1 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer font-heading uppercase"
          >
            Reserve <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

    </div>
  );
};
