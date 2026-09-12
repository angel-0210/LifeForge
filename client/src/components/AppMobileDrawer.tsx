'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCharacter } from '@/context/CharacterContext';
import { supabase } from '@/lib/supabase';

interface AppMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

import { clearAllCache } from '@/lib/cache';

export default function AppMobileDrawer({ isOpen, onClose }: AppMobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { level, xpInCurrentLevel, xpNeededForCurrentLevel, xpProgress } = useCharacter();

  const handleSignOut = async () => {
    onClose();
    clearAllCache();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'Command Center', path: '/home', icon: 'hub' },
    { label: 'Quest Matrix', path: '/quests', icon: 'radar' },
    { label: 'Character', path: '/character', icon: 'shield_person' },
    { label: 'Progress', path: '/progress', icon: 'auto_stories' },
    { label: 'Inventory & Relics', path: '/rewards', icon: 'diamond' },
    { label: 'Profile & Identity', path: '/profile', icon: 'person' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Content */}
      <div className="fixed top-0 bottom-0 left-0 w-4/5 max-w-xs bg-surface-container-lowest/95 backdrop-blur-2xl border-r border-surface-container-high p-space-lg flex flex-col justify-between shadow-2xl z-50">
        <div className="flex flex-col gap-space-lg">
          {/* Header */}
          <div className="flex items-center justify-between pb-space-md border-b border-surface-container-high">
            <Link href="/home" onClick={onClose} className="flex items-center gap-space-xs">
              <div className="w-3 h-3 rotate-45 bg-primary shadow-[0_0_12px_rgba(255,193,116,0.8)]"></div>
              <span className="font-headline-sm text-[16px] uppercase text-primary tracking-widest font-bold">
                LIFE FORGE
              </span>
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Directives Section */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sigil text-[10px] text-outline uppercase tracking-widest px-space-xs mb-1 font-bold">
              TACTICAL NAVIGATION
            </span>
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
                    onClick={onClose}
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
        </div>

        {/* Level EXP Gauge Footer */}
        <div className="pt-space-md border-t border-surface-container-high flex flex-col gap-space-sm">
          <div className="p-space-sm rounded bg-surface-container-low border border-surface-container-high flex flex-col gap-space-2xs">
            <div className="flex justify-between items-center">
              <span className="font-label-telemetry text-[9px] text-on-surface-variant uppercase font-bold">
                LEVEL {level} EXP PROGRESS
              </span>
              <span className="font-label-numeric text-[10px] text-secondary font-bold">
                {xpInCurrentLevel.toLocaleString()} / {xpNeededForCurrentLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
              <div
                className="h-full bg-secondary shadow-[0_0_8px_rgba(208,188,255,0.7)] transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-outline text-[11px] font-label-telemetry pt-1">
            <span className="font-bold text-tertiary">LIVE MATRIX // ONLINE</span>
            <button
              onClick={handleSignOut}
              className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer uppercase"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
