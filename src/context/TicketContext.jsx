import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_TICKETS, TECHNICIANS_DIRECTORY } from '../data/mockData';
import { useToast } from './ToastContext';

const TicketContext = createContext(null);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [technicians, setTechnicians] = useState(TECHNICIANS_DIRECTORY);
  const { showToast } = useToast();

  const getTicketById = useCallback((id) => {
    return tickets.find((t) => t.id === id);
  }, [tickets]);

  // Create new ticket
  const createTicket = (ticketData, currentUser) => {
    const ticketSeq = String(tickets.length + 149).padStart(4, '0');
    const newId = `MRS-2026-${ticketSeq}`;
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ', ' + new Date().toISOString().slice(0, 10);

    const newTicket = {
      id: newId,
      title: ticketData.title,
      category: ticketData.category,
      faculty: ticketData.faculty,
      department: ticketData.department,
      building: ticketData.building,
      floor: ticketData.floor,
      room: ticketData.room,
      priority: ticketData.priority,
      status: "Submitted",
      requester: {
        name: currentUser.name,
        role: currentUser.roleName || "Staff Member",
        email: currentUser.email,
        phone: currentUser.phone
      },
      assignedTo: null,
      submittedAt: timestamp,
      lastUpdated: timestamp,
      slaDue: ticketData.priority === 'Urgent' ? '4 hours' : ticketData.priority === 'High' ? '12 hours' : '24 hours',
      description: ticketData.description,
      attachments: ticketData.attachments || [],
      timeline: [
        {
          status: "Submitted",
          time: timestamp,
          actor: `${currentUser.name} (${currentUser.roleName || 'Staff'})`,
          note: "Maintenance request registered into University of Vavuniya MRS"
        }
      ],
      diagnosisNotes: "",
      checklist: [
        { task: "Initial site inspection and safety perimeter check", done: false },
        { task: "Verify fault conditions as reported by faculty", done: false },
        { task: "Ascertain required tools and parts from Central Stores", done: false },
        { task: "Execute corrective maintenance procedure", done: false },
        { task: "Conduct post-repair operational quality test", done: false }
      ],
      itemRequests: [],
      comments: []
    };

    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Maintenance request ${newId} submitted successfully`, 'success');
    return newTicket;
  };

  // Department Admin: Approve ticket
  const approveTicket = (ticketId, priority, remarks, adminUser) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().slice(0, 10);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Approved",
            priority: priority || t.priority,
            lastUpdated: timestamp,
            timeline: [
              ...t.timeline,
              {
                status: "Approved",
                time: timestamp,
                actor: `${adminUser.name} (HOD / Dept Admin)`,
                note: remarks || "Request verified by Department and queued for assignment"
              }
            ]
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} approved for maintenance dispatch`, 'success');
  };

  // Department Admin: Reject ticket
  const rejectTicket = (ticketId, reason, adminUser) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().slice(0, 10);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Rejected",
            rejectionReason: reason,
            lastUpdated: timestamp,
            timeline: [
              ...t.timeline,
              {
                status: "Rejected",
                time: timestamp,
                actor: `${adminUser.name} (HOD / Dept Admin)`,
                note: `Declined: ${reason}`
              }
            ]
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} marked as Rejected`, 'warning');
  };

  // Department Admin / Super Admin: Assign Technician
  const assignTechnician = (ticketId, technicianId, adminUser) => {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().slice(0, 10);

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Assigned",
            assignedTo: {
              id: tech.id,
              name: tech.name,
              trade: tech.trade,
              phone: tech.phone
            },
            lastUpdated: timestamp,
            timeline: [
              ...t.timeline,
              {
                status: "Assigned",
                time: timestamp,
                actor: `${adminUser.name} (${adminUser.roleName || 'Admin'})`,
                note: `Assigned to ${tech.name} (${tech.trade})`
              }
            ]
          };
        }
        return t;
      })
    );

    // Increment technician workload
    setTechnicians((prev) =>
      prev.map((t) => (t.id === technicianId ? { ...t, activeJobs: t.activeJobs + 1 } : t))
    );

    showToast(`Assigned ${ticketId} to ${tech.name}`, 'success');
  };

  // Technician: Update Status (e.g. Start Work / In Progress, Awaiting Parts, Inspection)
  const updateTicketStatus = (ticketId, newStatus, note, actorName) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().slice(0, 10);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            lastUpdated: timestamp,
            timeline: [
              ...t.timeline,
              {
                status: newStatus,
                time: timestamp,
                actor: actorName,
                note: note || `Status transitioned to ${newStatus}`
              }
            ]
          };
        }
        return t;
      })
    );
    showToast(`Status updated to "${newStatus}"`, 'info');
  };

  // Technician: Update Diagnosis & Checklist
  const updateDiagnosis = (ticketId, diagnosisText, technicianName) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            diagnosisNotes: diagnosisText,
            timeline: [
              ...t.timeline,
              {
                status: "Inspection",
                time: timestamp,
                actor: technicianName,
                note: "Diagnostic findings recorded"
              }
            ]
          };
        }
        return t;
      })
    );
    showToast("Diagnosis notes saved", 'success');
  };

  const toggleChecklistItem = (ticketId, index) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newChecklist = [...(t.checklist || [])];
          if (newChecklist[index]) {
            newChecklist[index] = { ...newChecklist[index], done: !newChecklist[index].done };
          }
          return { ...t, checklist: newChecklist };
        }
        return t;
      })
    );
  };

  // Technician: Request Parts
  const requestParts = (ticketId, itemRequest) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Awaiting Parts",
            itemRequests: [...(t.itemRequests || []), itemRequest]
          };
        }
        return t;
      })
    );
    showToast(`Requisition sent to Central Stores for ${itemRequest.name}`, 'info');
  };

  // Technician: Submit Work Report & mark completed
  const submitWorkReport = (ticketId, reportNotes, technicianName) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().slice(0, 10);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Repair Completed",
            lastUpdated: timestamp,
            timeline: [
              ...t.timeline,
              {
                status: "Repair Completed",
                time: timestamp,
                actor: technicianName,
                note: `Repair completed: ${reportNotes || 'All checklist items verified'}`
              }
            ]
          };
        }
        return t;
      })
    );
    showToast("Work report submitted. Ticket pending verification.", 'success');
  };

  // Staff Member: Confirm resolution
  const confirmResolution = (ticketId, staffName) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toISOString().slice(0, 10);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: "Resolved",
            lastUpdated: timestamp,
            timeline: [
              ...t.timeline,
              {
                status: "Resolved",
                time: timestamp,
                actor: `${staffName} (Requester)`,
                note: "Work confirmed and signed off by requester"
              }
            ]
          };
        }
        return t;
      })
    );
    showToast(`Ticket ${ticketId} marked as Resolved. Thank you for your feedback!`, 'success');
  };

  // Add Comment
  const addComment = (ticketId, text, author) => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today';
    const newComment = {
      id: `c-${Date.now()}`,
      author: author.name,
      role: author.roleName || author.role,
      time: timestamp,
      text: text.trim()
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            comments: [...(t.comments || []), newComment],
            lastUpdated: timestamp
          };
        }
        return t;
      })
    );
    showToast("Comment posted", 'info');
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        technicians,
        getTicketById,
        createTicket,
        approveTicket,
        rejectTicket,
        assignTechnician,
        updateTicketStatus,
        updateDiagnosis,
        toggleChecklistItem,
        requestParts,
        submitWorkReport,
        confirmResolution,
        addComment
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
