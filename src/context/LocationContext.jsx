import React, { createContext, useContext } from 'react';
import { api } from '../api/client';
import { useApiResource } from '../hooks/useApiResource';

const LocationContext = createContext(null);
export const LocationProvider = ({ children }) => {
  const resource = useApiResource('/locations', []);
  const addLocation = async (details) => { const result = await api('/locations', { method: 'POST', body: details }); resource.setData(result.data); };
  return <LocationContext.Provider value={{ locations: resource.data, addLocation, loading: resource.loading, ready: resource.ready, error: resource.error, reload: resource.reload }}>{children}</LocationContext.Provider>;
};
export const useLocations = () => useContext(LocationContext);
