import { useState, useEffect } from 'react';
import { PublicPage } from './components/PublicPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

type Page = 'public' | 'admin-login' | 'admin-panel';

export function App() {
  const [page, setPage] = useState<Page>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretTapCount, setSecretTapCount] = useState(0);

  // Check URL hash for #admin on load
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setPage(isAuthenticated ? 'admin-panel' : 'admin-login');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [isAuthenticated]);

  // Keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAuthenticated) {
          setPage('admin-panel');
        } else {
          setPage('admin-login');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  // Secret tap: 5 taps in bottom-right corner
  useEffect(() => {
    if (secretTapCount >= 5) {
      setPage(isAuthenticated ? 'admin-panel' : 'admin-login');
      setSecretTapCount(0);
    }
    const timer = setTimeout(() => setSecretTapCount(0), 2000);
    return () => clearTimeout(timer);
  }, [secretTapCount, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setPage('admin-panel');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPage('public');
    // Clear the #admin hash
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleBackToPublic = () => {
    setPage('public');
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="relative">
      {page === 'public' && (
        <div>
          <PublicPage />
          {/* Secret admin trigger — invisible tap zone in bottom-right */}
          <button
            onClick={() => setSecretTapCount((c) => c + 1)}
            className="fixed bottom-4 right-4 w-12 h-12 opacity-0 cursor-default z-50"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}
      {page === 'admin-login' && (
        <AdminLogin onLogin={handleLogin} onBack={handleBackToPublic} />
      )}
      {page === 'admin-panel' && isAuthenticated && (
        <AdminPanel onLogout={handleLogout} onBack={handleBackToPublic} />
      )}
    </div>
  );
}
