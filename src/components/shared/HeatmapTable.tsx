import { useState, useMemo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface HeatmapColumn<T> {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => number;
  headerAlign?: "left" | "right" | "center";
}

interface HeatmapTableProps<T> {
  data: T[];
  columns: HeatmapColumn<T>[];
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedKey?: string;
  maxHeight?: string;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
}

export function HeatmapTable<T>({
  data,
  columns,
  defaultSortKey,
  defaultSortDir = "desc",
  rowKey,
  onRowClick,
  selectedKey,
  maxHeight = "500px",
  title,
  subtitle,
  headerRight,
}: HeatmapTableProps<T>) {
  const [sortKey, setSortKey] = useState(defaultSortKey || "");
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col?.sortValue) return data;
    const fn = col.sortValue;
    return [...data].sort((a, b) => {
      const va = fn(a), vb = fn(b);
      return sortDir === "desc" ? vb - va : va - vb;
    });
  }, [data, sortKey, sortDir, columns]);

  const handleSort = (key: string) => {
    const col = columns.find(c => c.key === key);
    if (!col?.sortValue) return;
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="border border-border bg-card">
      {(title || headerRight) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div>
            {title && <h3 className="text-xs font-semibold text-foreground">{title}</h3>}
            {subtitle && <span className="text-[10px] text-muted-foreground">{subtitle}</span>}
          </div>
          {headerRight}
        </div>
      )}
      <div className="overflow-auto scrollbar-thin" style={{ maxHeight }}>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-card border-b border-border">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "px-2 py-1.5 text-[10px] font-medium text-muted-foreground border-r border-border/50 whitespace-nowrap select-none",
                    col.sortValue && "cursor-pointer hover:text-foreground",
                    col.headerAlign === "left" ? "text-left" : col.headerAlign === "center" ? "text-center" : "text-right",
                  )}
                  style={{ width: col.width }}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === "desc"
                        ? <ArrowDown className="h-2.5 w-2.5" />
                        : <ArrowUp className="h-2.5 w-2.5" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const key = rowKey(row);
              const isSelected = selectedKey === key;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border/30 hover:bg-surface-hover transition-colors",
                    onRowClick && "cursor-pointer",
                    isSelected && "border-l-2 border-l-primary bg-primary/5",
                  )}
                  style={{ height: "28px" }}
                >
                  {columns.map(col => (
                    <React.Fragment key={col.key}>
                      {col.render(row)}
                    </React.Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
