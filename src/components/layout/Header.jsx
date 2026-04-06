import { motion as Motion } from 'framer-motion';
import { Film, Tv, BookOpen, Search, Heart, Moon, Sun, BarChart2, Zap, Keyboard } from 'lucide-react';
import useStore from '../../store/useStore.js';

const NAV_ITEMS = [
  { key: 'movie', label: 'Movies', icon: Film, shortcut: '1' },
  { key: 'tv',    label: 'TV Shows', icon: Tv,   shortcut: '2' },
  { key: 'book',  label: 'Books',    icon: BookOpen, shortcut: '3' },
];

export default function Header() {
  const {
    activeSection, setActiveSection,
    theme, toggleTheme,
    sidebarOpen, setSidebarOpen,
    setSearchOpen, setStatsOpen, setVortexOpen, setShortcutsOpen,
    favorites,
  } = useStore();

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{ background: 'var(--primary-color)', boxShadow: 'var(--shadow-md)' }}
    >
      <nav className="flex items-center justify-between gap-4 px-4 py-3 max-w-screen-xl mx-auto">
        <Motion.div
          className="flex items-center gap-2 cursor-pointer select-none"
          whileHover={{ scale: 1.03 }}
          onClick={() => setVortexOpen(true)}
          title="Open Vortex Mode"
        >
          <Motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="text-2xl"
            aria-hidden
          >
            🌀
          </Motion.div>
          <span className="text-xl font-bold" style={{ color: 'var(--text-light)' }}>
            Viewing<span className="font-light opacity-80">Vortex</span>
          </span>
        </Motion.div>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Motion.button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeSection === item.key ? 'var(--secondary-color)' : 'rgba(255,255,255,0.1)',
                color: 'var(--text-light)',
              }}
              whileHover={{ background: activeSection === item.key ? undefined : 'rgba(255,255,255,0.2)', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`${item.label} (shortcut: ${item.shortcut})`}
              aria-pressed={activeSection === item.key}
            >
              <item.icon size={15} />
              <span className="hidden sm:inline">{item.label}</span>
              {activeSection === item.key && (
                <Motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--secondary-color)', zIndex: -1 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </Motion.button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <IconBtn onClick={() => setSearchOpen(true)} label="Search (/)"><Search size={17} /></IconBtn>
          <IconBtn onClick={() => setStatsOpen(true)} label="Stats Dashboard"><BarChart2 size={17} /></IconBtn>
          <IconBtn onClick={() => setVortexOpen(true)} label="Vortex Mode"><Zap size={17} /></IconBtn>

          <div className="relative">
            <IconBtn onClick={() => setSidebarOpen(!sidebarOpen)} label="My Collection (F)">
              <Heart size={17} />
            </IconBtn>
            {favorites.length > 0 && (
              <Motion.span
                key={favorites.length}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full"
                style={{ background: 'var(--accent-color)', color: 'white' }}
              >
                {favorites.length > 9 ? '9+' : favorites.length}
              </Motion.span>
            )}
          </div>

          <IconBtn onClick={toggleTheme} label="Toggle theme (T)">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </IconBtn>
          <IconBtn onClick={() => setShortcutsOpen(true)} label="Keyboard shortcuts (?)">
            <Keyboard size={17} />
          </IconBtn>
        </div>
      </nav>
    </header>
  );
}

function IconBtn({ children, onClick, label }) {
  return (
    <Motion.button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-9 h-9 rounded-full"
      style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-light)' }}
      whileHover={{ background: 'rgba(255,255,255,0.22)', scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
    >
      {children}
    </Motion.button>
  );
}
