import { Response, Router } from 'express';
import { AuthenticatedRequest } from './auth';
import { supabaseAdmin } from './database';
import { purchaseRewardSchema } from './validation';

export const rewardsRouter = Router();

const DEFAULT_REWARDS = [
  { id: '11111111-1111-1111-1111-111111111111', name: '1-Hour Gaming Pass', type: 'perk', price: 50, metadata: { description: 'Earn 1 hour of guilt-free video game time' }, is_active: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Cheat Meal Treat', type: 'item', price: 100, metadata: { description: 'Treat yourself to a snack or coffee treat' }, is_active: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Movie Night Ticket', type: 'perk', price: 150, metadata: { description: 'Watch a full movie or favorite show relaxed' }, is_active: true },
  { id: '44444444-4444-4444-4444-444444444444', name: 'RPG Title: Apprentice Slayer', type: 'custom', price: 250, metadata: { title: 'Apprentice Slayer', type: 'badge' }, is_active: true },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Weekend Day Off Pass', type: 'perk', price: 500, metadata: { description: 'Full rest day from non-essential task goals' }, is_active: true },
];

// GET /api/rewards - List active shop catalog
rewardsRouter.get('/', async (_req, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=900, stale-while-revalidate=3600');
    let rewards = DEFAULT_REWARDS;
    try {
      const { data, error } = await supabaseAdmin
        .from('reward_catalog')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (!error && data && data.length > 0) {
        rewards = data;
      }
    } catch (_err) {
      rewards = DEFAULT_REWARDS;
    }

    res.json({ rewards });
  } catch (err) {
    res.json({ rewards: DEFAULT_REWARDS });
  }
});

// POST /api/rewards/:id/purchase - Transactional purchase of catalog item
rewardsRouter.post('/:id/purchase', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const rewardId = req.params.id;

    // 1. Fetch reward item
    const { data: reward, error: rewardError } = await supabaseAdmin
      .from('reward_catalog')
      .select('*')
      .eq('id', rewardId)
      .eq('is_active', true)
      .single();

    if (rewardError || !reward) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Reward item not found or inactive' });
      return;
    }

    // 2. Fetch character profile
    const { data: character, error: charError } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (charError || !character) {
      res.status(404).json({ code: 'CHARACTER_NOT_FOUND', message: 'Character profile missing' });
      return;
    }

    // 3. Verify sufficient currency
    if (character.currency < reward.price) {
      res.status(400).json({ code: 'INSUFFICIENT_CURRENCY', message: 'Not enough currency to buy this reward' });
      return;
    }

    // 4. Deduct currency from character
    const newCurrency = character.currency - reward.price;
    const { data: updatedCharacter, error: updateCharError } = await supabaseAdmin
      .from('characters')
      .update({
        currency: newCurrency,
        updated_at: new Date().toISOString(),
      })
      .eq('id', character.id)
      .select('*')
      .single();

    if (updateCharError) {
      res.status(500).json({ code: 'DB_ERROR', message: updateCharError.message });
      return;
    }

    // 5. Insert item into inventory
    const { data: inventoryItem, error: inventoryError } = await supabaseAdmin
      .from('inventory')
      .insert({
        user_id: userId,
        reward_id: rewardId,
      })
      .select('*, reward:reward_catalog(*)')
      .single();

    if (inventoryError) {
      // Rollback currency if inventory insertion fails
      await supabaseAdmin.from('characters').update({ currency: character.currency }).eq('id', character.id);
      res.status(500).json({ code: 'DB_ERROR', message: 'Failed to record inventory item' });
      return;
    }

    res.json({
      character: updatedCharacter,
      inventoryItem,
    });
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to complete reward purchase' });
  }
});
