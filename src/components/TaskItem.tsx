import Link from 'next/link';
import { Task } from '@/types/task';
import { isOverdue } from '@/lib/date';
import s from '@/styles/ui.module.css';

interface Props {
  task: Task; canEdit: boolean; canDelete: boolean;
  onToggle: (t: Task) => void; onEdit: (t: Task) => void; onDelete: (t: Task) => void;
}

export default function TaskItem({ task, canEdit, canDelete, onToggle, onEdit, onDelete }: Props) {
  return (
    <li className={`${s.task} ${s[task.priority]} ${task.completed ? s.done : ''}`}>
      <input type="checkbox" checked={task.completed} disabled={!canEdit} onChange={() => onToggle(task)} aria-label={`Mark "${task.title}" complete`} />
      <div className={s.body}>
        <p className={s.title}><Link href={`/tasks/${task.id}`}>{task.title}</Link></p>
        <p className={s.meta}>
          {task.priority} priority · due {task.dueDate}
          {isOverdue(task) && <span className={s.late}> · Overdue</span>}
        </p>
      </div>
      {(canEdit || canDelete) && (
        <div className={s.actions}>
          {canEdit && <button className={s.btn} onClick={() => onEdit(task)}>Edit</button>}
          {canDelete && <button className={`${s.btn} ${s.danger}`} onClick={() => onDelete(task)}>Delete</button>}
        </div>
      )}
    </li>
  );
}