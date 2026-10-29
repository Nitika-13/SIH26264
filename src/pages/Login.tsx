import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname;

  const handleLogin = async (email: string, targetPath: string) => {
    setLoading(email);
    setError(null);
    try {
      await api.signIn(email);
      // Auto-run escalation check for senior role
      if (email === 'leadership@demo.test') {
        try {
          await api.escalateOverdue();
        } catch {
          // non-blocking
        }
      }
      navigate(from || targetPath);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-navy">Sign In to AICTE Portal</h1>
        <div className="kesari-rule my-3" />
        <p className="text-sm text-muted">
          Select a role below to access the AICTE Complaint Monitoring system. This prototype runs on verified mock credentials.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded bg-[#F7DDD8] text-[#B3321F] border border-[#E8B6AD] text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Complainant card */}
        <div
          onClick={() => !loading && handleLogin('student@demo.test', '/my')}
          className="p-5 border border-line rounded bg-surface hover:border-navy hover:bg-kesari-soft/20 cursor-pointer transition-all flex items-center justify-between group focus-within:outline focus-within:outline-3 focus-within:outline-focus"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogin('student@demo.test', '/my');
            }
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded bg-paper border border-line flex items-center justify-center shrink-0 text-navy group-hover:bg-navy group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted tracking-wider">Complainant (Student / Parent)</span>
              <h3 className="text-lg font-semibold text-ink mt-0.5">Aarav Sharma</h3>
              <p className="text-xs text-muted mt-1">
                student@demo.test · Files grievances, tracks live case status, submits documents
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="small"
            disabled={loading === 'student@demo.test'}
            className="shrink-0 pointer-events-none"
          >
            {loading === 'student@demo.test' ? 'Signing in…' : 'Continue as Student'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {/* Officer card */}
        <div
          onClick={() => !loading && handleLogin('officer@demo.test', '/officer')}
          className="p-5 border border-line rounded bg-surface hover:border-navy hover:bg-kesari-soft/20 cursor-pointer transition-all flex items-center justify-between group focus-within:outline focus-within:outline-3 focus-within:outline-focus"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogin('officer@demo.test', '/officer');
            }
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded bg-paper border border-line flex items-center justify-center shrink-0 text-navy group-hover:bg-navy group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted tracking-wider">AICTE Desk Officer (Finance & Refunds)</span>
              <h3 className="text-lg font-semibold text-ink mt-0.5">Meera Iyer</h3>
              <p className="text-xs text-muted mt-1">
                officer@demo.test · Reviews cell complaints, sends notices to colleges, resolves grievances
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="small"
            disabled={loading === 'officer@demo.test'}
            className="shrink-0 pointer-events-none"
          >
            {loading === 'officer@demo.test' ? 'Signing in…' : 'Continue as Officer'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {/* Leadership card */}
        <div
          onClick={() => !loading && handleLogin('leadership@demo.test', '/leadership')}
          className="p-5 border border-line rounded bg-surface hover:border-navy hover:bg-kesari-soft/20 cursor-pointer transition-all flex items-center justify-between group focus-within:outline focus-within:outline-3 focus-within:outline-focus"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogin('leadership@demo.test', '/leadership');
            }
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded bg-paper border border-line flex items-center justify-center shrink-0 text-navy group-hover:bg-navy group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted tracking-wider">Leadership & Chairman's Office</span>
              <h3 className="text-lg font-semibold text-ink mt-0.5">R. K. Nair</h3>
              <p className="text-xs text-muted mt-1">
                leadership@demo.test · Multi-Bureau analytics, SLA breach alerts, repeat-offender oversight
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="small"
            disabled={loading === 'leadership@demo.test'}
            className="shrink-0 pointer-events-none"
          >
            {loading === 'leadership@demo.test' ? 'Signing in…' : 'Continue as Senior'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 rounded bg-paper border border-line text-xs text-muted">
        <p className="font-semibold text-ink mb-1">Prototype Notice</p>
        <p>
          This dashboard operates on client-side seeded data. All actions take 150-400 ms to reflect real-world network latency. No live credentials or passwords are required for demo testing.
        </p>
      </div>
    </div>
  );
};
