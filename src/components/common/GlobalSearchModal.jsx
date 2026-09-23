import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Wrench, Package, MapPin, X, ArrowRight } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useInventory } from '../../context/InventoryContext';
import { TECHNICIANS_DIRECTORY } from '../../data/mockData';

export const GlobalSearchModal = ({ isOpen, onClose, onSelectTicket, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { tickets } = useTickets();
  const { inventory } = useInventory();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return { tickets: [], inventory: [], technicians: [] };
    const q = query.toLowerCase();

    const matchedTickets = tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.room.toLowerCase().includes(q) ||
        t.requester.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedInventory = inventory.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedTechs = TECHNICIANS_DIRECTORY.filter(
      (tech) =>
        tech.name.toLowerCase().includes(q) ||
        tech.trade.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      tickets: matchedTickets,
      inventory: matchedInventory,
      technicians: matchedTechs
    };
  }, [query, tickets, inventory]);

  if (!isOpen) return null;

  const totalMatches =
    results.tickets.length + results.inventory.length + results.technicians.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#131926] rounded-2xl shadow-modal border border-[#1F293D] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-[#1F293D] bg-[#0E131E]">
          <Search className="w-5 h-5 text-lime-bright mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets (e.g. MRS-2026-0148), parts, technicians, rooms..."
            className="w-full py-4 text-sm bg-transparent outline-none text-white placeholder:text-slate-500 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-[#1F293D] rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="p-6 text-center text-xs text-slate-400">
              <p className="font-semibold text-white mb-1">Quick Search</p>
              <p>Type an ID like <span className="font-mono text-lime-bright">MRS-2026-0148</span>, or location like <span className="text-slate-300">Room 204</span>.</p>
            </div>
          ) : totalMatches === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {results.tickets.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                    Maintenance Tickets
                  </div>
                  <div className="space-y-1">
                    {results.tickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectTicket(t.id);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-[#1F293D]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#182132] text-lime-bright flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-lime-bright">
                                {t.id}
                              </span>
                              <span className="text-xs text-white font-medium group-hover:text-lime-bright">
                                {t.title}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {t.room} • {t.category} • {t.status}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-lime-bright" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.inventory.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                    Stores Catalog
                  </div>
                  <div className="space-y-1">
                    {results.inventory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate && onNavigate('inventory_items');
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-[#1F293D]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#182132] text-emerald-400 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-medium text-slate-300">
                                {item.code}
                              </span>
                              <span className="text-xs text-white font-medium">
                                {item.name}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Available: <strong className="text-white">{item.stock} {item.unit}</strong>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#0E131E] border-t border-[#1F293D] flex items-center justify-between text-[11px] text-slate-400">
          <span>Search University of Vavuniya facilities & work orders</span>
          <span className="font-mono text-lime-bright">Ctrl+K</span>
        </div>
      </div>
    </div>
  );
};
