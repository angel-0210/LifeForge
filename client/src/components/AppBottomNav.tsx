'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppBottomNavProps {
  onOpenMenu: () => void;
}

export default function AppBottomNav({ onOpenMenu }: AppBottomNavProps) {
  const pathname = usePathname();

  const quickNav = [
    { label: 'Home', path: '/home', icon: 'hub' },
    { label: 'Quests', path: '/quests', icon: 'radar' },
    { label: 'Character', path: '/character', icon: 'shield_person' },
    { label: 'Progress', path: '/progress', icon: 'auto_stories' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl z-40 border-t border-surface-container-high/60 flex lg:hidden items-center justify-around px-space-xs shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {quickNav.map((item) => {
        const isActive =
          pathname === item.path ||
          (item.path === '/quests' && pathname.startsWith('/quests')) ||
          (item.path === '/character' && pathname.startsWith('/character'));

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-all ${
              isActive
                ? 'text-primary font-bold scale-105'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-primary' : ''}`}>
              {item.icon}
            </span>
            <span className="font-label-telemetry text-[9px] uppercase tracking-wider mt-0.5">
              {item.label}
            </span>
          </Link>
        );
      })}

      
    </nav>
  );
}
