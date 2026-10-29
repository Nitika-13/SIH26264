import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { api } from '../lib/api';
import {
  Kpis,
  CollegeStats,
  CellStats,
  CategoryStats,
  TrendStats,
  RepeatOffender,
  CaseRow
} from '../lib/types';
import { Kpi } from '../components/Kpi';
import { BarList } from '../components/BarList';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { DaysLeft } from '../components/DaysLeft';
import { StatusBadge } from '../components/StatusBadge';

export const Leadership: React.FC = () => {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [collegeStats, setCollegeStats] = useState<CollegeStats[]>([]);
  const [cellStats, setCellStats] = useState<CellStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [trendStats, setTrendStats] = useState<TrendStats[]>([]);
  const [repeatOffenders, setRepeatOffenders] = useState<RepeatOffender[]>([]);
  const [escalatedCases, setEscalatedCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [k, col, cel, cat, tr, rep, esc] = await Promise.all([
        api.getKpis(),
        api.getByCollege(),
        api.getByCell(),
        api.getByCategory(),
        api.getTrend(),
        api.getRepeatOffenders(),
        api.listCases({ status: 'Escalated' })
      ]);
      setKpis(k);
      setCollegeStats(col);
      setCellStats(cel);
      setCategoryStats(cat);
      setTrendStats(tr);
      setRepeatOffenders(rep);
      setEscalatedCases(esc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('casesupdated', handleUpdate);
    return () => window.removeEventListener('casesupdated', handleUpdate);
  }, [loadData]);

  const handleSimulateDays = async (days: number) => {
    try {
      const escalatedCount = await api.simulateDays(days);
      setActionNotice(`Simulation active: ${days} days elapsed. ${escalatedCount} cases auto-escalated.`);
      await loadData();
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Simulation error');
    }
  };

  const handleRunEscalation = async () => {
    try {
      const count = await api.escalateOverdue();
      setActionNotice(`Escalation audit complete. ${count} newly escalated cases identified.`);
      await loadData();
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Error running check');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to baseline seeded state?')) {
      await api.resetDemo();
      setActionNotice('Demo records reset to default seeded values.');
      await loadData();
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const escalatedColumns: Column<CaseRow>[] = [
    {
      key: 'code',
      header: 'Case ID',
      width: '140px',
      render: (c) => (
        <span className="font-semibold text-navy tabular-nums">
          {c.code}
        </span>
      )
    },
    {
      key: 'college_name',
      header: 'Institution',
      render: (c) => (
        <div>
          <span className="font-medium text-ink block">{c.college_name}</span>
          <span className="text-xs text-muted tabular-nums">ID: {c.college_aicte_id}</span>
        </div>
      )
    },
    {
      key: 'cell_name',
      header: 'Bureau / Cell',
      render: (c) => <span className="text-muted">{c.cell_name}</span>
    },
    {
      key: 'category',
      header: 'Subject',
      render: (c) => <span className="text-xs text-ink">{c.category}</span>
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (c) => <StatusBadge status={c.status} size="small" />
    },
    {
      key: 'due_date',
      header: 'Overdue By',
      width: '130px',
      render: (c) => <DaysLeft dueDate={c.due_date} status={c.status} />
    },
    {
      key: 'action',
      header: 'Inspect',
      align: 'right',
      render: (c) => (
        <Link
          to={`/case/${c.code}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
        >
          <span>Open Docket</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      )
    }
  ];

  return (
    <div className="max-w-wide mx-auto px-4 sm:px-6 py-8 text-left space-y-8">
      {/* Action Notice Banner */}
      {actionNotice && (
        <div className="p-3 bg-navy text-on-navy text-xs font-semibold rounded flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B5DFCB]" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-navy tracking-wider">
              AICTE Executive Oversight
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">Chairman's Monitoring Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy mt-1">
            Grievance Redressal & Compliance Analytics
          </h1>
        </div>

        {/* Senior Demo Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleSimulateDays(16)}
            title="Advance due dates by 16 days to trigger SLA breaches"
          >
            <Play className="w-3.5 h-3.5 mr-1 text-navy" />
            <span>Simulate 16 Days</span>
          </Button>

          <Button
            variant="secondary"
            size="small"
            onClick={handleRunEscalation}
            title="Scan for cases exceeding statutory response timeline"
          >
            <Clock className="w-3.5 h-3.5 mr-1 text-[#B3321F]" />
            <span>Run Escalation Check</span>
          </Button>

          <Button
            variant="ghost"
            size="small"
            onClick={handleResetData}
            title="Reset mock database to initial seed"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-muted" />
            <span>Reset Data</span>
          </Button>
        </div>
      </div>

      {/* Top Ledger Strip of 5 KPIs (Section 6) */}
      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Kpi
            label="Total Complaints"
            value={kpis.total}
            context="Across all 5 AICTE Bureaus"
          />
          <Kpi
            label="Open Cases"
            value={kpis.open_cases}
            context="Under review or notice issued"
          />
          <Kpi
            label="Resolved Ratio"
            value={`${kpis.total > 0 ? Math.round((kpis.resolved / kpis.total) * 100) : 0}%`}
            context={`${kpis.resolved} grievances closed`}
          />
          <Kpi
            label="Avg Disposal"
            value={`${kpis.avg_resolution_days} days`}
            context="Within statutory guidelines"
          />
          <Kpi
            label="SLA Breach"
            value={`${kpis.sla_breach_pct}%`}
            context={`${kpis.escalated} cases escalated`}
            isBreach={kpis.sla_breach_pct > 0}
          />
        </div>
      )}

      {/* Strict 7/5 Unequal Two-Column Layout (Section 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7/12): Ranked Institutions, Repeat Offender Alert, Weekly Trend Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Complaints by College Ranked Bars */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <h2 className="text-lg font-semibold text-ink font-display">
                  Complaints by Technical Institution
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Ranked by cumulative volume received over the active cycle.
                </p>
              </div>
              <span className="text-xs text-navy font-semibold tabular-nums">
                {collegeStats.length} Campus Profiles
              </span>
            </div>

            <BarList
              items={collegeStats.map((cs) => ({
                label: cs.college,
                value: cs.total,
                secondaryValue: cs.escalated,
                sublabel: cs.state
              }))}
              valueLabel="Cases"
              secondaryLabel="Overdue"
            />

            {/* Repeat Offender Alert Line beneath (Section 6) */}
            {repeatOffenders.length > 0 && (
              <div className="mt-4 p-3.5 rounded bg-[#FBEBCF] border border-[#E8CFA2] flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#8A5A00] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-ink block">
                    Repeat Offender Pattern Flagged
                  </span>
                  <p className="text-ink/80 mt-0.5 leading-relaxed">
                    <strong className="text-ink">{repeatOffenders[0].college}</strong>: recorded{' '}
                    <strong className="text-[#B3321F] tabular-nums font-semibold">
                      {repeatOffenders[0].cases_30d} similar {repeatOffenders[0].category.toLowerCase()}
                    </strong>{' '}
                    complaints within the last 30 days. Formal inquiry recommended under AICTE Approval Process Handbook regulations.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Trend Line Chart (Recharts with Token Colours Only) */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-ink font-display">
                Weekly Grievance Inflow Trend
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Volume trajectory across the simulated 4-week window.
              </p>
              {/* Visually hidden text summary for accessibility (Section 6) */}
              <div className="sr-only">
                Weekly complaint registration trend: Week 1: 14 complaints, Week 2: 18 complaints, Week 3: 22 complaints, Week 4: 16 complaints.
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendStats} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                  <XAxis
                    dataKey="week"
                    stroke="#4F596E"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#4F596E"
                    fontSize={12}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D9D2C3',
                      fontSize: '12px',
                      borderRadius: '4px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Complaints Received"
                    stroke="#0B2A5B"
                    strokeWidth={3}
                    dot={{ fill: '#E8890C', r: 5 }}
                    activeDot={{ r: 7, fill: '#0B2A5B' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (5/12): Complaints by Cell, Complaints by Category */}
        <div className="lg:col-span-5 space-y-6">
          {/* Complaints by Cell */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-ink font-display">
                Workload by AICTE Bureau / Cell
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Operational allocation and statutory SLA monitoring.
              </p>
            </div>

            <BarList
              items={cellStats.map((c) => ({
                label: c.cell,
                value: c.total,
                secondaryValue: c.escalated,
                sublabel: `Avg ${c.avg_resolution_days}d`
              }))}
              valueLabel="Active"
              secondaryLabel="Breached"
            />
          </div>

          {/* Complaints by Category */}
          <div className="p-6 border border-line rounded bg-surface space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-ink font-display">
                Classification by Grievance Nature
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Categorized via AI semantic routing rules.
              </p>
            </div>

            <BarList
              items={categoryStats.map((cat) => ({
                label: cat.category,
                value: cat.total
              }))}
              valueLabel="Cases"
            />
          </div>
        </div>
      </div>

      {/* Escalated to the Chairman's Office Table (Section 6) */}
      <div className="border border-line rounded bg-surface p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#B3321F]" />
            <h2 className="text-lg font-semibold text-ink font-display">
              Escalated to the Chairman's Office ({escalatedCases.length})
            </h2>
          </div>
          <span className="text-xs text-[#B3321F] font-semibold bg-[#F7DDD8] px-2 py-0.5 rounded-[2px] border border-[#E8B6AD]">
            Statutory SLAs Exceeded · Executive Intervention Required
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-muted py-4">Checking escalated dockets…</p>
        ) : escalatedCases.length === 0 ? (
          <p className="text-xs text-muted py-6 text-center">
            Zero escalated cases. All AICTE Bureaus are currently operating within prescribed statutory deadlines.
          </p>
        ) : (
          <DataTable
            columns={escalatedColumns}
            data={escalatedCases}
            keyExtractor={(c) => c.id}
            ariaLabel="Escalated complaints table"
          />
        )}
      </div>
    </div>
  );
};
