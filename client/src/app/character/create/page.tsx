'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default function CharacterCreatePage() {
  const router = useRouter();
  const [characterName, setCharacterName] = useState('Kaelen');
  const [selectedClass, setSelectedClass] = useState('Arcane Scholar');
  const [pointsLeft, setPointsLeft] = useState(10);
  const [allocations, setAllocations] = useState({
    STR: 2,
    INT: 4,
    DIS: 2,
    CRE: 1,
    WEL: 1,
    SOC: 0,
  });

  const classes = [
    {
      name: 'Arcane Scholar',
      icon: 'auto_awesome',
      primaryStat: 'Intellect',
      description: 'Master of deep work, algorithmic logic, and cognitive architecture.',
    },
    {
      name: 'Blade Warden',
      icon: 'swords',
      primaryStat: 'Strength',
      description: 'Master of somatic endurance, physical workout rigor, and kinetic power.',
    },
    {
      name: 'Sunfire Monk',
      icon: 'self_improvement',
      primaryStat: 'Discipline',
      description: 'Master of daily habit streaks, willpower combustion, and wellness clarity.',
    },
  ];

  const handleAdjustStat = (statKey: keyof typeof allocations, delta: number) => {
    if (delta > 0 && pointsLeft <= 0) return;
    if (delta < 0 && allocations[statKey] <= 0) return;

    setAllocations((prev) => ({
      ...prev,
      [statKey]: prev[statKey] + delta,
    }));
    setPointsLeft((prev) => prev - delta);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/character');
  };

  return (
    <AppLayout>
      <div className="p-margin md:p-margin-md lg:p-margin-lg flex items-center justify-center">
        <div className="relative w-full max-w-3xl rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col gap-space-lg border border-surface-container-high">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
            <div className="flex flex-col">
              <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
                GENESIS PROTOCOL
              </span>
              <h1 className="font-headline-md text-headline-md text-on-surface font-headline uppercase font-bold">
                FORGE YOUR CHARACTER CLASS
              </h1>
            </div>
            <Link
              href="/character"
              className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </Link>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-space-lg">
            {/* Character Name Input */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                CHARACTER CODENAME
              </label>
              <input
                type="text"
                required
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md"
              />
            </div>

            {/* Class Selection */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                CHOOSE CLASS SPECIALIZATION
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {classes.map((cls) => (
                  <div
                    key={cls.name}
                    onClick={() => setSelectedClass(cls.name)}
                    className={`p-space-md rounded-xl border flex flex-col gap-space-xs transition-all cursor-pointer ${
                      selectedClass === cls.name
                        ? 'border-primary bg-primary-container/20 shadow-lg'
                        : 'border-surface-container-high bg-surface-container-lowest hover:border-surface-container-highest'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[28px] text-primary">{cls.icon}</span>
                      <span className="font-label-telemetry text-[10px] text-primary uppercase font-bold">
                        {cls.primaryStat} Focus
                      </span>
                    </div>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-bold">{cls.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{cls.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Starter Point Allocator */}
            <div className="p-space-md rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-sigil text-[11px] text-outline uppercase tracking-wider font-bold">
                  INITIATE ATTRIBUTE DISTRIBUTION
                </span>
                <span className="font-label-numeric text-[13px] text-primary font-bold">
                  {pointsLeft} POINTS REMAINING
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md">
                {(Object.keys(allocations) as Array<keyof typeof allocations>).map((k) => (
                  <div key={k} className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-high">
                    <span className="font-label-telemetry text-[12px] font-bold text-on-surface">{k}</span>
                    <div className="flex items-center gap-space-xs">
                      <button
                        type="button"
                        onClick={() => handleAdjustStat(k, -1)}
                        className="w-6 h-6 rounded bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-label-numeric text-[14px] w-5 text-center text-primary font-bold">
                        {allocations[k]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustStat(k, 1)}
                        className="w-6 h-6 rounded bg-primary text-on-primary hover:bg-primary-fixed flex items-center justify-center font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <Link
                href="/character"
                className="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label-telemetry text-[11px] uppercase tracking-wider font-bold"
              >
                [ CANCEL ]
              </Link>
              <button
                type="submit"
                className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[11px] uppercase tracking-wider font-bold shadow-[0_0_18px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                [ INITIATE ASCENSION ]
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
