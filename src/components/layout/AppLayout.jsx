import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const AppLayout = ({
  activeTab,
  onSelectTab,
  breadcrumb = [],
  onSelectTicket,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-lime-accent selection:text-slate-950">
      {/* Top Floating Pill Navigation (Matching Reference Screenshot) */}
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
      <GlobalSearchModal
        isOpen={isSearchOpen}
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
    </div>
  );
};
