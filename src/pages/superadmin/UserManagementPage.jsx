import React, { useState } from 'react';
import { Plus, Search, KeyRound, Users } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLE_CONFIGS, BACKEND_ROLES } from '../../auth/roles';
import { Modal } from '../../components/common/Modal';

const createRoles = { dept_admin: ['general_user'], dean: ['general_user', 'dept_admin'], maintenance_head: ['supervisor', 'technician', 'store_keeper'], supervisor: ['technician'], super_admin: Object.keys(ROLE_CONFIGS) };
export const UserManagementPage = () => {
  const { currentUser, activeRoleId } = useAuth();
  const { showToast } = useToast();
  const users = useApiResource('/auth/users', []);
  const departments = useApiResource('/departments', []);
  const allowedRoles = createRoles[activeRoleId] || [];
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ name: '', email: '', username: '', password: '', role: allowedRoles[0] || 'general_user', departmentId: currentUser.departmentId, trade: '' });
  const eligibleDepartments = departments.data.filter((department) => !['dept_admin', 'dean'].includes(activeRoleId) || department.id === currentUser.departmentId || department.parentId === currentUser.departmentId);
  const filtered = users.data.filter((user) => `${user.name} ${user.email} ${user.roleName} ${user.department}`.toLowerCase().includes(query.trim().toLowerCase()));
  const save = async (event) => {
    event.preventDefault(); if (busy) return; setBusy(true); setError('');
    try {
      if (resetUser) { await api(`/auth/users/${resetUser.id}`, { method: 'PATCH', body: { newPassword: password } }); showToast('Password reset. Share the new password with the account holder.', 'success'); setResetUser(null); setPassword(''); }
      else { await api('/auth/users/create-staff', { method: 'POST', body: { ...draft, role: BACKEND_ROLES[draft.role] } }); showToast('Account created. The user can sign in with their email or username.', 'success'); setShowAdd(false); setDraft({ ...draft, name: '', email: '', username: '', password: '' }); }
      await users.reload();
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  };
  const toggle = async (user) => {
    if (busy) return; setBusy(true);
    try { await api(`/auth/users/${user.id}`, { method: 'PATCH', body: { isActive: user.status !== 'Active' } }); await users.reload(); showToast('Account access updated.', 'success'); }
    catch (failure) { showToast(failure.message, 'error'); }
    finally { setBusy(false); }
  };
  return <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">ACCOUNT MANAGEMENT</p><h1>User accounts</h1><p>Add authorized people and manage accounts within your responsibility.</p></div><button className="ui-button primary" onClick={() => { setShowAdd(true); setError(''); }}><Plus size={18} /> Add account</button></div><label className="search-field"><Search size={18} /><span className="sr-only">Search user accounts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, role, or department" /></label>
    {users.error && <p className="form-error" role="alert">{users.error}<button className="text-action ml-3" onClick={users.reload}>Retry</button></p>}
    <section className="ui-panel">{users.loading ? <div className="friendly-empty" role="status">Loading accounts…</div> : filtered.length ? filtered.map((user) => <article className="request-row" key={user.id}><Users size={21} className="shrink-0" /><div className="request-row-main"><h2>{user.name}</h2><p>{user.email}</p><p>{user.roleName} · {user.department}</p><p>{user.status}</p></div>{user.id !== currentUser.id && allowedRoles.includes(user.role) && <div className="button-group"><button className="ui-button secondary" onClick={() => { setResetUser(user); setPassword(''); setError(''); }} disabled={busy}><KeyRound size={17} /> Reset password</button><button className="ui-button secondary" onClick={() => toggle(user)} disabled={busy}>{user.status === 'Active' ? 'Suspend' : 'Activate'}</button></div>}</article>) : <div className="friendly-empty"><h2>No matching accounts</h2><p>Try a different search or add an account.</p></div>}</section>
    {(showAdd || resetUser) && <Modal isOpen onClose={() => { if (!busy) { setShowAdd(false); setResetUser(null); } }} title={resetUser ? `Reset password: ${resetUser.name}` : 'Add user account'} footer={<><button className="ui-button secondary" disabled={busy} onClick={() => { setShowAdd(false); setResetUser(null); }}>Cancel</button><button type="submit" form="account-form" className="ui-button primary" disabled={busy}>{busy ? 'Saving…' : resetUser ? 'Reset password' : 'Create account'}</button></>}><form id="account-form" className="form-fields" onSubmit={save}>{error && <p className="form-error" role="alert">{error}</p>}{resetUser ? <label>New password *<input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label> : <><label>Full name *<input required maxLength={160} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label>Email *<input type="email" required value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label><label>Username (optional)<input value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} /></label><label>Initial password *<input type="password" required minLength={8} autoComplete="new-password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} /></label><label>Role *<select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })}>{allowedRoles.map((role) => <option key={role} value={role}>{ROLE_CONFIGS[role].label}</option>)}</select></label><label>Department *<select required value={draft.departmentId} onChange={(event) => setDraft({ ...draft, departmentId: event.target.value })}>{eligibleDepartments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>{draft.role === 'technician' && <label>Specialist skills<input value={draft.trade} onChange={(event) => setDraft({ ...draft, trade: event.target.value })} placeholder="e.g. Electrical & HVAC" /></label>}</>}<p className="form-hint">Use at least 8 characters for passwords. Passwords are saved securely on the server.</p></form></Modal>}
  </div>;
};
