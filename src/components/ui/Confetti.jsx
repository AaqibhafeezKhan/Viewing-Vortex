import { useEffect, useRef } from 'react';

const COLORS = ['#f97316','#3b82f6','#22c55e','#a855f7','#ec4899','#eab308','#06b6d4','#ef4444'];

export default function Confetti({ active, onDone }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const particles = [];

    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.cssText = `
        left: ${20 + Math.random() * 60}%;
        bottom: 0;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        animation-delay: ${Math.random() * 0.3}s;
        animation-duration: ${0.6 + Math.random() * 0.6}s;
        transform: translateX(${(Math.random() - 0.5) * 60}px);
      `;
      container.appendChild(el);
      particles.push(el);
    }

    const timer = setTimeout(() => {
      particles.forEach((p) => p.remove());
      onDone?.();
    }, 1200);

    return () => {
      clearTimeout(timer);
      particles.forEach((p) => p.remove());
    };
  }, [active, onDone]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 50 }}
    />
  );
}
