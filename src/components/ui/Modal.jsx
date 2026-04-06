import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <Motion.div
            className={`relative z-10 w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl`}
            style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {title && (
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
