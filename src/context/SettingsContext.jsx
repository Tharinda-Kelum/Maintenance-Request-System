import React, { createContext, useContext, useState } from 'react';
import { UNIVERSITY_INFO } from '../data/mockData';

const SettingsContext = createContext(null);
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({ systemName: 'Campus maintenance', campusHours: UNIVERSITY_INFO.hours, supportEmail: 'maintenance@vau.ac.lk', supportExtension: '4211', responseHours: { Low: 72, Medium: 24, High: 12, Urgent: 4 } });
  const saveSettings = (changes) => setSettings((previous) => ({ ...previous, ...changes }));
  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>;
};
export const useSettings = () => useContext(SettingsContext);
