import {
  Cell,
  College,
  Complaint,
  ComplaintDetail,
  CaseRow,
  CaseUpdate,
  NotificationRow,
  PublicTrack,
  Session,
  Status,
  Kpis,
  CollegeStats,
  CellStats,
  CategoryStats,
  TrendStats,
  RepeatOffender
} from './types';
import { INITIAL_CELLS, INITIAL_COLLEGES, generateSeedData } from './mockData';
import { DEMO_USERS, getStoredSession, setStoredSession } from './session';
import { routeWithAi } from './routing';
import { now } from './time';

const STORAGE_KEY = 'sih26264-mock-v1';

interface MockDatabase {
  complaints: Complaint[];
  case_updates: CaseUpdate[];
  notifications_log: NotificationRow[];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(): Promise<void> {
  const ms = 150 + Math.floor(Math.random() * 250);
  return delay(ms);
}

class MockApiStore {
  private db: MockDatabase;

  constructor() {
    this.db = this.load();
  }

  private load(): MockDatabase {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    const seed = generateSeedData();
    this.save(seed);
    return seed;
  }

  private save(data: MockDatabase): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.db = data;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public async resetDemo(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = generateSeedData();
    this.save(fresh);
  }

  public getSession(): Session | null {
    return getStoredSession();
  }

  public async signIn(email: string): Promise<Session> {
    await randomDelay();
    const user = DEMO_USERS[email.toLowerCase().trim()];
    if (!user) {
      throw new Error('Invalid email for demo. Please select a valid demo user.');
    }
    const session: Session = { user, token: 'mock-jwt-token' };
    setStoredSession(session);
    return session;
  }

  public async signOut(): Promise<void> {
    await randomDelay();
    setStoredSession(null);
  }

  public async listColleges(): Promise<College[]> {
    await randomDelay();
    return INITIAL_COLLEGES;
  }

  public async listCells(): Promise<Cell[]> {
    await randomDelay();
    return INITIAL_CELLS;
  }

  public async createComplaint(input: {
    college_id: number;
    original_text: string;
    files: { name: string; size: number; type: string }[];
  }): Promise<Complaint> {
    const session = this.getSession();
    if (!session) {
      throw new Error('Authentication required to submit a complaint.');
    }

    // AI simulation delay: 1.2s as specified
    await delay(1200);

    const aiResult = routeWithAi(input.original_text);
    const cell = INITIAL_CELLS.find(c => c.id === aiResult.cell_id) || INITIAL_CELLS[4];
    const college = INITIAL_COLLEGES.find(c => c.id === input.college_id);

    const currentClock = now();
    const created_at = currentClock.toISOString();
    const dueDateObj = new Date(currentClock.getTime() + cell.sla_days * 24 * 60 * 60 * 1000);
    const due_date = dueDateObj.toISOString();

    const nextCodeNum = 1001 + this.db.complaints.length;
    const code = `AICTE-26-${nextCodeNum.toString().padStart(5, '0')}`;
    const id = `cmp_${nextCodeNum}`;

    const attachments = input.files.map((f, idx) => ({
      id: `att_${nextCodeNum}_${idx}`,
      complaint_id: id,
      file_name: f.name,
      file_path: `/uploads/${f.name}`,
      mime_type: f.type || 'application/pdf',
      size: f.size
    }));

    // Check overlap with other active complaints for this college
    const overlapping = this.db.complaints.filter(
      c => c.college_id === input.college_id && c.status !== 'Resolved'
    );
    const hasOverlap = overlapping.length > 0;
    const overlap_case_ids = overlapping.map(c => c.code);
    const diffCells = new Set(overlapping.map(o => o.cell_id));
    diffCells.add(cell.id);

    const newComplaint: Complaint = {
      id,
      code,
      complainant_id: session.user.id,
      college_id: input.college_id,
      cell_id: cell.id,
      category: aiResult.category,
      urgency: aiResult.urgency,
      summary: aiResult.summary,
      original_text: input.original_text,
      translated_text: aiResult.translated_text,
      language: aiResult.language,
      status: 'Submitted',
      routed_by: 'ai',
      created_at,
      due_date,
      resolved_at: null,
      attachments,
      overlap_alert: hasOverlap,
      overlap_case_ids: hasOverlap ? overlap_case_ids : undefined,
      overlap_reasons: hasOverlap ? [
        `Same AICTE Permanent ID (${college?.aicte_id})`,
        diffCells.size > 1 ? `Multi-Bureau handling across ${diffCells.size} different cells` : 'Concurrent complaint for same campus',
        'Potential overlap requiring cross-bureau coordination'
      ] : undefined
    };

    const initialUpdate: CaseUpdate = {
      id: `upd_${nextCodeNum}_0`,
      complaint_id: id,
      actor_id: session.user.id,
      actor_role: 'complainant',
      actor_name: session.user.full_name,
      action: 'Complaint received',
      note: `Grievance registered. Assigned to ${cell.name} with standard ${cell.sla_days}-day SLA.`,
      new_status: 'Submitted',
      visible_to_complainant: true,
      created_at
    };

    const aiUpdate: CaseUpdate = {
      id: `upd_${nextCodeNum}_ai`,
      complaint_id: id,
      actor_id: 'system',
      actor_role: 'system',
      actor_name: 'AI Routing Engine',
      action: `Routed by AI to ${cell.name}`,
      note: `Language: ${aiResult.language.toUpperCase()}. Categorised under ${aiResult.category}.`,
      visible_to_complainant: true,
      created_at: new Date(currentClock.getTime() + 1000).toISOString()
    };

    this.db.complaints.unshift(newComplaint);
    this.db.case_updates.push(initialUpdate, aiUpdate);
    this.save(this.db);

    return newComplaint;
  }

