import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  id: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  id,
  placeholder,
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
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`min-h-[44px] w-full px-3.5 py-2 rounded bg-surface border text-ink transition-colors appearance-none cursor-pointer pr-10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2 ${
            error ? 'border-[#B3321F]' : 'border-line hover:border-muted'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
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
