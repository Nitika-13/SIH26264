import {
  Cell,
  College,
  Complaint,
  ComplaintDetail,
  CaseRow,
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
import { mockApi } from './mockApi';

export interface Api {
  signIn(email: string): Promise<Session>;
  signOut(): Promise<void>;
  getSession(): Session | null;
  listColleges(): Promise<College[]>;
  listCells(): Promise<Cell[]>;
  createComplaint(input: {
    college_id: number;
    original_text: string;
    files: { name: string; size: number; type: string }[];
  }): Promise<Complaint>;
  listMyComplaints(): Promise<Complaint[]>;
  getComplaintByCode(code: string): Promise<ComplaintDetail>;
  trackByCode(code: string): Promise<PublicTrack | null>;
  listCases(filter: {
    cell_id?: number;
    status?: string;
    college_id?: number;
    overdueOnly?: boolean;
  }): Promise<CaseRow[]>;
  updateCase(
    id: string,
    patch: { status?: Status; note?: string; notice?: boolean }
  ): Promise<void>;
  similarCases(id: string): Promise<CaseRow[]>;
  listNotifications(): Promise<NotificationRow[]>;
  getKpis(): Promise<Kpis>;
  getByCollege(): Promise<CollegeStats[]>;
  getByCell(): Promise<CellStats[]>;
  getByCategory(): Promise<CategoryStats[]>;
  getTrend(): Promise<TrendStats[]>;
  getRepeatOffenders(): Promise<RepeatOffender[]>;
  escalateOverdue(): Promise<number>;
  simulateDays(n: number): Promise<number>;
  resetDemo(): Promise<void>;
}

export const api: Api = mockApi;
