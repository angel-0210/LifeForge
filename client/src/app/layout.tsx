import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lifeforge.app'),
  title: {
    default: 'LifeForge | Gamified Life RPG & Productivity Engine',
    template: '%s | LifeForge',
  },
  description: 'LifeRPG web application converting real-world tasks into RPG progression, attributes, levels, and sanctuary rewards.',
  keywords: ['life rpg', 'gamified productivity', 'task manager', 'habit tracker', 'rpg progression', 'discipline engine'],
  authors: [{ name: 'LifeForge Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lifeforge.app',
    siteName: 'LifeForge',
    title: 'LifeForge | Gamified Life RPG',
    description: 'Convert real-world productivity into RPG progression, attributes, levels, and sanctuary rewards.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b090e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen relative overflow-x-hidden flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
