import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rewards & Requisitions',
  description: 'Sanctuary catalog and gold rewards shop.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