  public async listMyComplaints(): Promise<Complaint[]> {
    await randomDelay();
    const session = this.getSession();
    if (!session) {
      throw new Error('Authentication required.');
    }
    return this.db.complaints.filter(c => c.complainant_id === session.user.id);
  }

  public async getComplaintByCode(code: string): Promise<ComplaintDetail> {
    await randomDelay();
    const complaint = this.db.complaints.find(c => c.code === code.trim().toUpperCase());
    if (!complaint) {
      throw new Error(`Complaint ${code} not found.`);
    }

    const session = this.getSession();
    if (session && session.user.role === 'complainant' && complaint.complainant_id !== session.user.id) {
      throw new Error('Access denied: You do not have permission to view this complaint.');
    }

    const college = INITIAL_COLLEGES.find(c => c.id === complaint.college_id)!;
    const cell = INITIAL_CELLS.find(c => c.id === complaint.cell_id)!;
    
    // Complainant sees only visible updates
    let updates = this.db.case_updates.filter(u => u.complaint_id === complaint.id);
    if (session && session.user.role === 'complainant') {
      updates = updates.filter(u => u.visible_to_complainant);
    }

    // Sort updates chronologically (oldest first for ledger timeline)
    updates.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return {
      ...complaint,
      college,
      cell,
      updates
    };
  }

  public async trackByCode(code: string): Promise<PublicTrack | null> {
    await randomDelay();
    const complaint = this.db.complaints.find(c => c.code === code.trim().toUpperCase());
    if (!complaint) {
      return null;
    }

    const college = INITIAL_COLLEGES.find(c => c.id === complaint.college_id);
    const cell = INITIAL_CELLS.find(c => c.id === complaint.cell_id);
    const updates = this.db.case_updates
      .filter(u => u.complaint_id === complaint.id && u.visible_to_complainant)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return {
      code: complaint.code,
      status: complaint.status,
      cell: cell ? cell.name : 'AICTE Cell',
      college: college ? college.name : 'Technical Institution',
      created_at: complaint.created_at,
      due_date: complaint.due_date,
      timeline: updates.map(u => ({
        action: u.action,
        at: u.created_at
      }))
    };
  }

