import { useEffect, useRef } from 'react';

export const useDialogFocus = (isOpen, onClose) => {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const getTargets = () => [...(ref.current?.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || [])].filter((target) => target.getClientRects().length);
    getTargets()[0]?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const targets = getTargets();
      const first = targets[0];
      const last = targets.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKeyDown); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [isOpen]);
  return ref;
};
