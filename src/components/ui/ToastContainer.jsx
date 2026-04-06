import { AnimatePresence, motion as Motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastManager, dismissToast } from '../../hooks/useToast.js';

const icons = { success: <CheckCircle size={16} />, error: <AlertCircle size={16} />, info: <Info size={16} /> };
const colors = {
  success: { border: '#22c55e', icon: '#4ade80' },
  error:   { border: '#ef4444', icon: '#f87171' },
  info:    { border: 'var(--secondary-color)', icon: 'var(--secondary-color)' },
};

export default function ToastContainer() {
  const toasts = useToastManager();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const c = colors[t.type] || colors.info;
          return (
            <Motion.div
              key={t.id}
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 120, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl pointer-events-auto min-w-[260px] max-w-[360px]"
              style={{ background: 'var(--card-bg)', border: `1px solid ${c.border}`, color: 'var(--text-primary)' }}
            >
              <span style={{ color: c.icon, flexShrink: 0 }}>{icons[t.type] || icons.info}</span>
              <span className="flex-1 text-sm font-medium">{t.message}</span>
              <button
                onClick={() => dismissToast(t.id)}
                className="p-0.5 rounded-full opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </Motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
