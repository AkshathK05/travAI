import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText } from 'lucide-react';
import { ChatMessage } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, message }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !message) return null;

  const handleCopyMarkdown = () => {
    let text = `# ${message.content}\n\n`;
    if (message.itinerary) {
      text += `## Itinerary Summary\n\n`;
      message.itinerary.forEach((day) => {
        text += `### ${day.title}\n${day.subtitle}\n\n`;
      });
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('PDF Download complete! (Mock itinerary exported)');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-[3.5px] border-black rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#000000] space-y-4 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-[2.5px] border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FFE600] border-[2px] border-black shadow-[1.5px_1.5px_0px_#000]">
              <Download className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">Export Itinerary</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-[#FF5376] hover:text-white border-[2px] border-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-3.5 rounded-xl bg-[#F4F4F0] border-[2px] border-black shadow-[2px_2px_0px_#000] space-y-1 text-xs">
          <div className="text-[10px] font-black text-slate-600 uppercase font-heading tracking-widest">
            Summary Preview
          </div>
          <p className="text-slate-800 font-extrabold line-clamp-3 leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-xl bg-[#FFE600] hover:bg-[#FFF066] text-black border-[2.5px] border-black font-black text-xs shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading uppercase tracking-wider"
          >
            <FileText className="w-4 h-4 stroke-[3]" />
            <span>{downloading ? 'Exporting PDF Document...' : 'Download PDF Document'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-black border-[2.5px] border-black text-xs font-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading uppercase tracking-wider"
          >
            {copied ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Markdown Text'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

