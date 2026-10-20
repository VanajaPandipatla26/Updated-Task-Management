import { AttendanceEntry } from '@/types/attendance';

// In-memory store (resets when the server restarts).
const g = globalThis as unknown as { __attendance?: AttendanceEntry[] };
export const attendanceDb: AttendanceEntry[] = (g.__attendance ??= []);