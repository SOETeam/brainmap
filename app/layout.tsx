import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainMap — 3D Neural Dashboard',
  description:
    'Interactive 3D fractal life management visualization for Sophia Saitta',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className="min-h-screen overflow-hidden"
        style={{ background: '#050508', margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
