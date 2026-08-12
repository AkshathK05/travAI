import React, { useState } from 'react';
import { Compass, Copy, Check, Bookmark, Download } from 'lucide-react';
import { ChatMessage } from '../types';
import { LoadingState } from './LoadingState';
import { StreamingText } from './StreamingText';
import { FlightCard } from './FlightCard';
import { HotelCard } from './HotelCard';
import { Itinerary } from './Itinerary';
import { DestinationComparison } from './DestinationComparison';

interface AIMessageProps {
  message: ChatMessage;
  onFollowUpSelect: (prompt: string) => void;
  onExportItinerary?: (message: ChatMessage) => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({
  message,
  onFollowUpSelect,
  onExportItinerary
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <div className="w-full py-3">
      <div className="brutal-card p-5 bg-white space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b-[2.5px] border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000]">
              <Compass className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide">TravAI Engine</span>
                <span className="bg-[#00E599] text-black text-[10px] font-black border border-black rounded px-1.5 py-0.2 shadow-[1px_1px_0px_#000]">
                  LIVE PLAN
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">{message.timestamp}</span>
        </div>

        {/* AI Message Body */}
        <div className="space-y-4">
          
          {/* Loading Indicator when streaming before first content token */}
          {message.isStreaming && !message.content && (
            <LoadingState label="Generating AI response..." variant="Drive" />
          )}

          {/* Text Content with Inline Citations, Actions & Follow-ups */}
          {message.content && (
            <StreamingText
              content={message.content}
              isStreaming={message.isStreaming}
              sources={message.sources}
              followUps={message.followUpSuggestions}
              onFollowUpSelect={onFollowUpSelect}
            />
          )}

          {/* Destination Comparison */}
          {message.comparison && message.comparison.length > 0 && (
            <DestinationComparison items={message.comparison} />
          )}

          {/* Flights */}
          {message.flights && message.flights.length > 0 && (
            <div className="my-4 space-y-2.5">
              <div className="text-xs font-black text-slate-900 uppercase tracking-widest font-heading flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00F0FF] border border-black rounded-sm inline-block"></span>
                Flight Options
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {message.flights.map((fl) => (
                  <FlightCard key={fl.id} flight={fl} />
                ))}
              </div>
            </div>
          )}

          {/* Hotels */}
          {message.hotels && message.hotels.length > 0 && (
            <div className="my-4 space-y-2.5">
              <div className="text-xs font-black text-slate-900 uppercase tracking-widest font-heading flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#FF5376] border border-black rounded-sm inline-block"></span>
                Hotel Recommendations
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {message.hotels.map((ht) => (
                  <HotelCard key={ht.id} hotel={ht} />
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {message.itinerary && message.itinerary.length > 0 && (
            <Itinerary
              days={message.itinerary}
              costSummary={message.costSummary}
              onQuickAction={onFollowUpSelect}
            />
          )}

          {/* Quick Bar Actions (Copy / Save / Export) */}
          {!message.isStreaming && (
            <div className="flex items-center gap-2 pt-3 border-t-[2.5px] border-black text-xs font-extrabold">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border-[2px] border-black text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`px-3 py-1.5 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer ${
                  saved ? 'bg-[#FFE600] text-black font-black' : 'bg-white hover:bg-slate-100 text-black'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 stroke-[2.5] ${saved ? 'fill-black' : ''}`} />
                <span>{saved ? 'Saved to Library' : 'Save Plan'}</span>
              </button>

              {message.itinerary && onExportItinerary && (
                <button
                  type="button"
                  onClick={() => onExportItinerary(message)}
                  className="px-3 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-[#66F5FF] text-black border-[2px] border-black font-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Download className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Export Itinerary</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
