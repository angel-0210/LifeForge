'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { clearAllCache } from '@/lib/cache';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    clearAllCache();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'Command Center', path: '/home', icon: 'hub' },
    { label: 'Quest Matrix', path: '/quests', icon: 'radar' },
    { label: 'Character', path: '/character', icon: 'shield_person' },
    { label: 'Progress', path: '/progress', icon: 'auto_stories' },
    { label: 'Inventory', path: '/rewards', icon: 'diamond' },
    { label: 'Profile', path: '/profile', icon: 'person' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 bg-surface-container-lowest/90 backdrop-blur-xl z-40 border-r border-surface-container-high/60 hidden lg:flex flex-col justify-between pt-space-lg pb-space-lg">
      <div className="flex flex-col gap-space-lg px-space-md">
        {/* Section Kicker */}
        <div className="px-space-md">
          <span className="font-label-sigil text-[10px] text-outline uppercase tracking-widest">
            TACTICAL DIRECTIVES
          </span>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === '/quests' && pathname.startsWith('/quests')) ||
              (item.path === '/character' && pathname.startsWith('/character'));

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_14px_rgba(245,158,11,0.25)] border border-primary/40'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-title-md text-[14px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Level EXP Gauge & Sign Out */}
      <div className="px-space-lg flex flex-col gap-space-sm">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-space-md px-space-md py-space-sm rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-title-md text-[14px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

