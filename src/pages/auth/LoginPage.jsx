import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Building, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UNIVERSITY_INFO, USER_ROLES } from '../../data/mockData';

export const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('k.sivalingam@vau.ac.lk');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState('general_user');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleQuickRoleSelect = (roleKey) => {
    const role = USER_ROLES[roleKey];
    setSelectedRole(role.id);
    setEmail(role.defaultUser.email);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7F9FC]">
      {/* Left Branded Panel */}
      <div className="md:w-5/12 lg:w-1/2 bg-[#0B1F3A] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden border-r border-[#152B4D]">
        {/* Subtle geometric architectural pattern background */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

        {/* Top: University Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              UoV
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">
                {UNIVERSITY_INFO.name}
              </h2>
              <p className="text-xs text-blue-200">
                {UNIVERSITY_INFO.subName}
              </p>
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
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
          <span>{UNIVERSITY_INFO.campus}</span>
          <span className="font-mono text-[11px] text-blue-300">{UNIVERSITY_INFO.systemCode}</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="md:w-7/12 lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-text">Authorized Sign In</h2>
          <p className="text-xs text-brand-text-secondary mt-1">
            Access your university maintenance dashboard with your institutional credentials.
          </p>
        </div>

        {/* Demo Persona Fast Selection Bar */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick 1-Click Role Login:
            </span>
            <span className="text-[10px] text-slate-400">Select any role to test</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {Object.keys(USER_ROLES).map((key) => {
              const role = USER_ROLES[key];
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleQuickRoleSelect(key)}
                  className={`text-[11px] px-2 py-1.5 rounded-lg border text-left truncate transition-all ${
                    isSelected
                      ? 'bg-brand-blue text-white border-brand-blue font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {role.label.split('/')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@vau.ac.lk"
                className="w-full pl-10 pr-4 py-2.5 text-xs text-brand-text bg-white border border-brand-border rounded-input outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-brand-text">
                Password
              </label>
              <a href="#forgot" className="text-xs text-brand-blue hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs text-brand-text bg-white border border-brand-border rounded-input outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>Remember this workstation</span>
            </label>
            <span className="text-[11px] text-slate-400">Campus SSO v2.4</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-input shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Maintenance System</span>
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

        {/* SSO Button Placeholder */}
        <button
          type="button"
          onClick={() => {
            login(selectedRole);
            if (onLoginSuccess) onLoginSuccess();
          }}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-input border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Shield className="w-3.5 h-3.5 text-brand-navy" />
          <span>Sign In with University LDAP / Google Workspace</span>
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
