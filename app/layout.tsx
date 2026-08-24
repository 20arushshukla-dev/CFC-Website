import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Citizens Of Change',
  description: 'Discord community landing page for Citizens Of Change.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
