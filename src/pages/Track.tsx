import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Building2, Calendar, Shield, Clock, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { PublicTrack } from '../lib/types';
import { StatusBadge } from '../components/StatusBadge';
import { DaysLeft } from '../components/DaysLeft';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { formatDate, formatDateTime } from '../lib/time';

export const Track: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(initialCode);
  const [trackResult, setTrackResult] = useState<PublicTrack | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrack = async (codeToQuery: string) => {
    const cleaned = codeToQuery.trim().toUpperCase();
    if (!cleaned) {
      setError('Please provide a complaint reference ID.');
      return;
    }
    setError(null);
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.trackByCode(cleaned);
      setTrackResult(res);
      setSearchParams({ code: cleaned });
    } catch {
      setError('Failed to query complaint status.');
      setTrackResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchTrack(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(inputCode);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 text-left space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">
          Track Complaint Status
        </h1>
        <div className="kesari-rule my-3" />
        <p className="text-sm text-muted">
          Public verification window. Check the real-time processing stage, assigned Bureau, and statutory deadlines using your complaint reference.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="p-6 border border-line rounded bg-surface shadow-sm space-y-4">
        <Input
          id="public_track_code"
          label="Complaint Reference ID"
          placeholder="AICTE-26-01001"
          value={inputCode}
          onChange={(e) => {
            setInputCode(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          helperText="Format: AICTE-26-XXXXX (found on your submission receipt)"
        />
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          <span>{loading ? 'Querying AICTE registry…' : 'Track Grievance'}</span>
        </Button>
      </form>

      {/* Results */}
      {loading && (
        <div className="p-8 border border-line rounded bg-surface text-center text-muted">
          Fetching tracking updates…
        </div>
      )}

      {!loading && searched && !trackResult && (
        <div className="p-8 border border-line rounded bg-surface text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#8A5A00] mx-auto" />
          <h2 className="text-lg font-semibold text-ink">No Complaint Found</h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            We could not find an active or historical complaint record matching <span className="font-mono font-bold text-navy">{inputCode}</span>. Please verify the code or check with your institution.
          </p>
        </div>
      )}

      {!loading && trackResult && (
        <div className="border border-line rounded bg-surface shadow-sm overflow-hidden text-left space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs uppercase font-semibold text-muted tracking-wider block">
                Public Tracking Docket
              </span>
              <h2 className="text-2xl font-display font-bold text-navy tabular-nums mt-0.5">
                {trackResult.code}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={trackResult.status} />
              <DaysLeft dueDate={trackResult.due_date} status={trackResult.status} />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-paper rounded border border-line flex items-start gap-3">
              <Building2 className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block">Concerned Institution:</span>
                <span className="font-semibold text-ink text-sm block">{trackResult.college}</span>
              </div>
            </div>

            <div className="p-3 bg-paper rounded border border-line flex items-start gap-3">
              <Shield className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block">Assigned Bureau / Cell:</span>
                <span className="font-semibold text-ink text-sm block">{trackResult.cell}</span>
              </div>
            </div>

            <div className="p-3 bg-paper rounded border border-line flex items-start gap-3">
              <Calendar className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block">Date Registered:</span>
                <span className="font-semibold text-ink tabular-nums block">{formatDate(trackResult.created_at)}</span>
              </div>
            </div>

            <div className="p-3 bg-paper rounded border border-line flex items-start gap-3">
              <Clock className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block">Statutory Disposal Date:</span>
                <span className="font-semibold text-navy tabular-nums block">{formatDate(trackResult.due_date)}</span>
              </div>
            </div>
          </div>

          {/* Timeline of actions only (no internal notes per rules) */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-base font-semibold text-ink font-display">
                Public Action Timeline
              </h3>
              <p className="text-xs text-muted">
                Official actions taken by AICTE desk officers and notified authorities.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-line space-y-5 my-2">
              {trackResult.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-paper ${
                      idx === trackResult.timeline.length - 1 ? 'bg-navy ring-2 ring-navy/20' : 'bg-muted'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="text-xs text-muted tabular-nums block">
                      {formatDateTime(item.at)}
                    </span>
                    <h4 className="text-sm font-semibold text-ink mt-0.5">
                      {item.action}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
