import Modal from '../ui/Modal.jsx';
import useStore from '../../store/useStore.js';

const SHORTCUTS = [
  { key: 'Space / →', action: 'Pick Another' },
  { key: 'S', action: 'Save to Favorites' },
  { key: 'W', action: 'Mark as Watched' },
  { key: 'T', action: 'Toggle Theme' },
  { key: 'F', action: 'Toggle Favorites Sidebar' },
  { key: '1', action: 'Switch to Movies' },
  { key: '2', action: 'Switch to TV Shows' },
  { key: '3', action: 'Switch to Books' },
  { key: '/', action: 'Open Search' },
  { key: '?', action: 'Toggle This Panel' },
  { key: 'Esc', action: 'Close Any Open Panel' },
];

export default function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useStore();

  return (
    <Modal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} title="⌨️ Keyboard Shortcuts">
      <div className="space-y-2">
        {SHORTCUTS.map(({ key, action }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{action}</span>
            <kbd className="px-2 py-1 rounded text-xs font-mono font-bold"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {key}
            </kbd>
          </div>
        ))}
        <p className="text-xs pt-2" style={{ color: 'var(--text-secondary)' }}>Shortcuts are disabled when typing in a text field.</p>
      </div>
    </Modal>
  );
}
