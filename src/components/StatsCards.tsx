import { Priority, Task } from '@/types/task';
import { isOverdue } from '@/lib/date';
import s from '@/styles/ui.module.css';

export default function StatsCards({ tasks }: { tasks: Task[] }) {
  const done = tasks.filter((t) => t.completed).length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const items = [
    { label: 'Total tasks', value: tasks.length },
    { label: 'Completed', value: done },
    { label: 'Pending', value: tasks.length - done },
    { label: 'Overdue', value: tasks.filter(isOverdue).length, cls: s.overdue },
  ];
  return (
    <section className={s.stats} aria-label="Task summary">
      {items.map((i) => (
        <div key={i.label} className={`${s.stat} ${i.cls ?? ''}`}><b>{i.value}</b><span>{i.label}</span></div>
      ))}

      <div className={s.analytics}>
        <article className={s.chartPanel} aria-labelledby="completion-title">
          <div>
            <p className={s.chartEyebrow}>Progress</p>
            <h2 id="completion-title" className={s.chartTitle}>Completion rate</h2>
            <p className={s.chartDescription}>{done} of {tasks.length} tasks completed</p>
          </div>
          <div className={s.ring} role="img" aria-label={`${completion}% of tasks completed`}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className={s.ringTrack} cx="60" cy="60" r="48" pathLength="100" />
              <circle
                className={s.ringValue}
                cx="60"
                cy="60"
                r="48"
                pathLength="100"
                strokeDasharray={`${completion} 100`}
              />
            </svg>
            <div className={s.ringLabel}><b>{completion}%</b><span>complete</span></div>
          </div>
        </article>

        <article className={s.chartPanel} aria-labelledby="priority-title">
          <div>
            <p className={s.chartEyebrow}>Workload</p>
            <h2 id="priority-title" className={s.chartTitle}>Tasks by priority</h2>
          </div>
          <div className={s.priorityChart}>
            {[
              { label: 'High', priority: Priority.High, className: s.priorityHigh },
              { label: 'Medium', priority: Priority.Medium, className: s.priorityMedium },
              { label: 'Low', priority: Priority.Low, className: s.priorityLow },
            ].map(({ label, priority, className }) => {
              const count = tasks.filter((task) => task.priority === priority).length;
              const percent = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
              return (
                <div className={s.priorityRow} key={priority}>
                  <div className={s.priorityMeta}><span>{label}</span><b>{count}</b></div>
                  <div
                    className={s.priorityTrack}
                    role="progressbar"
                    aria-label={`${label} priority tasks`}
                    aria-valuemin={0}
                    aria-valuemax={tasks.length || 1}
                    aria-valuenow={count}
                    aria-valuetext={`${count} tasks, ${percent}%`}
                  >
                    <span className={className} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {tasks.length === 0 && <p className={s.chartDescription}>Priority data will appear when tasks are added.</p>}
        </article>
      </div>
    </section>
  );
}
