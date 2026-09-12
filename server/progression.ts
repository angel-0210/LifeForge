import { Character, TaskDifficulty } from '../shared/types';
import { DIFFICULTY_REWARDS, levelFromXp } from '../shared/constants';

export function calculateTaskReward(difficulty: TaskDifficulty) {
  return DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.medium;
}

export function applyXpGain(character: Character, xpGain: number): {
  newTotalXp: number;
  newLevel: number;
  levelsGained: number;
} {
  const newTotalXp = character.total_xp + xpGain;
  const newLevel = levelFromXp(newTotalXp);
  const levelsGained = Math.max(0, newLevel - character.level);

  return {
    newTotalXp,
    newLevel,
    levelsGained,
  };
}

export function calculateStreakUpdate(character: Character, completionDate: Date = new Date()): {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  isNewActiveDay: boolean;
} {
  const todayStr = completionDate.toISOString().split('T')[0];
  const lastActiveStr = character.last_active_date ? character.last_active_date.split('T')[0] : null;

  if (lastActiveStr === todayStr) {
    return {
      currentStreak: character.current_streak,
      longestStreak: character.longest_streak,
      lastActiveDate: todayStr,
      isNewActiveDay: false,
    };
  }

  let newCurrentStreak = 1;

  if (lastActiveStr) {
    const lastActive = new Date(lastActiveStr);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newCurrentStreak = character.current_streak + 1;
    }
  }

  const newLongestStreak = Math.max(character.longest_streak, newCurrentStreak);

  return {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastActiveDate: todayStr,
    isNewActiveDay: true,
  };
}
