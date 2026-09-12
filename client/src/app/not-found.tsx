'use client';

import React from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/LandingNavbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      <LandingNavbar />

      <main className="w-full flex-1 pt-24 pb-space-xl bg-background flex items-center justify-center px-margin md:px-margin-md">
        <div className="relative w-full max-w-xl rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col items-center text-center gap-space-lg border border-surface-container-high overflow-hidden">
          {/* 3D Void Anomaly Visual Emblem */}
          <div className="relative w-36 h-36 rounded-full bg-surface-container-lowest flex items-center justify-center border-2 border-primary/40 shadow-[0_0_50px_rgba(139,92,246,0.3)] animate-pulse">
            <span className="material-symbols-outlined text-[72px] text-secondary animate-spin">
              cyclone
            </span>
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-25"></div>
          </div>

          <div className="flex flex-col gap-space-xs z-10">
            <span className="font-label-sigil text-[11px] text-error uppercase tracking-widest font-bold">
              ANOMALY DETECTED // ERROR 404
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-headline uppercase">
              UNEXPLORED REALM REGION
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              The coordinates you transmitted lead to a dark void sector beyond the known LifeForge matrix.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md w-full pt-space-xs z-10">
            <Link
              href="/home"
              className="w-full sm:w-auto px-space-xl py-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[12px] uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(245,158,11,0.4)] transition-all"
            >
              [ RETURN TO NEXUS COMMAND ]
            </Link>
            <Link
              href="/quests"
              className="w-full sm:w-auto px-space-lg py-space-md rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-telemetry text-[12px] uppercase tracking-widest"
            >
              [ QUEST MATRIX ]
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
