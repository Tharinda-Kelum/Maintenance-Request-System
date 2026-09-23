import React from 'react';
import { Shield, Check, X, Info } from 'lucide-react';
import { PERMISSION_MATRIX } from '../../data/adminData';

export const RolesPermissionsPage = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            Roles & Permissions Matrix
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Role-based access control (RBAC) governing capabilities across university staff, department heads, field technicians, store keepers, and administrators.
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 text-brand-blue mt-0.5" />
        <div className="leading-relaxed">
          <strong>Institutional Governance Policy:</strong> Capabilities are enforced strictly based on user roles linked to university appointments. Super Admins may adjust matrix thresholds or delegate department privileges to Faculty Deans.
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-card border border-brand-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-brand-border text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">System Capability / Operational Module</th>
                <th className="py-3.5 px-4 text-center">General Staff</th>
                <th className="py-3.5 px-4 text-center">Dept Admin (HOD)</th>
                <th className="py-3.5 px-4 text-center">Technician</th>
                <th className="py-3.5 px-4 text-center">Store Keeper</th>
                <th className="py-3.5 px-4 text-center">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/70">
              {PERMISSION_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-brand-text">
                    {row.module}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.staff ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.deptAdmin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.technician ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.storeKeeper ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.superAdmin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
