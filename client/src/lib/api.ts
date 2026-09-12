import { supabase } from './supabase';
import { Character, Task, Attribute, RewardCatalogItem, InventoryItem, CompletionResult, PurchaseResult } from '@shared/types';
import { deduplicateRequest, invalidateCache, getCachedData, TTL } from './cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return {};
  }
  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data as T;
}

export interface UserMeResponse {
  user: { id: string; email?: string };
  character: Character;
  attributes: Attribute[];
}

export interface QuestsResponse {
  tasks: Task[];
}

export interface CreateQuestData {
  title: string;
  description?: string;
  category: string;
  attribute_id?: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  due_date?: string | null;
}

export interface RewardsResponse {
  rewards: RewardCatalogItem[];
}

export interface InventoryResponse {
  inventory: InventoryItem[];
}

export interface ProgressResponse {
  totalCompletions: number;
  weeklyXP: Array<{ day: string; xp: number }>;
  activityDays: Array<{ day: number; date: string; count: number; intensity: number }>;
}

export async function getUserProfile(): Promise<UserMeResponse> {
  const cacheKey = '/users/me';
  try {
    return await deduplicateRequest(cacheKey, () => apiRequest<UserMeResponse>('/users/me'), TTL.USER_DATA, false);
  } catch (err) {
    const stale = getCachedData<UserMeResponse>(cacheKey);
    if (stale) return stale;
    throw err;
  }
}

export async function getAttributes(): Promise<{ attributes: Attribute[] }> {
  const cacheKey = '/users/attributes';
  try {
    return await deduplicateRequest(cacheKey, () => apiRequest<{ attributes: Attribute[] }>('/users/attributes'), TTL.STATIC);
  } catch (err) {
    const stale = getCachedData<{ attributes: Attribute[] }>(cacheKey);
    if (stale) return stale;
    throw err;
  }
}

export async function getQuests(status?: string): Promise<QuestsResponse> {
  const query = status ? `?status=${status}` : '';
  const cacheKey = `/quests${query}`;
  try {
    return await deduplicateRequest(cacheKey, () => apiRequest<QuestsResponse>(`/quests${query}`), TTL.USER_DATA, false);
  } catch (err) {
    const stale = getCachedData<QuestsResponse>(cacheKey);
    if (stale) return stale;
    throw err;
  }
}

export async function createQuest(data: CreateQuestData): Promise<{ task: Task }> {
  const result = await apiRequest<{ task: Task }>('/quests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  invalidateCache(/\/quests/);
  invalidateCache('/users/me');
  return result;
}

export async function completeQuest(taskId: string): Promise<CompletionResult> {
  const result = await apiRequest<CompletionResult>(`/quests/${taskId}/complete`, {
    method: 'POST',
  });
  invalidateCache(/\/quests/);
  invalidateCache('/users/me');
  invalidateCache('/users/progress');
  return result;
}

export async function getRewards(): Promise<RewardsResponse> {
  const cacheKey = '/rewards';
  try {
    return await deduplicateRequest(cacheKey, () => apiRequest<RewardsResponse>('/rewards'), TTL.SEMI_STATIC);
  } catch (err) {
    const stale = getCachedData<RewardsResponse>(cacheKey);
    if (stale) return stale;
    throw err;
  }
}

export async function purchaseReward(rewardId: string, itemData?: { name?: string; price?: number }): Promise<PurchaseResult> {
  const result = await apiRequest<PurchaseResult>(`/rewards/${rewardId}/purchase`, {
    method: 'POST',
    body: JSON.stringify(itemData || {}),
  });
  invalidateCache('/users/me');
  invalidateCache('/rewards');
  invalidateCache('/users/inventory');
  return result;
}

export async function getInventory(): Promise<InventoryResponse> {
  const cacheKey = '/users/inventory';
  try {
    return await deduplicateRequest(cacheKey, () => apiRequest<InventoryResponse>('/users/inventory'), TTL.USER_DATA, false);
  } catch (err) {
    const stale = getCachedData<InventoryResponse>(cacheKey);
    if (stale) return stale;
    throw err;
  }
}

export async function getProgress(): Promise<ProgressResponse> {
  const cacheKey = '/users/progress';
  try {
    return await deduplicateRequest(cacheKey, () => apiRequest<ProgressResponse>('/users/progress'), TTL.USER_DATA, false);
  } catch (err) {
    const stale = getCachedData<ProgressResponse>(cacheKey);
    if (stale) return stale;
    throw err;
  }
}

export async function saveCustomization(data: {
  characterClass?: string;
  weapon?: string;
  headgear?: string;
  auraColor?: number;
  armorTheme?: number;
}): Promise<{ success: boolean; message?: string }> {
  return await apiRequest<{ success: boolean; message?: string }>('/users/customization', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
