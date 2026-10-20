'use client';
import s from '@/styles/ui.module.css';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className={s.center}>
      <div className={`${s.state} ${s.errorBox}`}>
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
        <button className={s.btn} onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
