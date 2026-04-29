import React, { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import SuccessScreen from './components/SuccessScreen';
import './index.css';

function App() {
  const [registrationData, setRegistrationData] = useState(null);

  const handleSuccess = (data) => {
    setRegistrationData(data);
  };

  const isSuccess = !!registrationData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 bg-grid flex items-center justify-center p-4">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-sky-200/40 to-indigo-200/40 blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/60 border border-white/60 overflow-hidden">

          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              {/* RFID chip icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                  <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                  {isSuccess ? "You're all set!" : 'Student Registration'}
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  RFID Smart Attendance System
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${isSuccess ? 'bg-emerald-400' : 'bg-indigo-500'}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${isSuccess ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-medium text-indigo-500">Register</span>
              <span className={`text-[10px] font-medium ${isSuccess ? 'text-emerald-500' : 'text-slate-300'}`}>Connect Telegram</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-8 py-7">
            {isSuccess ? (
              <SuccessScreen telegramLink={registrationData.telegram_link} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}
          </div>

          {/* Card Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-slate-400">
              Secured by RFID Smart Attendance &middot;{' '}
              <span className="text-indigo-400 font-medium">v1.0</span>
            </p>
          </div>
        </div>

        {/* Decorative badge */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-indigo-200 uppercase tracking-widest">
          Demo
        </div>
      </div>
    </div>
  );
}

export default App;
