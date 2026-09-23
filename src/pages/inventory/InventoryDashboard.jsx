import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingDown,
  Search,
  ShoppingCart,
  History,
  Check,
  X
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';

export const InventoryDashboard = () => {
  const {
    inventory,
    itemRequests,
    transactions,
    approveAndIssueItem,
    rejectItemRequest,
    raisePurchaseRequest,
    adjustStock
  } = useInventory();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'requests' | 'transactions'
  const [searchQuery, setSearchQuery] = useState('');
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedPOItem, setSelectedPOItem] = useState(null);
  const [poQuantity, setPoQuantity] = useState(10);

  // Calculations
  const totalItems = inventory.length;
  const inStockCount = inventory.filter((i) => i.status === 'In Stock').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'Out of Stock').length;
  const pendingRequestsCount = itemRequests.filter((r) => r.status === 'Pending').length;

  const filteredInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPO = (item) => {
    setSelectedPOItem(item);
    setShowPOModal(true);
  };

  const handleSubmitPO = (e) => {
    e.preventDefault();
    if (!selectedPOItem) return;
    raisePurchaseRequest(selectedPOItem.code, poQuantity);
    setShowPOModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a3e635]">
              Central Maintenance Stores • Inventory Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Spare Parts & Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintain critical spare parts, review technician requisitions, issue stock, and manage reorder levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenPO(inventory[3] || inventory[0])}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#020617] bg-[#bbf246] hover:bg-[#a3e635] rounded-full shadow-[0_0_16px_rgba(187,242,70,0.4)] transition-colors"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            <span>Raise Purchase Requisition</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Catalog Items"
          value={totalItems}
          subtitle="SKU lines"
          icon={Package}
        />
        <StatCard
          title="In Stock"
          value={inStockCount}
          subtitle="Optimal level"
          icon={CheckCircle2}
        />
        <StatCard
          title="Low Stock"
          value={lowStockCount}
          subtitle="Below reorder point"
          icon={TrendingDown}
          active={lowStockCount > 0}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          subtitle="Immediate PO needed"
          icon={AlertTriangle}
          active={outOfStockCount > 0}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequestsCount}
          subtitle="Awaiting issue"
          icon={Clock}
          active={pendingRequestsCount > 0}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
            activeTab === 'items'
              ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
              : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white hover:bg-[#182132]'
          }`}
        >
          Stock Catalog ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
              : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white hover:bg-[#182132]'
          }`}
        >
          <span>Technician Parts Requests</span>
          {pendingRequestsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'requests' ? 'bg-[#020617] text-[#bbf246]' : 'bg-[#bbf246] text-[#020617]'
            }`}>
              {pendingRequestsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
            activeTab === 'transactions'
              ? 'bg-[#bbf246] text-[#020617] shadow-[0_0_16px_rgba(187,242,70,0.5)]'
              : 'bg-[#131926] text-slate-300 border border-[#1F293D] hover:text-white hover:bg-[#182132]'
          }`}
        >
          Stock Issuance History
        </button>
      </div>

      {/* VIEW 1: Stock Items Catalog Table */}
      {activeTab === 'items' && (
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock code, name, category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs text-white bg-[#0E131E] border border-[#1F293D] rounded-full outline-none focus:border-[#a3e635]"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono font-medium">
              Showing {filteredInventory.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Item Code</th>
                  <th className="py-3 px-4">Description & Specs</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stores Location</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Reorder Point</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]/70">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#a3e635] whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-[11px] text-slate-400">Unit Cost: {item.unitCost}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-white text-sm">{item.stock}</span>{' '}
                      <span className="text-slate-400 text-[11px]">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400">
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => adjustStock(item.id, 5, 'Quick Restock')}
                        className="px-2.5 py-1 text-[11px] font-semibold border border-[#1F293D] hover:bg-white/10 rounded-full text-slate-300"
                        title="Add 5 units"
                      >
                        + Restock
                      </button>
                      <button
                        onClick={() => handleOpenPO(item)}
                        className="px-3 py-1 text-[11px] font-bold text-[#020617] bg-[#bbf246] hover:bg-[#a3e635] rounded-full shadow-sm"
                        title="Raise Purchase Order"
                      >
                        Raise PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Technician Parts Requests Queue */}
      {activeTab === 'requests' && (
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Field Technician Requisitions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review parts requested by technicians for active campus maintenance tickets.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Req ID</th>
                  <th className="py-3.5 px-4">Ticket Ref</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Requested Item</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Issuance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]/70">
                {itemRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#a3e635] whitespace-nowrap">
                      {req.ticketId}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-white">{req.technician}</span>
                      <span className="text-[10px] text-slate-400 block">{req.technicianTrade}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                      <div className="font-semibold">{req.itemName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{req.itemCode}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-white">
                      {req.quantity} {req.unit}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          req.urgency === 'Urgent'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          req.status === 'Issued'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'Pending'
                            ? 'bg-[#bbf246]/15 text-[#a3e635] border border-[#a3e635]/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => approveAndIssueItem(req.id, currentUser.name)}
                            className="px-3.5 py-1.5 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] font-extrabold rounded-full transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Approve & Issue</span>
                          </button>
                          <button
                            onClick={() => rejectItemRequest(req.id, 'Insufficient stock')}
                            className="px-2.5 py-1.5 border border-[#1F293D] hover:bg-white/10 text-slate-400 rounded-full transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Transactions Log */}
      {activeTab === 'transactions' && (
        <div className="bg-[#131926] rounded-2xl border border-[#1F293D] shadow-card overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Stores Dispatch & Transaction Audit Trail</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete chronological record of all spare parts issued to technicians.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E131E] border-b border-[#1F293D] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Txn ID</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Item & Code</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Issued To</th>
                  <th className="py-3.5 px-4">Ticket / PO Ref</th>
                  <th className="py-3.5 px-4">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]/70">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{tx.id}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{tx.timestamp}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold text-[11px]">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      <div>{tx.itemName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.itemCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{tx.quantity}</td>
                    <td className="py-3.5 px-4 text-slate-300">{tx.issuedTo}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#a3e635]">{tx.ticketRef}</td>
                    <td className="py-3.5 px-4 text-slate-400">{tx.authorizedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Purchase Request Modal */}
      {showPOModal && selectedPOItem && (
        <Modal
          isOpen={showPOModal}
          onClose={() => setShowPOModal(false)}
          title="Raise Purchase Requisition"
          subtitle={`Item: ${selectedPOItem.name} (${selectedPOItem.code})`}
          footer={
            <>
              <button
                onClick={() => setShowPOModal(false)}
                className="px-4 py-2 border border-[#1F293D] text-xs font-semibold text-slate-300 rounded-full hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPO}
                className="px-5 py-2 bg-[#bbf246] hover:bg-[#a3e635] text-[#020617] text-xs font-bold rounded-full shadow-sm"
              >
                Generate PO to Bursar
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmitPO} className="space-y-4 text-xs">
            <div className="p-3 bg-[#0E131E] border border-[#1F293D] rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Stock:</span>
                <span className="font-bold text-white">{selectedPOItem.stock} {selectedPOItem.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reorder Threshold:</span>
                <span className="font-mono text-[#a3e635] font-bold">{selectedPOItem.reorderLevel} {selectedPOItem.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Unit Cost:</span>
                <span className="font-mono text-slate-300">{selectedPOItem.unitCost}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">
                Replenishment Quantity
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={poQuantity}
                onChange={(e) => setPoQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none text-white focus:border-[#a3e635]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">
                Purchase Urgency
              </label>
              <select className="w-full p-2.5 bg-[#0E131E] border border-[#1F293D] rounded-xl outline-none text-white focus:border-[#a3e635]">
                <option className="bg-[#0E131E] text-white">Urgent - Facility Disruption</option>
                <option className="bg-[#0E131E] text-white">High - Approaching Zero Stock</option>
                <option className="bg-[#0E131E] text-white">Routine Semester Restock</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
