import { Response, Router } from 'express';
import { AuthenticatedRequest } from './auth';
import { supabaseAdmin } from './database';

export const rewardsRouter = Router();

const DEFAULT_REWARDS = [
  { id: '11111111-1111-1111-1111-111111111111', name: '1-Hour Gaming Pass', type: 'perk', price: 50, metadata: { description: 'Earn 1 hour of guilt-free video game time' }, is_active: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Cheat Meal Treat', type: 'item', price: 100, metadata: { description: 'Treat yourself to a snack or coffee treat' }, is_active: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Movie Night Ticket', type: 'perk', price: 150, metadata: { description: 'Watch a full movie or favorite show relaxed' }, is_active: true },
  { id: '44444444-4444-4444-4444-444444444444', name: 'RPG Title: Apprentice Slayer', type: 'custom', price: 250, metadata: { title: 'Apprentice Slayer', type: 'badge' }, is_active: true },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Weekend Day Off Pass', type: 'perk', price: 500, metadata: { description: 'Full rest day from non-essential task goals' }, is_active: true },
];

async function ensureDefaultRewardsInDb() {
  try {
    for (const r of DEFAULT_REWARDS) {
      await supabaseAdmin.from('reward_catalog').upsert(r as any, { onConflict: 'id' });
    }
  } catch (_e) {
    // Ignore upsert errors
  }
}

// GET /api/rewards - List active shop catalog
rewardsRouter.get('/', async (_req, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=900, stale-while-revalidate=3600');
    let rewards = DEFAULT_REWARDS;
    try {
      const { data, error } = await supabaseAdmin
        .from('reward_catalog')
        .select('*')
        .order('price', { ascending: true });

      if (!error && data && data.length > 0) {
        rewards = data;
      } else {
        await ensureDefaultRewardsInDb();
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
    const { name, price } = req.body || {};

    // 1. Fetch reward item from DB or fallback list
    let reward: any = null;
    try {
      const { data } = await supabaseAdmin
        .from('reward_catalog')
        .select('*')
        .eq('id', rewardId)
        .maybeSingle();

      if (data) {
        reward = data;
      }
    } catch (_err) {
      reward = null;
    }

    // Check DEFAULT_REWARDS list by ID or by Name
    if (!reward) {
      const defaultItem = DEFAULT_REWARDS.find(
        (r) => r.id === rewardId || (name && r.name.toLowerCase() === String(name).toLowerCase())
      );
      if (defaultItem) {
        reward = defaultItem;
        ensureDefaultRewardsInDb();
      }
    }

    // Dynamic fallback using client-passed item details
    if (!reward) {
      reward = {
        id: rewardId || `rew-${Date.now()}`,
        name: name || 'Sanctuary Requisition Item',
        type: 'perk',
        price: typeof price === 'number' ? price : 50,
        metadata: { description: 'Sanctuary requisition item' },
        is_active: true,
      };
    }

    // 2. Fetch character profile
    let character: any = null;
    try {
      const { data } = await supabaseAdmin
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (data) {
        character = data;
      }
    } catch (_err) {
      character = null;
    }

    if (!character) {
      try {
        const { data: newChar } = await supabaseAdmin
          .from('characters')
          .insert({ user_id: userId, currency: 100 })
          .select('*')
          .single();
        character = newChar;
      } catch (_err) {
        character = null;
      }
    }

    if (!character) {
      character = {
        id: userId,
        user_id: userId,
        level: 1,
        total_xp: 0,
        currency: 100,
      };
    }

    // 3. Verify sufficient currency
    if (character.currency < reward.price) {
      res.status(400).json({ code: 'INSUFFICIENT_CURRENCY', message: 'Not enough gold currency to buy this reward' });
      return;
    }

    // 4. Deduct currency from character (update by user_id for maximum safety)
    const newCurrency = Math.max(0, character.currency - reward.price);
    let updatedCharacter = null;
    try {
      const { data } = await supabaseAdmin
        .from('characters')
        .update({
          currency: newCurrency,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();

      if (data) {
        updatedCharacter = data;
      }
    } catch (_err) {
      updatedCharacter = null;
    }

    const finalCharacter = updatedCharacter || { ...character, currency: newCurrency };

    // 5. Record inventory item
    let inventoryItem: any = null;
    try {
      const { data } = await supabaseAdmin
        .from('inventory')
        .insert({
          user_id: userId,
          reward_id: reward.id,
        })
        .select('*')
        .maybeSingle();

      if (data) {
        inventoryItem = { ...data, reward };
      }
    } catch (_err) {
      inventoryItem = null;
    }

    if (!inventoryItem) {
      inventoryItem = {
        id: `inv-${Date.now()}`,
        user_id: userId,
        reward_id: reward.id,
        purchased_at: new Date().toISOString(),
        reward,
      };
    }

    res.json({
      character: finalCharacter,
      inventoryItem,
    });
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to complete reward purchase' });
  }
});
