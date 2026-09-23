import React from 'react';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4 border border-blue-200">
        <span className="font-mono text-xl font-extrabold">404</span>
      </div>
      <h1 className="text-2xl font-bold text-brand-text">Resource Not Found</h1>
      <p className="text-xs text-brand-text-secondary max-w-sm mt-1.5 mb-6">
        The maintenance ticket, facility block, or page you are trying to access does not exist or has been relocated.
      </p>
      <button
        onClick={onGoHome}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};

export const UnauthorizedPage = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-brand-text">Access Restricted (403)</h1>
      <p className="text-xs text-brand-text-secondary max-w-sm mt-1.5 mb-6">
        You do not have the required role-based permissions to perform operations in this module. Use the Role Switcher in the top navigation to view authorized modules.
      </p>
      <button
        onClick={onGoHome}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Permitted Portal</span>
      </button>
    </div>
  );
};
