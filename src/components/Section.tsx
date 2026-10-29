import React from 'react';

export interface SectionProps {
  stepNumber?: number;
  totalSteps?: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  stepNumber,
  totalSteps,
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 border border-line rounded bg-surface text-left ${className}`}>
      <div className="mb-4">
        {stepNumber && totalSteps && (
          <span className="text-xs font-semibold text-navy uppercase tracking-wider block mb-1">
            Step {stepNumber} of {totalSteps}
          </span>
        )}
        <h2 className="text-xl font-semibold text-ink font-display">{title}</h2>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};
