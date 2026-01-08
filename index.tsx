
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
  if (!response.ok) throw new Error('Mesaj veritabanından çekilemedi.');
  const data = await response.json();
  if (!data.values || !data.values[0][0]) throw new Error('Mesaj bulunamadı.');
  return data.values[0][0];
};

// --- COMPONENTS ---
const Loader = () => (
  <div className="flex flex-col items-center justify-center p-12 animate-in fade-in duration-500">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-4 text-slate-500 font-medium animate-pulse text-sm">Mesaj hazırlanıyor...</p>
  </div>
);

const LockScreen = ({ targetDate, onBypass }: { targetDate: string, onBypass: (k: string) => void }) => {
  const [input, setInput] = useState('');
  const formatDisplayDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('.');
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">KİLİTLİ MESAJ</h2>
        <p className="text-slate-600 leading-relaxed text-sm px-4">
          Bu mesaj <span className="font-bold text-indigo-600">{formatDisplayDate(targetDate)}</span> tarihinde açılacaktır.
        </p>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-5">
        <form onSubmit={(e) => { e.preventDefault(); onBypass(input); }} className="space-y-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Şifreyi girin"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-center font-medium bg-slate-50/50" />
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl">Mesajı Aç</button>
        </form>
      </div>
    </div>
  );
};

const MessageDisplay = ({ message }: { message: string }) => (
  <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Gizli Mesaj</span>
        <div className="flex space-x-1"><div className="w-2 h-2 rounded-full bg-white/30"></div><div className="w-2 h-2 rounded-full bg-white/30"></div></div>
      </div>
      <div className="p-10 md:p-16">
        <p className="text-slate-800 text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-medium text-center italic">"{message}"</p>
      </div>
    </div>
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
      setError({ title: 'Veri Hatası', message: err.message });
      setStatus('error');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const d = urlParams.get('d');
    if (!d) {
      setError({ title: 'Link Hatalı', message: 'Parametre bulunamadı. Lütfen tam linki kullanın.' });
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
      setError({ title: 'Geçersiz Veri', message: 'Bağlantı parametreleri çözümlenemedi.' });
      setStatus('error');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {status === 'loading' && <Loader />}
        {status === 'locked' && <LockScreen targetDate={config.targetDate} onBypass={(k) => k === config.secretKeyword ? loadMessage(config.sheetRowNo) : alert('Hatalı!')} />}
        {status === 'unlocked' && <MessageDisplay message={message} />}
        {status === 'error' && (
          <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-red-50">
            <h1 className="text-xl font-bold text-slate-800 mb-2">{error.title}</h1>
            <p className="text-slate-500 text-sm">{error.message}</p>
          </div>
        )}
        <div className="mt-12 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">SECURE VIEWER v1.5</div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
