import React from 'react';
import { CaseUpdate } from '../lib/types';
import { formatDateTime } from '../lib/time';

export interface LedgerTimelineProps {
  updates: CaseUpdate[];
  className?: string;
}

export const LedgerTimeline: React.FC<LedgerTimelineProps> = ({ updates, className = '' }) => {
  if (!updates || updates.length === 0) {
    return <p className="text-sm text-muted py-4">No audit history recorded yet.</p>;
  }

  // Newest at bottom as specified
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className={`relative pl-6 border-l-2 border-line space-y-6 text-left my-2 ${className}`}>
      {sortedUpdates.map((update, index) => {
        const isLatest = index === sortedUpdates.length - 1;
        return (
          <div key={update.id} className="relative group">
            {/* Ledger bullet marker */}
            <span
              className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-paper ${
                isLatest ? 'bg-navy ring-2 ring-navy/20' : 'bg-muted'
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-2 text-xs text-muted">
                <span className="font-semibold text-ink tabular-nums">
                  {formatDateTime(update.created_at)}
                </span>
                <span>·</span>
                <span className="font-medium text-navy">
                  {update.actor_name || update.actor_role}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-ink leading-snug">
                {update.action}
              </h4>
              {update.note && (
                <p className="text-sm text-muted bg-paper/60 p-2.5 rounded border border-line/60 mt-0.5">
                  {update.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
