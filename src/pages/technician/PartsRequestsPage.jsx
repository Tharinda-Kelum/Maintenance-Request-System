import React, { useState } from 'react';
import { Package, ArrowRight, Search } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';

export const PartsRequestsPage = ({ onOpenWorkspace }) => {
  const { itemRequests, inventory } = useInventory();
  const { tickets } = useTickets();
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const requests = itemRequests.filter((request) => request.technician === currentUser.name);
  const tasks = tickets.filter((ticket) => ticket.assignedTo?.name === currentUser.name && ['Assigned', 'Inspection', 'In Progress', 'Awaiting Parts'].includes(ticket.status));
  return <div className="portal-page"><div className="page-heading"><div><p className="eyebrow">YOUR SPARE PARTS</p><h1>Parts requests</h1><p>Track parts from Central Stores. To request a part, open the task it belongs to.</p></div></div><section className="ui-panel"><div className="panel-heading"><h2>My parts requests</h2></div>{requests.length ? requests.map((request) => <div className="request-row" key={request.id}><Package size={22} className="shrink-0" /><div className="request-row-main"><h3>{request.itemName}</h3><p>{request.ticketId} · {request.quantity} {request.unit} · {request.status}</p></div><button className="text-action" onClick={() => onOpenWorkspace(request.ticketId)}>Open task <ArrowRight size={16} /></button></div>) : <div className="friendly-empty"><Package size={30} /><h2>No parts requested yet</h2><p>Choose an active task below to request what you need.</p></div>}</section><section className="ui-panel"><div className="panel-heading"><h2>Request parts for a task</h2></div>{tasks.map((task) => <button className="request-row" key={task.id} onClick={() => onOpenWorkspace(task.id)}><div className="request-row-main"><h3>{task.title}</h3><p>{task.id} · {task.room}</p></div><ArrowRight size={18} /></button>)}{!tasks.length && <p className="p-6">You have no active tasks requiring parts.</p>}</section><section className="ui-panel"><div className="panel-heading"><h2>Available parts</h2></div><div className="request-toolbar pt-0"><label className="search-field"><Search size={18} /><span className="sr-only">Search parts</span><input placeholder="Search part name or code" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>{inventory.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(query.trim().toLowerCase())).map((item) => <div className="request-row" key={item.id}><div className="request-row-main"><h3>{item.name}</h3><p>{item.code} · {item.stock} {item.unit} available</p></div><span className="muted">{item.status}</span></div>)}</section></div>;
};
