import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const WorkflowSettingsPage = () => {
  const { settings, saveSettings } = useSettings();
  const { showToast } = useToast();
  const [hours, setHours] = useState(settings.responseHours);
  const submit = async (event) => { event.preventDefault(); try { await saveSettings({ responseHours: hours }); showToast('Response targets saved. They apply to new and newly approved requests.', 'success'); } catch (error) { showToast(error.message, 'error'); } };
  return <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">MAINTENANCE WORKFLOW</p><h1>Priorities & categories</h1><p>Set response targets and view the team responsible for each type of problem.</p></div></div><form className="ui-panel request-form" onSubmit={submit}><div className="form-section-heading"><h2>Response targets</h2><p>These targets apply when a request is submitted or its priority is approved.</p></div><div className="location-fields form-fields">{['Low', 'Medium', 'High', 'Urgent'].map((priority) => <label key={priority}>{priority} priority — hours<input type="number" min="1" max="720" required value={hours[priority]} onChange={(event) => setHours({ ...hours, [priority]: event.target.value === '' ? '' : Number(event.target.value) })} /></label>)}</div><div className="form-actions"><p className="form-hint">Existing requests keep their current target until reviewed.</p><button className="ui-button primary" type="submit"><Save size={17} /> Save targets</button></div></form><section className="ui-panel"><div className="panel-heading"><h2>Category guide</h2></div>{CATEGORIES.map((category) => <div className="request-row" key={category.id}><div className="request-row-main"><h3>{category.name}</h3><p>{category.squad}</p></div><span className="muted">{category.defaultSlaHours} hour category guide</span></div>)}</section></div>;
};
