import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useTheme } from '../../context/ThemeContext';

export const AppLayout = ({
  activeTab,
  onSelectTab,
  breadcrumb = [],
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

  return (
    <div
      className={`min-h-screen text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-[var(--accent-text)] ${isDark ? 'dark' : 'light'}`}
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Top Floating Pill Navigation */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewRequest={() => onSelectTab('create_request')}
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
            isCollapsed={false}
            onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
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