  public async listCases(filter: {
    cell_id?: number;
    status?: string;
    college_id?: number;
    overdueOnly?: boolean;
  }): Promise<CaseRow[]> {
    await randomDelay();
    const session = this.getSession();
    if (!session || (session.user.role !== 'officer' && session.user.role !== 'senior' && session.user.role !== 'admin')) {
      throw new Error('Access denied: Officer or Senior credentials required.');
    }

    let list = this.db.complaints;

    // Permissions: Officer can only see their own cell
    if (session.user.role === 'officer' && session.user.cell_id) {
      list = list.filter(c => c.cell_id === session.user.cell_id);
    } else if (filter.cell_id) {
      list = list.filter(c => c.cell_id === filter.cell_id);
    }

    if (filter.status && filter.status !== 'All') {
      list = list.filter(c => c.status === filter.status);
    }

    if (filter.college_id) {
      list = list.filter(c => c.college_id === filter.college_id);
    }

    const currentTime = now().getTime();
    if (filter.overdueOnly) {
      list = list.filter(c => c.status !== 'Resolved' && new Date(c.due_date).getTime() < currentTime);
    }

    const rows: CaseRow[] = list.map(c => {
      const col = INITIAL_COLLEGES.find(col => col.id === c.college_id);
      const cel = INITIAL_CELLS.find(cel => cel.id === c.cell_id);
      return {
        ...c,
        college_name: col?.name || 'Unknown College',
        college_state: col?.state || 'Unknown State',
        cell_name: cel?.name || 'Unknown Cell',
        college_aicte_id: col?.aicte_id || 'N/A'
      };
    });

    // Default sort: due date ascending
    rows.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    return rows;
  }

