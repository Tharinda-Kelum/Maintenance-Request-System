import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const SystemSettingsPage = () => {
  const { settings, saveSettings } = useSettings();
  const { showToast } = useToast();
  const [draft, setDraft] = useState(settings);
  const submit = (event) => { event.preventDefault(); saveSettings(draft); showToast('Portal settings saved for this session.', 'success'); };
  return <div className="portal-page form-page"><div className="page-heading"><div><p className="eyebrow">PORTAL PREFERENCES</p><h1>System settings</h1><p>Set the portal name and the contact information shown to users.</p></div></div><form className="ui-panel request-form form-fields" onSubmit={submit}>{[['systemName', 'Portal name', 'text'], ['supportEmail', 'Maintenance support email', 'email'], ['supportExtension', 'Maintenance phone extension', 'text'], ['campusHours', 'Service hours', 'text']].map(([key, label, type]) => <label key={key}>{label} *<input type={type} required value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}<p className="form-hint">These settings apply to this demo session. Email, SMS delivery, and database backups require a connected server.</p><div className="button-group"><button type="submit" className="ui-button primary"><Save size={18} /> Save changes</button></div></form></div>;
};
