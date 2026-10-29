import React from 'react';

export interface KpiProps {
  label: string;
  value: number | string;
  context?: string;
  isBreach?: boolean;
  className?: string;
}

export const Kpi: React.FC<KpiProps> = ({
  label,
  value,
  context,
  isBreach = false,
  className = ''
}) => {
  return (
    <div className={`p-4 border border-line rounded bg-surface flex flex-col justify-between ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted font-medium">{label}</span>
      <div className="my-2">
        <span
          className={`text-3xl font-bold tabular-nums tracking-tight font-display ${
            isBreach ? 'text-[#B3321F]' : 'text-navy'
          }`}
        >
          {value}
        </span>
      </div>
      {context && (
        <span className="text-xs text-muted tabular-nums leading-snug">
          {context}
        </span>
      )}
    </div>
  );
};
