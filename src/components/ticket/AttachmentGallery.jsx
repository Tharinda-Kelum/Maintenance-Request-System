import React, { useState } from 'react';
import { Image, FileText, Download, Eye, X } from 'lucide-react';

export const AttachmentGallery = ({ attachments = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!attachments || attachments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-brand-border p-5 text-center text-xs text-slate-400">
        No photographic or document evidence attached to this ticket.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5 shadow-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary mb-3">
        Attached Evidence ({attachments.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded bg-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Image className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-brand-text truncate">{att.name}</p>
                <p className="text-[10px] text-slate-400">{att.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <button
                onClick={() => setSelectedImage(att)}
                className="p-1 text-slate-500 hover:text-brand-blue hover:bg-white rounded transition-colors"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b flex items-center justify-between bg-slate-50">
              <div className="text-xs font-semibold text-brand-text truncate">
                {selectedImage.name} ({selectedImage.size})
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center bg-slate-900 text-white min-h-[300px]">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-blue-400 border border-slate-700">
                <Image className="w-10 h-10" />
              </div>
              <p className="text-sm font-medium">{selectedImage.name}</p>
              <p className="text-xs text-slate-400 mt-1">Simulated high-resolution photo evidence capture</p>
            </div>
            <div className="px-4 py-2.5 bg-slate-50 border-t flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 rounded text-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SLAIndicator = ({ priority, slaDue, status }) => {
  const isComplete = status === 'Resolved' || status === 'Completed' || status === 'Rejected';

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono">
      <span className="text-slate-400">Target SLA:</span>
      <span
        className={`px-2 py-0.5 rounded font-medium ${
          isComplete
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : priority === 'Urgent'
            ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}
      >
        {slaDue || '24 hours'}
      </span>
    </div>
  );
};
