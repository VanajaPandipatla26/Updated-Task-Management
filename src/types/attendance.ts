export enum WorkMode { Office = 'Office', Remote = 'Remote', Hybrid = 'Hybrid' }
export const PROJECTS = ['Project Alpha', 'Project Beta', 'Internal'] as const;
export type Project = (typeof PROJECTS)[number];

export interface AttendanceEntry {
  id: string;
  employee: string;
  task: string;
  date: string; // YYYY-MM-DD
  project: Project;
  workMode: WorkMode;
  hours: number;
  done: boolean;
}

export type RowStatus = 'draft' | 'saving' | 'saved';
// UI row: hours may be empty while typing; status tracks the Save button.
export interface AttendanceRow extends Omit<AttendanceEntry, 'hours'> {
  hours: number | '';
  status: RowStatus;
  error?: string;
}