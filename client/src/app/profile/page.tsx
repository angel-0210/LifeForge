'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getInventory } from '@/lib/api';
import { InventoryItem } from '@shared/types';
import { useCharacter } from '@/context/CharacterContext';

export default function ProfilePage() {
  const { userName, userEmail, level, totalXp, streak } = useCharacter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [soundFrequency, setSoundFrequency] = useState('432 Hz');

  useEffect(() => {
    async function loadProfile() {
      try {
        const invRes = await getInventory();
        setInventory(invRes.inventory || []);
      } catch (err) {
        console.error('Failed to load profile details:', err);
      }
    }
    loadProfile();
  }, []);

  const badges = [
    { id: 1, title: 'Initiate Wayfinder', icon: 'military_tech', desc: 'Commenced Life RPG quest directives.', unlocked: level >= 1 },
    { id: 2, title: '10-Day Streak Igniter', icon: 'local_fire_department', desc: 'Maintained unbroken daily quest streak for 10 days.', unlocked: streak >= 10 },
    { id: 3, title: 'Relic Collector', icon: 'diamond', desc: 'Acquired Sanctuary relics from the Requisitions Store.', unlocked: inventory.length > 0 },
    { id: 4, title: 'Ascension Vanguard', icon: 'bolt', desc: 'Reached Level 10 Explorer rank.', unlocked: level >= 10 },
    { id: 5, title: 'Sovereign Architect', icon: 'crown', desc: 'Reach Level 20 Master rank.', unlocked: level >= 20 },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <AppLayout>
      <div className="p-margin sm:p-margin-md lg:p-margin-lg flex flex-col gap-space-md lg:gap-space-lg">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-surface-container-high">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
                IDENTITY // PLAYER DISCIPLINE
              </span>
              <span className="font-label-telemetry text-[11px] text-outline">•</span>
              <span className="font-label-telemetry text-[11px] text-tertiary uppercase">LEVEL {level} EXPLORER</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-headline font-bold">
              PROFILE & PLAYER IDENTITY
            </h1>
          </div>
        </div>

        {/* Profile Identity Card */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-xl flex flex-col md:flex-row items-center gap-space-lg">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary via-primary-container to-tertiary flex items-center justify-center text-on-primary font-headline text-[24px] sm:text-[28px] font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-primary/40 shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : 'E'}
          </div>
          <div className="flex flex-col gap-space-xs text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-space-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface font-headline font-bold capitalize">
                {userName}
              </h2>
              <span className="px-space-sm py-0.5 rounded bg-primary-container/20 text-primary font-label-telemetry text-[11px] font-bold border border-primary/30">
                LEVEL {level} EXPLORER
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">{userEmail || 'No Email Registered'}</span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-space-md pt-space-xs font-label-telemetry text-[11px] text-outline">
              <span className="font-bold text-tertiary">DISCIPLINE MATRIX ONLINE</span>
              <span>•</span>
              <span>TOTAL XP: {totalXp.toLocaleString()}</span>
              <span>•</span>
              <span>INVENTORY: {inventory.length} ITEMS</span>
            </div>
          </div>
        </div>

        {/* Achievement Badges Matrix */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface font-headline uppercase font-bold">
              UNLOCKED ACHIEVEMENT SIGILS
            </span>
            <span className="font-label-telemetry text-[11px] text-tertiary font-bold">
              {unlockedCount} / {badges.length} UNLOCKED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-space-md rounded-xl border flex items-start gap-space-md ${
                  b.unlocked
                    ? 'bg-surface-container-lowest border-primary/30'
                    : 'bg-surface-container-lowest/40 border-surface-container-high opacity-50'
                }`}
              >
                <span className="material-symbols-outlined text-[32px] text-primary">{b.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">{b.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{b.desc}</p>
                  {b.unlocked ? (
                    <span className="font-label-telemetry text-[10px] text-tertiary font-bold mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      <span>UNLOCKED</span>
                    </span>
                  ) : (
                    <span className="font-label-telemetry text-[10px] text-outline mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">lock</span>
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Realm Settings & Preferences */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col gap-space-md">
          <span className="font-headline-sm text-headline-sm text-on-surface font-headline uppercase border-b border-surface-container-high pb-space-xs font-bold">
            REALM PREFERENCES & TELEMETRY
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            <div className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-lowest border border-surface-container-high">
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-bold">Daily Directive Alerts</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Receive notifications for quest deadlines</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`px-space-md py-1 rounded font-label-telemetry text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  notifications ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-high text-outline'
                }`}
              >
                {notifications ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-lowest border border-surface-container-high">
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-bold">Aether Harmonic Frequency</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Audio feedback resonance calibration</span>
              </div>
              <select
                value={soundFrequency}
                onChange={(e) => setSoundFrequency(e.target.value)}
                className="bg-surface-container-high text-primary font-label-telemetry text-[11px] px-space-sm py-1 rounded border border-primary/30 outline-none"
              >
                <option value="432 Hz">432 Hz Harmonic</option>
                <option value="528 Hz">528 Hz Solfeggio</option>
                <option value="Mute">Muted</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

