import Link from 'next/link';
import s from '@/styles/ui.module.css';

export default function NotFound() {
  return (
    <div className={s.center}>
      <div className={s.state}>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
