'use client';

import React from 'react';
import Link from 'next/link';

export interface QuestItem {
  id: string;
  title: string;
  category: 'intellect' | 'strength' | 'discipline' | 'creativity' | 'wellness' | 'social' | 'focus' | 'vitality' | 'general';
  tier: 'Standard' | 'Medium' | 'Hard' | 'Legendary';
  xp: number;
  gold: number;
  statBonus: string;
  time: string;
  completed?: boolean;
}

interface QuestCardProps {
  quest: QuestItem;
  onComplete?: (id: string, xp: number, gold: number) => void;
}

const categoryColors: Record<string, { bg: string; text: string; label: string; iconName: string }> = {
  intellect: { bg: 'bg-[#38bdf8]/10', text: 'text-[#38bdf8]', label: 'Intellect', iconName: 'psychology' },
  strength: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', label: 'Strength', iconName: 'fitness_center' },
  discipline: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', label: 'Discipline', iconName: 'shield' },
  creativity: { bg: 'bg-[#a855f7]/10', text: 'text-[#a855f7]', label: 'Creativity', iconName: 'palette' },
  wellness: { bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', label: 'Wellness', iconName: 'spa' },
  social: { bg: 'bg-[#f97316]/10', text: 'text-[#f97316]', label: 'Social', iconName: 'groups' },
  focus: { bg: 'bg-[#a855f7]/10', text: 'text-[#a855f7]', label: 'Focus', iconName: 'bolt' },
  vitality: { bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', label: 'Vitality', iconName: 'favorite' },
  general: { bg: 'bg-[#f97316]/10', text: 'text-[#f97316]', label: 'General', iconName: 'groups' },
};

export default function QuestCard({ quest, onComplete }: QuestCardProps) {
  const cat = categoryColors[quest.category] || categoryColors.discipline;

  if (quest.completed) {
    return (
      <div className="quest-card opacity-60 hover:opacity-100 relative p-space-lg rounded-xl bg-surface-container-lowest transition-all duration-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
        <div className="flex items-start gap-space-md min-w-0">
          <div className="shrink-0 w-6 h-6 mt-1 rotate-45 bg-tertiary flex items-center justify-center shadow-[0_0_12px_rgba(86,229,169,0.7)]">
            <span className="material-symbols-outlined text-[14px] -rotate-45 text-on-tertiary font-bold">check</span>
          </div>
          <div className="flex flex-col gap-space-xs min-w-0">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className={`px-space-sm py-0.5 rounded ${cat.bg} ${cat.text} font-label-telemetry text-[11px] uppercase tracking-wider font-bold flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[14px]">{cat.iconName}</span>
                <span>{cat.label}</span>
              </span>
              <span className="px-space-sm py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-telemetry text-[11px] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>COMPLETED (+{quest.xp} XP SEALED)</span>
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface-variant line-through">{quest.title}</h3>
            <div className="flex items-center gap-space-md pt-space-xs">
              <span className="font-label-telemetry text-label-telemetry text-outline">CLAIMED TODAY</span>
              <span className="text-outline font-label-telemetry text-label-telemetry">•</span>
              <span className="font-label-numeric text-label-numeric text-tertiary">{quest.statBonus}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <span className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-tertiary font-label-telemetry text-[11px] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            ARCHIVED TODAY
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="quest-card group relative p-space-lg rounded-xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
      <div className="flex items-start gap-space-md min-w-0">
        {/* Diamond Rune Trigger */}
        <button
          className="rune-check shrink-0 w-6 h-6 mt-1 rounded-none bg-surface-container-high hover:bg-tertiary flex items-center justify-center transition-all shadow-[0_0_8px_rgba(0,0,0,0.5)] group/btn cursor-pointer"
          onClick={() => onComplete && onComplete(quest.id, quest.xp, quest.gold)}
          title="Complete quest"
        >
          <span className="material-symbols-outlined text-[14px] text-transparent group-hover/btn:text-on-tertiary font-bold">
            check
          </span>
        </button>
        <div className="flex flex-col gap-space-xs min-w-0">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className={`px-space-sm py-0.5 rounded ${cat.bg} ${cat.text} font-label-telemetry text-[11px] uppercase tracking-wider font-bold flex items-center gap-1`}>
              <span className="material-symbols-outlined text-[14px]">{cat.iconName}</span>
              <span>{cat.label}</span>
            </span>
            <span className="px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-telemetry text-[11px] uppercase">
              {quest.tier} Tier
            </span>
            <span className="text-outline font-label-telemetry text-label-telemetry">•</span>
            <span className="text-primary font-label-numeric text-[12px] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">alarm</span> {quest.time}
            </span>
          </div>
          <Link href={`/quests/details?id=${quest.id}`} className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors">
            {quest.title}
          </Link>
          <div className="flex items-center gap-space-md pt-space-xs">
            <span className="font-label-numeric text-[12px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">bolt</span> +{quest.xp} XP
            </span>
            <span className="font-label-numeric text-[12px] text-primary-fixed flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">monetization_on</span> +{quest.gold} Gold
            </span>
            <span className={`font-label-numeric text-[12px] ${cat.text} flex items-center gap-1`}>
              <span className="material-symbols-outlined text-[16px]">military_tech</span> {quest.statBonus}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-space-sm shrink-0">
        <Link
          href={`/quests/details?id=${quest.id}`}
          className="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-label-telemetry text-[11px] uppercase tracking-wider transition-colors"
        >
          DETAILS
        </Link>
        <button
          className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] font-label-telemetry text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer"
          onClick={() => onComplete && onComplete(quest.id, quest.xp, quest.gold)}
        >
          COMPLETE
        </button>
      </div>
    </div>
  );
}
