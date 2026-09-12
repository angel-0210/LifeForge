'use client';

import React from 'react';
import { useAvatarCustomization } from '@/context/AvatarCustomizationContext';
import { useCharacter } from '@/context/CharacterContext';
import {
  CharacterClass,
  CLASS_VISUALS,
  WEAPON_OPTIONS,
  HEADGEAR_OPTIONS,
  COLOR_THEMES,
  isClassUnlocked,
  isWeaponUnlocked,
  isHeadgearUnlocked,
  isThemeUnlocked,
} from '@/lib/classVisuals';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarCustomizerModal({ isOpen, onClose }: AvatarCustomizerModalProps) {
  const { level: playerLevel } = useCharacter();
  const {
    characterClass,
    headgear,
    weapon,
    auraColor,
    armorTheme,
    setCharacterClass,
    setHeadgear,
    setWeapon,
    setAuraColor,
    setArmorTheme,
  } = useAvatarCustomization();

  if (!isOpen) return null;

  const classesList = Object.values(CLASS_VISUALS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-surface-container-low rounded-2xl border border-surface-container-high shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-space-md border-b border-surface-container-high bg-surface-container-lowest">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">palette</span>
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-headline uppercase font-bold">
                AVATAR FORGE & CUSTOMIZER
              </h2>
              <span className="font-label-telemetry text-[10px] text-tertiary uppercase font-bold">
                CURRENT RANK: LEVEL {playerLevel} EXPLORER
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-space-lg flex flex-col gap-space-lg overflow-y-auto custom-scrollbar">
          {/* Section 1: Character Class */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <label className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
                1. SELECT CHARACTER CLASS (7 CLASSES)
              </label>
              <span className="font-label-telemetry text-[10px] text-outline uppercase font-bold">
                UNLOCKED BY LEVEL
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
              {classesList.map((cls) => {
                const isSelected = characterClass === cls.id;
                const unlocked = isClassUnlocked(cls.id as CharacterClass, playerLevel);
                const levelsNeeded = cls.requiredLevel - playerLevel;

                return (
                  <button
                    key={cls.id}
                    disabled={!unlocked}
                    onClick={() => setCharacterClass(cls.id as CharacterClass)}
                    className={`relative p-space-sm rounded-xl border flex flex-col items-center gap-1 transition-all text-center ${
                      !unlocked
                        ? 'border-surface-container-high bg-surface-container-lowest/40 text-outline cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-primary bg-primary-container/20 text-primary shadow-md cursor-pointer'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface hover:border-surface-container-highest cursor-pointer'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{cls.icon}</span>
                    <span className="font-title-md text-[12px] font-bold">{cls.name}</span>

                    {!unlocked && (
                      <span className="mt-1 font-label-telemetry text-[9px] text-outline font-bold bg-surface-container px-1.5 py-0.5 rounded border border-surface-container-high flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">lock</span>
                        <span>LVL {cls.requiredLevel} ({levelsNeeded} left)</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Weapon Selection */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
              2. EQUIP WEAPON ARSENAL
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
              {WEAPON_OPTIONS.map((w) => {
                const unlocked = isWeaponUnlocked(w.id, playerLevel);
                const isSelected = weapon === w.id;

                return (
                  <button
                    key={w.id}
                    disabled={!unlocked}
                    onClick={() => setWeapon(w.id)}
                    className={`px-space-sm py-2 rounded-lg border font-label-telemetry text-[11px] uppercase font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
                      !unlocked
                        ? 'border-surface-container-high bg-surface-container-lowest/40 text-outline cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-secondary bg-secondary-container/20 text-secondary shadow-sm cursor-pointer'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:border-surface-container-highest cursor-pointer'
                    }`}
                  >
                    <span>{w.label}</span>
                    {!unlocked && (
                      <span className="text-[9px] text-outline font-normal flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">lock</span>
                        <span>LVL {w.requiredLevel}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Headgear Selection */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
              3. HEADGEAR & HELMET SLOT
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
              {HEADGEAR_OPTIONS.map((h) => {
                const unlocked = isHeadgearUnlocked(h.id, playerLevel);
                const isSelected = headgear === h.id;

                return (
                  <button
                    key={h.id}
                    disabled={!unlocked}
                    onClick={() => setHeadgear(h.id)}
                    className={`px-space-sm py-2 rounded-lg border font-label-telemetry text-[11px] uppercase font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
                      !unlocked
                        ? 'border-surface-container-high bg-surface-container-lowest/40 text-outline cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-tertiary bg-tertiary-container/20 text-tertiary shadow-sm cursor-pointer'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:border-surface-container-highest cursor-pointer'
                    }`}
                  >
                    <span>{h.label}</span>
                    {!unlocked && (
                      <span className="text-[9px] text-outline font-normal flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">lock</span>
                        <span>LVL {h.requiredLevel}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Aura & Color Theme */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
              4. AURA & COLOR PALETTE THEME
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
              {COLOR_THEMES.map((theme, idx) => {
                const unlocked = isThemeUnlocked(theme.aura, theme.primary, playerLevel);
                const isSelected =
                  (auraColor === theme.aura && armorTheme === theme.primary) ||
                  (idx === 0 && auraColor === 0 && armorTheme === 0);

                return (
                  <button
                    key={theme.name}
                    disabled={!unlocked}
                    onClick={() => {
                      setAuraColor(theme.aura);
                      setArmorTheme(theme.primary);
                    }}
                    className={`p-space-sm rounded-lg border flex items-center justify-between font-label-telemetry text-[11px] uppercase font-bold transition-all ${
                      !unlocked
                        ? 'border-surface-container-high bg-surface-container-lowest/40 text-outline cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-sm cursor-pointer'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:border-surface-container-highest cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow"
                        style={{
                          backgroundColor:
                            theme.primary === 0 ? '#ef4444' : `#${theme.primary.toString(16).padStart(6, '0')}`,
                        }}
                      />
                      <span>{theme.name}</span>
                    </div>

                    {!unlocked && (
                      <span className="text-[9px] text-outline font-normal flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">lock</span>
                        <span>LVL {theme.requiredLevel}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-space-md border-t border-surface-container-high bg-surface-container-lowest flex items-center justify-between">
          <span className="font-label-telemetry text-[10px] text-outline font-bold">
            Complete quests to earn XP & level up to unlock higher tier cosmetics!
          </span>
          <button
            onClick={onClose}
            className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[11px] uppercase tracking-wider font-bold shadow-md cursor-pointer"
          >
            [ SEAL CUSTOMIZATION ]
          </button>
        </div>
      </div>
    </div>
  );
}
