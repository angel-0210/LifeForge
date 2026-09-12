'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { getAttributes, createQuest } from '@/lib/api';
import { Attribute } from '@shared/types';

export default function CreateQuestPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('intellect');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'epic'>('medium');
  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    async function loadAttrs() {
      try {
        const res = await getAttributes();
        if (res.attributes && res.attributes.length > 0) {
          setAttributes(res.attributes);
        }
      } catch (err) {
        console.error('Failed to load attributes:', err);
      }
    }
    loadAttrs();
  }, []);

  const difficultyYields: Record<string, { xp: number; gold: number; tier: string }> = {
    easy: { xp: 25, gold: 10, tier: 'Standard' },
    medium: { xp: 50, gold: 25, tier: 'Medium' },
    hard: { xp: 100, gold: 60, tier: 'Hard' },
    epic: { xp: 250, gold: 150, tier: 'Legendary' },
  };

  const currentYield = difficultyYields[difficulty] || difficultyYields.medium;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Find matching attribute_id if available
      const matchedAttr = attributes.find(
        (a) => a.name.toLowerCase() === category.toLowerCase()
      );

      const attributeId = matchedAttr ? matchedAttr.id : undefined;

      await createQuest({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        attribute_id: attributeId,
        difficulty,
      });

      setIsCreated(true);
      setTimeout(() => {
        router.push('/quests');
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create quest';
      setErrorMsg(msg);
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-margin md:p-margin-md lg:p-margin-lg flex items-center justify-center">
        <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col gap-space-lg border border-surface-container-high">
          {/* Header */}
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
            <div className="flex flex-col">
              <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
                ALCHEMICAL BLUEPRINT
              </span>
              <h1 className="font-headline-md text-headline-md text-on-surface font-headline uppercase font-bold">
                FORGE NEW TACTICAL DIRECTIVE
              </h1>
            </div>
            <Link
              href="/quests"
              className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </Link>
          </div>

          {errorMsg && (
            <div className="p-space-sm rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-body-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            {/* Quest Title Input */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                DIRECTIVE TITLE
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Solve 3 Dynamic Programming Matrices..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md"
              />
            </div>

            {/* Category Picker */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                PRIMARY DISCIPLINE CATEGORY
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                {[
                  { id: 'intellect', label: 'Intellect', icon: 'psychology', color: 'border-[#38bdf8]' },
                  { id: 'strength', label: 'Strength', icon: 'fitness_center', color: 'border-[#ef4444]' },
                  { id: 'discipline', label: 'Discipline', icon: 'shield', color: 'border-[#f59e0b]' },
                  { id: 'focus', label: 'Focus', icon: 'bolt', color: 'border-[#a855f7]' },
                  { id: 'vitality', label: 'Vitality', icon: 'favorite', color: 'border-[#10b981]' },
                  { id: 'general', label: 'General', icon: 'groups', color: 'border-[#f97316]' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-space-xs rounded-lg border font-label-telemetry text-[11px] uppercase text-center flex items-center justify-center gap-1 transition-all ${
                      category === cat.id
                        ? `${cat.color} bg-surface-container-high text-on-surface font-bold shadow-md`
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Tier Selector */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                DIFFICULTY TIER
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                {[
                  { key: 'easy', label: 'Standard' },
                  { key: 'medium', label: 'Medium' },
                  { key: 'hard', label: 'Hard' },
                  { key: 'epic', label: 'Legendary' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setDifficulty(t.key as 'easy' | 'medium' | 'hard' | 'epic')}
                    className={`p-space-sm rounded-lg border text-[12px] font-label-telemetry uppercase tracking-wider transition-all cursor-pointer ${
                      difficulty === t.key
                        ? 'border-primary bg-primary-container/20 text-primary font-bold shadow-md'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                TACTICAL INSTRUCTIONS & OBJECTIVES
              </label>
              <textarea
                rows={3}
                placeholder="Detail key acceptance criteria or milestone checks..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md resize-none"
              />
            </div>

            {/* Calculated Yield Preview */}
            <div className="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-xs border border-surface-container-high">
              <span className="font-label-sigil text-[10px] text-outline uppercase tracking-wider font-bold">
                CALCULATED BLUEPRINT YIELD
              </span>
              <div className="flex items-center justify-between font-label-numeric text-[13px]">
                <span className="text-secondary font-bold">+{currentYield.xp} XP</span>
                <span className="text-primary-fixed font-bold">+{currentYield.gold} Gold</span>
                <span className="text-tertiary font-bold">{currentYield.tier} Tier</span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <Link
                href="/quests"
                className="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label-telemetry text-[11px] uppercase tracking-wider font-bold"
              >
                [ CANCEL ]
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[11px] uppercase tracking-wider font-bold shadow-[0_0_18px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isCreated ? (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>FORGED IN MATRIX!</span>
                  </span>
                ) : (
                  '[ FORGE DIRECTIVE ]'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

