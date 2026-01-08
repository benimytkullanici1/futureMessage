
import React, { useState } from 'react';

interface LockScreenProps {
  targetDate: string; // dd.mm.yyyy
  onBypass: (keyword: string) => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ targetDate, onBypass }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBypass(input);
  };

  // dd.mm.yyyy zaten düzgün bir string, sadece ay ismini eklemek istersek parser kullanalım
  const formatDisplayDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('.');
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">KİLİTLİ MESAJ</h2>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base px-4">
          Bu mesajın içeriği henüz erişime açık değil. <br className="hidden sm:block" />
          <span className="font-bold text-indigo-600 underline decoration-indigo-200 decoration-2 underline-offset-4">
            {formatDisplayDate(targetDate)}
          </span> tarihinde otomatik olarak açılacak.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-5 mx-2">
        <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alternatif Giriş</p>
            <p className="text-[11px] text-slate-500">Erişim şifreniz varsa hemen açabilirsiniz.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Şifreyi buraya girin"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-center font-medium placeholder:text-slate-300 shadow-inner bg-slate-50/50"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
            >
              Mesajı Aç
            </button>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;
