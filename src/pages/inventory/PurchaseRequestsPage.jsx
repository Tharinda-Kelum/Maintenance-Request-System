import React, { useRef, useState } from 'react';
import { Check, Clock, Package, ShoppingCart, X } from 'lucide-react';
import { api } from '../../api/client';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/common/StatCard';
import { useApiResource } from '../../hooks/useApiResource';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const statusClass = {
  PENDING: 'bg-amber-500/10 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-500/10 text-rose-700 border-rose-200',
  PURCHASED: 'bg-blue-500/10 text-blue-700 border-blue-200'
};

export const PurchaseRequestsPage = () => {
  const { activeRoleId } = useAuth();
  const { showToast } = useToast();
  const requests = useApiResource('/inventory/purchase-requests', [], { poll: 15000 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [action, setAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const canReview = ['finance_head', 'super_admin'].includes(activeRoleId);
  const pendingCount = requests.data.filter((request) => request.status === 'PENDING').length;
  const approvedCount = requests.data.filter((request) => request.status === 'APPROVED').length;
  const rejectedCount = requests.data.filter((request) => request.status === 'REJECTED').length;

  const openAction = (request, nextAction) => {
    if (request.status !== 'PENDING' || !canReview) return;
    setSelectedRequest(request);
    setAction(nextAction);
    setRemarks('');
  };

  const closeAction = () => {
    if (isSubmitting) return;
    setSelectedRequest(null);
    setAction('');
    setRemarks('');
  };

  const submitAction = async (event) => {
    event.preventDefault();
    if (!selectedRequest || submittingRef.current || selectedRequest.status !== 'PENDING') return;
    const reason = remarks.trim();
    if (action === 'reject' && !reason) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      const result = await api(`/inventory/purchase-requests/${selectedRequest.id}/${endpoint}`, {
        method: 'PATCH',
        body: { remarks: reason }
      });
      requests.setData((previous) => previous.map((request) => request.id === result.data.id ? result.data : request));
      showToast(action === 'approve' ? 'Purchase request approved.' : 'Purchase request rejected.', 'success');
      setSelectedRequest(null);
      setAction('');
      setRemarks('');
      await requests.reload();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return <div className="portal-page">
    <div className="page-heading">
      <div>
        <p className="eyebrow">FINANCE REVIEW</p>
        <h1>Purchase requests</h1>
        <p>Review maintenance stock requests and record Finance decisions.</p>
      </div>
    </div>

    {requests.error && <p className="form-error" role="alert">{requests.error}<button className="text-action ml-3" onClick={requests.reload}>Retry</button></p>}

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <StatCard title="Total requests" value={requests.data.length} subtitle="All statuses" icon={ShoppingCart} />
      <StatCard title="Pending" value={pendingCount} subtitle="Awaiting review" icon={Clock} active={pendingCount > 0} />
      <StatCard title="Approved" value={approvedCount} subtitle="Approved by Finance" icon={Check} />
      <StatCard title="Rejected" value={rejectedCount} subtitle="Declined by Finance" icon={X} />
    </div>

    <section className="ui-panel">
      <div className="panel-heading"><h2>Purchase request register</h2></div>
      {requests.loading && !requests.ready ? <div className="friendly-empty" role="status">Loading purchase requests…</div>
        : requests.data.length ? <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-secondary text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">PR ID / SR</th>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Requested by</th>
                <th className="py-3 px-3">Request date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Approval information</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {requests.data.map((request) => (
                <tr key={request.id} className="align-top">
                  <td className="py-3 px-3 font-mono">
                    <strong className="block break-all">{request.id}</strong>
                    <span className="text-brand-text-secondary">{request.ticketId || 'No related SR'}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-start gap-2"><Package size={16} className="shrink-0" /><span><strong>{request.item?.name || 'Item unavailable'}</strong><small className="block text-brand-text-secondary">{request.item?.code || 'No item code'}</small></span></span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{request.quantity ?? '—'} {request.item?.unit || ''}</td>
                  <td className="py-3 px-3">{request.requestedBy?.name || 'Not provided'}{request.requestedBy?.email && <small className="block text-brand-text-secondary">{request.requestedBy.email}</small>}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{request.requestedAt || 'Not provided'}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex rounded-full border px-2 py-1 font-semibold ${statusClass[request.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>{request.status || 'Unknown'}</span>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-brand-blue">Request details</summary>
                      <p className="mt-2 whitespace-pre-wrap text-brand-text-secondary">{request.remarks || 'No remarks provided.'}</p>
                    </details>
                  </td>
                  <td className="py-3 px-3">
                    {request.approvedBy && <span className="block">By {request.approvedBy}</span>}
                    {request.approvedAt && <span className="block text-brand-text-secondary">{request.approvedAt}</span>}
                    {!request.approvedBy && request.status === 'PENDING' && <span className="text-brand-text-secondary">Awaiting decision</span>}
                    {request.receivedAt && <span className="block text-brand-text-secondary">Received {request.receivedAt}</span>}
                    {!request.approvedBy && !request.approvedAt && !request.receivedAt && request.status !== 'PENDING' && <span className="text-brand-text-secondary">Decision recorded</span>}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {canReview && request.status === 'PENDING' ? <div className="flex justify-end gap-2">
                      <button className="ui-button primary" onClick={() => openAction(request, 'approve')} aria-label={`Approve purchase request ${request.id}`}><Check size={16} /> Approve</button>
                      <button className="ui-button secondary" onClick={() => openAction(request, 'reject')} aria-label={`Reject purchase request ${request.id}`}><X size={16} /> Reject</button>
                    </div> : <span className="text-brand-text-secondary">No action available</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        : <div className="friendly-empty"><ShoppingCart size={30} /><h2>No purchase requests</h2><p>Purchase requests will appear here when the backend routes them for review.</p></div>}
    </section>

    {selectedRequest && <Modal
      isOpen
      onClose={closeAction}
      title={action === 'approve' ? 'Approve purchase request' : 'Reject purchase request'}
      subtitle={`${selectedRequest.id}${selectedRequest.ticketId ? ` · SR ${selectedRequest.ticketId}` : ''}`}
      footer={<>
        <button type="button" className="ui-button secondary" disabled={isSubmitting} onClick={closeAction}>Cancel</button>
        <button type="submit" form="purchase-review" className="ui-button primary" disabled={isSubmitting || (action === 'reject' && !remarks.trim())}>{isSubmitting ? 'Saving…' : action === 'approve' ? 'Confirm approval' : 'Confirm rejection'}</button>
      </>}
    >
      <div className="mb-4 text-sm">
        <p><strong>{selectedRequest.item?.name || 'Item unavailable'}</strong> · {selectedRequest.quantity ?? '—'} {selectedRequest.item?.unit || ''}</p>
        <p className="mt-1 text-brand-text-secondary">Requested by {selectedRequest.requestedBy?.name || 'Not provided'} · {selectedRequest.requestedAt || 'Request date not provided'}</p>
      </div>
      <form id="purchase-review" className="form-fields" onSubmit={submitAction}>
        <label>{action === 'approve' ? 'Remarks (optional)' : 'Reason for rejection *'}
          <textarea required={action === 'reject'} maxLength={1000} rows={4} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder={action === 'approve' ? 'Add an approval note if needed.' : 'Explain why this request is being rejected.'} />
        </label>
      </form>
    </Modal>}
  </div>;
};
