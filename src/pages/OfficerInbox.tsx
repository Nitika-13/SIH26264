import React, { useState, useEffect, useCallback } from 'react';
import {
  Filter,
  Search,
  AlertTriangle,
  Clock,
  Mail,
  CheckCircle,
  FileText,
  Languages,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Send,
  Building,
  RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';
import { CaseRow, Cell, College, CaseUpdate, NotificationRow } from '../lib/types';
import { StatusBadge } from '../components/StatusBadge';
import { DaysLeft } from '../components/DaysLeft';
import { DataTable, Column } from '../components/DataTable';
import { Drawer } from '../components/Drawer';
import { Tabs } from '../components/Tabs';
import { LedgerTimeline } from '../components/LedgerTimeline';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { formatDate, formatDateTime } from '../lib/time';

export const OfficerInbox: React.FC = () => {
  const session = api.getSession();
  const isSenior = session?.user.role === 'senior' || session?.user.role === 'admin';

  // Data states
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCellId, setSelectedCellId] = useState<string>(
    !isSenior && session?.user.cell_id ? String(session.user.cell_id) : ''
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected case & drawer
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);
  const [caseUpdates, setCaseUpdates] = useState<CaseUpdate[]>([]);
  const [similarCasesList, setSimilarCasesList] = useState<CaseRow[]>([]);
  const [activeDrawerTab, setActiveDrawerTab] = useState('complaint');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  // Action dialog states
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTemplate, setNoticeTemplate] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveNote, setResolveNote] = useState('');

  // UI feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [casesRes, cellsRes, collegesRes, notifRes] = await Promise.all([
        api.listCases({
          cell_id: selectedCellId ? parseInt(selectedCellId, 10) : undefined,
          status: selectedStatus,
          college_id: selectedCollegeId ? parseInt(selectedCollegeId, 10) : undefined,
          overdueOnly
        }),
        api.listCells(),
        api.listColleges(),
        api.listNotifications()
      ]);
      setCases(casesRes);
      setCells(cellsRes);
      setColleges(collegesRes);
      setNotifications(notifRes);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCellId, selectedStatus, selectedCollegeId, overdueOnly]);

  useEffect(() => {
    loadData();
    const handleCasesUpdated = () => loadData();
    window.addEventListener('casesupdated', handleCasesUpdated);
    return () => window.removeEventListener('casesupdated', handleCasesUpdated);
  }, [loadData]);

  const handleRowSelect = async (row: CaseRow) => {
    setSelectedCase(row);
    setDrawerOpen(true);
    setActiveDrawerTab('complaint');
    setShowTranslated(false);

    try {
      const [detail, similar] = await Promise.all([
        api.getComplaintByCode(row.code),
        api.similarCases(row.id)
      ]);
      setCaseUpdates(detail.updates);
      setSimilarCasesList(similar);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Actions
  const handleMarkUnderReview = async () => {
    if (!selectedCase) return;
    try {
      await api.updateCase(selectedCase.id, {
        status: 'Under Review',
        note: 'Scrutiny initiated by assigned Bureau officer.'
      });
      showToast(`Case ${selectedCase.code} marked Under Review.`);
      await loadData();
      const updated = await api.getComplaintByCode(selectedCase.code);
      setSelectedCase((prev) => (prev ? { ...prev, status: 'Under Review' } : null));
      setCaseUpdates(updated.updates);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const openNoticeDialog = () => {
    if (!selectedCase) return;
    setNoticeTemplate(
      `This office has received a complaint regarding ${selectedCase.category} against your institution (AICTE Permanent ID: ${selectedCase.college_aicte_id}). You are hereby requested to furnish a factual report and explanation within 7 days of this communication.`
    );
    setShowNoticeModal(true);
  };

  const handleSendNotice = async () => {
    if (!selectedCase) return;
    try {
      await api.updateCase(selectedCase.id, {
        status: 'Notice Sent',
        note: noticeTemplate,
        notice: true
      });
      setShowNoticeModal(false);
      showToast(`Statutory Notice dispatched for case ${selectedCase.code}.`);
      await loadData();
      const updated = await api.getComplaintByCode(selectedCase.code);
      setSelectedCase((prev) => (prev ? { ...prev, status: 'Notice Sent' } : null));
      setCaseUpdates(updated.updates);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch notice.');
    }
  };

  const handleAddNote = async () => {
    if (!selectedCase || !noteText.trim()) return;
    try {
      await api.updateCase(selectedCase.id, {
        note: noteText.trim()
      });
      setShowNoteModal(false);
      setNoteText('');
      showToast(`Internal note recorded on ${selectedCase.code}.`);
      const updated = await api.getComplaintByCode(selectedCase.code);
      setCaseUpdates(updated.updates);
    } catch (err: any) {
      alert(err.message || 'Failed to record note.');
    }
  };

  const handleResolve = async () => {
    if (!selectedCase) return;
    try {
      await api.updateCase(selectedCase.id, {
        status: 'Resolved',
        note: resolveNote.trim() || 'Compliance verified by AICTE desk. Matter resolved and closed.'
      });
      setShowResolveModal(false);
      setResolveNote('');
      showToast(`Grievance ${selectedCase.code} marked Resolved.`);
      await loadData();
      const updated = await api.getComplaintByCode(selectedCase.code);
      setSelectedCase((prev) => (prev ? { ...prev, status: 'Resolved' } : null));
      setCaseUpdates(updated.updates);
    } catch (err: any) {
      alert(err.message || 'Failed to resolve case.');
    }
  };

  // Filter cases by search text
  const filteredCases = cases.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.college_name.toLowerCase().includes(q) ||
      c.college_aicte_id.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const columns: Column<CaseRow>[] = [
    {
      key: 'code',
      header: 'Case ID',
      width: '150px',
      render: (c) => (
        <span className="font-semibold text-navy tabular-nums">
          {c.code}
        </span>
      )
    },
    {
      key: 'college_name',
      header: 'Institution & AICTE ID',
      render: (c) => (
        <div>
          <span className="font-medium text-ink block leading-snug">{c.college_name}</span>
          <span className="text-xs text-muted tabular-nums">
            ID: {c.college_aicte_id} · {c.college_state}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (c) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-ink text-xs font-medium">{c.category}</span>
          {c.overlap_alert && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-[#8A5A00] font-semibold bg-[#FBEBCF] px-1 py-0.2 rounded-[2px] w-fit"
              title="Multi-Bureau overlap detected for this institution"
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Overlap Alert</span>
            </span>
          )}
        </div>
      )
    },
    {
      key: 'urgency',
      header: 'Urgency',
      width: '90px',
      render: (c) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            c.urgency === 'high' ? 'text-[#B3321F] font-semibold' : 'text-muted'
          }`}
        >
          {c.urgency === 'high' ? '● High' : '○ Normal'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (c) => <StatusBadge status={c.status} size="small" />
    },
    {
      key: 'due_date',
      header: 'Days Left',
      width: '120px',
      render: (c) => <DaysLeft dueDate={c.due_date} status={c.status} />
    }
  ];

  return (
    <div className="max-w-wide mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-navy text-white text-xs font-semibold rounded shadow-lg border border-line">
          {toastMessage}
        </div>
      )}

      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-navy tracking-wider">
              AICTE Bureau Workspace
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">
              {session?.user.full_name} ({isSenior ? 'All Bureaus' : cells.find(c => c.id === session?.user.cell_id)?.name})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy mt-1">
            Grievance Redressal Inbox
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isSenior && (
            <button
              type="button"
              onClick={() => setSelectedStatus(selectedStatus === 'Escalated' ? 'All' : 'Escalated')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                selectedStatus === 'Escalated'
                  ? 'bg-[#F7DDD8] text-[#B3321F] border-[#E8B6AD]'
                  : 'bg-paper text-muted border-line hover:border-navy'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-[#B3321F]" />
              <span>Escalated Quick Filter</span>
            </button>
          )}

          <Button variant="ghost" size="small" onClick={loadData} title="Refresh case list">
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter Rail & Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Rail (3 cols) */}
        <div className="lg:col-span-3 bg-surface border border-line p-5 rounded space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <Filter className="w-4 h-4 text-navy" />
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
              Filter Records
            </h2>
          </div>

          {/* Search box */}
          <div>
            <label htmlFor="search_query" className="text-xs font-semibold text-ink block mb-1">
              Search by Code or College
            </label>
            <div className="relative">
              <input
                id="search_query"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs min-h-[38px] pl-8 pr-3 py-1.5 rounded bg-surface border border-line focus:outline-none focus:border-navy"
              />
              <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Cell select (Senior only) */}
          {isSenior && (
            <Select
              id="filter_cell"
              label="Assigned Bureau/Cell"
              placeholder="All Bureaus"
              value={selectedCellId}
              onChange={(e) => setSelectedCellId(e.target.value)}
              options={cells.map((c) => ({ value: String(c.id), label: `${c.name} (${c.sla_days}d SLA)` }))}
            />
          )}

          {/* Status select */}
          <Select
            id="filter_status"
            label="Case Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Submitted', label: 'Submitted (New)' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Notice Sent', label: 'Notice Sent' },
              { value: 'Resolved', label: 'Resolved (Closed)' },
              { value: 'Escalated', label: 'Escalated to Senior' }
            ]}
          />

          {/* College select */}
          <Select
            id="filter_college"
            label="Institution"
            placeholder="All Institutions"
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            options={colleges.map((c) => ({
              value: String(c.id),
              label: `${c.name} (${c.state})`
            }))}
          />

          {/* Overdue only checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink select-none">
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={(e) => setOverdueOnly(e.target.checked)}
                className="w-4 h-4 text-navy rounded border-line cursor-pointer"
              />
              <span className="flex items-center gap-1 text-[#B3321F]">
                <Clock className="w-3.5 h-3.5" />
                <span>Overdue Cases Only</span>
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-line text-xs text-muted flex justify-between">
            <span>Showing:</span>
            <span className="font-semibold text-navy tabular-nums">{filteredCases.length} records</span>
          </div>
        </div>

        {/* Centre DataTable (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="text-xs text-muted flex justify-between items-center">
            <span>Click any row to open scrutiny details and official action controls. Use ↑/↓ to navigate.</span>
            <span className="text-[11px] tabular-nums font-medium text-navy">Sorted by statutory due date</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted border border-line bg-surface">
              Loading Bureau cases…
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredCases}
              keyExtractor={(c) => c.id}
              selectedRowKey={selectedCase?.id}
              onRowSelect={handleRowSelect}
              emptyMessage="No grievances match the specified filters."
              ariaLabel="Bureau grievance inbox"
            />
          )}

          {/* Collapsible Notifications Sent Panel */}
          <div className="border border-line rounded bg-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setNotificationsExpanded(!notificationsExpanded)}
              className="w-full px-5 py-3.5 bg-paper flex items-center justify-between text-left text-xs font-semibold text-ink hover:bg-kesari-soft/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-navy" />
                <span>Statutory Notices & Communications Sent ({notifications.length})</span>
              </div>
              {notificationsExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
            </button>

            {notificationsExpanded && (
              <div className="divide-y divide-line max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-muted text-center">No notices issued yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 text-xs flex flex-col gap-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-navy">To: {n.recipient}</span>
                        <span className="text-muted tabular-nums">{formatDateTime(n.sent_at)}</span>
                      </div>
                      <p className="text-ink/80 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Drawer: Case Scrutiny & Actions */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedCase ? `Case Scrutiny: ${selectedCase.code}` : 'Case Scrutiny'}
        subtitle={selectedCase ? `${selectedCase.college_name} · Due ${formatDate(selectedCase.due_date)}` : undefined}
      >
        {selectedCase && (
          <div className="space-y-6">
            {/* Status & Timing summary strip */}
            <div className="p-3.5 bg-paper rounded border border-line flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedCase.status} />
                <DaysLeft dueDate={selectedCase.due_date} status={selectedCase.status} />
              </div>
              <div className="text-muted tabular-nums">
                Filed on {formatDate(selectedCase.created_at)}
              </div>
            </div>

            {/* Overlap Alert Card (from PPT Slide 2 & 3: Cross-Bureau Overlap Detection Engine) */}
            {selectedCase.overlap_alert && (
              <div className="p-4 rounded border-2 border-[#E8890C] bg-[#FBEBCF]/50 text-left space-y-2">
                <div className="flex items-center gap-2 text-ink font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#8A5A00] shrink-0" />
                  <span>Potential Overlapping Cases – Coordination Required</span>
                </div>
                <p className="text-xs text-ink/90 leading-relaxed">
                  The system detected active grievance records for this institution across AICTE Bureaus.
                </p>
                <div className="p-2.5 bg-surface rounded border border-[#E8CFA2] space-y-1 text-[11px]">
                  <span className="font-semibold text-navy block">Match Evidence:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-muted">
                    <li>Same AICTE Permanent ID: <strong className="text-ink">{selectedCase.college_aicte_id}</strong></li>
                    <li>Parallel cases identified: <span className="font-mono text-navy font-semibold">{selectedCase.overlap_case_ids?.join(', ')}</span></li>
                    <li>Active timeline overlap between Regulation Bureau & Redressal Cell</li>
                  </ul>
                </div>
                <div className="pt-1 flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setActiveDrawerTab('similar')}
                  >
                    <LinkIcon className="w-3.5 h-3.5 mr-1" />
                    <span>Review Overlapping Cases</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Drawer Tabs */}
            <Tabs
              tabs={[
                { id: 'complaint', label: 'Complaint' },
                { id: 'history', label: 'History Ledger', badge: caseUpdates.length },
                { id: 'similar', label: 'Similar Cases', badge: similarCasesList.length }
              ]}
              activeTab={activeDrawerTab}
              onChange={setActiveDrawerTab}
            />

            {/* Tab 1: Complaint */}
            {activeDrawerTab === 'complaint' && (
              <div className="space-y-4 text-xs">
                {/* Institution Profile Info */}
                <div className="p-3 bg-surface rounded border border-line space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-navy text-sm">
                    <Building className="w-4 h-4 shrink-0" />
                    <span>{selectedCase.college_name}</span>
                  </div>
                  <div className="text-muted tabular-nums">
                    Permanent ID: <span className="font-mono font-medium text-ink">{selectedCase.college_aicte_id}</span> · {selectedCase.college_state} ({selectedCase.cell_name})
                  </div>
                </div>

                {/* Complaint Summary & Routed by */}
                <div className="p-3 bg-paper rounded border border-line flex justify-between items-center">
                  <div>
                    <span className="text-muted block text-[11px] uppercase font-semibold">Classification:</span>
                    <span className="font-semibold text-ink text-sm">{selectedCase.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface border border-line text-[11px] text-navy font-semibold">
                    Routed by {selectedCase.routed_by === 'ai' ? 'AI Text Engine' : 'Keyword Rules'}
                  </span>
                </div>

                {/* Complaint Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink uppercase text-[11px] tracking-wider">
                      Grievance Text
                    </span>
                    {selectedCase.translated_text && (
                      <button
                        type="button"
                        onClick={() => setShowTranslated(!showTranslated)}
                        className="inline-flex items-center gap-1 text-[11px] text-navy font-semibold underline p-1"
                      >
                        <Languages className="w-3 h-3" />
                        <span>{showTranslated ? 'Show Original Language' : 'Show English Translation'}</span>
                      </button>
                    )}
                  </div>
                  <div className="p-3 bg-surface rounded border border-line text-sm text-ink leading-relaxed whitespace-pre-line">
                    {showTranslated && selectedCase.translated_text
                      ? selectedCase.translated_text
                      : selectedCase.original_text}
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-2 pt-2">
                  <span className="font-semibold text-ink uppercase text-[11px] tracking-wider block">
                    Supporting Documents ({selectedCase.attachments?.length || 0})
                  </span>
                  {(!selectedCase.attachments || selectedCase.attachments.length === 0) ? (
                    <p className="text-muted italic">No attachments submitted.</p>
                  ) : (
                    <div className="divide-y divide-line border border-line rounded bg-surface">
                      {selectedCase.attachments.map((att) => (
                        <div key={att.id} className="p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-navy shrink-0" />
                            <span className="font-medium text-ink truncate">{att.file_name}</span>
                          </div>
                          <span className="text-muted tabular-nums">
                            {(att.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: History Ledger (Internal notes included) */}
            {activeDrawerTab === 'history' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                  Complete Chronological Scrutiny Trail
                </span>
                <LedgerTimeline updates={caseUpdates} />
              </div>
            )}

            {/* Tab 3: Similar Cases (Overlap check) */}
            {activeDrawerTab === 'similar' && (
              <div className="space-y-3">
                <p className="text-xs text-muted">
                  Cases related to <strong className="text-ink">{selectedCase.college_name}</strong> or categorized under <strong className="text-ink">{selectedCase.category}</strong> within the past 30 days.
                </p>
                {similarCasesList.length === 0 ? (
                  <p className="text-xs text-muted italic p-4 text-center border border-line rounded">
                    No other cases recorded for this institution in the last 30 days.
                  </p>
                ) : (
                  <div className="divide-y divide-line border border-line rounded bg-surface text-xs">
                    {similarCasesList.map((sc) => (
                      <div key={sc.id} className="p-3 space-y-1 hover:bg-paper transition-colors">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-navy tabular-nums">{sc.code}</span>
                          <StatusBadge status={sc.status} size="small" />
                        </div>
                        <p className="text-ink truncate font-medium">{sc.category}</p>
                        <div className="flex justify-between text-[11px] text-muted">
                          <span>{sc.cell_name}</span>
                          <span className="tabular-nums">Filed {formatDate(sc.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Bar (Pinned at bottom of drawer) */}
            <div className="pt-4 border-t border-line space-y-2">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Desk Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedCase.status === 'Submitted' && (
                  <Button variant="secondary" size="small" onClick={handleMarkUnderReview}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Mark Under Review</span>
                  </Button>
                )}
                <Button variant="secondary" size="small" onClick={openNoticeDialog}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send Notice</span>
                </Button>
                <Button variant="ghost" size="small" onClick={() => setShowNoteModal(true)}>
                  <span>+ Add Internal Note</span>
                </Button>
                {selectedCase.status !== 'Resolved' && (
                  <Button variant="kesari" size="small" onClick={() => setShowResolveModal(true)}>
                    <span>Resolve Case</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Notice Dialog Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true">
          <div className="bg-surface border border-line rounded p-6 max-w-lg w-full space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-semibold text-ink font-display">
              Dispatch Statutory Notice to Institution
            </h3>
            <p className="text-xs text-muted">
              Prefilled official template. The notice will be logged in the public ledger and transmitted to the registered head of the institution.
            </p>
            <textarea
              rows={4}
              value={noticeTemplate}
              onChange={(e) => setNoticeTemplate(e.target.value)}
              className="w-full text-xs p-3 rounded bg-paper border border-line text-ink focus:outline-none focus:border-navy"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="small" onClick={() => setShowNoticeModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" onClick={handleSendNotice}>
                Dispatch Formal Notice (7 Days)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true">
          <div className="bg-surface border border-line rounded p-6 max-w-md w-full space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-semibold text-ink font-display">
              Record Internal Scrutiny Note
            </h3>
            <p className="text-xs text-muted">
              Add observations, phone verification logs, or preliminary inspection remarks.
            </p>
            <Input
              id="internal_note_input"
              label="Observation"
              placeholder="e.g. Accounts section contacted; fee receipts submitted for re-audit."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="small" onClick={() => setShowNoteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" onClick={handleAddNote} disabled={!noteText.trim()}>
                Save to Ledger
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Case Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true">
          <div className="bg-surface border border-line rounded p-6 max-w-md w-full space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-semibold text-ink font-display">
              Resolve and Close Grievance
            </h3>
            <p className="text-xs text-muted">
              Confirm that the institution has complied or refund proof has been received. This will update the case status to Resolved.
            </p>
            <Input
              id="resolve_note_input"
              label="Closing Remark"
              placeholder="e.g. Refund receipt confirmed by student. Grievance settled."
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="small" onClick={() => setShowResolveModal(false)}>
                Cancel
              </Button>
              <Button variant="kesari" size="small" onClick={handleResolve}>
                Confirm Resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
