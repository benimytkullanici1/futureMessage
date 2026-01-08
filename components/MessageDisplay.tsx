
import React from 'react';

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
          <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Gizli Mesaj</span>
          <div className="flex space-x-1">
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
        <div className="p-8 md:p-12">
          <div className="prose prose-slate lg:prose-lg max-w-none">
            <p className="text-slate-800 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium text-center italic">
                "{message}"
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-slate-400 text-sm">Bu mesaj otomatik olarak açılmıştır.</p>
    </div>
  );
};

export default MessageDisplay;
