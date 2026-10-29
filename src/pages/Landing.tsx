import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { t } from '../lib/i18n';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [trackCode, setTrackCode] = useState('');
  const [trackError, setTrackError] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = trackCode.trim().toUpperCase();
    if (!cleaned) {
      setTrackError('Please enter a complaint ID.');
      return;
    }
    const regex = /^AICTE-26-\d{5}$/;
    if (!regex.test(cleaned)) {
      setTrackError('Format must be AICTE-26-XXXXX (e.g. AICTE-26-01001)');
      return;
    }
    setTrackError('');
    navigate(`/track?code=${cleaned}`);
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-10 sm:py-14 text-left">
      {/* Asymmetric hero grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (7 cols): Display headline & mission */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-paper border border-line text-xs font-semibold text-navy">
            <span className="w-2 h-2 rounded-full bg-flag-green" aria-hidden="true" />
            <span>AICTE OneView · Central Grievance Redressal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-navy leading-tight">
            Raise a complaint against an institution. See exactly where it stands.
          </h1>
          <div className="kesari-rule my-4" />
          <p className="text-base sm:text-lg text-ink/80 max-w-xl leading-relaxed">
            A single transparent portal for students, parents, and faculty across technical education institutions in India. Every complaint is tracked by statutory deadlines and routed directly to the competent AICTE Bureau.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 text-xs font-medium text-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1E6B4F]" />
              <span>Mandatory 15-day resolution SLA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-navy" />
              <span>Multi-Bureau overlap coordination</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Action box (Track & File) */}
        <div className="lg:col-span-5 bg-surface border border-line p-6 rounded shadow-sm space-y-6">
          {/* Track Box */}
          <form onSubmit={handleTrackSubmit} className="space-y-3">
            <h2 className="text-lg font-semibold text-ink font-display flex items-center justify-between">
              <span>{t('btn.track_complaint')}</span>
              <span className="text-xs text-muted font-body font-normal">शिकायत की स्थिति</span>
            </h2>
            <div className="space-y-1">
              <Input
                id="landing_track_id"
                label="Complaint ID"
                placeholder="AICTE-26-01001"
                value={trackCode}
                onChange={(e) => {
                  setTrackCode(e.target.value);
                  if (trackError) setTrackError('');
                }}
                error={trackError}
                helperText="Enter your 14-character tracking reference"
              />
            </div>
            <Button type="submit" variant="secondary" fullWidth>
              <Search className="w-4 h-4 mr-2" />
              <span>Check Status</span>
            </Button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-line" />
            <span className="flex-shrink mx-4 text-xs text-muted font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-line" />
          </div>

          {/* File Complaint Primary Action */}
          <div className="space-y-2">
            <Link to="/file" className="block w-full">
              <Button variant="kesari" fullWidth>
                <span>{t('btn.file_complaint')}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-center text-muted">
              Takes under 3 minutes · Free public service
            </p>
          </div>
        </div>
      </div>

      {/* Numbered Ledger: What happens next (Section 6) */}
      <div className="mt-16 pt-12 border-t border-line">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold text-navy uppercase tracking-wider">
            Process Ledger
          </span>
          <h2 className="text-2xl font-display font-semibold text-ink mt-1">
            What happens after you file
          </h2>
          <p className="text-sm text-muted mt-1">
            Every step is recorded in an immutable ledger. You receive real-time notifications when the college is notified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          <div className="p-5 border border-line rounded bg-surface relative">
            <span className="text-2xl font-bold font-display text-navy mb-2 block tabular-nums">1</span>
            <h3 className="text-base font-semibold text-ink mb-1">You file with evidence</h3>
            <p className="text-sm text-muted">
              Submit details and upload fee receipts, emails, or prospectus screenshots in original format.
            </p>
          </div>

          <div className="p-5 border border-line rounded bg-surface relative">
            <span className="text-2xl font-bold font-display text-navy mb-2 block tabular-nums">2</span>
            <h3 className="text-base font-semibold text-ink mb-1">Instant Bureau routing</h3>
            <p className="text-sm text-muted">
              Routed to the relevant cell (Finance, Approvals, Anti-Ragging, or Regional Office) with a fixed deadline.
            </p>
          </div>

          <div className="p-5 border border-line rounded bg-surface relative">
            <span className="text-2xl font-bold font-display text-navy mb-2 block tabular-nums">3</span>
            <h3 className="text-base font-semibold text-ink mb-1">Scrutiny & notice issued</h3>
            <p className="text-sm text-muted">
              An officer reviews your submission and formally seeks an explanation from the institution within 7 days.
            </p>
          </div>

          <div className="p-5 border border-line rounded bg-surface relative">
            <span className="text-2xl font-bold font-display text-navy mb-2 block tabular-nums">4</span>
            <h3 className="text-base font-semibold text-ink mb-1">Automatic escalation</h3>
            <p className="text-sm text-muted">
              If the deadline expires without college compliance, the grievance auto-escalates to the Chairman's Office.
            </p>
          </div>
        </div>
      </div>

      {/* Small three-row table: Who handles what (Section 6) */}
      <div className="mt-14 max-w-3xl">
        <div className="mb-4">
          <h2 className="text-xl font-display font-semibold text-ink">
            Who handles what at AICTE
          </h2>
          <p className="text-sm text-muted mt-0.5">
            AICTE cells operate under prescribed statutory response windows.
          </p>
        </div>

        <div className="border border-line bg-surface rounded-none overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" aria-label="AICTE Bureaus and Timelines">
            <thead className="bg-paper border-b border-line text-xs uppercase tracking-wider text-ink font-semibold">
              <tr>
                <th scope="col" className="px-4 py-3">Bureau / Cell</th>
                <th scope="col" className="px-4 py-3">Subject Matter Handled</th>
                <th scope="col" className="px-4 py-3 text-right">Statutory SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink">
              <tr>
                <td className="px-4 py-3 font-medium">Finance & Refunds Cell</td>
                <td className="px-4 py-3 text-muted">Fee refund disputes, caution deposit return, unapproved extra charges</td>
                <td className="px-4 py-3 text-right font-semibold text-navy tabular-nums">15 days</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Approvals Bureau</td>
                <td className="px-4 py-3 text-muted">Unapproved courses, false accreditation, lapsed university affiliation</td>
                <td className="px-4 py-3 text-right font-semibold text-navy tabular-nums">15 days</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Anti-Ragging Cell</td>
                <td className="px-4 py-3 text-muted">Bullying, harassment, hostel discipline, safety violations</td>
                <td className="px-4 py-3 text-right font-semibold text-[#B3321F] tabular-nums">7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
