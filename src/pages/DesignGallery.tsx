import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';
import { FileDrop, UploadedFile } from '../components/FileDrop';
import { StatusBadge } from '../components/StatusBadge';
import { DaysLeft } from '../components/DaysLeft';
import { DataTable } from '../components/DataTable';
import { LedgerTimeline } from '../components/LedgerTimeline';
import { EmptyState } from '../components/EmptyState';
import { Tabs } from '../components/Tabs';
import { Kpi } from '../components/Kpi';
import { BarList } from '../components/BarList';
import { CaseUpdate } from '../lib/types';

export const DesignGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [demoFiles, setDemoFiles] = useState<UploadedFile[]>([
    { name: 'receipt_2026.pdf', size: 450000, type: 'application/pdf' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const demoUpdates: CaseUpdate[] = [
    {
      id: 'upd_1',
      complaint_id: 'cmp_1001',
      actor_id: 'usr_student',
      actor_role: 'complainant',
      actor_name: 'Aarav Sharma',
      action: 'Complaint received',
      note: 'Grievance submitted regarding caution deposit refund.',
      visible_to_complainant: true,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'upd_2',
      complaint_id: 'cmp_1001',
      actor_id: 'usr_officer',
      actor_role: 'officer',
      actor_name: 'Meera Iyer',
      action: 'Notice sent to college seeking an explanation within 7 days',
      note: 'Official notice emailed to Principal requesting refund disbursement slip.',
      old_status: 'Under Review',
      new_status: 'Notice Sent',
      visible_to_complainant: true,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ];

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 text-left space-y-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Design System Gallery</h1>
        <div className="kesari-rule my-3" />
        <p className="text-sm text-muted">
          "Daftar-Setu" — An authentic register aesthetic built exclusively with Tailwind tokens and design constraints from docs/DESIGN.md.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'components', label: 'Interactive Components' },
          { id: 'typography', label: 'Typography Specimen' },
          { id: 'tokens', label: 'Design Tokens & Colours' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'typography' && (
        <section className="space-y-8 bg-surface p-6 border border-line rounded">
          <h2 className="text-xl font-display font-semibold text-navy">Trilingual Type Specimens</h2>
          <p className="text-sm text-muted">
            Display & Headings: Eczar (600). Body & Forms: Anek Latin, Anek Devanagari, Anek Telugu. Tabular numerals for dates, IDs and numbers.
          </p>

          <div className="space-y-6 divide-y divide-line pt-2">
            <div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                Display 44/48 (Eczar / Anek)
              </span>
              <p className="text-3xl sm:text-4xl font-display font-bold text-navy">
                AICTE OneView: One Institution. One Consolidated View.
              </p>
              <p className="text-2xl sm:text-3xl font-display font-bold text-ink mt-2">
                एक संस्थान। एक एकीकृत पारदर्शी दृष्टिकोण।
              </p>
              <p className="text-2xl sm:text-3xl font-display font-bold text-ink mt-2">
                ఒకే సంస్థ. ఒకే సమీకృత దృక్కోణం.
              </p>
            </div>

            <div className="pt-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                H1 32/38 · Page Titles
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">
                Integrated Grievance Monitoring & Redressal Ledger
              </h1>
              <h1 className="text-xl sm:text-2xl font-display font-semibold text-ink mt-1">
                संस्थान-वार शिकायत निवारण एवं निगरानी पंजिका
              </h1>
            </div>

            <div className="pt-4">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                Body 16/24 with Tabular Numerals
              </span>
              <p className="text-base text-ink leading-relaxed">
                Complaint AICTE-26-01045 filed on 14 Oct 2026 for ₹85,000 refund due in 15 days.
              </p>
              <p className="text-base text-ink leading-relaxed mt-1">
                शिकायत संख्या AICTE-26-01045 दिनांक 14 अक्टूबर 2026 को ₹85,000 रिफंड हेतु दर्ज की गई।
              </p>
              <p className="text-base text-ink leading-relaxed mt-1">
                ఫిర్యాదు సంఖ్య AICTE-26-01045 అక్టోబర్ 14, 2026న రూ. 85,000 రీఫండ్ కొరకు దాఖలు చేయబడింది.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'tokens' && (
        <section className="space-y-8 bg-surface p-6 border border-line rounded">
          <h2 className="text-xl font-display font-semibold text-navy">Colour Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-medium">
            <div className="p-3 rounded border border-line bg-paper text-ink">
              <div className="font-bold">--paper</div>
              <div className="text-muted">#F7F3EA</div>
            </div>
            <div className="p-3 rounded border border-line bg-surface text-ink">
              <div className="font-bold">--surface</div>
              <div className="text-muted">#FFFFFF</div>
            </div>
            <div className="p-3 rounded border border-line bg-navy text-on-navy">
              <div className="font-bold">--navy</div>
              <div className="text-white/80">#0B2A5B</div>
            </div>
            <div className="p-3 rounded border border-line bg-kesari text-ink">
              <div className="font-bold">--kesari</div>
              <div className="text-ink/80">#E8890C</div>
            </div>
            <div className="p-3 rounded border border-line bg-kesari-soft text-ink">
              <div className="font-bold">--kesari-soft</div>
              <div className="text-muted">#FBE7C6</div>
            </div>
            <div className="p-3 rounded border border-line bg-[#ECEAE4] text-[#4F596E]">
              <div className="font-bold">Submitted Pair</div>
              <div>#4F596E / #ECEAE4</div>
            </div>
            <div className="p-3 rounded border border-line bg-[#E3EBFA] text-[#1F4FB4]">
              <div className="font-bold">Under Review Pair</div>
              <div>#1F4FB4 / #E3EBFA</div>
            </div>
            <div className="p-3 rounded border border-line bg-[#FBEBCF] text-[#8A5A00]">
              <div className="font-bold">Notice Sent Pair</div>
              <div>#8A5A00 / #FBEBCF</div>
            </div>
            <div className="p-3 rounded border border-line bg-[#DDEFE7] text-[#1E6B4F]">
              <div className="font-bold">Resolved Pair</div>
              <div>#1E6B4F / #DDEFE7</div>
            </div>
            <div className="p-3 rounded border border-line bg-[#F7DDD8] text-[#B3321F]">
              <div className="font-bold">Escalated Pair</div>
              <div>#B3321F / #F7DDD8</div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'components' && (
        <div className="space-y-10">
          {/* Status Badges & Days Left */}
          <section className="p-6 border border-line rounded bg-surface space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">Status Badges & SLA Chips</h3>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="Submitted" />
              <StatusBadge status="Under Review" />
              <StatusBadge status="Notice Sent" />
              <StatusBadge status="Resolved" />
              <StatusBadge status="Escalated" />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <DaysLeft dueDate={new Date(Date.now() + 9 * 86400000).toISOString()} status="Under Review" />
              <DaysLeft dueDate={new Date().toISOString()} status="Under Review" />
              <DaysLeft dueDate={new Date(Date.now() - 3 * 86400000).toISOString()} status="Escalated" />
              <DaysLeft dueDate={new Date().toISOString()} status="Resolved" />
            </div>
          </section>

          {/* Buttons */}
          <section className="p-6 border border-line rounded bg-surface space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">Buttons (44px min height)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Navy</Button>
              <Button variant="secondary">Secondary Outline</Button>
              <Button variant="kesari">Kesari Primary CTA</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Action</Button>
              <Button variant="primary" disabled>Disabled State</Button>
            </div>
          </section>

          {/* Form controls */}
          <section className="p-6 border border-line rounded bg-surface space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">Form Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="demo_input_1"
                label="Complaint or Roll Number"
                placeholder="e.g. AICTE-26-01045"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Enter the 14-character official tracking ID"
              />
              <Input
                id="demo_input_error"
                label="Invalid Field"
                defaultValue="invalid_format"
                error="Format must match AICTE-26-XXXXX"
              />
              <Select
                id="demo_select"
                label="Select Bureau/Cell"
                placeholder="-- Choose assigned cell --"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: '1', label: 'Anti-Ragging Cell (7-day SLA)' },
                  { value: '2', label: 'Approvals Bureau (15-day SLA)' },
                  { value: '3', label: 'Finance & Refunds Cell (15-day SLA)' }
                ]}
              />
              <Textarea
                id="demo_textarea"
                label="Grievance Details"
                placeholder="Describe the issue in detail..."
                currentCount={48}
                minChars={20}
              />
            </div>
            <FileDrop files={demoFiles} onFilesChange={setDemoFiles} />
          </section>

          {/* DataTable */}
          <section className="p-6 border border-line rounded bg-surface space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">Data Table (Zero Radius, Keyboard Nav)</h3>
            <DataTable
              columns={[
                { key: 'code', header: 'ID', render: () => <span className="font-semibold text-navy">AICTE-26-01045</span> },
                { key: 'college', header: 'College', render: () => 'Sunrise Institute of Technology' },
                { key: 'status', header: 'Status', render: () => <StatusBadge status="Under Review" /> }
              ]}
              data={[{ id: '1' }]}
              keyExtractor={(r: any) => r.id}
            />
          </section>

          {/* Ledger Timeline */}
          <section className="p-6 border border-line rounded bg-surface space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">Case History (Ledger Timeline)</h3>
            <LedgerTimeline updates={demoUpdates} />
          </section>

          {/* KPIs & Ranked Bars */}
          <section className="p-6 border border-line rounded bg-surface space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">KPI & Ranked Bar Visualizations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Kpi label="Total Received" value={70} context="Across all AICTE cells" />
              <Kpi label="SLA Compliance" value="88%" context="Resolution within statutory limit" />
              <Kpi label="Breached Overdue" value={8} context="Escalated to Chairman" isBreach />
            </div>
            <div className="pt-4">
              <BarList
                items={[
                  { label: 'Sunrise Institute of Technology', value: 24, secondaryValue: 5, sublabel: 'Telangana' },
                  { label: 'Greenfield Engineering College', value: 14, secondaryValue: 2, sublabel: 'Karnataka' },
                  { label: 'Lakeview Polytechnic', value: 9, secondaryValue: 0, sublabel: 'Maharashtra' }
                ]}
              />
            </div>
          </section>

          {/* Empty State */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-ink font-display">Empty State with Jaali Pattern</h3>
            <EmptyState
              title="No complaints filed yet"
              description="Your registered grievances and live tracking updates will appear in this ledger once submitted."
              actionText="File a complaint"
              onAction={() => alert('Navigate to /file')}
            />
          </section>
        </div>
      )}
    </div>
  );
};
