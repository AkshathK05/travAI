import React, { useState } from 'react';
import { ExternalLink, Globe, MapPin, Building, Plane } from 'lucide-react';
import { Source } from '../types';

interface SourcesPanelProps {
  sources: Source[];
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'flights':
        return <Plane className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'hotels':
        return <Building className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'maps':
        return <MapPin className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
    }
  };

  return (
    <div className="my-3">
      {/* Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-[#66F5FF] text-black border-[2px] border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-black cursor-pointer font-heading uppercase"
        >
          <Globe className="w-4 h-4 stroke-[3]" />
          <span>Verified Sources ({sources.length})</span>
        </button>

        {!isExpanded &&
          sources.slice(0, 3).map((src) => (
            <a
              key={src.id}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 border-[1.5px] border-black text-slate-900 shadow-[1.5px_1.5px_0px_#000000] transition-all text-xs font-bold"
            >
              {getCategoryIcon(src.category)}
              <span className="truncate max-w-[120px]">{src.name}</span>
            </a>
          ))}
      </div>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mt-2.5 p-4 rounded-2xl bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000] max-w-xl space-y-2">
          <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest font-heading pb-1.5 border-b-[2px] border-black flex items-center justify-between">
            <span>Verified Ground & Data Sources</span>
            <span className="bg-[#FFE600] text-black border border-black rounded px-1.5 py-0.2 text-[10px] shadow-[1px_1px_0px_#000]">LIVE API</span>
          </div>

          <div className="space-y-2 pt-1">
            {sources.map((src) => (
              <a
                key={src.id}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-2.5 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000000] hover:bg-white transition-all"
              >
                <div className="p-2 rounded-lg bg-white border-[1.5px] border-black text-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
                  {getCategoryIcon(src.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900 font-heading truncate">
                      {src.name}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-700 font-mono flex items-center gap-1">
                      {src.domain}
                      <ExternalLink className="w-3 h-3 text-black stroke-[2.5]" />
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 line-clamp-2 mt-1 leading-relaxed">
                    {src.snippet}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

