import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { calculateDaysLeft } from '../lib/time';

export interface DaysLeftProps {
  dueDate: string;
  status: string;
  className?: string;
}

export const DaysLeft: React.FC<DaysLeftProps> = ({ dueDate, status, className = '' }) => {
  const { text, overdue, days } = calculateDaysLeft(dueDate, status);

  if (status === 'Resolved') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-muted font-medium tabular-nums ${className}`}>
        Closed
      </span>
    );
  }

  if (overdue) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#F7DDD8] text-[#B3321F] border border-[#E8B6AD] text-xs font-semibold tabular-nums ${className}`}
      >
        <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>{text}</span>
      </span>
    );
  }

  if (days === 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#FBEBCF] text-[#8A5A00] border border-[#E8CFA2] text-xs font-semibold tabular-nums ${className}`}
      >
        <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>Due today</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-paper text-muted border border-line text-xs font-medium tabular-nums ${className}`}
    >
      <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
};