  public async updateCase(
    id: string,
    patch: { status?: Status; note?: string; notice?: boolean }
  ): Promise<void> {
    await randomDelay();
    const session = this.getSession();
    if (!session || (session.user.role !== 'officer' && session.user.role !== 'senior' && session.user.role !== 'admin')) {
      throw new Error('Access denied: Unauthorized to update cases.');
    }

    const complaint = this.db.complaints.find(c => c.id === id);
    if (!complaint) {
      throw new Error(`Case ${id} not found.`);
    }

    // Role check: officer can only act on their own cell
    if (session.user.role === 'officer' && session.user.cell_id && complaint.cell_id !== session.user.cell_id) {
      throw new Error('Unauthorized: You can only act on cases in your assigned Bureau/Cell.');
    }

    const old_status = complaint.status;
    const new_status = patch.status || old_status;
    const currentTime = now().toISOString();

    if (patch.status) {
      complaint.status = patch.status;
      if (patch.status === 'Resolved') {
        complaint.resolved_at = currentTime;
      }
    }

    let action = patch.status ? `Status updated to ${patch.status}` : 'Internal note recorded';
    if (patch.notice) {
      action = 'Notice sent to college seeking an explanation within 7 days';
    }

    const updateRecord: CaseUpdate = {
      id: `upd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      complaint_id: complaint.id,
      actor_id: session.user.id,
      actor_role: session.user.role,
      actor_name: session.user.full_name,
      action,
      note: patch.note || (patch.notice ? 'Formal notice issued to institution management.' : undefined),
      old_status,
      new_status,
      visible_to_complainant: true,
      created_at: currentTime
    };

    this.db.case_updates.push(updateRecord);

    if (patch.notice) {
      const col = INITIAL_COLLEGES.find(c => c.id === complaint.college_id);
      this.db.notifications_log.push({
        id: `notif_${Date.now()}`,
        complaint_id: complaint.id,
        channel: 'email',
        recipient: `director@${col ? col.name.toLowerCase().replace(/[^a-z]/g, '') : 'institution'}.edu.in`,
        message: patch.note || `Official Notice for complaint ${complaint.code}. Reply requested within 7 days.`,
        sent_at: currentTime
      });
    }

    this.save(this.db);
  }

  public async similarCases(id: string): Promise<CaseRow[]> {
    await randomDelay();
    const complaint = this.db.complaints.find(c => c.id === id);
    if (!complaint) return [];

    const thirtyDaysAgo = now().getTime() - 30 * 24 * 60 * 60 * 1000;

    // Same college OR same category in last 30 days, prioritizing same college (overlap detection!)
    const matched = this.db.complaints.filter(c =>
      c.id !== id &&
      (c.college_id === complaint.college_id || c.category === complaint.category) &&
      new Date(c.created_at).getTime() >= thirtyDaysAgo
    );

    return matched.map(c => {
      const col = INITIAL_COLLEGES.find(col => col.id === c.college_id);
      const cel = INITIAL_CELLS.find(cel => cel.id === c.cell_id);
      return {
        ...c,
        college_name: col?.name || 'Unknown College',
        college_state: col?.state || 'Unknown State',
        cell_name: cel?.name || 'Unknown Cell',
        college_aicte_id: col?.aicte_id || 'N/A'
      };
    });
  }

  public async listNotifications(): Promise<NotificationRow[]> {
    await randomDelay();
    return [...this.db.notifications_log].reverse();
  }

  public async getKpis(): Promise<Kpis> {
    await randomDelay();
    const total = this.db.complaints.length;
    const resolved = this.db.complaints.filter(c => c.status === 'Resolved').length;
    const open_cases = total - resolved;
    const escalated = this.db.complaints.filter(c => c.status === 'Escalated').length;

    const currentTime = now().getTime();
    const breaches = this.db.complaints.filter(c => {
      if (c.status === 'Resolved' && c.resolved_at) {
        return new Date(c.resolved_at).getTime() > new Date(c.due_date).getTime();
      }
      return c.status !== 'Resolved' && currentTime > new Date(c.due_date).getTime();
    }).length;

    const sla_breach_pct = total > 0 ? Math.round((breaches / total) * 100) : 0;

    // Average resolution days for resolved cases
    const resolvedCases = this.db.complaints.filter(c => c.status === 'Resolved' && c.resolved_at);
    let avg_resolution_days = 9; // baseline
    if (resolvedCases.length > 0) {
      const totalDays = resolvedCases.reduce((sum, c) => {
        const created = new Date(c.created_at).getTime();
        const res = new Date(c.resolved_at!).getTime();
        return sum + Math.max(1, Math.round((res - created) / (1000 * 60 * 60 * 24)));
      }, 0);
      avg_resolution_days = Math.round(totalDays / resolvedCases.length);
    }

    return {
      total,
      open_cases,
      resolved,
      escalated,
      sla_breach_pct,
      avg_resolution_days
    };
  }

  public async getByCollege(): Promise<CollegeStats[]> {
    await randomDelay();
    const statsMap: Record<number, { total: number; open_cases: number; escalated: number }> = {};
    INITIAL_COLLEGES.forEach(c => {
      statsMap[c.id] = { total: 0, open_cases: 0, escalated: 0 };
    });

    this.db.complaints.forEach(c => {
      if (!statsMap[c.college_id]) {
        statsMap[c.college_id] = { total: 0, open_cases: 0, escalated: 0 };
      }
      statsMap[c.college_id].total += 1;
      if (c.status !== 'Resolved') statsMap[c.college_id].open_cases += 1;
      if (c.status === 'Escalated') statsMap[c.college_id].escalated += 1;
    });

    return INITIAL_COLLEGES.map(col => ({
      college: col.name,
      state: col.state,
      total: statsMap[col.id].total,
      open_cases: statsMap[col.id].open_cases,
      escalated: statsMap[col.id].escalated
    })).sort((a, b) => b.total - a.total);
  }

  public async getByCell(): Promise<CellStats[]> {
    await randomDelay();
    const map: Record<number, { total: number; open_cases: number; escalated: number; resSum: number; resCount: number }> = {};
    INITIAL_CELLS.forEach(c => {
      map[c.id] = { total: 0, open_cases: 0, escalated: 0, resSum: 0, resCount: 0 };
    });

    this.db.complaints.forEach(c => {
      if (!map[c.cell_id]) {
        map[c.cell_id] = { total: 0, open_cases: 0, escalated: 0, resSum: 0, resCount: 0 };
      }
      map[c.cell_id].total += 1;
      if (c.status !== 'Resolved') map[c.cell_id].open_cases += 1;
      if (c.status === 'Escalated') map[c.cell_id].escalated += 1;
      if (c.status === 'Resolved' && c.resolved_at) {
        const days = Math.round((new Date(c.resolved_at).getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24));
        map[c.cell_id].resSum += Math.max(1, days);
        map[c.cell_id].resCount += 1;
      }
    });

    return INITIAL_CELLS.map(c => ({
      cell: c.name,
      total: map[c.id].total,
      open_cases: map[c.id].open_cases,
      escalated: map[c.id].escalated,
      avg_resolution_days: map[c.id].resCount > 0 ? Math.round(map[c.id].resSum / map[c.id].resCount) : c.sla_days - 2
    })).sort((a, b) => b.total - a.total);
  }

  public async getByCategory(): Promise<CategoryStats[]> {
    await randomDelay();
    const counts: Record<string, number> = {};
    this.db.complaints.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  public async getTrend(): Promise<TrendStats[]> {
    await randomDelay();
    // Group complaints into 4 weekly buckets
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const buckets = [14, 18, 22, 16]; // baseline trend matching seed
    return weeks.map((w, i) => ({
      week: w,
      total: buckets[i] || 15
    }));
  }

  public async getRepeatOffenders(): Promise<RepeatOffender[]> {
    await randomDelay();
    // 3+ in 30 days
    const thirtyDaysAgo = now().getTime() - 30 * 24 * 60 * 60 * 1000;
    const grouping: Record<string, { college: string; category: string; count: number }> = {};

    this.db.complaints.forEach(c => {
      if (new Date(c.created_at).getTime() >= thirtyDaysAgo) {
        const col = INITIAL_COLLEGES.find(col => col.id === c.college_id);
        const colName = col ? col.name : 'Unknown';
        const key = `${colName}::${c.category}`;
        if (!grouping[key]) {
          grouping[key] = { college: colName, category: c.category, count: 0 };
        }
        grouping[key].count += 1;
      }
    });

    return Object.values(grouping)
      .filter(g => g.count >= 3)
      .map(g => ({
        college: g.college,
        category: g.category,
        cases_30d: g.count
      }))
      .sort((a, b) => b.cases_30d - a.cases_30d);
  }

  public async escalateOverdue(): Promise<number> {
    await randomDelay();
    const currentTime = now().getTime();
    let escalatedCount = 0;

    for (const c of this.db.complaints) {
      if (c.status !== 'Resolved' && c.status !== 'Escalated') {
        if (new Date(c.due_date).getTime() < currentTime) {
          const old_status = c.status;
          c.status = 'Escalated';
          escalatedCount += 1;

          this.db.case_updates.push({
            id: `upd_${Date.now()}_esc_${Math.floor(Math.random() * 1000)}`,
            complaint_id: c.id,
            actor_id: 'system',
            actor_role: 'system',
            actor_name: 'SLA Escalation Service',
            action: "Escalated to the Chairman's Office",
            note: 'Timely disposal timeline exceeded. Escalated for senior administrative review.',
            old_status,
            new_status: 'Escalated',
            visible_to_complainant: true,
            created_at: now().toISOString()
          });
        }
      }
    }

    if (escalatedCount > 0) {
      this.save(this.db);
    }
    return escalatedCount;
  }

  public async simulateDays(n: number): Promise<number> {
    const session = this.getSession();
    if (!session || (session.user.role !== 'senior' && session.user.role !== 'admin')) {
      throw new Error('Unauthorized: Senior role required to simulate days.');
    }

    await randomDelay();
    const shiftMs = n * 24 * 60 * 60 * 1000;

    // Shift open due dates backward by n days
    for (const c of this.db.complaints) {
      if (c.status !== 'Resolved') {
        const curDue = new Date(c.due_date).getTime();
        c.due_date = new Date(curDue - shiftMs).toISOString();
      }
    }

    this.save(this.db);
    // Automatically trigger escalation check
    return await this.escalateOverdue();
  }
}

export const mockApi = new MockApiStore();
