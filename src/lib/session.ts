import { Session, UserProfile } from './types';

export const DEMO_USERS: Record<string, UserProfile> = {
  'student@demo.test': {
    id: 'usr_student_01',
    email: 'student@demo.test',
    full_name: 'Aarav Sharma',
    role: 'complainant',
    cell_id: null,
    language: 'en'
  },
  'officer@demo.test': {
    id: 'usr_officer_03',
    email: 'officer@demo.test',
    full_name: 'Meera Iyer',
    role: 'officer',
    cell_id: 3, // Finance & Refunds Cell
    language: 'en'
  },
  'leadership@demo.test': {
    id: 'usr_senior_01',
    email: 'leadership@demo.test',
    full_name: 'R. K. Nair',
    role: 'senior',
    cell_id: null,
    language: 'en'
  },
  'ragging.officer@demo.test': {
    id: 'usr_officer_01',
    email: 'ragging.officer@demo.test',
    full_name: 'Kavita Menon',
    role: 'officer',
    cell_id: 1, // Anti-Ragging Cell
    language: 'en'
  },
  'approvals.officer@demo.test': {
    id: 'usr_officer_02',
    email: 'approvals.officer@demo.test',
    full_name: 'Imran Qureshi',
    role: 'officer',
    cell_id: 2, // Approvals Bureau
    language: 'en'
  }
};

const SESSION_KEY = 'sih26264-session';

export function getStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(session: Session | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event('authchange'));
}
