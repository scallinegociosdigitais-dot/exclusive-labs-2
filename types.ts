import React from 'react';

export interface DailyRecord {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  leads: number;
  source: string;
  contacts: number;
  scheduled: number;
  attended: number;
  testDrives: number;
  approvals: number;
  sales: number;
  revenue: number;
  investment: number;
}

export interface KPIData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export type SortField = keyof DailyRecord;
export type SortOrder = 'asc' | 'desc';