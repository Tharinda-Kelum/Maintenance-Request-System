import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Wrench, Package, Shield, ArrowRight, Check } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../../data/adminData';
import { useToast } from '../../context/ToastContext';

export const NotificationsPage = ({ onSelectTicket }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState('All');
  const { showToast } = useToast();

  const categories = ['All', 'Requests', 'Assignments', 'Approvals', 'Inventory', 'System'];

  const filtered = notifications.filter(
    (n) => activeCategory === 'All' || n.category === activeCategory
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'info');
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const categoryIcons = {
    Requests: Clock,
    Assignments: Wrench,
    Approvals: CheckCircle2,
    Inventory: Package,
    System: Shield
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131926] p-6 rounded-2xl border border-[#1F293D] shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Notification Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System activity alerts, assignment notices, approval updates, and stock requisitions.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border border-[#1F293D] bg-[#0E131E] hover:bg-white/5 text-slate-200 transition-colors self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
                  : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white hover:bg-[#182132]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-[#131926] rounded-2xl border border-[#1F293D]">
            No notifications in the "{activeCategory}" category.
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = categoryIcons[item.category] || Bell;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  item.unread
                    ? 'bg-[#131926] border-[#bbf246]/40 shadow-[0_0_16px_rgba(187,242,70,0.08)]'
                    : 'bg-[#131926] border-[#1F293D] hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.unread
                        ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_12px_rgba(187,242,70,0.3)]'
                        : 'bg-[#0E131E] text-slate-400 border border-[#1F293D]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0E131E] border border-[#1F293D] text-slate-300 font-medium">
                        {item.category}
                      </span>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#bbf246] shadow-[0_0_8px_rgba(187,242,70,0.8)]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                    <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-2">
                      <span>{item.timestamp}</span>
                      {item.ticketId && (
                        <>
                          <span>•</span>
                          <span className="text-[#a3e635] font-bold">{item.ticketId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.ticketId && onSelectTicket && (
                    <button
                      onClick={() => onSelectTicket(item.ticketId)}
                      className="px-3 py-1.5 bg-[#0E131E] border border-[#1F293D] hover:bg-white/5 rounded-full text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#a3e635]" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleRead(item.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title={item.unread ? 'Mark as read' : 'Mark as unread'}
                  >
                    <Check className={`w-4 h-4 ${item.unread ? 'text-slate-400' : 'text-[#a3e635]'}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
