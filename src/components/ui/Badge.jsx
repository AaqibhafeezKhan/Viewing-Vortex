export default function Badge({ children, color = 'blue', size = 'sm' }) {
  const colors = {
    blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
    orange: { bg: 'rgba(249,115,22,0.15)', text: '#fb923c', border: 'rgba(249,115,22,0.3)' },
    green:  { bg: 'rgba(34,197,94,0.15)',  text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
    red:    { bg: 'rgba(239,68,68,0.15)',  text: '#f87171', border: 'rgba(239,68,68,0.3)' },
    purple: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
    gray:   { bg: 'rgba(107,114,128,0.15)',text: '#9ca3af', border: 'rgba(107,114,128,0.3)' },
  };
  const c = colors[color] || colors.blue;
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2.5 py-1 text-xs', md: 'px-3 py-1.5 text-sm' };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizes[size] || sizes.sm}`}
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {children}
    </span>
  );
}
