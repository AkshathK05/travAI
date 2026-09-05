import React from "react";
import { Source } from "../types";
import { stripThinkingTraces, cleanFormattingTokens } from "../services/geminiService";

export { cleanFormattingTokens };

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

function parseCellMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-black text-black">
          {inner}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className="italic font-bold text-slate-800">
          {inner}
        </em>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function parseTableRow(line: string): string[] {
  let content = line.trim();
  if (content.startsWith('|')) content = content.slice(1);
  if (content.endsWith('|')) content = content.slice(0, -1);
  return content.split('|').map((c) => c.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\s*\|?[\s:-]*(?:\|[\s:-]+)+\|?\s*$/.test(trimmed) && /^[\s|:-]+$/.test(trimmed);
}

interface TableData {
  headers: string[];
  rows: string[][];
}

function parseTableBlock(lines: string[]): TableData {
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseTableRow(lines[0]);
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || isTableSeparator(line)) continue;
    const cells = parseTableRow(line);
    if (cells.some((c) => c.length > 0)) {
      rows.push(cells);
    }
  }

  return { headers, rows };
}

type ParsedBlock =
  | { type: 'hr' }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'numbered'; num: string; body: string }
  | { type: 'heading'; text: string; level: number }
  | { type: 'bullet'; text: string }
  | { type: 'paragraph'; text: string };

function renderFormattedMarkdown(rawText: string) {
  if (!rawText) return null;

  const sanitized = cleanFormattingTokens(stripThinkingTraces(rawText, { trim: false }));
  if (!sanitized) return null;

  // Pre-process text: strip lone double-dashes, normalize inline numbers onto newlines outside tables
  const normalized = sanitized
    .replace(/^\s*--\s*$/gm, '')
    .replace(/([^\n|])\s+(\d+\.\s+\*\*)/g, '$1\n$2')
    .replace(/([^\n|])\s+(\d+\.\s+[A-Z])/g, '$1\n$2');

  const rawLines = normalized.split(/\r?\n/);

  const parsedBlocks: ParsedBlock[] = [];
  let tableLines: string[] = [];

  const flushTable = () => {
    if (tableLines.length > 0) {
      const tableData = parseTableBlock(tableLines);
      if (tableData.headers.length > 0) {
        parsedBlocks.push({
          type: 'table',
          headers: tableData.headers,
          rows: tableData.rows,
        });
      }
      tableLines = [];
    }
  };

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '--') {
      flushTable();
      continue;
    }

    // Check if line is a table row (starts and ends with '|' or contains multiple '|' with separator syntax)
    const isTable =
      (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1) ||
      /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(trimmed);

    if (isTable) {
      tableLines.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    // Horizontal Rules / Dividers (e.g., "---", "***", "___")
    if (/^[-*_]{2,}$/.test(trimmed)) {
      parsedBlocks.push({ type: 'hr' });
      continue;
    }

    // Numbered list item (e.g., "1. **Tokyo (Day 2 Evening):** ...")
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      parsedBlocks.push({ type: 'numbered', num: numMatch[1], body: numMatch[2] });
      continue;
    }

    // Section Heading (e.g., "### Budget Summary Breakdown:")
    if (trimmed.startsWith('#')) {
      const levelMatch = trimmed.match(/^(#+)/);
      const level = levelMatch ? levelMatch[1].length : 3;
      const headingText = trimmed.replace(/^#+\s*/, '');
      parsedBlocks.push({ type: 'heading', text: headingText, level });
      continue;
    }

    // Bullet point
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      const bulletText = bulletMatch[1].trim();
      if (bulletText && bulletText !== '--' && bulletText !== '-') {
        parsedBlocks.push({ type: 'bullet', text: bulletText });
      }
      continue;
    }

    // Standard Paragraph
    parsedBlocks.push({ type: 'paragraph', text: trimmed });
  }

  flushTable();

  return (
    <div className="space-y-2 text-slate-900 font-extrabold">
      {parsedBlocks.map((block, idx) => {
        if (block.type === 'hr') {
          return <hr key={idx} className="border-t-2 border-black/20 my-3" />;
        }

        if (block.type === 'table') {
          return (
            <div
              key={idx}
              className="overflow-x-auto my-4 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white"
            >
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead className="bg-[#FFE600] border-b-2 border-black font-black uppercase font-heading">
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="p-2.5 border-r border-black font-black last:border-r-0"
                      >
                        {parseCellMarkdown(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-t border-black/20 hover:bg-slate-50 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="p-2.5 border-r border-black/10 last:border-r-0 font-medium text-slate-900"
                        >
                          {parseCellMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'numbered') {
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border-[2.5px] border-black shadow-[3.5px_3.5px_0px_#000000] my-2 transition-all hover:bg-slate-50"
            >
              <span className="w-7 h-7 rounded-xl bg-[#FFE600] border-[2px] border-black text-black font-black text-xs font-heading flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#000] mt-0.5">
                {block.num}
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed flex-1">
                {parseInlineMarkdown(block.body)}
              </div>
            </div>
          );
        }

        if (block.type === 'heading') {
          return (
            <div key={idx} className="pt-3 pb-1">
              <h4 className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide flex items-center gap-2">
                <span className="w-3 h-3 bg-[#00F0FF] border-[1.5px] border-black rounded-md shadow-[1px_1px_0px_#000]"></span>
                {parseInlineMarkdown(block.text)}
              </h4>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000] my-1 text-xs sm:text-sm font-bold"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] border border-black shrink-0 mt-1 shadow-[1px_1px_0px_#000]" />
              <div className="flex-1 leading-relaxed">{parseInlineMarkdown(block.text)}</div>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-900 font-bold my-1.5">
            {parseInlineMarkdown(block.text)}
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
  const cleanContent = cleanFormattingTokens(stripThinkingTraces(content, { trim: false }));

  return (
    <div className="w-full space-y-3">
      {/* Streamed Formatted Content: rendered directly and reactively as chunks arrive */}
      <div className="relative">
        {renderFormattedMarkdown(cleanContent)}
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-black animate-pulse" />
        )}
      </div>

      {/* Follow-ups (shown when streaming is complete) */}
      {!isStreaming && followUps && followUps.length > 0 && (
        <div className="mt-4 pt-3 border-t-[2.5px] border-black/20 space-y-2">
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


