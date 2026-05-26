import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Illumination Studio - Computer Graphics Learning Platform',
  description: 'Interactive 3D graphics rendering engine for learning computer graphics concepts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
