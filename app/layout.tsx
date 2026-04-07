import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solvus App Demo',
  description: 'Visual runtime demo for Vercel deployment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
