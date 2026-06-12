import React, { useState, useEffect } from 'react';

const SuccessScreen = ({ telegramLink, rfidId, onConnected, connected }) => {
  const [checking, setChecking] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [hasFallback, setHasFallback] = useState(false);

  const handleTelegramConnect = () => {
    window.open(telegramLink, '_blank', 'noopener,noreferrer');
  };

  const checkStatus = async () => {
    setChecking(true);
    setStatusError(null);
    try {
      const response = await fetch(`http://localhost:8000/status/${rfidId}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      if (data.connected) {
        onConnected();
      } else {
        setStatusError('Telegram linking incomplete. Please complete Telegram setup to finish registration.');
      }
    } catch (err) {
      console.error('Error checking status:', err);
      setStatusError('Telegram linking incomplete. Please complete Telegram setup to finish registration.');
      setHasFallback(true);
    } finally {
      setChecking(false);
    }
  };

  // Automatic Polling
  useEffect(() => {
    if (connected || !rfidId) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/status/${rfidId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.connected) {
            onConnected();
            clearInterval(interval);
          }
        }
      } catch (e) {
        // Silent catch for background polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [connected, rfidId, onConnected]);

  return (
    <div className="flex flex-col items-center text-center animate-slide-up space-y-6">

      {/* Success Icon */}
      <div className="relative">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${connected ? 'from-emerald-400 to-teal-500 shadow-emerald-200' : 'from-indigo-400 to-violet-500 shadow-indigo-200'} flex items-center justify-center shadow-lg shadow-indigo-200`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {/* Pulse ring */}
        <div className={`absolute inset-0 rounded-full ${connected ? 'bg-emerald-400' : 'bg-indigo-400'} opacity-20 animate-ping`} />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">
          {connected ? 'Registration Complete!' : 'Registration Successful!'}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
          {connected 
            ? 'Your student profile is active and Telegram notifications are enabled.'
            : 'Your student profile has been created. Connect your Telegram account to receive attendance notifications.'}
        </p>
      </div>

      {/* Connection Status Badge */}
      <div className="flex justify-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          Status: {connected ? 'Connected ✓' : 'Not Connected'}
        </div>
      </div>

      {/* Prominent Onboarding Notices / Failure Messages */}
      {!connected && (
        <div className="w-full space-y-3">
          {/* Failure banner */}
          {statusError && (
            <div className="w-full p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-left leading-relaxed flex items-start gap-2.5 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-rose-900 mb-0.5">Linking Incomplete</p>
                <p>{statusError}</p>
              </div>
            </div>
          )}
          
          {/* Warning notice banner */}
          <div className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-left leading-relaxed flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Registration is not complete until Telegram is successfully connected.</span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full border-t border-slate-100" />

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        {connected ? (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
            <p className="text-sm font-semibold text-emerald-800 mb-1">Student Profile Linked!</p>
            <p className="text-xs text-slate-500">
              RFID Card ID: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{rfidId}</code>
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Step</p>
            <button
              id="telegram-connect-btn"
              onClick={handleTelegramConnect}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
            >
              {/* Telegram paper-plane icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Connect to Telegram</span>
            </button>

            <button
              id="check-connection-btn"
              onClick={checkStatus}
              disabled={checking}
              className="w-full py-3 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Checking Connection...</span>
                </>
              ) : (
                <span>Check Connection Status</span>
              )}
            </button>

            {hasFallback && (
              <button
                onClick={onConnected}
                className="text-[10px] text-indigo-500 hover:text-indigo-600 underline font-medium cursor-pointer transition-all mt-1"
              >
                [Dev Fallback] Simulate Successful Connection
              </button>
            )}

            <p className="text-xs text-slate-400">
              You\'ll be redirected to our Telegram bot to complete setup.
            </p>
          </>
        )}
      </div>

    </div>
  );
};

export default SuccessScreen;
