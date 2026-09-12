'use client';

import React from 'react';
import Link from 'next/link';
import { useCharacter } from '@/context/CharacterContext';

interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function AppHeader({ onToggleMobileMenu }: AppHeaderProps) {
  const { userName, level, streak, currency } = useCharacter();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-50 border-b border-surface-container-high/60 shadow-[0_1px_16px_rgba(0,0,0,0.4)]">
      <div className="w-full h-16 px-margin md:px-margin-md flex items-center justify-between">
        {/* Left: Mobile Drawer Toggle & Brand Logo */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center cursor-pointer transition-colors"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          <Link href="/home" className="flex items-center gap-space-xs group">
            <div className="w-3.5 h-3.5 rounded bg-surface-container-high flex items-center justify-center border border-primary/40 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[18px]">token</span>
            </div>
            <span className="font-headline-sm text-[15px] sm:text-headline-sm uppercase text-primary tracking-widest font-bold">
              LIFE FORGE
            </span>
          </Link>
        </div>

        {/* Right: Player Status Telemetry Badges */}
        <div className="flex items-center gap-space-xs sm:gap-space-md">
          <div className="flex items-center gap-1 px-space-xs sm:px-space-md py-1 rounded bg-surface-container-high border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse hidden sm:inline-block"></span>
            <span className="material-symbols-outlined text-[14px] text-primary">local_fire_department</span>
            <span className="font-label-numeric text-[11px] sm:text-[12px] text-primary font-bold">{streak}D</span>
          </div>

          <div className="flex items-center gap-1 px-space-xs sm:px-space-md py-1 rounded bg-surface-container-high border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container hidden sm:inline-block"></span>
            <span className="material-symbols-outlined text-[14px] text-primary-fixed">monetization_on</span>
            <span className="font-label-numeric text-[11px] sm:text-[12px] text-primary-fixed font-bold">{currency}</span>
          </div>

          <div className="hidden lg:flex items-center gap-space-xs px-space-md py-1 rounded bg-surface-container-high border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-telemetry text-[11px] text-tertiary font-bold">432 HZ ACTIVE</span>
          </div>

          {/* User Profile Info & Avatar */}
          <div className="flex items-center gap-space-xs sm:gap-space-md ml-1 sm:ml-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-title-md text-[13px] sm:text-[14px] text-on-surface leading-tight font-bold">{userName}</span>
              <span className="font-label-telemetry text-[10px] text-secondary-fixed-dim uppercase font-bold">Level {level} Explorer</span>
            </div>
            <Link
              href="/profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-headline text-[13px] sm:text-[14px] font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform border border-primary/30"
              title="Player Profile"
            >
              {userName ? userName.charAt(0).toUpperCase() : 'E'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
