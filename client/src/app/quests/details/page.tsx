'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { getQuests, completeQuest as completeQuestAPI } from '@/lib/api';
import { Task } from '@shared/types';
import { useCharacter } from '@/context/CharacterContext';

function QuestDetailsContent() {
  const searchParams = useSearchParams();
  const { updateCharacter } = useCharacter();
  const taskId = searchParams.get('id');

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTaskDetails() {
      try {
        const res = await getQuests();
        const tasks = res.tasks || [];
        if (taskId) {
          const found = tasks.find((t) => t.id === taskId);
          if (found) {
            setTask(found);
            setCompleted(found.status === 'completed');
          } else if (tasks.length > 0) {
            setTask(tasks[0]);
            setCompleted(tasks[0].status === 'completed');
          }
        } else if (tasks.length > 0) {
          setTask(tasks[0]);
          setCompleted(tasks[0].status === 'completed');
        }
      } catch (err) {
        console.error('Failed to fetch quest details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTaskDetails();
  }, [taskId]);

  const handleComplete = async () => {
    if (!task) return;
    try {
      const result = await completeQuestAPI(task.id);
      updateCharacter(result.character);
      setCompleted(true);
      setToastMessage(`QUEST COMPLETED! +${result.xpAwarded} XP & +${result.currencyAwarded} GOLD HARVESTED!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete quest';
      setToastMessage(`ERROR: ${msg}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const diffMap: Record<string, { tier: string; xp: number; gold: number }> = {
    easy: { tier: 'Standard', xp: 25, gold: 10 },
    medium: { tier: 'Medium', xp: 50, gold: 25 },
    hard: { tier: 'Hard', xp: 100, gold: 60 },
    epic: { tier: 'Legendary', xp: 250, gold: 150 },
  };

  const meta = diffMap[task?.difficulty || 'medium'] || diffMap.medium;
  const categoryName = (task?.category || 'Discipline').toUpperCase();
  const attrName = task?.attribute?.name || 'Discipline';

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-margin md:p-margin-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col gap-space-lg border border-surface-container-high">
        {/* Top Kicker */}
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
          <div className="flex flex-col">
            <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
              TACTICAL DIRECTIVE RECORD
            </span>
            <span className="font-label-telemetry text-[12px] text-[#38bdf8] uppercase font-bold">
              {categoryName} DIRECTIVE • {meta.tier.toUpperCase()} TIER
            </span>
          </div>
          <Link
            href="/quests"
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
            title="Return to Quest Matrix"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-space-xl text-center font-label-telemetry text-on-surface-variant">
            LOADING TACTICAL DIRECTIVE DATA...
          </div>
        ) : !task ? (
          <div className="p-space-xl text-center font-body-md text-on-surface-variant flex flex-col items-center gap-space-md">
            <span>No quest directive selected.</span>
            <Link
              href="/quests"
              className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-label-telemetry text-[11px] uppercase font-bold"
            >
              RETURN TO QUEST MATRIX
            </Link>
          </div>
        ) : (
          <>
            {/* Title & Deadline */}
            <div className="flex flex-col gap-space-xs">
              <h1 className="font-headline-md text-headline-md text-on-surface font-headline uppercase font-bold">
                {task.title}
              </h1>
              <div className="flex items-center gap-space-xs text-primary font-label-numeric text-[13px]">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>
                  Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {task.description || 'Execute real-world habit directive to channel XP into character matrix and earn gold rewards.'}
            </p>

            {/* Reward Breakdown Matrix */}
            <div className="p-space-lg rounded-xl bg-surface-container flex flex-col gap-space-md border border-surface-container-high">
              <span className="font-label-sigil text-[11px] text-outline uppercase tracking-wider font-bold">
                ESTIMATED ASCENSION YIELD
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col items-center border border-secondary/20">
                  <span className="font-label-telemetry text-[11px] text-secondary uppercase font-bold">EXP POTENTIAL</span>
                  <span className="font-headline-sm text-headline-sm text-secondary font-bold">+{meta.xp} XP</span>
                </div>
                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col items-center border border-primary/20">
                  <span className="font-label-telemetry text-[11px] text-primary-fixed uppercase font-bold">GOLD MINT</span>
                  <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">+{meta.gold} Gold</span>
                </div>
                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col items-center border border-[#38bdf8]/20">
                  <span className="font-label-telemetry text-[11px] text-[#38bdf8] uppercase font-bold">CORE ATTRIBUTE</span>
                  <span className="font-headline-sm text-headline-sm text-[#38bdf8] font-bold">+{attrName}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
              <div className="flex items-center gap-space-xs w-full sm:w-auto">
                <Link
                  href="/quests"
                  className="flex-1 sm:flex-none px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-telemetry text-[11px] uppercase tracking-wider text-center font-bold"
                >
                  BACK TO MATRIX
                </Link>
              </div>

              {completed ? (
                <span className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-tertiary text-on-tertiary font-label-telemetry text-[12px] uppercase tracking-wider font-bold text-center flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>QUEST COMPLETED</span>
                </span>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-fixed shadow-[0_0_20px_rgba(245,158,11,0.6)] font-label-telemetry text-[12px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-space-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>[ COMPLETE QUEST ]</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-12 right-8 z-50 animate-bounce flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-high text-on-surface shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
            <span className="material-symbols-outlined text-[20px]">check</span>
          </div>
          <span className="font-title-md text-title-md font-bold">{toastMessage}</span>
        </div>
      )}
    </main>
  );
}

export default function QuestDetailsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-space-xl text-center text-on-surface-variant font-label-telemetry">LOADING QUEST...</div>}>
        <QuestDetailsContent />
      </Suspense>
    </AppLayout>
  );
}
