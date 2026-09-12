import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Your Journey | LifeForge',
  description: 'Forge your LifeForge character and begin your gamified life RPG journey.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
