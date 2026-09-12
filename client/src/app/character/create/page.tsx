'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import DynamicCharacter3DCanvas from '@/components/DynamicCharacter3DCanvas';
import { useAvatarCustomization } from '@/context/AvatarCustomizationContext';
import { useCharacter } from '@/context/CharacterContext';
import { CharacterClass, CLASS_VISUALS, isClassUnlocked } from '@/lib/classVisuals';

export default function CharacterCreatePage() {
  const router = useRouter();
  const { level: playerLevel } = useCharacter();
  const { setCharacterClass } = useAvatarCustomization();
  const [characterName, setCharacterName] = useState('Kaelen');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior');
  const [pointsLeft, setPointsLeft] = useState(10);
  const [allocations, setAllocations] = useState({
    STR: 2,
    INT: 4,
    DIS: 2,
    CRE: 1,
    WEL: 1,
    SOC: 0,
  });

  const classList = Object.values(CLASS_VISUALS);

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
    if (!isClassUnlocked(selectedClass, playerLevel)) return;
    setCharacterClass(selectedClass);
    router.push('/character');
  };

  return (
    <AppLayout>
      <div className="p-margin md:p-margin-md lg:p-margin-lg flex items-center justify-center">
        <div className="relative w-full max-w-4xl rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col gap-space-lg border border-surface-container-high">
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
            {/* Split layout: Live 3D Preview (Left) + Class Form (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* 3D Live Viewport Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-xs">
                <span className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider font-bold">
                  LIVE 3D CLASS PREVIEW
                </span>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high shadow-lg relative p-space-2xs">
                  <DynamicCharacter3DCanvas initialClass={selectedClass} height="h-[320px]" />
                </div>
                <div className="p-space-sm bg-surface-container-lowest rounded-lg border border-surface-container-high flex flex-col gap-1 text-center">
                  <span className="font-title-md text-[13px] text-primary font-bold">
                    {CLASS_VISUALS[selectedClass].name}
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    {CLASS_VISUALS[selectedClass].description}
                  </span>
                </div>
              </div>

              {/* Form Controls (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                {/* Character Name Input */}
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider font-bold">
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

                {/* Class Selection Grid */}
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider font-bold">
                      CHOOSE CLASS SPECIALIZATION (7 CLASSES)
                    </label>
                    <span className="font-label-telemetry text-[10px] text-primary font-bold">
                      YOUR RANK: LVL {playerLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {classList.map((cls) => {
                      const unlocked = isClassUnlocked(cls.id as CharacterClass, playerLevel);
                      const isSelected = selectedClass === cls.id;

                      return (
                        <div
                          key={cls.id}
                          onClick={() => {
                            if (unlocked) setSelectedClass(cls.id as CharacterClass);
                          }}
                          className={`p-space-xs rounded-xl border flex flex-col items-center gap-1 transition-all text-center ${
                            !unlocked
                              ? 'border-surface-container-high bg-surface-container-lowest/40 text-outline cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'border-primary bg-primary-container/20 text-primary shadow-md cursor-pointer'
                              : 'border-surface-container-high bg-surface-container-lowest text-on-surface hover:border-surface-container-highest cursor-pointer'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[24px]">{cls.icon}</span>
                          <span className="font-title-md text-[11px] font-bold">{cls.name}</span>
                          {!unlocked && (
                            <span className="text-[9px] text-outline font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px]">lock</span>
                              <span>LVL {cls.requiredLevel}</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Starter Point Allocator */}
                <div className="p-space-md rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sigil text-[10px] text-outline uppercase tracking-wider font-bold">
                      ATTRIBUTE DISTRIBUTION
                    </span>
                    <span className="font-label-numeric text-[12px] text-primary font-bold">
                      {pointsLeft} POINTS REMAINING
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-space-xs">
                    {(Object.keys(allocations) as Array<keyof typeof allocations>).map((k) => (
                      <div key={k} className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-lowest border border-surface-container-high">
                        <span className="font-label-telemetry text-[11px] font-bold text-on-surface">{k}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleAdjustStat(k, -1)}
                            className="w-5 h-5 rounded bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center font-bold cursor-pointer text-[12px]"
                          >
                            -
                          </button>
                          <span className="font-label-numeric text-[12px] w-4 text-center text-primary font-bold">
                            {allocations[k]}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdjustStat(k, 1)}
                            className="w-5 h-5 rounded bg-primary text-on-primary hover:bg-primary-fixed flex items-center justify-center font-bold cursor-pointer text-[12px]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-high">
              <Link
                href="/character"
                className="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label-telemetry text-[11px] uppercase tracking-wider font-bold"
              >
                [ CANCEL ]
              </Link>
              <button
                type="submit"
                disabled={!isClassUnlocked(selectedClass, playerLevel)}
                className={`px-space-lg py-space-sm rounded-lg font-label-telemetry text-[11px] uppercase tracking-wider font-bold transition-all ${
                  isClassUnlocked(selectedClass, playerLevel)
                    ? 'bg-primary text-on-primary hover:bg-primary-fixed shadow-[0_0_18px_rgba(245,158,11,0.4)] cursor-pointer'
                    : 'bg-surface-container-high text-outline cursor-not-allowed'
                }`}
              >
                [ SEAL CLASS & ASCEND ]
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
