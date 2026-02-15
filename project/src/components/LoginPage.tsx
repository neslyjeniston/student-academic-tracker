import React, { useState } from 'react';
import { LoginCredentials } from '../types';
import { GraduationCap, ArrowRight, Calendar, User, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => void;
  error?: string;
  onAdminClick: () => void; // Added to resolve TypeScript error in App.tsx
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, onAdminClick }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    rollNumber: '',
    dateOfBirth: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <div className="relative space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <GraduationCap className="h-9 w-9 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">
            Student Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium px-4">
            Access your semester reports and performance analytics
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Registration Number Input */}
            <div>
              <label htmlFor="rollNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-widest ml-1 mb-1.5">
                Registration Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                  placeholder="Enter Your Register Number"
                  value={credentials.rollNumber}
                  onChange={(e) => setCredentials({ ...credentials, rollNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Date of Birth Input */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-xs font-bold text-slate-700 uppercase tracking-widest ml-1 mb-1.5">
                Date of Birth
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  value={credentials.dateOfBirth}
                  onChange={(e) => setCredentials({ ...credentials, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full flex items-center justify-center py-4 px-4 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-900/10"
          >
            <span className="mr-2">View My Report</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Admin Access Switch */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <button 
            onClick={onAdminClick}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors duration-200"
          >
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Admin Login</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
          Student Academic Tracker
        </p>
      </div>
    </div>
  );
};