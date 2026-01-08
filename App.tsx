
import React, { useState, useEffect, useCallback } from 'react';
import { MessageConfig, AppStatus, AppError } from './types';
import { fetchMessageFromSheet } from './services/sheetsService';
import Loader from './components/Loader';
import LockScreen from './components/LockScreen';
import MessageDisplay from './components/MessageDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('loading');
  const [config, setConfig] = useState<MessageConfig | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<AppError | null>(null);

  const parseTurkishDate = (dateStr: string): Date => {
    const parts = dateStr.split('.');
    if (parts.length !== 3) throw new Error('Date format error.');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const decodeBase64 = (str: string): string => {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        throw new Error('Link data could not be read.');
    }
  };

  const parseUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const d = urlParams.get('d');

    if (!d) {
      setError({
        title: 'Missing Message',
        message: 'No surprise found in this link. Please check your URL.'
      });
      setStatus('error');
      return;
    }

    try {
      const decoded = decodeBase64(d);
      const parts = decoded.split(',');
      
      if (parts.length < 3) {
        throw new Error('Incomplete data format.');
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
        title: 'Invalid Link',
        message: err.message || 'This surprise might have expired or is corrupted.'
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
      setError({ title: 'System Error', message: 'Could not calculate the opening time.' });
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
        title: 'Connection Issue',
        message: 'We could not reach the server to fetch your message.'
      });
      setStatus('error');
    }
  };

  const handleBypass = (keyword: string) => {
    if (config && keyword.trim().toLowerCase() === config.secretKeyword.trim().toLowerCase()) {
      loadMessage(config.sheetRowNo);
    } else {
      alert('Incorrect access code. Try again?');
    }
  };

  useEffect(() => {
    parseUrlParams();
  }, [parseUrlParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        {status === 'loading' && <Loader />}

        {status === 'error' && error && (
          <div className="text-center space-y-8 max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-rose-50 animate-soft-fade" >
            <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-3">
                <h1 className="text-2xl font-bold text-slate-800 serif italic">{error.title}</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{error.message}</p>
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
            >
                Try Again
            </button>
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
      </div>
    </div>
  );
};

export default App;
