'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getUserProfile, getProgress, ProgressResponse } from '@/lib/api';

export default function ProgressPage() {
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [profileRes, progressRes] = await Promise.all([
          getUserProfile(),
          getProgress(),
        ]);
        setStreak(profileRes.character?.current_streak || 0);
        setLevel(profileRes.character?.level || 1);
        setProgress(progressRes);
      } catch (err) {
        console.error('Failed to load progress metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const weeklyXP = progress?.weeklyXP || [
    { day: 'MON', xp: 0 },
    { day: 'TUE', xp: 0 },
    { day: 'WED', xp: 0 },
    { day: 'THU', xp: 0 },
    { day: 'FRI', xp: 0 },
    { day: 'SAT', xp: 0 },
    { day: 'SUN', xp: 0 },
  ];

  const maxWeeklyXP = Math.max(100, ...weeklyXP.map((w) => w.xp));

  const activityDays = progress?.activityDays || Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    intensity: 0,
  }));

  return (
    <AppLayout>
      <div className="p-margin sm:p-margin-md lg:p-margin-lg flex flex-col gap-space-md lg:gap-space-lg">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-surface-container-high">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
                STREAK CODEX // HABIT RESONANCE
              </span>
              <span className="font-label-telemetry text-[11px] text-outline">•</span>
              <span className="font-label-telemetry text-[11px] text-tertiary uppercase">LEVEL {level} METRICS</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-headline font-bold">
              PROGRESS & STREAK CODEX
            </h1>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-primary/30 shadow-md">
              <span className="material-symbols-outlined text-[18px] text-primary">local_fire_department</span>
              <span className="font-label-numeric text-[13px] text-primary font-bold">{streak} DAYS ACTIVE STREAK</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-tertiary/30">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              <span className="font-label-telemetry text-[11px] text-tertiary font-bold">
                {progress?.totalCompletions || 0} TOTAL COMPLETED
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout: Weekly Bar Chart & 30-Day Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left 7 Cols: Weekly XP Resonance */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-title-lg text-title-lg text-on-surface font-bold">Weekly XP Yield</span>
              <span className="font-label-numeric text-[12px] text-primary font-bold">
                {loading ? 'LOADING...' : `${weeklyXP.reduce((acc, curr) => acc + curr.xp, 0)} XP THIS WEEK`}
              </span>
            </div>

            {/* Bar Chart Container */}
            <div className="h-56 flex items-end justify-between gap-space-sm pt-space-md px-space-md bg-surface-container-lowest rounded-lg border border-surface-container-high">
              {weeklyXP.map((bar) => {
                const heightPct = `${Math.min(100, Math.round((bar.xp / maxWeeklyXP) * 100))}%`;
                return (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-space-xs h-full justify-end">
                    <span className="font-label-numeric text-[10px] text-primary font-bold">{bar.xp}</span>
                    <div className="w-full bg-surface-container rounded-t h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-primary-container to-primary rounded-t transition-all duration-500 hover:brightness-125"
                        style={{ height: heightPct }}
                      />
                    </div>
                    <span className="font-label-telemetry text-[10px] text-outline uppercase font-bold">{bar.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: 30-Day Activity Matrix */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-title-lg text-title-lg text-on-surface font-bold">30-Day Habit Activity Heatmap</span>
            </div>

            {/* Heatmap Tile Grid */}
            <div className="grid grid-cols-6 gap-space-xs p-space-md bg-surface-container-lowest rounded-lg border border-surface-container-high">
              {activityDays.map((item) => {
                const colors = [
                  'bg-surface-container-high border-transparent',
                  'bg-primary/20 border-primary/30',
                  'bg-primary/50 border-primary/60',
                  'bg-primary border-primary shadow-[0_0_8px_rgba(245,158,11,0.6)]',
                ];
                return (
                  <div
                    key={item.day}
                    className={`h-9 rounded flex items-center justify-center font-label-numeric text-[10px] text-on-surface border transition-transform hover:scale-105 ${colors[item.intensity]}`}
                    title={`Day ${item.day}: ${item.intensity} completions`}
                  >
                    {item.day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level Progression Timeline */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col gap-space-md">
          <span className="font-label-sigil text-[11px] text-primary uppercase tracking-wider font-bold">
            MILESTONE ASCENSION PATH
          </span>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
            {[
              { lvl: 1, title: 'Initiate', desc: 'Unlocked core quest log and stat telemetry', done: level >= 1 },
              { lvl: 5, title: 'Wayfinder', desc: 'Unlocked 3D character gear & discipline crown', done: level >= 5 },
              { lvl: 10, title: 'Sovereign', desc: 'Unlocked Vault chest daily rewards', done: level >= 10 },
              { lvl: 15, title: 'Aether Architect', desc: 'Unlocks custom sanctuary themes & relic crafting', done: level >= 15 },
            ].map((m) => (
              <div
                key={m.lvl}
                className={`p-space-md rounded-lg border flex flex-col gap-space-xs ${
                  m.done
                    ? 'bg-surface-container-lowest border-primary/40'
                    : 'bg-surface-container-lowest/50 border-surface-container-high opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-numeric text-[12px] font-bold text-primary">LEVEL {m.lvl}</span>
                  {m.done && <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>}
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">{m.title}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

