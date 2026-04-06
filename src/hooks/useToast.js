import { useState, useEffect } from 'react';

const MAX_TOASTS = 3;

let _setToasts = null;

export function useToastManager() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _setToasts = setToasts;
    return () => { _setToasts = null; };
  }, [setToasts]);
  return toasts;
}

export function toast(message, type = 'info') {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts((prev) => {
    const next = [...prev.slice(-(MAX_TOASTS - 1)), { id, message, type }];
    return next;
  });
  setTimeout(() => {
    _setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3000);
}

export function dismissToast(id) {
  _setToasts?.((prev) => prev.filter((t) => t.id !== id));
}
