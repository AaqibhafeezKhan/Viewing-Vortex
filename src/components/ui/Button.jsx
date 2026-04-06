import { motion } from 'framer-motion';

export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', ...props }) {
  const variants = {
    primary:   { background: 'var(--secondary-color)', color: 'white' },
    accent:    { background: 'var(--accent-color)', color: 'white' },
    danger:    { background: '#ef4444', color: 'white' },
    ghost:     { background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)' },
    outline:   { background: 'transparent', color: 'var(--secondary-color)', border: '1px solid var(--secondary-color)' },
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-full transition-all cursor-pointer border-0 ${sizes[size]} ${className}`}
      style={{ ...variants[variant], opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      whileHover={!disabled ? { scale: 1.04, translateY: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
}
