export type Role = 'complainant' | 'officer' | 'senior' | 'admin';

export type Status = 'Submitted' | 'Under Review' | 'Notice Sent' | 'Resolved' | 'Escalated';

export type Urgency = 'low' | 'normal' | 'high';

export type RoutedBy = 'rules' | 'ai';

export type Language = 'en' | 'hi' | 'te';

export interface Cell {
  id: number;
  name: string;
  sla_days: number;
}

export interface College {
  id: number;
  name: string;
  state: string;
  region: string;
  aicte_id: string; // AICTE Permanent ID (e.g., 1-10928374)
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  cell_id?: number | null;
  language: string;
}

export interface Session {
  user: UserProfile;
  token?: string;
}

export interface Attachment {
  id: string;
  complaint_id: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  size: number;
}

export interface CaseUpdate {
  id: string;
  complaint_id: string;
  actor_id: string;
  actor_role: string;
  actor_name: string;
  action: string;
  note?: string;
  old_status?: Status;
  new_status?: Status;
  visible_to_complainant: boolean;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  complaint_id: string;
  channel: 'email';
  recipient: string;
  message: string;
  sent_at: string;
}

export interface Complaint {
  id: string;
  code: string; // AICTE-26-xxxxx
  complainant_id: string;
  college_id: number;
  cell_id: number;
  category: string;
  urgency: Urgency;
  summary: string;
  original_text: string;
  translated_text?: string;
  language: Language;
  status: Status;
  routed_by: RoutedBy;
  created_at: string;
  due_date: string;
  resolved_at?: string | null;
  attachments: Attachment[];
  overlap_alert?: boolean;
  overlap_case_ids?: string[];
  overlap_reasons?: string[];
}

export interface ComplaintDetail extends Complaint {
  college: College;
  cell: Cell;
  updates: CaseUpdate[];
}

export interface PublicTrack {
  code: string;
  status: Status;
  cell: string;
  college: string;
  created_at: string;
  due_date: string;
  timeline: { action: string; at: string }[];
}

export interface CaseRow extends Complaint {
  college_name: string;
  college_state: string;
  cell_name: string;
  college_aicte_id: string;
}

export interface Kpis {
  total: number;
  open_cases: number;
  resolved: number;
  escalated: number;
  sla_breach_pct: number;
  avg_resolution_days: number;
}

export interface CollegeStats {
  college: string;
  state: string;
  total: number;
  open_cases: number;
  escalated: number;
}

export interface CellStats {
  cell: string;
  total: number;
  open_cases: number;
  escalated: number;
  avg_resolution_days: number;
}

export interface CategoryStats {
  category: string;
  total: number;
}

export interface TrendStats {
  week: string;
  total: number;
}

export interface RepeatOffender {
  college: string;
  category: string;
  cases_30d: number;
}
