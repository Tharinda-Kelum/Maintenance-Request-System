import React from 'react';
import { WorkflowActionModal } from '../../components/ticket/WorkflowActionModal';
export const AssignTechnicianModal = ({ isOpen, ticket, onClose }) => isOpen && ticket ? <WorkflowActionModal ticket={ticket} onClose={onClose} /> : null;
