import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useStore from './store/useStore.js';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import TVPage from './pages/TVPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import SearchBar from './components/search/SearchBar.jsx';
import VortexMode from './components/mood/VortexMode.jsx';
import StatsDashboard from './components/stats/StatsDashboard.jsx';
import ShortcutsModal from './components/ui/ShortcutsModal.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

export default function App() {
  const { theme, activeSection } = useStore();

  // Apply theme on mount + when it changes
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--background-color)' }}>
        <Header />

        <main className="flex-1 px-4 py-6 max-w-screen-xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeSection === 'movie' && <MoviesPage key="movie" />}
            {activeSection === 'tv'    && <TVPage    key="tv"    />}
            {activeSection === 'book'  && <BooksPage key="book"  />}
          </AnimatePresence>
        </main>

        <Footer />

        {/* Global overlays */}
        <Sidebar />
        <SearchBar />
        <VortexMode />
        <StatsDashboard />
        <ShortcutsModal />
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}
