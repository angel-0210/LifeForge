'use client';

import React from 'react';

interface StatCardProps {
  name: string;
  icon: string;
  value: number;
  max?: number;
  level: number;
  color: string;
  description: string;
}

export default function StatCard({ name, icon, value, max = 100, level, color, description }: StatCardProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col justify-between gap-space-sm border border-surface-container-high hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[20px]" style={{ color }}>{icon}</span>
          <span className="font-title-md text-title-md text-on-surface font-semibold">{name}</span>
        </div>
        <span className="font-label-numeric text-[12px] px-space-sm py-0.5 rounded bg-surface-container-high text-primary font-bold">
          RANK {level}
        </span>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{description}</p>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center font-label-telemetry text-[11px]">
          <span className="text-outline uppercase">Resonance Energy</span>
          <span className="text-on-surface font-label-numeric">{value} / {max} XP</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
