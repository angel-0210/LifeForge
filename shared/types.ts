export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type TaskStatus = 'pending' | 'completed' | 'cancelled';
export type RewardType = 'item' | 'perk' | 'custom';

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  level: number;
  total_xp: number;
  currency: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface CharacterAttribute {
  character_id: string;
  attribute_id: string;
  level: number;
  xp: number;
  attribute?: Attribute;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  category: string;
  attribute_id: string;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  attribute?: Attribute;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  user_id: string;
  completed_at: string;
  xp_awarded: number;
  currency_awarded: number;
  attribute_id_awarded: string;
}

export interface RewardCatalogItem {
  id: string;
  name: string;
  type: RewardType;
  price: number;
  metadata?: Record<string, unknown>;
  is_active: boolean;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  reward_id: string;
  purchased_at: string;
  reward?: RewardCatalogItem;
}

export interface CompletionResult {
  task: Task;
  character: Character;
  xpAwarded: number;
  currencyAwarded: number;
  levelsGained: number;
  streakUpdated: boolean;
}

export interface PurchaseResult {
  character: Character;
  inventoryItem: InventoryItem;
}
