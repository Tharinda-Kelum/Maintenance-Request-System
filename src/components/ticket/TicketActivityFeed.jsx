import React, { useState } from 'react';
import { Send, Paperclip, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';

export const TicketActivityFeed = ({ ticket }) => {
  const [commentText, setCommentText] = useState('');
  const { currentUser } = useAuth();
  const { addComment } = useTickets();

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(ticket.id, commentText, currentUser);
    setCommentText('');
  };

  const comments = ticket.comments || [];

  return (
    <div className="bg-[#131926] rounded-2xl border border-[#1F293D] p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#a3e635]" />
          <span>Activity & Discussion</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Discussion List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-6 border border-dashed border-[#1F293D] rounded-xl bg-[#0E131E]">
            No remarks or comments yet. Add a note below to notify the maintenance squad.
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#0E131E] text-slate-300 font-semibold text-[11px] flex items-center justify-center flex-shrink-0 border border-[#1F293D]">
                {c.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 bg-[#0E131E] border border-[#1F293D] rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{c.author}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#131926] border border-[#1F293D] text-slate-400">
                      {c.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                </div>
                <p className="text-slate-300 leading-relaxed mt-1">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handlePostComment} className="relative">
        <div className="border border-[#1F293D] rounded-xl overflow-hidden focus-within:border-[#a3e635] bg-[#0E131E]">
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Add a remark or update as ${currentUser.name}...`}
            className="w-full p-3 text-xs text-white bg-transparent outline-none resize-none placeholder:text-slate-500"
          />
          <div className="px-3 py-2 bg-[#131926] border-t border-[#1F293D] flex items-center justify-between">
            <button
              type="button"
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1.5 p-1 rounded transition-colors"
              title="Attach document or screenshot"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-[11px]">Attach</span>
            </button>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#020617] bg-[#bbf246] hover:bg-[#a3e635] disabled:opacity-40 disabled:hover:bg-[#bbf246] rounded-full transition-all shadow-[0_0_12px_rgba(187,242,70,0.3)]"
            >
              <Send className="w-3 h-3" />
              <span>Post Remark</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
