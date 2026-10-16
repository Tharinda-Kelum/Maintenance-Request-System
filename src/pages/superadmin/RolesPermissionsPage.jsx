import React from 'react';
import { Check, Minus } from 'lucide-react';
import { ROLE_CONFIGS } from '../../auth/roles';

const capabilities = [
  ['Submit a request', ['general_user']],
  ['HOD approval', ['dept_admin']],
  ['Dean approval', ['dean']],
  ['Choose a supervisor', ['maintenance_head']],
  ['Assign an inspection technician', ['supervisor']],
  ['Submit an inspection report', ['technician']],
  ['Arrange materials and work', ['supervisor']],
  ['Complete work and report actual usage', ['technician']],
  ['Check, rate, and close completed work', ['supervisor']],
  ['Request maintenance parts', ['technician', 'supervisor']],
  ['Issue and manage stock', ['store_keeper', 'maintenance_head', 'super_admin']],
  ['Manage permitted user accounts', ['dept_admin', 'dean', 'maintenance_head', 'supervisor', 'super_admin']],
  ['Manage locations and portal settings', ['super_admin']],
  ['Read account notifications', Object.keys(ROLE_CONFIGS)]
];
export const RolesPermissionsPage = () => <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">WHO DOES WHAT</p><h1>Roles & access</h1><p>Each person sees the actions needed for their stage. The server checks permissions and request ownership.</p></div></div><p className="form-hint">HODs work within their department; Deans work within their faculty. Supervisors and technicians work on their assigned requests. Account managers can create only the roles they are permitted to manage.</p><section className="ui-panel overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr><th className="p-4 border-b border-[var(--border)] min-w-[220px]">Action</th>{Object.entries(ROLE_CONFIGS).map(([id, role]) => <th key={id} className="p-4 text-center border-b border-[var(--border)] min-w-[120px]">{role.label}</th>)}</tr></thead><tbody>{capabilities.map(([label, roles]) => <tr key={label}><th className="p-4 font-medium border-b border-[var(--border)]">{label}</th>{Object.keys(ROLE_CONFIGS).map((id) => <td key={id} className="p-4 text-center border-b border-[var(--border)]"><span className="inline-flex" aria-label={roles.includes(id) ? 'Allowed' : 'Not allowed'}>{roles.includes(id) ? <Check size={18} className="text-emerald-600" /> : <Minus size={18} className="text-slate-400" />}</span></td>)}</tr>)}</tbody></table></section></div>;
