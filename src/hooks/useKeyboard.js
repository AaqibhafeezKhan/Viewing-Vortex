import { useEffect } from 'react';
import useStore from '../store/useStore.js';

export function useKeyboard(callbacks = {}) {
  const { onPickAnother, onSave, onWatched } = callbacks;
  const {
    activeSection, setActiveSection,
    sidebarOpen, setSidebarOpen,
    searchOpen, setSearchOpen,
    statsOpen, setStatsOpen,
    vortexOpen, setVortexOpen,
    shortcutsOpen, setShortcutsOpen,
    toggleTheme,
  } = useStore();

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'arrowright':
          e.preventDefault();
          onPickAnother?.();
          break;
        case 's':
          e.preventDefault();
          onSave?.();
          break;
        case 'w':
          e.preventDefault();
          onWatched?.();
          break;
        case 't':
          toggleTheme();
          break;
        case 'f':
          setSidebarOpen(!sidebarOpen);
          break;
        case 'v':
          setVortexOpen(!vortexOpen);
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
        case 'escape':
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
  }, [
    activeSection, sidebarOpen, searchOpen, statsOpen, vortexOpen, shortcutsOpen,
    onPickAnother, onSave, onWatched, setSidebarOpen, setSearchOpen, setStatsOpen,
    setVortexOpen, setShortcutsOpen, toggleTheme, setActiveSection
  ]);
}
