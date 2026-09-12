import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL is missing in server/.env');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runMigrations() {
  console.log('🚀 Connecting to Supabase PostgreSQL database...');
  await client.connect();
  console.log('✅ Connected to database successfully.');

  console.log('🔨 Migrating & updating database schemas...');

  const migrationSql = `
    -- Enable pgcrypto extension for UUID generation
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- 1. Create Characters Table if not existing
    CREATE TABLE IF NOT EXISTS public.characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL,
        level INT NOT NULL DEFAULT 1,
        total_xp INT NOT NULL DEFAULT 0,
        currency INT NOT NULL DEFAULT 0,
        current_streak INT NOT NULL DEFAULT 0,
        longest_streak INT NOT NULL DEFAULT 0,
        last_active_date DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 2. Create Attributes Table if not existing
    CREATE TABLE IF NOT EXISTS public.attributes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Seed Default Attributes
    INSERT INTO public.attributes (id, name, description, icon) VALUES
      ('11111111-1111-1111-1111-111111111111', 'Intellect', 'Cognitive acuity and problem solving', 'psychology'),
      ('22222222-2222-2222-2222-222222222222', 'Strength', 'Physical power and somatic endurance', 'fitness_center'),
      ('33333333-3333-3333-3333-333333333333', 'Discipline', 'Willpower consistency and habit execution', 'shield'),
      ('44444444-4444-4444-4444-444444444444', 'Focus', 'Deep concentration and flow state', 'bolt'),
      ('55555555-5555-5555-5555-555555555555', 'Vitality', 'Energy, recovery, and wellness balance', 'favorite'),
      ('66666666-6666-6666-6666-666666666666', 'General', 'Overall productivity and community directives', 'groups')
    ON CONFLICT (name) DO NOTHING;

    -- 3. Safely Update Tasks Table Schema
    CREATE TABLE IF NOT EXISTS public.tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'discipline',
        attribute_id UUID REFERENCES public.attributes(id) ON DELETE SET NULL,
        difficulty TEXT NOT NULL DEFAULT 'medium',
        status TEXT NOT NULL DEFAULT 'pending',
        due_date TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Ensure missing columns are added to tasks table without data loss
    ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'discipline';
    ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS attribute_id UUID REFERENCES public.attributes(id) ON DELETE SET NULL;
    ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'medium';
    ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

    CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);

    -- 4. Create Task Completions Table
    CREATE TABLE IF NOT EXISTS public.task_completions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
        user_id UUID NOT NULL,
        xp_awarded INT NOT NULL,
        currency_awarded INT NOT NULL,
        attribute_id_awarded UUID REFERENCES public.attributes(id) ON DELETE SET NULL,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 5. Safely Update Rewards Catalog Table Schema
    CREATE TABLE IF NOT EXISTS public.rewards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'item',
        price INT NOT NULL DEFAULT 50,
        metadata JSONB DEFAULT '{}'::jsonb,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Ensure missing columns & defaults are added to rewards table
    ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS title TEXT;
    ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'item';
    ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS price INT DEFAULT 50;
    ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS cost INT DEFAULT 50;
    ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.rewards ALTER COLUMN created_at SET DEFAULT NOW();
    ALTER TABLE public.rewards ALTER COLUMN updated_at SET DEFAULT NOW();
    
    -- Sync existing columns
    UPDATE public.rewards SET name = title WHERE name IS NULL AND title IS NOT NULL;
    UPDATE public.rewards SET title = name WHERE title IS NULL AND name IS NOT NULL;
    UPDATE public.rewards SET price = cost WHERE price IS NULL AND cost IS NOT NULL;
    UPDATE public.rewards SET cost = price WHERE cost IS NULL AND price IS NOT NULL;
    UPDATE public.rewards SET created_at = NOW() WHERE created_at IS NULL;
    UPDATE public.rewards SET updated_at = NOW() WHERE updated_at IS NULL;

    -- Seed Default Rewards Catalog
    INSERT INTO public.rewards (id, title, name, type, cost, price, metadata, is_active, created_at, updated_at) VALUES
      ('77777777-7777-7777-7777-777777777777', 'Cognitive Focus Elixir', 'Cognitive Focus Elixir', 'perk', 50, 50, '{"description": "Boosts XP yield by 1.5x for 2 hours"}'::jsonb, TRUE, NOW(), NOW()),
      ('88888888-8888-8888-8888-888888888888', 'Aetheric Crown of Discipline', 'Aetheric Crown of Discipline', 'item', 250, 250, '{"description": "Sovereign gear relic conferring +10 Discipline stat"}'::jsonb, TRUE, NOW(), NOW()),
      ('99999999-9999-9999-9999-999999999999', 'Sanctuary Rest Pass', 'Sanctuary Rest Pass', 'custom', 100, 100, '{"description": "Protects current streak for 24 hours of rest"}'::jsonb, TRUE, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- 6. Create User Inventory Table
    CREATE TABLE IF NOT EXISTS public.inventory (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
        purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await client.query(migrationSql);
  console.log('🎉 Migration completed successfully! Database tables updated and verified.');

  // Verify created tables & columns
  const res = await client.query(`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name IN ('tasks', 'characters', 'attributes', 'rewards', 'inventory', 'task_completions')
    ORDER BY table_name, ordinal_position;
  `);

  const tables: Record<string, string[]> = {};
  res.rows.forEach((row) => {
    if (!tables[row.table_name]) tables[row.table_name] = [];
    tables[row.table_name].push(row.column_name);
  });

  console.log('\n📊 Verified LifeForge Core Tables in Supabase PostgreSQL:');
  Object.entries(tables).forEach(([table, cols]) => {
    console.log(`  ✓ Table [${table}]: ${cols.join(', ')}`);
  });

  await client.end();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  client.end();
  process.exit(1);
});
