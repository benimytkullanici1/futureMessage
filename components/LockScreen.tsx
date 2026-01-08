
import React, { useState } from 'react';

interface LockScreenProps {
  targetDate: string; // dd.mm.yyyy
  onBypass: (keyword: string) => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ targetDate, onBypass }) => {
  const [input, setInput] = useState('');

  const formatDisplayDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('.');
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-10 animate-soft-fade">
      <div className="space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-50 rounded-full shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight serif italic">A Surprise is Waiting</h2>
            <p className="text-slate-500 leading-relaxed text-sm px-6">
              Some messages are best read at the perfect moment. <br/>
              This one will be ready for you on <br/>
              <span className="font-bold text-rose-500 border-b border-rose-200">
                {formatDisplayDate(targetDate)}
              </span>
            </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(244,114,182,0.1)] space-y-6 mx-2">
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.2em]">Have a code?</p>
            <p className="text-xs text-slate-400 italic serif">If you can't wait, enter your access code below.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onBypass(input); }} className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full px-8 py-5 rounded-[2rem] border border-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all text-center font-medium placeholder:text-slate-200 bg-white/50"
            />
            <button
              type="submit"
              className="w-full bg-rose-500 text-white font-bold py-5 rounded-[2rem] hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-200"
            >
              Open My Message
            </button>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;
