import { TaskDifficulty } from './types';

export const DIFFICULTY_REWARDS: Record<TaskDifficulty, { xp: number; currency: number }> = {
  easy: { xp: 25, currency: 10 },
  medium: { xp: 50, currency: 25 },
  hard: { xp: 100, currency: 60 },
  epic: { xp: 250, currency: 150 },
};

/**
 * Formula required by PRD §6.5:
 * xp_to_reach_level(n) = 100 * n * (n + 1) / 2
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return Math.floor((100 * n * (n + 1)) / 2);
}

export function levelFromXp(totalXp: number): number {
  let level = 1;
  while (totalXp >= xpForLevel(level + 1)) {
    level++;
  }
  return level;
}
