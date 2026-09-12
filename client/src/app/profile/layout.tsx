import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player Profile & Identity',
  description: 'Player identity, unlocked sigils, and preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
