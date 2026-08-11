import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="w-full py-4 flex justify-end">
      <div className="flex items-start gap-3 max-w-2xl group">
        
        {/* User Content Bubble */}
        <div className="bg-[#FFE600] text-black border-[3px] border-black px-5 py-3.5 rounded-2xl rounded-tr-xs shadow-[4px_4px_0px_#000000] transition-all duration-200">
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-bold">
            {message.content}
          </p>
          <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t-[2px] border-black/20 text-[11px] font-black uppercase tracking-wide">
            <span>{message.timestamp}</span>
            <span className="flex items-center gap-1 text-black font-extrabold font-heading">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Request Sent
            </span>
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#00F0FF] border-[2.5px] border-black flex items-center justify-center text-black shrink-0 shadow-[2.5px_2.5px_0px_#000000]">
          <User className="w-4 h-4 stroke-[3]" />
        </div>

      </div>
    </div>
  );
};

