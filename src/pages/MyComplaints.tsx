import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../lib/api';
import { Complaint, College, Cell } from '../lib/types';
import { StatusBadge } from '../components/StatusBadge';
import { DaysLeft } from '../components/DaysLeft';
import { DataTable, Column } from '../components/DataTable';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { formatDate } from '../lib/time';

export const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listMyComplaints(), api.listColleges(), api.listCells()])
      .then(([myC, col, cel]) => {
        setComplaints(myC);
        setColleges(col);
        setCells(cel);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<Complaint>[] = [
    {
      key: 'code',
      header: 'Complaint ID',
      width: '160px',
      render: (c) => (
        <span className="font-semibold text-navy tabular-nums hover:underline">
          {c.code}
        </span>
      )
    },
    {
      key: 'college_id',
      header: 'Institution',
      render: (c) => {
        const col = colleges.find((cl) => cl.id === c.college_id);
        return (
          <div>
            <div className="font-medium text-ink">{col?.name || 'Institution'}</div>
            <div className="text-xs text-muted tabular-nums">AICTE ID: {col?.aicte_id}</div>
          </div>
        );
      }
    },
    {
      key: 'cell_id',
      header: 'Assigned Cell',
      render: (c) => {
        const cel = cells.find((ce) => ce.id === c.cell_id);
        return <span className="text-muted">{cel?.name || 'Assigned Bureau'}</span>;
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />
    },
    {
      key: 'due_date',
      header: 'Timeline',
      render: (c) => <DaysLeft dueDate={c.due_date} status={c.status} />
    },
    {
      key: 'created_at',
      header: 'Filed on',
      align: 'right',
      render: (c) => (
        <span className="text-muted tabular-nums text-xs">
          {formatDate(c.created_at)}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-10 text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">My Complaints</h1>
          <div className="kesari-rule my-3" />
          <p className="text-sm text-muted">
            All grievances filed from your registered profile. Click any record to view officer actions and notice replies.
          </p>
        </div>
        <Link to="/file">
          <Button variant="kesari" size="small">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>File new complaint</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted border border-line bg-surface">
          Loading grievance records…
        </div>
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints filed yet"
          description="You have not submitted any grievance petitions to AICTE. If you are experiencing issues regarding fees, ragging, or unapproved courses, file a complaint now."
          actionText="File a complaint · शिकायत दर्ज करें"
          onAction={() => navigate('/file')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={complaints}
          keyExtractor={(c) => c.id}
          onRowSelect={(c) => navigate(`/case/${c.code}`)}
          ariaLabel="My filed complaints table"
        />
      )}
    </div>
  );
};
