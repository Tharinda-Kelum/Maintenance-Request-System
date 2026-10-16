const API_ROOT = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
let expectedUser = '';
export const setExpectedUser = (user) => { expectedUser = user?.id || ''; };

export class ApiError extends Error {
  constructor(message, status = 0) { super(message); this.name = 'ApiError'; this.status = status; }
}

export const api = async (path, options = {}) => {
  const { body, signal, ...rest } = options;
  const multipart = body instanceof FormData;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  try {
    const response = await fetch(`${API_ROOT}${path}`, {
      ...rest, credentials: 'include', signal: controller.signal,
      headers: { ...(expectedUser && !['/auth/login', '/auth/me'].includes(path) ? { 'X-MRS-User': expectedUser } : {}), ...(!multipart && body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...rest.headers },
      body: body === undefined ? undefined : multipart ? body : JSON.stringify(body)
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.success === false) {
      if (payload?.code === 'SESSION_CHANGED') window.dispatchEvent(new Event('mrs:account-changed'));
      if (response.status === 401 && !['/auth/login', '/auth/me'].includes(path)) window.dispatchEvent(new Event('mrs:session-expired'));
      throw new ApiError(payload?.message || 'The server could not complete this action. Please try again.', response.status);
    }
    if (!payload) throw new ApiError('The API response was not valid. Check that the backend is running.', response.status);
    if (rest.method && rest.method !== 'GET' && !path.startsWith('/auth/login') && !path.startsWith('/auth/logout') && !path.startsWith('/uploads')) window.dispatchEvent(new CustomEvent('mrs:data-changed', { detail: path }));
    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted) throw error;
    throw new ApiError(error.name === 'AbortError' ? 'The server took too long to respond. Please try again.' : 'Cannot reach the maintenance server. Check the connection and try again.');
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
};

export const uploadAttachments = async (attachments = []) => {
  const saved = attachments.filter((file) => !file.url?.startsWith('data:'));
  const local = attachments.filter((file) => file.url?.startsWith('data:'));
  if (!local.length) return saved.map((file) => file.id);
  const form = new FormData();
  for (const file of local) form.append('files', await (await fetch(file.url)).blob(), file.name);
  const result = await api('/uploads', { method: 'POST', body: form });
  return [...saved.map((file) => file.id), ...result.data.map((file) => file.id)];
};
