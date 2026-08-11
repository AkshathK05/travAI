import React, { useEffect, useState } from "react";
import { Source } from "../types";

const WORD_MS = 30;

const DEFAULT_SOURCES: Source[] = [
  {
    id: "s1",
    name: "Google Travel & Maps",
    domain: "google.com",
    url: "https://google.com/travel",
    snippet: "Shinkansen bullet train routes and Tokyo Metro transit routes.",
  },
  {
    id: "s2",
    name: "Booking.com Japan",
    domain: "booking.com",
    url: "https://booking.com",
    snippet: "Curated 4-star boutique hotels in Shinjuku & Kyoto Gion district.",
  },
];

function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Matches **bold text** and *italic text*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="bg-[#FFE600] text-black px-1.5 py-0.5 rounded-md border-[1.5px] border-black font-black shadow-[1px_1px_0px_#000] inline-block mx-0.5 font-heading">
          {inner}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className="italic font-bold text-slate-900 bg-slate-100 px-1 py-0.2 rounded border border-black/30">
          {inner}
        </em>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function renderFormattedMarkdown(rawText: string) {
  if (!rawText) return null;

  // Pre-process text: normalize inline numbers like " 2. " or " 3. " onto newlines
  const normalized = rawText
    .replace(/\s+(\d+\.\s+\*\*)/g, '\n$1')
    .replace(/\s+(\d+\.\s+[A-Z])/g, '\n$1');

  const blocks = normalized.split(/\n+/);

  return (
    <div className="space-y-2 text-slate-900 font-extrabold">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Numbered list item (e.g., "1. **Tokyo (Day 2 Evening):** ...")
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const body = numMatch[2];
          return (
            <div
              key={bIdx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border-[2.5px] border-black shadow-[3.5px_3.5px_0px_#000000] my-2 transition-all hover:bg-slate-50"
            >
              <span className="w-7 h-7 rounded-xl bg-[#FFE600] border-[2px] border-black text-black font-black text-xs font-heading flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#000] mt-0.5">
                {num}
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed flex-1">
                {parseInlineMarkdown(body)}
              </div>
            </div>
          );
        }

        // Section Heading (e.g., "### Budget Summary Breakdown:")
        if (trimmed.startsWith('#')) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={bIdx} className="pt-2 pb-1">
              <h4 className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide flex items-center gap-2">
                <span className="w-3 h-3 bg-[#00F0FF] border-[1.5px] border-black rounded-md shadow-[1px_1px_0px_#000]"></span>
                {parseInlineMarkdown(headingText)}
              </h4>
            </div>
          );
        }

        // Bullet point (e.g., "- Roundtrip Flights...")
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const bulletText = trimmed.replace(/^[-*]\s*/, '');
          return (
            <div key={bIdx} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000] my-1 text-xs sm:text-sm font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] border border-black shrink-0 mt-1 shadow-[1px_1px_0px_#000]" />
              <div className="flex-1 leading-relaxed">{parseInlineMarkdown(bulletText)}</div>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={bIdx} className="text-xs sm:text-sm leading-relaxed text-slate-900 font-bold my-1.5">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

interface StreamingTextProps {
  content?: string;
  isStreaming?: boolean;
  sources?: Source[];
  followUps?: string[];
  onFollowUpSelect?: (prompt: string) => void;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  content = "I have created a complete 7-Day Food & Culture Itinerary for 2 People in Japan, carefully structured to stay comfortably within your ₹1.5 Lakh budget!",
  isStreaming = false,
  sources = DEFAULT_SOURCES,
  followUps,
  onFollowUpSelect,
}) => {
  const words = content.split(" ");
  const [count, setCount] = useState(isStreaming ? 0 : words.length);
  const done = count >= words.length;

  useEffect(() => {
    if (!isStreaming) {
      setCount(words.length);
      return;
    }
    if (count >= words.length) return;

    const t = setTimeout(() => {
      setCount((c) => Math.min(c + 1, words.length));
    }, WORD_MS);
    return () => clearTimeout(t);
  }, [count, isStreaming, words.length]);

  const currentText = isStreaming ? words.slice(0, count).join(" ") : content;

  return (
    <div className="w-full space-y-3">
      {/* Streamed Formatted Content */}
      <div className="relative">
        {renderFormattedMarkdown(currentText)}
        {!done && (
          <span className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-black animate-pulse" />
        )}
      </div>

      {/* Follow-ups */}
      {followUps && followUps.length > 0 && (
        <div
          className="mt-4 pt-3 border-t-[2.5px] border-black/20 space-y-2"
          style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}
        >
          <p className="text-xs font-black text-slate-800 uppercase tracking-widest font-heading">Refine & Follow-up</p>
          <div className="flex flex-wrap gap-2">
            {followUps.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => onFollowUpSelect && onFollowUpSelect(text)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE600] border-[2px] border-black text-slate-900 text-xs font-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-heading"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


