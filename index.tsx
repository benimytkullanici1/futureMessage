
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- CONFIG & SERVICES ---
const API_KEY = 'AIzaSyCoA5LPL8NHfXhzbSbVzJc9r6naEKXUogU'; 
const SHEET_ID = '1lc3pmmVZVSq_qf6w50ZSHKBW0sd9IV9w58cj1MTHkuY';
const SHEET_NAME = 'Sheet1'; 

const fetchMessageFromSheet = async (rowNumber: number): Promise<string> => {
  const range = `${SHEET_NAME}!B${rowNumber}:B${rowNumber}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not connect to the database.');
  const data = await response.json();
  if (!data.values || !data.values[0][0]) throw new Error('Message not found.');
  return data.values[0][0];
};

// --- SUB-COMPONENTS ---

const Loader = () => (
  <div className="flex flex-col items-center justify-center p-12 animate-soft-fade">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-50 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-300 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-6 text-rose-400 font-medium italic serif text-lg">Preparing your surprise...</p>
  </div>
);

const LockScreen = ({ targetDate, onBypass }: { targetDate: string, onBypass: (k: string) => void }) => {
  const [input, setInput] = useState('');
  
  const formatDisplayDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('.');
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-10 animate-soft-fade">
      <div className="space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-50 rounded-full shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight serif italic">A Surprise is Waiting</h2>
            <p className="text-slate-500 leading-relaxed text-sm px-6">
              This message is carefully kept until the right moment. <br/>
              It will be ready for you on <br/>
              <span className="font-bold text-rose-500 border-b border-rose-100">
                {formatDisplayDate(targetDate)}
              </span>
            </p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(244,114,182,0.1)] space-y-6 mx-2">
        <form onSubmit={(e) => { e.preventDefault(); onBypass(input); }} className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Access Code"
              className="w-full px-8 py-5 rounded-[2rem] border border-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all text-center font-medium placeholder:text-slate-200 bg-white/50"
            />
            <button
              type="submit"
              className="w-full bg-rose-500 text-white font-bold py-5 rounded-[2rem] hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-200"
            >
              Open My Message
            </button>
        </form>
        <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold opacity-60 italic serif">Gift Access Only</p>
      </div>
    </div>
  );
};

const MessageDisplay = ({ message }: { message: string }) => (
  <div className="w-full max-w-2xl mx-auto animate-soft-fade">
    <div className="bg-white rounded-[4rem] border border-white shadow-[0_40px_80px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="bg-rose-50/40 py-4 text-center">
        <span className="text-rose-300 text-[10px] font-bold uppercase tracking-[0.4em]">Especially for You</span>
      </div>
      <div className="p-16 md:p-24 lg:p-32 text-center">
        <p className="text-slate-800 text-2xl md:text-4xl leading-relaxed whitespace-pre-wrap font-medium italic serif">
            "{message}"
        </p>
        <div className="mt-20 flex justify-center items-center space-x-3">
          <div className="h-px w-12 bg-rose-100"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-200"></div>
          <div className="h-px w-12 bg-rose-100"></div>
        </div>
      </div>
    </div>
    <p className="mt-10 text-center text-rose-300 serif italic text-sm opacity-50">Handled with love</p>
  </div>
);

// --- MAIN APP ---
const App = () => {
  const [status, setStatus] = useState('loading');
  const [config, setConfig] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<any>(null);

  const loadMessage = async (rowNo: number) => {
    setStatus('loading');
    try {
      const msg = await fetchMessageFromSheet(rowNo);
      setMessage(msg);
      setStatus('unlocked');
    } catch (err: any) {
      setError({ title: 'Connection Issue', message: 'We could not open the surprise at this moment.' });
      setStatus('error');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const d = urlParams.get('d');
    if (!d) {
      setError({ title: 'Empty Link', message: 'No message was found in this link.' });
      setStatus('error');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(d)));
      const parts = decoded.split(',');
      const conf = { targetDate: parts[0], secretKeyword: parts[1], sheetRowNo: parseInt(parts[2], 10) };
      setConfig(conf);
      
      const tDate = parts[0].split('.');
      const target = new Date(parseInt(tDate[2]), parseInt(tDate[1]) - 1, parseInt(tDate[0]));
      const today = new Date();
      today.setHours(0,0,0,0); target.setHours(0,0,0,0);

      if (today >= target) loadMessage(conf.sheetRowNo);
      else setStatus('locked');
    } catch {
      setError({ title: 'Invalid Link', message: 'This message link seems to be broken.' });
      setStatus('error');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {status === 'loading' && <Loader />}
        {status === 'locked' && config && (
            <LockScreen 
                targetDate={config.targetDate} 
                onBypass={(k) => k.trim().toLowerCase() === config.secretKeyword.trim().toLowerCase() ? loadMessage(config.sheetRowNo) : alert('Incorrect code. Please try again.')} 
            />
        )}
        {status === 'unlocked' && <MessageDisplay message={message} />}
        {status === 'error' && error && (
          <div className="text-center p-12 bg-white rounded-[3.5rem] shadow-xl border border-rose-50 animate-soft-fade max-w-sm">
            <h1 className="text-xl font-bold text-slate-800 mb-3 serif italic">{error.title}</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">{error.message}</p>
            <button onClick={() => window.location.reload()} className="text-xs font-bold text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
