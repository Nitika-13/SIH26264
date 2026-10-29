import React, { useEffect, useRef } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowSelect?: (row: T, index: number) => void;
  selectedRowKey?: string;
  emptyMessage?: string;
  ariaLabel?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowSelect,
  selectedRowKey,
  emptyMessage = 'No records found.',
  ariaLabel = 'Data table'
}: DataTableProps<T>) {
  const tableRef = useRef<HTMLTableElement>(null);
  const selectedIndex = data.findIndex(row => keyExtractor(row) === selectedRowKey);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!onRowSelect || data.length === 0) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = selectedIndex < data.length - 1 ? selectedIndex + 1 : 0;
        onRowSelect(data[nextIndex], nextIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : data.length - 1;
        onRowSelect(data[prevIndex], prevIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, data, onRowSelect]);

  return (
    <div className="w-full overflow-x-auto border border-line bg-surface rounded-none">
      <table className="w-full text-left text-sm border-collapse" aria-label={ariaLabel} ref={tableRef}>
        <thead className="sticky top-0 bg-paper border-b border-line z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ width: col.width }}
                className={`px-3 py-2.5 font-semibold text-ink text-xs uppercase tracking-wider ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const rowKey = keyExtractor(row);
              const isSelected = selectedRowKey === rowKey;
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowSelect?.(row, index)}
                  tabIndex={0}
                  role={onRowSelect ? 'button' : undefined}
                  aria-selected={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRowSelect?.(row, index);
                    }
                  }}
                  className={`h-[40px] cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus ${
                    isSelected ? 'bg-kesari-soft/60 font-medium' : 'hover:bg-kesari-soft/40'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-ink text-sm ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row, index) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
