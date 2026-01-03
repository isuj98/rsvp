
import React, { useState } from 'react';
import { COLORS } from '../constants';
import Reveal from './Reveal';

interface LoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a server-side check with bcrypt.
    // For this demonstration, we use the specified password.
    if (username === 'admin' && password === 'JohnseanKristine2026') {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#FDFBF7] px-6">
      <Reveal animation="reveal-scale" className="w-full max-w-md bg-white p-10 md:p-16 shadow-2xl border border-stone-50 text-center">
        <h2 className="text-4xl font-script mb-8" style={{ color: COLORS.dark }}>Admin Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="text-left space-y-2">
            <label className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30">Username</label>
            <input 
              type="text" 
              required
              className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-stone-400 transition-colors bg-transparent font-serif-elegant text-lg italic"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="text-left space-y-2">
            <label className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30">Password</label>
            <input 
              type="password" 
              required
              className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-stone-400 transition-colors bg-transparent font-serif-elegant text-lg italic"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-[10px] text-red-400 uppercase tracking-widest">{error}</p>}

          <div className="space-y-4">
            <button 
              type="submit"
              className="w-full py-4 text-white uppercase tracking-[0.5em] text-[10px] font-bold shadow-lg transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: COLORS.dark }}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 uppercase tracking-[0.5em] text-[9px] font-bold opacity-40 hover:opacity-100 transition-opacity"
            >
              Return Home
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  );
};

export default Login;
