
import React, { useState, useEffect, useCallback } from 'react';
import { MessageConfig, AppStatus, AppError } from './types';
import { fetchMessageFromSheet } from './services/sheetsService';
import Loader from './components/Loader';
import LockScreen from './components/LockScreen';
import MessageDisplay from './components/MessageDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [config, setConfig] = useState<MessageConfig | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<AppError | null>(null);

  const parseTurkishDate = (dateStr: string): Date => {
    const parts = dateStr.split('.');
    if (parts.length !== 3) throw new Error('Tarih formatı hatalı (GG.AA.YYYY olmalı).');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const decodeBase64 = (str: string): string => {
    try {
        // Base64 çözümleme ve Türkçe karakter desteği
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        throw new Error('Bağlantı parametreleri çözümlenemedi.');
    }
  };

  const parseUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const d = urlParams.get('d');

    if (!d) {
      setError({
        title: 'Geçersiz Link',
        message: 'Bu sayfaya erişmek için geçerli bir parametre gereklidir.'
      });
      setStatus('error');
      return;
    }

    try {
      const decoded = decodeBase64(d);
      const parts = decoded.split(',');
      
      if (parts.length < 3) {
        throw new Error('Eksik veri formatı detected.');
      }

      const parsedConfig: MessageConfig = {
        targetDate: parts[0],
        secretKeyword: parts[1],
        sheetRowNo: parseInt(parts[2], 10)
      };

      setConfig(parsedConfig);
      checkLockStatus(parsedConfig);
    } catch (err: any) {
      setError({
        title: 'Parametre Hatası',
        message: err.message || 'Link yapısı bozulmuş olabilir.'
      });
      setStatus('error');
    }
  }, []);

  const checkLockStatus = (conf: MessageConfig) => {
    try {
      const targetDate = parseTurkishDate(conf.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);
      
      if (today >= targetDate) {
        loadMessage(conf.sheetRowNo);
      } else {
        setStatus('locked');
      }
    } catch (e: any) {
      setError({ title: 'Sistem Hatası', message: 'Tarih hesaplanırken bir sorun oluştu.' });
      setStatus('error');
    }
  };

  const loadMessage = async (rowNo: number) => {
    setStatus('loading');
    try {
      const msg = await fetchMessageFromSheet(rowNo);
      setMessage(msg);
      setStatus('unlocked');
    } catch (err: any) {
      setError({
        title: 'Erişim Engellendi',
        message: err.message || 'Veritabanı bağlantısı kurulamadı.'
      });
      setStatus('error');
    }
  };

  const handleBypass = (keyword: string) => {
    if (config && keyword.trim() === config.secretKeyword.trim()) {
      loadMessage(config.sheetRowNo);
    } else {
      alert('Hatalı şifre.');
    }
  };

  useEffect(() => {
    parseUrlParams();
  }, [parseUrlParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        {status === 'loading' && <Loader />}

        {status === 'error' && error && (
          <div className="text-center space-y-6 max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-red-50 animate-fade-in" >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-slate-800">{error.title}</h1>
                <p className="text-slate-500 text-sm leading-relaxed">{error.message}</p>
            </div>
          </div>
        )}

        {status === 'locked' && config && (
          <LockScreen 
            targetDate={config.targetDate} 
            onBypass={handleBypass} 
          />
        )}

        {status === 'unlocked' && (
          <MessageDisplay message={message} />
        )}
        
        <div className="mt-12 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30 select-none">
            End-to-End Secure Fetch &bull; v1.3
        </div>
      </div>
    </div>
  );
};

export default App;
