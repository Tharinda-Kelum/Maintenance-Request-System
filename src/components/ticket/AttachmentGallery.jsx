import React, { useState } from 'react';
import { Image, FileText, Download, Eye, X } from 'lucide-react';

export const AttachmentGallery = ({ attachments = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!attachments || attachments.length === 0) {
    return (
      <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-5 text-center text-xs text-slate-500 shadow-card">
        No photographic or document evidence attached to this ticket.
      </div>
    );
  }

  return (
    <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Attached Evidence ({attachments.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-[#1F293D] bg-[#0E131E] hover:bg-[#1A2234] transition-colors"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-[#1A2234] text-[#a3e635] flex items-center justify-center flex-shrink-0 border border-[#1F293D]">
                <Image className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-white truncate">{att.name}</p>
                <p className="text-[10px] text-slate-400">{att.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <button
                onClick={() => setSelectedImage(att)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1F293D] rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-[#131926] rounded-2xl overflow-hidden shadow-2xl border border-[#1F293D]">
            <div className="px-4 py-3 border-b border-[#1F293D] flex items-center justify-between bg-[#0E131E]">
              <div className="text-xs font-semibold text-white truncate">
                {selectedImage.name} ({selectedImage.size})
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center bg-[#0B0F17] text-white min-h-[300px]">
              <div className="w-20 h-20 rounded-2xl bg-[#131926] flex items-center justify-center mb-4 text-[#a3e635] border border-[#1F293D]">
                <Image className="w-10 h-10" />
              </div>
              <p className="text-sm font-medium text-white">{selectedImage.name}</p>
              <p className="text-xs text-slate-400 mt-1">Simulated high-resolution photo evidence capture</p>
            </div>
            <div className="px-4 py-2.5 bg-[#0E131E] border-t border-[#1F293D] flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#1F293D] hover:bg-slate-700 rounded-full text-slate-200"
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
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : priority === 'Urgent'
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}
      >
        {slaDue || '24 hours'}
      </span>
    </div>
  );
};
