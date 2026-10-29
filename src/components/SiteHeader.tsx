import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { api } from '../lib/api';
import { Session } from '../lib/types';
import { t } from '../lib/i18n';

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(api.getSession());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => setSession(api.getSession());
    window.addEventListener('authchange', handleAuthChange);
    return () => window.removeEventListener('authchange', handleAuthChange);
  }, []);

  const role = session?.user?.role;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-20">
      <div className="max-w-content w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark with Kesari square mark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus rounded"
          aria-label="AICTE Complaint Monitor Home"
        >
          <span className="w-3.5 h-3.5 bg-kesari rounded-[1px] shrink-0" aria-hidden="true" />
          <span className="text-xl sm:text-2xl font-bold font-display text-navy tracking-tight">
            AICTE Complaint Monitor
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main navigation">
          <Link
            to="/"
            className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
              isActive('/') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
            }`}
          >
            {t('nav.home')}
          </Link>

          {(!role || role === 'complainant') && (
            <>
              <Link
                to="/file"
                className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
                  isActive('/file') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
                }`}
              >
                {t('nav.file')}
              </Link>
              {role === 'complainant' && (
                <Link
                  to="/my"
                  className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
                    isActive('/my') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
                  }`}
                >
                  {t('nav.my')}
                </Link>
              )}
            </>
          )}

          <Link
            to="/track"
            className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
              isActive('/track') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
            }`}
          >
            {t('nav.track')}
          </Link>

          {(role === 'officer' || role === 'senior' || role === 'admin') && (
            <Link
              to="/officer"
              className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
                isActive('/officer') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
              }`}
            >
              {t('nav.officer')}
            </Link>
          )}

          {(role === 'senior' || role === 'admin') && (
            <Link
              to="/leadership"
              className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
                isActive('/leadership') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
              }`}
            >
              {t('nav.leadership')}
            </Link>
          )}

          <Link
            to="/design"
            className={`min-h-[44px] px-3.5 py-2 inline-flex items-center rounded transition-colors ${
              isActive('/design') ? 'text-navy font-semibold bg-paper' : 'text-muted hover:text-ink hover:bg-paper/50'
            }`}
          >
            {t('nav.design')}
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded text-muted hover:text-ink hover:bg-paper focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-line px-4 pt-2 pb-4 space-y-1 text-left">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
          >
            {t('nav.home')}
          </Link>

          {(!role || role === 'complainant') && (
            <>
              <Link
                to="/file"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
              >
                {t('nav.file')}
              </Link>
              {role === 'complainant' && (
                <Link
                  to="/my"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
                >
                  {t('nav.my')}
                </Link>
              )}
            </>
          )}

          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
          >
            {t('nav.track')}
          </Link>

          {(role === 'officer' || role === 'senior' || role === 'admin') && (
            <Link
              to="/officer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
            >
              {t('nav.officer')}
            </Link>
          )}

          {(role === 'senior' || role === 'admin') && (
            <Link
              to="/leadership"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
            >
              {t('nav.leadership')}
            </Link>
          )}

          <Link
            to="/design"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded text-base font-medium text-ink hover:bg-paper"
          >
            {t('nav.design')}
          </Link>

          {!session && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded text-base font-medium text-navy hover:bg-paper"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
