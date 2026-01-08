
import React from 'react';

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-soft-fade">
      <div className="bg-white rounded-[4rem] border border-white shadow-[0_40px_80px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="bg-rose-50/50 py-4 text-center">
          <span className="text-rose-300 text-[10px] font-bold uppercase tracking-[0.4em]">Especially for You</span>
        </div>
        <div className="p-16 md:p-24 lg:p-32">
          <div className="max-w-none">
            <p className="text-slate-800 text-2xl md:text-4xl leading-relaxed whitespace-pre-wrap font-medium text-center italic serif">
                "{message}"
            </p>
          </div>
          <div className="mt-20 flex justify-center items-center space-x-3">
            <div className="h-px w-12 bg-rose-100"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-200"></div>
            <div className="h-px w-12 bg-rose-100"></div>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-rose-300 serif italic text-sm opacity-60">Handled with love.</p>
    </div>
  );
};

export default MessageDisplay;
