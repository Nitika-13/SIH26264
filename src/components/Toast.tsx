import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  text: string;
}

export interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded bg-navy text-on-navy shadow-lg border border-line/40 max-w-md w-auto"
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 text-[#F7DDD8] shrink-0" aria-hidden="true" />
      ) : toast.type === 'info' ? (
        <Info className="w-5 h-5 text-kesari-soft shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-[#B5DFCB] shrink-0" aria-hidden="true" />
      )}
      <p className="text-sm font-medium pr-2 text-left">{toast.text}</p>
      <button
        onClick={onClose}
        className="text-on-navy/70 hover:text-on-navy p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
