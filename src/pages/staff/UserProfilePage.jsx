import React from 'react';
import { User, Mail, Phone, Building, Shield, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const UserProfilePage = () => {
  const { currentUser, activeRoleConfig } = useAuth();
  const { showToast } = useToast();

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    showToast('Credentials updated successfully', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header Profile Card */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-[#bbf246] text-[#020617] font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(187,242,70,0.35)] flex-shrink-0">
          {currentUser.avatar || 'U'}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
              <p className="text-xs text-[#a3e635] font-semibold mt-0.5">{currentUser.roleName || currentUser.role}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-center sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Active Account</span>
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-[#1F293D] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-mono text-[11px] truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-mono text-[11px]">{currentUser.phone || '+94 24 222 3311'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{currentUser.faculty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Privileges */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white">Active Role & Operational Scope</h3>
        <p className="text-slate-300 leading-relaxed">
          {activeRoleConfig.description}
        </p>
        <div className="p-3.5 rounded-xl bg-[#0E131E] border border-[#1F293D] flex items-center justify-between">
          <span className="text-slate-400">Department Unit:</span>
          <span className="font-bold text-white">{currentUser.department}</span>
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-white">Institutional Security Credentials</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-white mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full p-2.5 bg-[#0E131E] text-white border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635] text-xs transition-colors"
              />
            </div>
            <div>
              <label className="block font-semibold text-white mb-1.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full p-2.5 bg-[#0E131E] text-white border border-[#1F293D] rounded-xl outline-none focus:border-[#a3e635] text-xs transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-all transform hover:scale-[1.02]"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
