import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const useApiResource = (path, initialValue, { enabled = true, poll = 0 } = {}) => {
  const { currentUser } = useAuth();
  const owner = currentUser?.id || '';
  const active = enabled && Boolean(owner);
  const [initial] = useState(() => initialValue);
  const generation = useRef(0);
  const [state, setState] = useState({ owner: '', data: initialValue, loading: false, ready: false, error: '' });
  const reload = useCallback(async () => {
    if (!active) return;
    const version = ++generation.current;
    setState((previous) => ({ ...previous, owner, ready: previous.owner === owner && previous.ready, data: previous.owner === owner ? previous.data : initial, loading: previous.owner !== owner, error: '' }));
    try {
      const result = await api(path);
      if (version === generation.current) setState({ owner, data: result.data, loading: false, ready: true, error: '' });
      return result.data;
    } catch (error) {
      if (version === generation.current) setState((previous) => ({ ...previous, owner, loading: false, error: error.message }));
      return undefined;
    }
  }, [active, owner, path, initial]);

  useEffect(() => {
    if (!active) { generation.current += 1; return undefined; }
    const initialTimer = setTimeout(reload, 0);
    let debounce;
    const changed = () => { clearTimeout(debounce); debounce = setTimeout(reload, 100); };
    const visible = () => { if (!document.hidden) changed(); };
    window.addEventListener('mrs:data-changed', changed);
    window.addEventListener('focus', changed);
    window.addEventListener('pageshow', changed);
    document.addEventListener('visibilitychange', visible);
    const timer = poll ? setInterval(() => { if (!document.hidden) reload(); }, poll) : null;
    return () => { generation.current += 1; clearTimeout(initialTimer); clearTimeout(debounce); clearInterval(timer); window.removeEventListener('mrs:data-changed', changed); window.removeEventListener('focus', changed); window.removeEventListener('pageshow', changed); document.removeEventListener('visibilitychange', visible); };
  }, [active, reload, poll]);

  const setData = useCallback((value) => {
    generation.current += 1;
    setState((previous) => ({ owner, loading: false, ready: true, error: '', data: typeof value === 'function' ? value(previous.owner === owner ? previous.data : initial) : value }));
  }, [owner, initial]);
  return {
    data: active && state.owner === owner ? state.data : initial,
    loading: active && (state.owner !== owner || state.loading),
    ready: !active || state.owner === owner && state.ready,
    error: active && state.owner === owner ? state.error : '',
    reload, setData
  };
};
