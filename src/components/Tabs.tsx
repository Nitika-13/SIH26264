import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`border-b border-line flex gap-2 ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`min-h-[44px] px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus ${
              isActive
                ? 'border-navy text-navy font-semibold bg-surface'
                : 'border-transparent text-muted hover:text-ink hover:border-line'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-[2px] tabular-nums font-semibold ${
                  isActive ? 'bg-navy text-white' : 'bg-paper text-muted'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
