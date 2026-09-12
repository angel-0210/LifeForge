'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import QuestCard, { QuestItem } from '@/components/QuestCard';
import { getQuests, completeQuest as completeQuestAPI } from '@/lib/api';
import { Task } from '@shared/types';
import { useCharacter } from '@/context/CharacterContext';

const validCategories = ['intellect', 'strength', 'discipline', 'creativity', 'wellness', 'social', 'focus', 'vitality', 'general'] as const;
type CategoryType = typeof validCategories[number];

function parseCategory(cat?: string): CategoryType {
  const normalized = (cat || '').toLowerCase() as CategoryType;
  return validCategories.includes(normalized) ? normalized : 'discipline';
}

function mapTaskToQuestItem(task: Task): QuestItem {
  const diffMap: Record<string, { tier: 'Standard' | 'Medium' | 'Hard' | 'Legendary'; xp: number; gold: number }> = {
    easy: { tier: 'Standard', xp: 25, gold: 10 },
    medium: { tier: 'Medium', xp: 50, gold: 25 },
    hard: { tier: 'Hard', xp: 100, gold: 60 },
    epic: { tier: 'Legendary', xp: 250, gold: 150 },
  };
  const meta = diffMap[task.difficulty] || diffMap.medium;

  return {
    id: task.id,
    title: task.title,
    category: parseCategory(task.category),
    tier: meta.tier,
    xp: meta.xp,
    gold: meta.gold,
    statBonus: task.attribute ? `+${task.attribute.name}` : `+${meta.gold} Gold`,
    time: task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
    completed: task.status === 'completed',
  };
}

export default function QuestsPage() {
  const { updateCharacter } = useCharacter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('today');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    try {
      const data = await getQuests();
      const mapped = (data.tasks || []).map(mapTaskToQuestItem);
      setQuests(mapped);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCompleteQuest = async (id: string) => {
    try {
      const result = await completeQuestAPI(id);
      updateCharacter(result.character);
      setQuests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
      );
      setToastMessage(`+${result.xpAwarded} XP & +${result.currencyAwarded} GOLD SEALED IN MATRIX`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete quest';
      setToastMessage(`ERROR: ${msg}`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredQuests = quests.filter((q) => {
    if (activeCategory !== 'all' && q.category !== activeCategory) return false;
    if (activeTab === 'completed' && !q.completed) return false;
    if (activeTab === 'today' && q.completed) return true;
    return true;
  });

  const pendingCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <AppLayout>
      <div className="p-margin sm:p-margin-md lg:p-margin-lg flex flex-col gap-space-md lg:gap-space-lg">
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-lg border-b border-surface-container-high">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-space-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
                TACTICAL DIRECTIVES
              </span>
              <span className="text-outline font-label-telemetry text-[11px]">•</span>
              <span className="font-label-telemetry text-[11px] text-tertiary uppercase">LIVE DISCIPLINE MATRIX</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-headline font-bold">
              QUEST MATRIX // TACTICAL DIRECTIVES
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Execute daily disciplines to forge character stats, channel XP, and unlock ascension loot.
            </p>
          </div>

          {/* Create Quest Action */}
          <div className="flex items-center gap-space-sm shrink-0">
            <Link
              href="/quests/create"
              className="relative group px-space-lg py-space-sm rounded-lg bg-primary-container/20 hover:bg-primary hover:text-on-primary text-primary transition-all duration-300 shadow-[0_0_18px_rgba(245,158,11,0.25)] flex items-center gap-space-sm font-bold border border-primary/30"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
                add
              </span>
              <span className="font-label-telemetry text-[12px] uppercase tracking-wider">
                CREATE QUEST
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Section Tabs */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-space-sm border-b border-surface-container-high">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-space-md py-space-sm rounded-lg font-title-md text-[14px] flex items-center gap-space-xs transition-colors cursor-pointer ${
              activeTab === 'today'
                ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">adjust</span>
            <span>Today&apos;s Quests</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary font-label-numeric text-[11px] ml-space-xs font-bold">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-space-md py-space-sm rounded-lg font-title-md text-[14px] flex items-center gap-space-xs transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Completed</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-tertiary font-label-numeric text-[11px] ml-space-xs font-bold">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-space-sm flex-wrap pb-space-sm">
          {[
            { id: 'all', label: 'All Disciplines', icon: 'grid_view' },
            { id: 'strength', label: 'Strength', icon: 'fitness_center' },
            { id: 'intellect', label: 'Intellect', icon: 'psychology' },
            { id: 'discipline', label: 'Discipline', icon: 'shield' },
            { id: 'creativity', label: 'Creativity', icon: 'palette' },
            { id: 'wellness', label: 'Wellness', icon: 'spa' },
            { id: 'social', label: 'Social', icon: 'groups' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveCategory(chip.id)}
              className={`px-space-md py-1 rounded-full font-label-telemetry text-[11px] uppercase tracking-wider flex items-center gap-space-xs transition-all cursor-pointer ${
                activeCategory === chip.id
                  ? 'bg-primary text-on-primary font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Quest Cards Grid */}
        <div className="flex flex-col gap-space-md">
          {loading && (
            <div className="p-space-lg text-center text-on-surface-variant font-label-telemetry">
              LOADING QUEST MATRIX...
            </div>
          )}
          {!loading && filteredQuests.length === 0 && (
            <div className="p-space-lg bg-surface-container-low rounded-xl text-center text-on-surface-variant font-body-md border border-surface-container-high">
              No quests found for this selection. Create a new quest to begin!
            </div>
          )}
          {filteredQuests.map((q) => (
            <QuestCard key={q.id} quest={q} onComplete={(id) => handleCompleteQuest(id)} />
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-8 z-50 animate-bounce flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-high text-on-surface shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
            <span className="material-symbols-outlined text-[20px]">check</span>
          </div>
          <span className="font-title-md text-title-md font-bold">{toastMessage}</span>
        </div>
      )}
    </AppLayout>
  );
}

