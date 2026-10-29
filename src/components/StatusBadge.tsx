import React from 'react';
import { Circle, Search, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Status } from '../lib/types';
import { t } from '../lib/i18n';

export interface StatusBadgeProps {
  status: Status;
  size?: 'default' | 'small';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'default' }) => {
  let icon = <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
  let colorClasses = 'bg-[#ECEAE4] text-[#4F596E] border-[#D9D2C3]';
  let i18nKey = 'status.submitted';

  switch (status) {
    case 'Submitted':
      icon = <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      colorClasses = 'bg-[#ECEAE4] text-[#4F596E] border-[#D9D2C3]';
      i18nKey = 'status.submitted';
      break;
    case 'Under Review':
      icon = <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      colorClasses = 'bg-[#E3EBFA] text-[#1F4FB4] border-[#BDD0F5]';
      i18nKey = 'status.under_review';
      break;
    case 'Notice Sent':
      icon = <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      colorClasses = 'bg-[#FBEBCF] text-[#8A5A00] border-[#E8CFA2]';
      i18nKey = 'status.notice_sent';
      break;
    case 'Resolved':
      icon = <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      colorClasses = 'bg-[#DDEFE7] text-[#1E6B4F] border-[#B5DFCB]';
      i18nKey = 'status.resolved';
      break;
    case 'Escalated':
      icon = <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
      colorClasses = 'bg-[#F7DDD8] text-[#B3321F] border-[#E8B6AD]';
      i18nKey = 'status.escalated';
      break;
  }

  const paddingClass = size === 'small' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-[2px] border ${colorClasses} ${paddingClass}`}
      role="status"
    >
      {icon}
      <span>{t(i18nKey)}</span>
    </span>
  );
};
