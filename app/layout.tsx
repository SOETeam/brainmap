import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainMap — Command Dashboard',
  description: 'Interactive life management visualization for Sophia Saitta',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cyber-bg text-cyber-white min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
