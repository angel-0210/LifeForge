import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Celestial Ascension',
  description: 'Level up fanfare and milestone ascension rewards.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AscensionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
