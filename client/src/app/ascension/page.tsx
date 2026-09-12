'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import DynamicCharacter3DCanvas from '@/components/DynamicCharacter3DCanvas';
import { useCharacter } from '@/context/CharacterContext';

export default function AscensionPage() {
  const { level, userName } = useCharacter();

  return (
    <AppLayout>
      <main className="w-full min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-margin md:p-margin-md">
        <div className="relative w-full max-w-3xl rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col items-center text-center gap-space-lg border-2 border-primary/50 overflow-hidden">
          {/* Radial Ambient Backlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Banner Kicker */}
          <div className="flex flex-col items-center gap-space-xs z-10">
            <span className="px-space-md py-1 rounded-full bg-primary/20 text-primary font-label-telemetry text-[11px] uppercase tracking-widest font-bold border border-primary/40 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>CELESTIAL ASCENSION EVENT</span>
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-headline uppercase tracking-wide mt-1">
              LEVEL {level} REACHED
            </h1>
            <span className="font-title-lg text-title-lg text-primary-fixed font-bold uppercase">
              PLAYER ASCENSION: {userName}
            </span>
          </div>

          {/* 3D Character Viewport Fanfare */}
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-xl p-space-xs border border-surface-container-high shadow-2xl">
            <DynamicCharacter3DCanvas height="h-[320px]" />
          </div>

          {/* Stat Boost Breakdown Matrix */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-space-md z-10">
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-primary/30 flex flex-col items-center">
              <span className="material-symbols-outlined text-[24px] text-rose-500">favorite</span>
              <span className="font-title-md text-title-md text-on-surface font-bold mt-1">+10 Max Stamina</span>
              <span className="font-label-telemetry text-[10px] text-outline">VITALITY RESIDUAL</span>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-secondary/30 flex flex-col items-center">
              <span className="material-symbols-outlined text-[24px] text-secondary">psychology</span>
              <span className="font-title-md text-title-md text-secondary font-bold mt-1">+5 Intellect</span>
              <span className="font-label-telemetry text-[10px] text-outline">COGNITIVE ASCENT</span>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-tertiary/30 flex flex-col items-center">
              <span className="material-symbols-outlined text-[24px] text-tertiary">shield</span>
              <span className="font-title-md text-title-md text-tertiary font-bold mt-1">+3 Discipline</span>
              <span className="font-label-telemetry text-[10px] text-outline">HABIT COMBUSTION</span>
            </div>
          </div>

          {/* Return CTA */}
          <div className="w-full flex justify-center z-10 pt-space-xs">
            <Link
              href="/home"
              className="px-space-xl py-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[12px] uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all"
            >
              [ RETURN TO COMMAND MATRIX ]
            </Link>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
