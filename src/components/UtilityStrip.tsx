import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Session } from '../lib/types';
import { getUiLanguage, setUiLanguage, t } from '../lib/i18n';
import { DEMO_USERS } from '../lib/session';

interface UtilityStripProps {
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UtilityStrip: React.FC<UtilityStripProps> = ({ onNotify }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(api.getSession());
  const [textSize, setTextSize] = useState<string>(
    localStorage.getItem('sih26264-text-size') || '100'
  );
  const [lang, setLang] = useState(getUiLanguage());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setSession(api.getSession());
    };
    const handleLangChange = () => {
      setLang(getUiLanguage());
    };

    window.addEventListener('authchange', handleAuthChange);
    window.addEventListener('languagechange', handleLangChange);
    return () => {
      window.removeEventListener('authchange', handleAuthChange);
      window.removeEventListener('languagechange', handleLangChange);
    };
  }, []);

  const changeTextSize = (size: '100' | '112' | '125') => {
    setTextSize(size);
    document.documentElement.setAttribute('data-text-size', size);
    localStorage.setItem('sih26264-text-size', size);
  };

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setUiLanguage(next);
  };

  const handleSignOut = async () => {
    await api.signOut();
    setMenuOpen(false);
    navigate('/');
    onNotify?.('Signed out successfully.');
  };

  const handleSwitchRole = async (email: string) => {
    try {
      await api.signIn(email);
      setMenuOpen(false);
      const user = DEMO_USERS[email];
      onNotify?.(`Switched session to ${user.full_name} (${user.role}).`, 'success');
      if (user.role === 'complainant') navigate('/my');
      else if (user.role === 'officer') navigate('/officer');
      else if (user.role === 'senior') navigate('/leadership');
    } catch (e: any) {
      onNotify?.(e.message || 'Failed to switch user.', 'error');
    }
  };

  const handleSimulateDays = async (days: number) => {
    try {
      const escalated = await api.simulateDays(days);
      setMenuOpen(false);
      onNotify?.(`Simulated ${days} days passing. ${escalated} cases escalated to Chairman's Office.`, 'info');
      // Trigger update event if on dashboard
      window.dispatchEvent(new Event('casesupdated'));
    } catch (e: any) {
      onNotify?.(e.message || 'Simulation error.', 'error');
    }
  };

  const handleEscalationCheck = async () => {
    try {
      const escalated = await api.escalateOverdue();
      setMenuOpen(false);
      onNotify?.(`Escalation check complete: ${escalated} cases newly escalated.`, 'info');
      window.dispatchEvent(new Event('casesupdated'));
    } catch (e: any) {
      onNotify?.(e.message || 'Error running check.', 'error');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to original seeded state?')) {
      await api.resetDemo();
      setMenuOpen(false);
      onNotify?.('Demo data reset to baseline seeded complaints.', 'success');
      window.dispatchEvent(new Event('casesupdated'));
    }
  };

  return (
    <div className="bg-navy text-on-navy text-xs min-h-[36px] flex items-center border-b border-navy/40 relative z-30">
      <div className="max-w-content w-full mx-auto px-4 sm:px-6 flex items-center justify-between py-1">
        {/* Left: Skip link + Gov label */}
        <div className="flex items-center gap-3">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:inline-block focus:bg-white focus:text-navy focus:px-2 focus:py-1 focus:rounded font-semibold"
          >
            {t('skip.link')}
          </a>
          <span className="font-medium text-white/90">
            {lang === 'hi' ? 'भारत सरकार' : 'Government of India'}
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/80 hidden sm:inline">
            {t('portal.tagline')}
          </span>
        </div>

        {/* Right: Accessibility controls, Language toggle, Account */}
        <div className="flex items-center gap-4">
          {/* Text size scaling */}
          <div className="flex items-center gap-1 border-r border-white/20 pr-3">
            <span className="sr-only">Font size options</span>
            <button
              type="button"
              onClick={() => changeTextSize('100')}
              className={`px-1.5 py-0.5 rounded ${
                textSize === '100' ? 'bg-white/20 font-bold' : 'hover:bg-white/10 text-white/80'
              }`}
              title="Normal text size (100%)"
              aria-label="Normal text size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => changeTextSize('112')}
              className={`px-1.5 py-0.5 rounded text-sm ${
                textSize === '112' ? 'bg-white/20 font-bold' : 'hover:bg-white/10 text-white/80'
              }`}
              title="Medium text size (112%)"
              aria-label="Medium text size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => changeTextSize('125')}
              className={`px-1.5 py-0.5 rounded text-base font-bold ${
                textSize === '125' ? 'bg-white/20' : 'hover:bg-white/10 text-white/80'
              }`}
              title="Large text size (125%)"
              aria-label="Large text size"
            >
              A+
            </button>
          </div>

          {/* Bilingual language switch */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 font-medium transition-colors"
            title="Switch Language"
          >
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>

          {/* Account / Demo Menu */}
          <div className="relative">
            {session ? (
              <div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <span className="truncate max-w-[130px]">{session.user.full_name}</span>
                  <span className="text-[10px] uppercase px-1 py-0.2 bg-kesari text-ink font-semibold rounded-[2px]">
                    {session.user.role}
                  </span>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-1 w-64 bg-surface text-ink rounded border border-line shadow-xl py-2 z-50 text-left text-sm"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-line bg-paper/60">
                      <p className="font-semibold text-ink">{session.user.full_name}</p>
                      <p className="text-xs text-muted">{session.user.email}</p>
                      <p className="text-xs font-medium text-navy capitalize mt-0.5">Role: {session.user.role}</p>
                    </div>

                    <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
                      Switch Role (Demo)
                    </div>
                    {Object.entries(DEMO_USERS).map(([email, u]) => (
                      <button
                        key={email}
                        type="button"
                        onClick={() => handleSwitchRole(email)}
                        className={`w-full px-4 py-1.5 text-left text-xs hover:bg-kesari-soft/60 flex items-center justify-between ${
                          session.user.email === email ? 'font-bold text-navy bg-kesari-soft/40' : 'text-ink'
                        }`}
                      >
                        <span>{u.full_name}</span>
                        <span className="text-[10px] text-muted capitalize">({u.role})</span>
                      </button>
                    ))}

                    {/* Senior Demo Controls */}
                    {session.user.role === 'senior' && (
                      <>
                        <div className="border-t border-line my-1" />
                        <div className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
                          Senior Controls
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSimulateDays(16)}
                          className="w-full px-4 py-1.5 text-left text-xs text-navy font-medium hover:bg-kesari-soft/60"
                        >
                          Simulate 16 days passing
                        </button>
                        <button
                          type="button"
                          onClick={handleEscalationCheck}
                          className="w-full px-4 py-1.5 text-left text-xs text-navy font-medium hover:bg-kesari-soft/60"
                        >
                          Run escalation check
                        </button>
                      </>
                    )}

                    <div className="border-t border-line my-1" />
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="w-full px-4 py-1.5 text-left text-xs text-[#8A5A00] font-medium hover:bg-kesari-soft/60"
                    >
                      Reset demo data
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-4 py-1.5 text-left text-xs text-[#B3321F] font-medium hover:bg-red-50"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-2.5 py-1 rounded bg-kesari text-ink font-semibold hover:bg-[#d67b07] transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
