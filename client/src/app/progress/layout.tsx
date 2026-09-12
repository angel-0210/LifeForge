import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progress & Streak Codex',
  description: 'Weekly XP yield and habit activity metrics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
