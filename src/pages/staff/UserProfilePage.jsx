import React, { useState } from 'react';
import { Mail, Phone, Building2, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const UserProfilePage = () => {
  const { currentUser, activeRoleConfig, changePassword, logout } = useAuth();
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (newPassword !== confirmPassword) { setError('The new passwords do not match. Please enter them again.'); return; }
    try { await changePassword(currentPassword, newPassword); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); showToast('Password changed successfully.', 'success'); }
    catch (failure) { setError(failure.message); }
  };
  return <div className="portal-page form-page"><div className="page-heading"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>My profile</h1><p>View your account details and manage your password.</p></div><button className="ui-button secondary" onClick={logout}><LogOut size={17} /> Sign out</button></div><section className="ui-panel help-panel"><div className="profile-summary"><span className="profile-avatar">{currentUser.avatar}</span><div><h2>{currentUser.name}</h2><p>{currentUser.roleName}</p><p>{activeRoleConfig.label}</p></div></div><dl className="profile-details">{[[Mail, 'Email', currentUser.email], [Phone, 'Phone', currentUser.phone], [Building2, 'Department', currentUser.department], [Building2, 'Faculty / division', currentUser.faculty]].map(([Icon, label, value]) => <div key={label}><dt><Icon size={17} />{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl></section><section className="ui-panel request-form"><div className="form-section-heading"><h2><KeyRound size={21} className="inline mr-2" /> Change password</h2><p>Use your current password to choose a new one. The change is saved to your account.</p></div><form className="form-fields" onSubmit={submit}>{error && <p className="form-error" role="alert">{error}</p>}<label>Current password<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><label>New password<input type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><span className="form-hint">Use at least 8 characters.</span></label><label>Confirm new password<input type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label><div className="button-group"><button className="ui-button primary" type="submit">Change password</button></div></form></section></div>;
};
