import React from 'react';

export interface BarListItem {
  label: string;
  value: number;
  secondaryValue?: number; // e.g. escalated count
  sublabel?: string;
}

export interface BarListProps {
  items: BarListItem[];
  valueLabel?: string;
  secondaryLabel?: string;
  className?: string;
}

export const BarList: React.FC<BarListProps> = ({
  items,
  valueLabel = 'Total',
  secondaryLabel = 'Escalated',
  className = ''
}) => {
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={`space-y-3 w-full text-left ${className}`}>
      {items.map((item, idx) => {
        const percentage = Math.round((item.value / maxValue) * 100);
        return (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline text-sm">
              <div className="truncate pr-2">
                <span className="font-medium text-ink">{item.label}</span>
                {item.sublabel && (
                  <span className="text-xs text-muted ml-1.5">({item.sublabel})</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs tabular-nums">
                <span className="font-semibold text-navy">
                  {item.value} {valueLabel.toLowerCase()}
                </span>
                {item.secondaryValue !== undefined && item.secondaryValue > 0 && (
                  <span className="px-1.5 py-0.2 rounded-[2px] bg-[#F7DDD8] text-[#B3321F] font-semibold border border-[#E8B6AD]">
                    {item.secondaryValue} {secondaryLabel.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
            {/* Visual bar container */}
            <div className="w-full bg-paper rounded-sm h-3 overflow-hidden flex border border-line/60">
              <div
                className="bg-navy h-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
