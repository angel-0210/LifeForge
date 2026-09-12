'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getRewards, purchaseReward as purchaseRewardAPI, getInventory } from '@/lib/api';
import { RewardCatalogItem, InventoryItem } from '@shared/types';
import { useCharacter } from '@/context/CharacterContext';

export default function RewardsPage() {
  const { currency: gold, streak, updateCharacter } = useCharacter();
  const [shopItems, setShopItems] = useState<RewardCatalogItem[]>([]);
  const [userInventory, setUserInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [rewardsRes, inventoryRes] = await Promise.all([
        getRewards(),
        getInventory(),
      ]);

      setShopItems(rewardsRes.rewards || []);
      setUserInventory(inventoryRes.inventory || []);
    } catch (err) {
      console.error('Failed to load shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBuyItem = async (item: RewardCatalogItem) => {
    if (gold < item.price) {
      setToastMessage('INSUFFICIENT GOLD FOR THIS REQUISITION');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    setPurchasingId(item.id);
    try {
      const result = await purchaseRewardAPI(item.id);
      updateCharacter(result.character);
      setUserInventory((prev) => [result.inventoryItem, ...prev]);
      setToastMessage(`${item.name} PURCHASED & ADDED TO INVENTORY!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Purchase failed';
      setToastMessage(`ERROR: ${msg}`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setPurchasingId(null);
    }
  };

  const purchasedRewardIds = new Set(userInventory.map((i) => i.reward_id));

  return (
    <AppLayout>
      <div className="p-margin sm:p-margin-md lg:p-margin-lg flex flex-col gap-space-md lg:gap-space-lg">
        {/* Header Kicker */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-xs border-b border-surface-container-high">
          <div className="flex flex-col gap-space-2xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sigil text-label-sigil text-primary">┌─</span>
              <span className="font-label-telemetry text-label-telemetry text-outline uppercase">
                SANCTUARY VAULT & ITEM STORE
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-headline font-bold">
              REWARDS & REQUISITIONS SHOP
            </h1>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-primary/30 shadow-md">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">monetization_on</span>
              <span className="font-label-numeric text-[14px] text-primary-fixed font-bold">{gold} GOLD BALANCE</span>
            </div>
          </div>
        </div>

        {/* Banner: Streak Status */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">local_fire_department</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-lg text-title-lg text-on-surface font-bold">Active Streak: {streak} Days</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Complete daily quests to earn currency and unlock sanctuary items.
              </span>
            </div>
          </div>
          <div className="font-label-telemetry text-[11px] text-tertiary bg-surface-container-lowest px-space-md py-1.5 rounded-lg border border-tertiary/30 font-bold">
            INVENTORY: {userInventory.length} ITEMS OWNED
          </div>
        </div>

        {/* Gold Relic Store */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-container-high shadow-md flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface font-headline uppercase font-bold">
              SANCTUARY CATALOG
            </span>
            <span className="font-label-telemetry text-[11px] text-primary font-bold">CURRENCY: GOLD</span>
          </div>

          {loading && (
            <div className="p-space-lg text-center text-on-surface-variant font-label-telemetry">
              LOADING REWARD CATALOG...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {shopItems.map((item) => {
              const isOwned = purchasedRewardIds.has(item.id);
              const metadata = item.metadata as { description?: string } | undefined;

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-xl p-space-md border flex flex-col justify-between gap-space-sm transition-colors ${
                    isOwned
                      ? 'border-tertiary/40 opacity-80'
                      : 'border-surface-container-high hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[28px] text-primary">
                      {item.type === 'perk' ? 'shield' : item.type === 'custom' ? 'workspace_premium' : 'inventory_2'}
                    </span>
                    <div className="flex flex-col">
                      <h4 className="font-title-md text-title-md text-on-surface font-bold">{item.name}</h4>
                      <span className="font-label-numeric text-[12px] text-primary-fixed font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                        <span>{item.price} Gold</span>
                      </span>
                    </div>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {metadata?.description || `Type: ${item.type}`}
                  </p>

                  <button
                    onClick={() => handleBuyItem(item)}
                    disabled={isOwned || purchasingId === item.id || gold < item.price}
                    className={`w-full py-1.5 rounded font-label-telemetry text-[10px] uppercase font-bold tracking-wider border transition-all cursor-pointer ${
                      isOwned
                        ? 'bg-surface-container-highest text-tertiary border-tertiary/30'
                        : gold < item.price
                        ? 'bg-surface-container-high text-outline border-surface-container-high cursor-not-allowed'
                        : 'bg-primary-container/20 hover:bg-primary hover:text-on-primary text-primary border-primary/30'
                    }`}
                  >
                    {isOwned
                      ? '✓ IN INVENTORY'
                      : purchasingId === item.id
                      ? 'PROCESSING...'
                      : gold < item.price
                      ? 'INSUFFICIENT GOLD'
                      : 'PURCHASE REQUISITION'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-12 right-8 z-50 animate-bounce flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-high text-on-surface shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <span className="font-title-md text-title-md font-bold">{toastMessage}</span>
        </div>
      )}
    </AppLayout>
  );
}

