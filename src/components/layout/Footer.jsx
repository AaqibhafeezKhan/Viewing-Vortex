export default function Footer() {
  return (
    <footer
      className="mt-auto py-6 px-4 text-center text-sm border-t"
      style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          🌀 <strong style={{ color: 'var(--text-primary)' }}>Viewing Vortex</strong> — Powered by{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
            className="hover:underline" style={{ color: 'var(--secondary-color)' }}>TMDB</a>
          {' '}& <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer"
            className="hover:underline" style={{ color: 'var(--secondary-color)' }}>Open Library</a>
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Looking for the classic experience?{' '}
          <a
            href="/legacy/index.html"
            className="font-medium hover:underline"
            style={{ color: 'var(--accent-color)' }}
          >
            → Legacy App
          </a>
        </p>
      </div>
    </footer>
  );
}
