import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | LifeForge',
  description: 'Log in to your LifeForge RPG command matrix.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
