 'use client';

import { Children, useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardList, Clock3, Download, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { useTaskStore } from '@/lib/store';
import { AttendanceEntry } from '@/types/attendance';

const reportTabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'tasks', label: 'Task report', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance report', icon: Clock3 },
] as const;

type ReportTab = (typeof reportTabs)[number]['id'];

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function ReportsPage() {
  const { tasks, loading: tasksLoading, error: tasksError, load } = useTaskStore();
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState('');
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [month, setMonth] = useState(currentMonth);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    let cancelled = false;
    api.get<AttendanceEntry[]>('/api/attendance')
      .then((entries) => { if (!cancelled) setAttendance(entries); })
      .catch((requestError: Error) => { if (!cancelled) setAttendanceError(requestError.message); })
      .finally(() => { if (!cancelled) setAttendanceLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const monthTasks = tasks.filter((task) => task.dueDate.startsWith(month));
  const monthAttendance = attendance.filter((entry) => entry.date.startsWith(month));
  const completedTasks = monthTasks.filter((task) => task.completed).length;
  const totalHours = monthAttendance.reduce((total, entry) => total + entry.hours, 0);
  const loading = tasksLoading || attendanceLoading;
  const error = tasksError || attendanceError;
  const activeTabIndex = reportTabs.findIndex((tab) => tab.id === activeTab);

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    let nextIndex = activeTabIndex;
    if (event.key === 'ArrowRight') nextIndex = (activeTabIndex + 1) % reportTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (activeTabIndex - 1 + reportTabs.length) % reportTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = reportTabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = reportTabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`reports-tab-${nextTab.id}`)?.focus();
  }

  return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] print:hidden">
            <div className="flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label="Reports">
              {reportTabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`reports-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="reports-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={handleTabKeyDown}
                    className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)] ${selected ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'}`}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-2.5 py-2 text-sm text-[var(--muted)]">
                <CalendarDays size={16} aria-hidden="true" />
                <span className="sr-only">Report month</span>
                <input
                  aria-label="Report month"
                  type="month"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="min-w-0 bg-transparent text-sm font-medium text-[var(--text)] outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => window.print()}
                title="Print or save the selected report as PDF"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <Download size={16} aria-hidden="true" />
                Download
              </button>
            </div>
          </div>

          <section id="reports-panel" role="tabpanel" aria-labelledby={`reports-tab-${activeTab}`} className="print:border-0">
            {loading ? (
              <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8 text-sm text-[var(--muted)]" role="status">Loading report data...</div>
            ) : error ? (
              <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8 text-sm text-[var(--danger)]" role="alert">{error}</div>
            ) : activeTab === 'overview' ? (
              <>
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard label="Tasks due" value={monthTasks.length} icon={<ClipboardList size={18} />} />
                  <MetricCard label="Tasks completed" value={completedTasks} icon={<CheckCircle2 size={18} />} />
                  <MetricCard label="Open tasks" value={monthTasks.length - completedTasks} icon={<FileText size={18} />} />
                  <MetricCard label="Attendance hours" value={totalHours.toLocaleString()} icon={<Clock3 size={18} />} />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <ReportSummary
                    title="Task completion"
                    detail={monthTasks.length ? `${completedTasks} of ${monthTasks.length} tasks completed` : 'No tasks due in this month'}
                    percentage={monthTasks.length ? Math.round((completedTasks / monthTasks.length) * 100) : 0}
                  />
                  <ReportSummary
                    title="Attendance activity"
                    detail={monthAttendance.length ? `${monthAttendance.length} entries across ${new Set(monthAttendance.map((entry) => entry.project)).size} projects` : 'No attendance entries for this month'}
                    percentage={monthAttendance.length ? 100 : 0}
                  />
                </div>
              </>
            ) : activeTab === 'tasks' ? (
              <ReportTable
                title="Task report"
                period={month}
                empty={monthTasks.length === 0}
                emptyText="No tasks are due in this month."
                headers={['Task', 'Priority', 'Due date', 'Status']}
              >
                {monthTasks.map((task) => (
                  <tr key={task.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{task.title}</td>
                    <td className="px-4 py-3 capitalize text-[var(--muted)]">{task.priority}</td>
                    <td className="px-4 py-3 text-[var(--muted)]"><time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time></td>
                    <td className="px-4 py-3 text-[var(--muted)]">{task.completed ? 'Completed' : 'Open'}</td>
                  </tr>
                ))}
              </ReportTable>
            ) : (
              <ReportTable
                title="Attendance report"
                period={month}
                empty={monthAttendance.length === 0}
                emptyText="No attendance entries were recorded in this month."
                headers={['Employee', 'Project', 'Date', 'Work mode', 'Hours']}
              >
                {monthAttendance.map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{entry.employee}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">{entry.project}</td>
                    <td className="px-4 py-3 text-[var(--muted)]"><time dateTime={entry.date}>{formatDate(entry.date)}</time></td>
                    <td className="px-4 py-3 text-[var(--muted)]">{entry.workMode}</td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--text)]">{entry.hours}</td>
                  </tr>
                ))}
              </ReportTable>
            )}
          </section>
        </main>
      );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="mb-5 flex items-center justify-between text-[var(--muted)]">
        <span className="text-sm">{label}</span>
        <span aria-hidden="true">{icon}</span>
      </div>
      <p className="text-3xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function ReportSummary({ title, detail, percentage }: { title: string; detail: string; percentage: number }) {
  return (
    <article className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-[var(--text)]">{title}</h2>
        <span className="text-sm font-semibold text-[var(--muted)]">{percentage}%</span>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--bg)]" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <div className="h-full rounded-full bg-[var(--accent)] transition-[width]" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-sm text-[var(--muted)]">{detail}</p>
    </article>
  );
}

function ReportTable({
  title, period, empty, emptyText, headers, children,
}: {
  title: string;
  period: string;
  empty: boolean;
  emptyText: string;
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] p-5">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text)]">{title}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Reporting period: {period}</p>
        </div>
        {!empty && <p className="text-sm text-[var(--muted)]">Records shown: {Children.count(children)}</p>}
      </div>
      {empty ? (
        <p className="p-8 text-center text-sm text-[var(--muted)]">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead className="bg-[var(--bg)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}