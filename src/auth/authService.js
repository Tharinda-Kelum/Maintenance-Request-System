import { api } from '../api/client';

export const authenticate = async (credentials) => {
  const result = await api('/auth/login', { method: 'POST', body: credentials });
  return { user: result.user, roleId: result.user.role };
};
export const restoreSession = async () => {
  try { return (await api('/auth/me')).user; }
  catch (error) { if (error.status === 401) return null; throw error; }
};
