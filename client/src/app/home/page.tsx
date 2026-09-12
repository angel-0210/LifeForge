'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import DynamicCharacter3DCanvas from '@/components/DynamicCharacter3DCanvas';
import QuestCard, { QuestItem } from '@/components/QuestCard';
import { getUserProfile, getQuests, completeQuest as completeQuestAPI } from '@/lib/api';
import { Character, Task } from '@shared/types';
import { xpForLevel } from '@shared/constants';
import { useCharacter } from '@/context/CharacterContext';

const validCategories = ['intellect', 'strength', 'discipline', 'creativity', 'wellness', 'social'] as const;
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

export default function HomePage() {
  const {
    userName,
    level,
    totalXp: currentTotalXp,
    currency: gold,
    streak,
    xpInCurrentLevel,
    xpNeededForCurrentLevel,
    xpProgress,
    updateCharacter,
  } = useCharacter();

  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const questsData = await getQuests();
      const rawTasks = questsData.tasks || [];
      const mapped = rawTasks.map(mapTaskToQuestItem);
      setQuests(mapped);

      const completedThisSession = rawTasks.filter((t) => t.status === 'completed').length;
      setCompletedCount(completedThisSession);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCompleteQuest = async (id: string) => {
    try {
      const result = await completeQuestAPI(id);

      // Instantly broadcast character update globally to Header, Drawer, Sidebar & Page
      updateCharacter(result.character);
      setCompletedCount((prev) => prev + 1);

      // Update local quest list
      setQuests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
      );

      if (result.levelsGained > 0) {
        setToastMessage(`ASCENSION! LEVEL ${result.character.level} UNLOCKED!`);
      } else {
        setToastMessage(`+${result.xpAwarded} XP & +${result.currencyAwarded} GOLD HARVESTED`);
      }

      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete quest';
      setToastMessage(`ERROR: ${msg}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const pendingQuests = quests.filter((q) => !q.completed);
  const recommendedQuest = pendingQuests[0];

  return (
    <AppLayout>
      <div className="p-margin sm:p-margin-md lg:p-margin-lg flex flex-col gap-space-md lg:gap-space-lg">
        {/* COMMAND COCKPIT BANNER */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-surface-container-high">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-telemetry text-[11px] uppercase text-primary tracking-widest font-bold">
                COMMAND MATRIX // PRIME DIRECTIVE
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-tertiary"></span>
              <span className="font-label-telemetry text-[11px] text-on-surface-variant uppercase">
                STATUS: ACTIVE
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-headline capitalize font-bold">
              Welcome back, {userName}
            </h1>
          </div>

          {/* AVATAR META BADGES */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg shadow-sm border border-surface-container-high">
              <span className="w-2 h-2 rotate-45 bg-primary-container"></span>
              <span className="font-label-numeric text-label-numeric text-primary font-bold">LVL {level}</span>
              <span className="font-body-sm text-body-sm text-outline-variant">•</span>
              <span className="font-title-md text-[14px] text-on-surface uppercase tracking-wider">Explorer</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg shadow-sm border border-surface-container-high">
              <span className="material-symbols-outlined text-[16px] text-primary">local_fire_department</span>
              <span className="font-label-numeric text-label-numeric text-on-surface">{streak} DAYS</span>
              <span className="font-label-telemetry text-on-surface-variant uppercase text-[10px]">STREAK</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg shadow-sm border border-surface-container-high">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">monetization_on</span>
              <span className="font-label-numeric text-label-numeric text-primary-fixed">{gold}</span>
              <span className="font-label-telemetry text-on-surface-variant uppercase text-[10px]">GOLD</span>
            </div>
          </div>
        </div>

        {/* MAIN HUD BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: 3D CHARACTER AVATAR & EVOLUTION CONSOLE (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* 3D AVATAR VIEWPORT CONTAINER */}
            <div className="relative w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-xl p-space-xs border border-surface-container-high">
              <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-space-xs opacity-60">
                <span className="font-label-sigil text-label-sigil text-primary">┌─</span>
                <span className="font-label-telemetry text-[10px] text-outline uppercase tracking-wider">
                  HOLO:SYS_VIEW_01
                </span>
              </div>
              <div className="absolute top-3 right-3 z-20 pointer-events-none opacity-60 text-right">
                <span className="font-label-sigil text-label-sigil text-primary">─┐</span>
              </div>

              {/* Character 3D Canvas */}
              <DynamicCharacter3DCanvas height="h-[440px]" />

              {/* Floating Telemetry Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-space-xs pointer-events-none">
                <div className="flex items-center gap-space-xs bg-surface-container-highest/80 backdrop-blur-md px-space-sm py-1 rounded-sm shadow-md border border-tertiary/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(86,229,169,0.9)] animate-pulse"></span>
                  <span className="font-label-telemetry text-[10px] text-tertiary tracking-wider">
                    LEVEL {level} // ACTIVE AVATAR
                  </span>
                </div>
              </div>

              {/* Interaction Prompt */}
              <div className="absolute bottom-4 inset-x-0 mx-auto w-fit z-20 flex items-center gap-space-xs bg-surface-container-low/90 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-lg border border-surface-container-high">
                <span className="material-symbols-outlined text-[16px] text-primary animate-pulse">3d_rotation</span>
                <span className="font-label-telemetry text-on-surface-variant text-[11px] uppercase tracking-wider">
                  Drag to inspect avatar gear
                </span>
                <span className="font-label-numeric text-outline text-[11px]">360°</span>
              </div>
            </div>

            {/* XP EVOLUTION METER */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-md relative overflow-hidden border border-surface-container-high">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(255,193,116,0.9)] animate-ping opacity-75"></div>
                  <span className="font-title-lg text-title-lg text-on-surface tracking-wide font-bold">
                    Evolutionary Trajectory
                  </span>
                </div>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">{xpInCurrentLevel}</span>
                  <span className="font-label-numeric text-label-numeric text-outline">/ {xpNeededForCurrentLevel} XP</span>
                  <span className="font-label-telemetry text-[11px] text-tertiary ml-space-xs bg-surface-container px-space-xs py-0.5 rounded font-bold">
                    {xpProgress}% READY
                  </span>
                </div>
              </div>

              <div className="relative w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary via-primary-container to-tertiary rounded-full transition-all duration-1000 shadow-[0_0_14px_rgba(245,158,11,0.6)]"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs font-label-telemetry text-[11px] text-on-surface-variant">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[15px] text-primary">flag</span>
                  <span>
                    NEXT LEVEL: <strong className="text-primary-fixed font-semibold">+{xpNeededForCurrentLevel - xpInCurrentLevel} XP</strong> needed
                  </span>
                </div>
                <span className="text-outline uppercase tracking-wider font-bold">TOTAL XP: {currentTotalXp}</span>
              </div>
            </div>

            {/* DAILY PROGRESS & VAULT TELEMETRY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {/* Daily Completion */}
              <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider font-bold">
                    DIRECTIVE COMPLETIONS
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
                </div>
                <div className="flex items-baseline gap-space-sm">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">{completedCount}</span>
                  <span className="font-title-lg text-title-lg text-outline">Tasks Completed</span>
                </div>
              </div>

              {/* Vault Status */}
              <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-label-telemetry text-[11px] text-primary tracking-wider uppercase font-bold">
                    STREAK RESONANCE
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary animate-bounce">
                    local_fire_department
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-bold">{streak} Day Active Streak</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Keep executing daily tasks to sustain your streak!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DIRECTIVES & QUEST MATRIX (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* RECOMMENDED PRIORITY QUEST */}
            {recommendedQuest && (
              <div className="relative w-full bg-surface-container-high rounded-xl p-space-lg shadow-xl border border-primary/30 overflow-hidden">
                <div className="flex items-center justify-between pb-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
                      RECOMMENDED PROTOCOL
                    </span>
                  </div>
                  <span className="font-label-telemetry text-[10px] text-secondary uppercase bg-secondary-container/30 px-space-xs py-0.5 rounded border border-secondary/30 font-bold">
                    {recommendedQuest.category}
                  </span>
                </div>

                <div className="flex flex-col gap-space-xs my-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[18px] text-primary">military_tech</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {recommendedQuest.title}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-space-xs my-space-md">
                  <span className="font-label-telemetry text-[11px] bg-surface-container-highest text-tertiary px-space-sm py-1 rounded font-bold">
                    +{recommendedQuest.xp} XP
                  </span>
                  <span className="font-label-telemetry text-[11px] bg-surface-container-highest text-primary px-space-sm py-1 rounded font-bold">
                    +{recommendedQuest.gold} GOLD
                  </span>
                  <span className="font-label-telemetry text-[11px] bg-surface-container text-on-surface-variant px-space-sm py-1 rounded ml-auto uppercase">
                    {recommendedQuest.tier} TIER
                  </span>
                </div>

                <button
                  className="w-full bg-primary text-on-primary hover:bg-primary-fixed transition-all duration-300 py-space-md px-space-lg rounded font-label-telemetry text-[12px] uppercase tracking-widest flex items-center justify-center gap-space-sm shadow-[0_0_18px_rgba(245,158,11,0.35)] cursor-pointer active:scale-[0.99] font-bold"
                  onClick={() => handleCompleteQuest(recommendedQuest.id)}
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>COMPLETE QUEST</span>
                </button>
              </div>
            )}

            {/* TODAY'S QUEST MATRIX */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-md border border-surface-container-high">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-space-sm">
                  <span className="font-title-lg text-title-lg text-on-surface font-bold">Daily Codex Directives</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-telemetry text-[11px] text-outline font-bold mr-2">
                    {loading ? 'LOADING...' : `${quests.length} TASKS`}
                  </span>
                  <Link
                    href="/quests/create"
                    className="px-space-sm py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-label-telemetry text-[10px] uppercase font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>NEW QUEST</span>
                  </Link>
                </div>
              </div>

              {/* Quest List */}
              <div className="flex flex-col gap-space-xs">
                {quests.length === 0 && !loading && (
                  <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-dashed border-surface-container-highest flex flex-col items-center justify-center text-center gap-space-md my-space-xs">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">assignment_add</span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-sm">
                      <h4 className="font-title-lg text-title-lg text-on-surface font-bold">No Active Directives</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Your quest log is currently empty. Forge your first tactical directive to earn XP, gold, and rank up your character!
                      </p>
                    </div>
                    <Link
                      href="/quests/create"
                      className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[11px] uppercase tracking-wider font-bold shadow-[0_0_18px_rgba(245,158,11,0.4)] transition-all flex items-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>FORGE FIRST QUEST</span>
                    </Link>
                  </div>
                )}
                {quests.map((q) => (
                  <QuestCard key={q.id} quest={q} onComplete={(id) => handleCompleteQuest(id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST CELEBRATION FLOATER */}
      {toastMessage && (
        <div className="fixed bottom-12 right-8 pointer-events-none z-50 animate-bounce flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-high text-on-surface shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sigil text-[10px] text-primary uppercase">ASCENSION SEALED</span>
            <span className="font-title-md text-title-md text-on-surface font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

