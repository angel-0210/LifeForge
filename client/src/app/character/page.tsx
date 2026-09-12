'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import DynamicCharacter3DCanvas from '@/components/DynamicCharacter3DCanvas';
import StatCard from '@/components/StatCard';
import { useCharacter } from '@/context/CharacterContext';

export default function CharacterPage() {
  const { level, totalXp, currency, streak, attributes, loading } = useCharacter();

  const defaultColorMap: Record<string, string> = {
    Strength: '#ef4444',
    Intelligence: '#38bdf8',
    Intellect: '#38bdf8',
    Focus: '#a855f7',
    Vitality: '#10b981',
    Discipline: '#f59e0b',
    General: '#f97316',
  };

  return (
    <AppLayout>
      <div className="p-margin sm:p-margin-md lg:p-margin-lg flex flex-col gap-space-md lg:gap-space-lg">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-surface-container-high">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
                PLAYER IDENTITY // DISCIPLINE CODEX
              </span>
              <span className="font-label-telemetry text-[11px] text-outline">•</span>
              <span className="font-label-telemetry text-[11px] text-tertiary uppercase font-bold">LEVEL {level} EXPLORER</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-headline font-bold">
              CHARACTER & ATTRIBUTES
            </h1>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-primary/30 shadow-md">
              <span className="material-symbols-outlined text-[18px] text-primary">monetization_on</span>
              <span className="font-label-numeric text-[13px] text-primary font-bold">
                {currency.toLocaleString()} GOLD BALANCE
              </span>
            </div>
            <Link
              href="/character/create"
              className="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-telemetry text-[11px] uppercase tracking-wider font-bold"
            >
              RE-FORGE CLASS
            </Link>
          </div>
        </div>

        {/* Grid Layout: 3D Stage + Attribute Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* 3D Avatar Viewport & Gear Slots (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="relative w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-xl p-space-xs border border-surface-container-high">
              <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-space-xs opacity-75">
                <span className="font-label-sigil text-label-sigil text-primary">┌─</span>
                <span className="font-label-telemetry text-[10px] text-outline uppercase tracking-wider font-bold">
                  ARMOR:AETHER_V4
                </span>
              </div>
              <div className="absolute top-3 right-3 z-20 pointer-events-none opacity-75">
                <span className="font-label-sigil text-label-sigil text-primary">─┐</span>
              </div>

              <DynamicCharacter3DCanvas height="h-[460px]" />

              <div className="absolute bottom-3 inset-x-0 mx-auto w-fit z-20 flex items-center gap-space-xs bg-surface-container-low/90 backdrop-blur-md px-space-md py-1 rounded-full border border-surface-container-high">
                <span className="material-symbols-outlined text-[14px] text-primary">shield</span>
                <span className="font-label-telemetry text-[10px] text-on-surface-variant uppercase font-bold">
                  Streak Resonance: {streak} Days
                </span>
              </div>
            </div>

            {/* Stats Summary Panel */}
            <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-container-high flex flex-col gap-space-sm">
              <span className="font-label-sigil text-[10px] text-outline uppercase tracking-wider font-bold">
                CHARACTER OVERVIEW METRICS
              </span>
              <div className="grid grid-cols-3 gap-space-xs">
                <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-primary/30 flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-[20px] text-primary">military_tech</span>
                  <span className="font-title-md text-[11px] text-primary font-bold mt-1">Level {level}</span>
                  <span className="font-label-telemetry text-[9px] text-outline font-bold">RANK</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-secondary/30 flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-[20px] text-secondary">bolt</span>
                  <span className="font-title-md text-[11px] text-secondary font-bold mt-1">{totalXp.toLocaleString()} XP</span>
                  <span className="font-label-telemetry text-[9px] text-outline font-bold">TOTAL YIELD</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-tertiary/30 flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-[20px] text-tertiary">local_fire_department</span>
                  <span className="font-title-md text-[11px] text-tertiary font-bold mt-1">{streak} Days</span>
                  <span className="font-label-telemetry text-[9px] text-outline font-bold">STREAK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attribute Cards (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {loading && (
              <div className="p-space-lg text-center text-on-surface-variant font-label-telemetry">
                LOADING CHARACTER ATTRIBUTES...
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {attributes.map((attr) => (
                <div key={attr.id} className="relative flex flex-col">
                  <StatCard
                    name={attr.name}
                    icon={attr.icon || 'psychology'}
                    value={Math.min(100, Math.round(totalXp / 10))}
                    max={100}
                    level={level}
                    color={defaultColorMap[attr.name] || '#38bdf8'}
                    description={attr.description || 'Character attribute discipline.'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
