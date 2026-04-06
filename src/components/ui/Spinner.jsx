export default function Spinner({ size = 32, color = 'var(--secondary-color)' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid rgba(255,255,255,0.1)`,
        borderLeftColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
