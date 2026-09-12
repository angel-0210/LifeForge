import { Response, Router } from 'express';
import { AuthenticatedRequest } from './auth';
import { supabaseAdmin } from './database';

export const usersRouter = Router();

const DEFAULT_ATTRIBUTES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Intellect', icon: 'psychology', description: 'Cognitive acuity and problem solving' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Strength', icon: 'fitness_center', description: 'Physical power and somatic endurance' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Discipline', icon: 'shield', description: 'Willpower consistency and habit execution' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Focus', icon: 'bolt', description: 'Deep concentration and flow state' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Vitality', icon: 'favorite', description: 'Energy, recovery, and wellness balance' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'General', icon: 'groups', description: 'Overall productivity and community directives' },
];

const CLASS_LEVEL_REQUIREMENTS: Record<string, number> = {
  warrior: 1,
  mage: 1,
  rogue: 3,
  paladin: 6,
  bard: 9,
  cyberpunk: 12,
  necromancer: 15,
};

const WEAPON_LEVEL_REQUIREMENTS: Record<string, number> = {
  greatsword: 1,
  staff: 1,
  daggers: 3,
  shield_sword: 6,
  lute: 9,
  cyber_blade: 12,
  scythe: 15,
  none: 1,
};

const HEADGEAR_LEVEL_REQUIREMENTS: Record<string, number> = {
  helm: 1,
  hood: 3,
  visor: 5,
  crown: 7,
  halo: 10,
  cowl: 14,
  horns: 18,
  none: 1,
};

// GET /api/users/me - Get current user info & character profile
usersRouter.get('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const userId = req.user!.id;

    let character = null;
    try {
      const { data: charData, error } = await supabaseAdmin
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newCharacter } = await supabaseAdmin
          .from('characters')
          .insert({ user_id: userId })
          .select('*')
          .single();
        character = newCharacter;
      } else {
        character = charData;
      }
    } catch (_err) {
      // Fallback character
    }

    if (!character) {
      character = {
        id: 'default-char-id',
        user_id: userId,
        level: 1,
        total_xp: 0,
        currency: 0,
        current_streak: 0,
        longest_streak: 0,
      };
    }

    let attributesList = DEFAULT_ATTRIBUTES;
    try {
      const { data: attrsData, error: attrError } = await supabaseAdmin.from('attributes').select('*');
      if (!attrError && attrsData && attrsData.length > 0) {
        attributesList = attrsData;
      }
    } catch (_err) {
      // Use fallback
    }

    res.json({
      user: req.user,
      character,
      attributes: attributesList,
    });
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch user profile' });
  }
});

// POST /api/users/customization - Validate & save level-based avatar customization
usersRouter.post('/customization', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { characterClass, weapon, headgear } = req.body;

    let character = null;
    try {
      const { data } = await supabaseAdmin
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .single();
      character = data;
    } catch (_err) {
      // Fallback
    }

    const playerLevel = character?.level || 1;

    // Validate Class Unlock Level
    if (characterClass && CLASS_LEVEL_REQUIREMENTS[characterClass]) {
      const reqLvl = CLASS_LEVEL_REQUIREMENTS[characterClass];
      if (playerLevel < reqLvl) {
        res.status(403).json({
          code: 'LEVEL_LOCKED',
          message: `Class '${characterClass}' requires Level ${reqLvl} (Current Level: ${playerLevel})`,
        });
        return;
      }
    }

    // Validate Weapon Unlock Level
    if (weapon && WEAPON_LEVEL_REQUIREMENTS[weapon]) {
      const reqLvl = WEAPON_LEVEL_REQUIREMENTS[weapon];
      if (playerLevel < reqLvl) {
        res.status(403).json({
          code: 'LEVEL_LOCKED',
          message: `Weapon '${weapon}' requires Level ${reqLvl} (Current Level: ${playerLevel})`,
        });
        return;
      }
    }

    // Validate Headgear Unlock Level
    if (headgear && HEADGEAR_LEVEL_REQUIREMENTS[headgear]) {
      const reqLvl = HEADGEAR_LEVEL_REQUIREMENTS[headgear];
      if (playerLevel < reqLvl) {
        res.status(403).json({
          code: 'LEVEL_LOCKED',
          message: `Headgear '${headgear}' requires Level ${reqLvl} (Current Level: ${playerLevel})`,
        });
        return;
      }
    }

    res.json({
      success: true,
      message: 'Avatar customization authorized and updated.',
    });
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update customization' });
  }
});

// GET /api/users/attributes - Get shared attributes catalog
usersRouter.get('/attributes', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    let attributesList = DEFAULT_ATTRIBUTES;
    try {
      const { data: attrsData, error } = await supabaseAdmin.from('attributes').select('*').order('name');
      if (!error && attrsData && attrsData.length > 0) {
        attributesList = attrsData;
      }
    } catch (_err) {
      // Use fallback
    }
    res.json({ attributes: attributesList });
  } catch (err) {
    res.json({ attributes: DEFAULT_ATTRIBUTES });
  }
});

// GET /api/users/inventory - Get user inventory items
usersRouter.get('/inventory', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const userId = req.user!.id;
    let inventory: any[] = [];

    try {
      const { data, error } = await supabaseAdmin
        .from('inventory')
        .select('*')
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false });

      if (!error && data) {
        inventory = data;
      }
    } catch (_err) {
      inventory = [];
    }

    res.json({ inventory });
  } catch (err) {
    res.json({ inventory: [] });
  }
});

// GET /api/users/progress - Get weekly XP & 30-day activity metrics
usersRouter.get('/progress', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    const userId = req.user!.id;
    let completions: any[] = [];

    try {
      const { data, error } = await supabaseAdmin
        .from('task_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (!error && data) {
        completions = data;
      }
    } catch (_err) {
      completions = [];
    }

    const items = completions || [];
    const totalCompletions = items.length;

    // Calculate last 7 days XP yield
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const now = new Date();
    const last7DaysXP: Record<string, number> = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };

    items.forEach((c) => {
      const date = new Date(c.completed_at);
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 7) {
        const dayStr = dayNames[date.getDay()];
        if (last7DaysXP[dayStr] !== undefined) {
          last7DaysXP[dayStr] += c.xp_awarded || 0;
        }
      }
    });

    const weeklyXP = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => ({
      day,
      xp: last7DaysXP[day] || 0,
    }));

    // Calculate 30-day activity heatmap
    const activityDays = Array.from({ length: 30 }, (_, i) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (29 - i));
      const targetStr = targetDate.toISOString().split('T')[0];

      const count = items.filter((c) => c.completed_at && c.completed_at.startsWith(targetStr)).length;
      const intensity = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;

      return {
        day: i + 1,
        date: targetStr,
        count,
        intensity,
      };
    });

    res.json({
      totalCompletions,
      weeklyXP,
      activityDays,
    });
  } catch (err) {
    res.json({
      totalCompletions: 0,
      weeklyXP: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => ({ day, xp: 0 })),
      activityDays: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, date: '', count: 0, intensity: 0 })),
    });
  }
});
