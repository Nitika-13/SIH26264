import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Languages, FileText, Building } from 'lucide-react';
import { api } from '../lib/api';
import { ComplaintDetail } from '../lib/types';
import { StatusBadge } from '../components/StatusBadge';
import { DaysLeft } from '../components/DaysLeft';
import { LedgerTimeline } from '../components/LedgerTimeline';
import { formatDate } from '../lib/time';

export const CaseDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [caseData, setCaseData] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslated, setShowTranslated] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    api.getComplaintByCode(code)
      .then(setCaseData)
      .catch((err) => setError(err.message || 'Failed to load complaint.'))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-16 text-center text-muted">
        Loading case record {code}…
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-display font-bold text-[#B3321F]">Case Not Found</h1>
        <div className="kesari-rule mx-auto" />
        <p className="text-sm text-muted">{error || 'The requested complaint does not exist.'}</p>
        <Link to="/my" className="inline-block pt-2 text-sm text-navy font-semibold hover:underline">
          Return to My Complaints
        </Link>
      </div>
    );
  }

  const getStatusExplanation = (status: string): string => {
    switch (status) {
      case 'Submitted':
        return 'Your grievance is queued at the Bureau desk. An officer will scrutinize the documents and initiate contact with the college within 2 working days.';
      case 'Under Review':
        return "The appointed desk officer is evaluating the evidence and preparing a formal inquiry notice to the institution's authorities.";
      case 'Notice Sent':
        return 'A statutory notice has been issued to the college Principal and Registrar. The institution has 7 days to furnish compliance proof or formal explanations.';
      case 'Resolved':
        return 'The institution has submitted compliance or refund documents verified by the Bureau officer. This case is now closed.';
      case 'Escalated':
        return 'The statutory resolution timeline has expired without adequate college compliance. This matter is currently under review with senior AICTE management.';
      default:
        return 'Your grievance is currently being processed by the assigned AICTE Bureau.';
    }
  };

  const displayText = showTranslated && caseData.translated_text
    ? caseData.translated_text
    : caseData.original_text;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      {/* Back button */}
      <Link
        to="/my"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-navy font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to my complaints</span>
      </Link>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded">
        <div>
          <span className="text-xs uppercase font-semibold text-muted tracking-wider block">
            Grievance Docket
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy tracking-tight mt-0.5 tabular-nums">
            {caseData.code}
          </h1>
          <p className="text-xs text-muted mt-1 tabular-nums">
            Filed on {formatDate(caseData.created_at)} · Category: {caseData.category}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={caseData.status} />
          <DaysLeft dueDate={caseData.due_date} status={caseData.status} />
        </div>
      </div>

      {/* Unequal 7/5 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Text, attachments, ledger timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Complaint Text Section */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-base font-semibold text-ink font-display">
                Original Grievance Submission
              </h2>
              {caseData.translated_text && (
                <button
                  type="button"
                  onClick={() => setShowTranslated(!showTranslated)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-paper border border-line text-navy hover:bg-kesari-soft/60"
                >
                  <Languages className="w-3.5 h-3.5 text-navy" />
                  <span>{showTranslated ? 'View Original Language' : 'View English Translation'}</span>
                </button>
              )}
            </div>

            <div className="text-sm text-ink leading-relaxed whitespace-pre-line p-3 bg-paper rounded border border-line/60">
              {displayText}
            </div>

            {caseData.translated_text && (
              <p className="text-[11px] text-muted italic">
                {showTranslated
                  ? 'Showing verified English translation for Bureau processing.'
                  : `Original language detected: ${caseData.language.toUpperCase()}. AI translation available.`}
              </p>
            )}

            {/* Attachments */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Attached Documents ({caseData.attachments.length})
              </h3>
              {caseData.attachments.length === 0 ? (
                <p className="text-xs text-muted">No documents attached with this submission.</p>
              ) : (
                <div className="divide-y divide-line border border-line rounded">
                  {caseData.attachments.map((att) => (
                    <div key={att.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="w-4 h-4 text-navy shrink-0" />
                        <span className="font-medium text-ink truncate">{att.file_name}</span>
                      </div>
                      <span className="text-muted tabular-nums shrink-0">
                        {(att.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Audit History: Ledger Timeline */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div>
              <h2 className="text-base font-semibold text-ink font-display">
                Action & Scrutiny Ledger
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Verifiable chronological log of all communications, inspections, and notices.
              </p>
            </div>
            <LedgerTimeline updates={caseData.updates} />
          </div>
        </div>

        {/* Right Column (5 cols): What happens next + Institution details */}
        <div className="lg:col-span-5 space-y-6">
          {/* What happens next */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <span className="text-xs font-semibold text-navy uppercase tracking-wider block">
              Current Stage Guide
            </span>
            <h2 className="text-lg font-semibold text-ink font-display">
              What happens next
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed bg-paper p-3.5 rounded border border-line/70">
              {getStatusExplanation(caseData.status)}
            </p>

            <div className="pt-2 space-y-2 text-xs divide-y divide-line">
              <div className="pt-2 flex justify-between">
                <span className="text-muted">Statutory Deadline:</span>
                <span className="font-semibold text-navy tabular-nums">
                  {formatDate(caseData.due_date)}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted">Handling Bureau:</span>
                <span className="font-semibold text-ink">
                  {caseData.cell.name}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-muted">Standard SLA Window:</span>
                <span className="font-semibold text-ink tabular-nums">
                  {caseData.cell.sla_days} calendar days
                </span>
              </div>
            </div>
          </div>

          {/* Centralized Institution Profile (from PPT and Official Statement) */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-navy shrink-0" />
              <h2 className="text-base font-semibold text-ink font-display">
                Institution Profile
              </h2>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted block">Institution Name:</span>
                <span className="font-semibold text-ink text-sm block">
                  {caseData.college.name}
                </span>
              </div>
              <div>
                <span className="text-muted block">AICTE Permanent ID:</span>
                <span className="font-mono font-bold text-navy text-sm block tabular-nums">
                  {caseData.college.aicte_id}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-line">
                <span className="text-muted">Jurisdiction / Region:</span>
                <span className="font-medium text-ink">{caseData.college.region} Region</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-line">
                <span className="text-muted">State:</span>
                <span className="font-medium text-ink">{caseData.college.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
