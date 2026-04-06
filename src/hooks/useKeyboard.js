import { useEffect } from 'react';
import useStore from '../store/useStore.js';

export function useKeyboard(pickAnother) {
  const {
    activeSection, setActiveSection,
    sidebarOpen, setSidebarOpen,
    setSearchOpen,
    setStatsOpen,
    setVortexOpen,
    shortcutsOpen, setShortcutsOpen,
    toggleTheme,
    addFavorite,
  } = useStore();

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;

      switch (e.key) {
        case ' ':
        case 'ArrowRight':
          e.preventDefault();
          pickAnother?.();
          break;
        case 'T':
        case 't':
          toggleTheme();
          break;
        case 'F':
        case 'f':
          setSidebarOpen(!sidebarOpen);
          break;
        case '1':
          setActiveSection('movie');
          break;
        case '2':
          setActiveSection('tv');
          break;
        case '3':
          setActiveSection('book');
          break;
        case '/':
          e.preventDefault();
          setSearchOpen(true);
          break;
        case '?':
          setShortcutsOpen(!shortcutsOpen);
          break;
        case 'Escape':
          setSidebarOpen(false);
          setSearchOpen(false);
          setStatsOpen(false);
          setVortexOpen(false);
          setShortcutsOpen(false);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeSection, sidebarOpen, shortcutsOpen, pickAnother, setSidebarOpen, setSearchOpen, setStatsOpen, setVortexOpen, setShortcutsOpen, toggleTheme, setActiveSection]);
}
