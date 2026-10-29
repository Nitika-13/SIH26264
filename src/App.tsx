import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TricolourBar } from './components/TricolourBar';
import { UtilityStrip } from './components/UtilityStrip';
import { SiteHeader } from './components/SiteHeader';
import { Toast, ToastMessage } from './components/Toast';
import { AppRoutes } from './routes';
import { t } from './lib/i18n';

export const App: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      type,
      text
    });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-kesari-soft">
        {/* Signature tricolour bar */}
        <TricolourBar />

        {/* Navy utility strip */}
        <UtilityStrip onNotify={showNotification} />

        {/* Site Header */}
        <SiteHeader />

        {/* Main Content */}
        <main id="main" className="flex-1 w-full focus:outline-none" tabIndex={-1}>
          <AppRoutes />
        </main>

        {/* Global Toast */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Footer */}
        <footer className="bg-surface border-t border-line py-8 mt-16 text-center text-xs text-muted">
          <div className="max-w-content mx-auto px-4 space-y-2">
            <p className="font-medium text-ink">
              {t('footer.bilingual')}
            </p>
            <p className="tabular-nums">
              {t('footer.disclaimer')}
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};
