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
    <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-brand-text flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-blue" />
          <span>Activity & Discussion</span>
        </h3>
        <span className="text-xs text-brand-text-secondary">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Discussion List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-6 border border-dashed rounded-lg">
            No remarks or comments yet. Add a note below to notify the maintenance squad.
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center justify-center flex-shrink-0 border border-slate-200">
                {c.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-text">{c.author}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {c.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handlePostComment} className="relative">
        <div className="border border-brand-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/30 focus-within:border-brand-blue bg-white">
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Add a remark or update as ${currentUser.name}...`}
            className="w-full p-3 text-xs text-brand-text outline-none resize-none placeholder:text-slate-400"
          />
          <div className="px-3 py-2 bg-slate-50 border-t border-brand-border flex items-center justify-between">
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1.5 p-1 rounded"
              title="Attach document or screenshot"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-[11px]">Attach</span>
            </button>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-brand-blue hover:bg-brand-blue-hover disabled:bg-slate-300 rounded transition-colors"
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
