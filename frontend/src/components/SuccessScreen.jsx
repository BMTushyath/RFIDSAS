import React from 'react';

const SuccessScreen = ({ telegramLink }) => {
  const handleTelegramConnect = () => {
    window.open(telegramLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center text-center animate-slide-up space-y-6">

      {/* Success Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
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
        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Registration Successful!</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
          Your student profile has been created. Connect your Telegram account to receive attendance notifications.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-slate-100" />

      {/* Telegram Connect Button */}
      <div className="w-full space-y-3">
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

        <p className="text-xs text-slate-400">
          You'll be redirected to our Telegram bot to complete setup.
        </p>
      </div>

    </div>
  );
};

export default SuccessScreen;
