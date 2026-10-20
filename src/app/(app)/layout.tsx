import Sidebar from '@/components/Sidebar';
import AppHeader from '@/components/AppHeader';
import s from '@/styles/ui.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.shell}>
      <AppHeader />
      <Sidebar />
      <div className={s.content}>{children}</div>
    </div>
  );
}