import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Command Matrix',
  description: 'LifeForge Command Cockpit and active RPG directives.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
