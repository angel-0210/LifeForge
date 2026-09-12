import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(255, 'Title too long'),
  description: z.string().optional(),
  category: z.string().trim().min(1, 'Category is required'),
  attribute_id: z.string().uuid('Valid attribute ID required').optional().nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'epic']),
  due_date: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
});

export const purchaseRewardSchema = z.object({
  reward_id: z.string().uuid('Valid reward ID required'),
});
