import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Character & Attributes',
  description: 'Player attributes and 3D character gear customization.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CharacterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
