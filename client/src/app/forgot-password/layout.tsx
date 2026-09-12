import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Key | LifeForge',
  description: 'Reset your LifeForge security key.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
