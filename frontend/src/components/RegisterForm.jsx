import React, { useState } from 'react';

// Onboarding step constants
const STEP_FORM = 0;
const STEP_TELEGRAM = 1;
const STEP_COMPLETE = 2;

const RegisterForm = ({ onSuccess }) => {
  // ---------- Form data ----------
  const [formData, setFormData] = useState({ name: '', phone: '', rfid_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ---------- Onboarding flow ----------
  const [step, setStep] = useState(STEP_FORM);
  const [telegramLink, setTelegramLink] = useState('');
  const [telegramConnected, setTelegramConnected] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // ---------- Helper UI ----------
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 hover:border-indigo-300';
  const labelClass = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5';

  const progressClass = (current) =>
    `flex items-center justify-between mb-6 ${current <= step ? 'text-indigo-600' : 'text-gray-400'}`;

  // ---------- Form submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim() || !formData.phone.trim() || !formData.rfid_id.trim()) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${response.status}`);
      }
      const data = await response.json();
      // Backend returns { telegram_link }
      setTelegramLink(data.telegram_link);
      setStep(STEP_TELEGRAM);
      onSuccess(data);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Telegram connection flow ----------
  const handleTelegramConnect = () => {
    // Open Telegram link in a new tab/window
    window.open(telegramLink, '_blank');
    // Simulate successful connection after user returns
    // In a real app you would verify via backend endpoint
    setTelegramConnected(true);
    setStep(STEP_COMPLETE);
  };

  // ---------- UI Render ----------
  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-6">
        <div className={progressClass(0)}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white">1</div>
            <span className="ml-2">Fill Details</span>
          </div>
        </div>
        <div className={progressClass(1)}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white">2</div>
            <span className="ml-2">Connect Telegram</span>
          </div>
        </div>
        <div className={progressClass(2)}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white">3</div>
            <span className="ml-2">Registration Complete</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="p-4 mb-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800">
        Registration is not complete until Telegram is successfully connected.
      </div>

      {/* Content based on step */}
      {step === STEP_FORM && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>Full Name</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </span>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`${inputClass} pl-10`}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
              </span>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`${inputClass} pl-10`}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* RFID */}
          <div>
            <label htmlFor="rfid_id" className={labelClass}>RFID Card ID</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" /></svg>
              </span>
              <input
                id="rfid_id"
                type="text"
                name="rfid_id"
                value={formData.rfid_id}
                onChange={handleChange}
                placeholder="e.g. A3F2B1C4"
                className={`${inputClass} pl-10`}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="register-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </>
            )}
          </button>
        </form>
      )}

      {/* Telegram connection step */}
      {step === STEP_TELEGRAM && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-lg font-medium mr-2">Telegram Status:</span>
            {telegramConnected ? (
              <span className="flex items-center text-green-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 00-1.414 1.414l4.414 4.414a1 1 0 001.414 0l8.414-8.414a1 1 0 000-1.414z" clipRule="evenodd" /></svg>Connected ✓</span>
            ) : (
              <span className="text-red-600">Not Connected</span>
            )}
          </div>
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            onClick={handleTelegramConnect}
            disabled={telegramConnected}
          >
            {telegramConnected ? 'Telegram Connected' : 'Connect Telegram'}
          </button>
        </div>
      )}

      {/* Completion step */}
      {step === STEP_COMPLETE && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Registration Complete</h2>
          <p className="text-green-700">Your account is now registered and linked with Telegram.</p>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
