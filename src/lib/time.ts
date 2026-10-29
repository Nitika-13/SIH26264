export function now(): Date {
  return new Date();
}

export function nowIso(): string {
  return now().toISOString();
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function calculateDaysLeft(dueDateIso: string, status: string): { text: string; overdue: boolean; days: number } {
  if (status === 'Resolved') {
    return { text: 'Closed', overdue: false, days: 0 };
  }
  
  const due = new Date(dueDateIso).getTime();
  const current = now().getTime();
  const diffDays = Math.ceil((due - current) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return {
      text: `${absDays} ${absDays === 1 ? 'day' : 'days'} overdue`,
      overdue: true,
      days: diffDays
    };
  } else if (diffDays === 0) {
    return { text: 'Due today', overdue: false, days: 0 };
  } else {
    return {
      text: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`,
      overdue: false,
      days: diffDays
    };
  }
}
