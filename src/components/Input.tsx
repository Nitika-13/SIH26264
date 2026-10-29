import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className="text-sm font-semibold text-ink flex items-center gap-1">
        <span>{label}</span>
        {required && <span className="text-[#B3321F]" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`min-h-[44px] px-3.5 py-2 rounded bg-surface border text-ink placeholder:text-muted/60 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2 ${
          error ? 'border-[#B3321F]' : 'border-line hover:border-muted'
        } ${className}`}
        {...props}
      />
      {error && (
        <div id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-[#B3321F] mt-0.5" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-xs text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
};
