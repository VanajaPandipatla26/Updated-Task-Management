import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import './globals.css';

const font = Public_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'Task Dashboard', template: '%s | Task Dashboard' },
  description: 'Plan, track and finish your work with a responsive task dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.variable}>{children}</body>
    </html>
  );
}
