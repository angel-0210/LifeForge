import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quest Matrix',
  description: 'Tactical directives and daily RPG quests.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
