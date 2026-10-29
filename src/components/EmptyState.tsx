import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`relative p-10 border border-line rounded bg-surface text-center flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {/* Subtle jaali pattern header strip */}
      <div className="absolute top-0 left-0 right-0 h-4 jaali-pattern opacity-40" aria-hidden="true" />
      <div className="mt-2 max-w-md">
        <h3 className="text-lg font-semibold text-ink mb-1.5">{title}</h3>
        <p className="text-sm text-muted mb-6 leading-relaxed">{description}</p>
        {actionText && onAction && (
          <Button variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};
