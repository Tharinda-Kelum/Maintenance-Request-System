import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, CheckCircle2, Building, Moon, Sun, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UNIVERSITY_INFO } from '../../data/mockData';
import universityLogo from '../../../University-of-Vavuniya-Logo-1024x1024.png';

export const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = await login({ username, password });
      if (onLoginSuccess) onLoginSuccess(session.roleId);
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Left Branded Panel */}
      <div className="theme-static-dark md:w-5/12 lg:w-1/2 bg-[#0B1F3A] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden border-r border-[#152B4D]">
        {/* Subtle geometric architectural pattern background */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

        {/* Top: University Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={universityLogo}
              alt="University of Vavuniya logo"
              className="w-12 h-12 object-contain flex-shrink-0"
            />
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">
                {UNIVERSITY_INFO.name}
              </h2>
            </div>
          </div>

          <div className="mt-12 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
              <Building className="w-3.5 h-3.5" />
              <span>Campus Facility & Maintenance Portal</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Maintenance Request System (MRS)
            </h1>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Centralized, role-based infrastructure management platform for reporting, verifying, inspecting, and resolving physical facility issues across all university faculties.
            </p>
          </div>
        </div>

        {/* Middle: Key Features Highlights */}
        <div className="relative z-10 my-10 space-y-3.5 border-l-2 border-blue-500/40 pl-5">
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>Digital maintenance workflow replacing manual paper chits & emails</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>Multi-level SLA tracking for Electrical, HVAC, Plumbing & Civil works</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>Integrated spare parts requisition linked to Central Stores inventory</span>
          </div>
        </div>

        {/* Bottom: Institutional Note */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-end">
          <span className="font-mono text-[11px] text-blue-300">{UNIVERSITY_INFO.systemCode}</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="relative md:w-7/12 lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{isDark ? 'Dark' : 'Light'}</span>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-text">Authorized Sign In</h2>
          <p className="text-xs text-brand-text-secondary mt-1">
            Access your university maintenance dashboard with your institutional credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2.5 text-xs text-brand-text bg-white border border-brand-border rounded-input outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-brand-text">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 text-xs text-brand-text bg-white border border-brand-border rounded-input outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-input shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In to Maintenance System'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-3 bg-[#F7F9FC] text-[11px] text-slate-400 uppercase font-semibold">
            Institutional Access
          </span>
        </div>

        {/* SSO placeholder: intentionally disabled until the backend integration is ready. */}
        <button type="button" disabled className="w-full py-2.5 px-4 bg-white text-slate-400 text-xs font-semibold rounded-input border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed">
          <Shield className="w-3.5 h-3.5 text-brand-navy" />
          <span>University SSO (available after backend connection)</span>
        </button>

        {/* Security Footer Notice */}
        <div className="mt-8 text-center text-[11px] text-slate-400">
          <p>Strictly for authorized University of Vavuniya staff and technicians.</p>
          <p className="mt-0.5">Contact Works & Maintenance Division: ext. 4211 for password assistance.</p>
        </div>
      </div>
    </div>
  );
};
