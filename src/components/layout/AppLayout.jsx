import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useTheme } from '../../context/ThemeContext';

export const AppLayout = ({
  activeTab,
  onSelectTab,
  onSelectTicket,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen((isOpen) => !isOpen);
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [activeTab]);

  return (
    <div
      className={`min-h-screen text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-[var(--accent-text)] ${isDark ? 'dark' : 'light'}`}
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <a className="skip-link" href="#main-content">Skip to content</a>
      <TopNav
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Container */}
      <div className="flex-1 flex min-w-0">
        {/* Optional Collapsible Drawer Sidebar */}
        {isSidebarOpen && (
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              onSelectTab(tab);
              setIsSidebarOpen(false);
            }}
            onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* Dynamic Main Workspace Content */}
        <main id="main-content" tabIndex={-1} className="app-main flex-1 p-4 sm:p-6 md:p-8 max-w-[1440px] w-full mx-auto min-w-0">
          {children}
        </main>
      </div>

      {/* Global Search Dialog */}
      {isSearchOpen && (
        <GlobalSearchModal
          isOpen
          onClose={() => setIsSearchOpen(false)}
          onSelectTicket={(ticketId) => {
            setIsSearchOpen(false);
            onSelectTicket(ticketId);
          }}
          onNavigate={(tab) => {
            setIsSearchOpen(false);
            onSelectTab(tab);
          }}
        />
      )}
    </div>
  );
};
