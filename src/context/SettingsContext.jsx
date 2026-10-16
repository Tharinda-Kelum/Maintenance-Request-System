import React, { createContext, useContext } from 'react';
import { api } from '../api/client';
import { useApiResource } from '../hooks/useApiResource';

const SettingsContext = createContext(null);
const defaults = { systemName: 'Campus maintenance', campusHours: '', supportEmail: '', supportExtension: '', responseHours: { Low: 72, Medium: 24, High: 12, Urgent: 4 } };
export const SettingsProvider = ({ children }) => {
  const resource = useApiResource('/settings', defaults);
  const saveSettings = async (changes) => { const result = await api('/settings', { method: 'PUT', body: changes }); resource.setData(result.data); };
  return <SettingsContext.Provider value={{ settings: resource.data, saveSettings, loading: resource.loading, ready: resource.ready, error: resource.error, reload: resource.reload }}>{children}</SettingsContext.Provider>;
};
export const useSettings = () => useContext(SettingsContext);
