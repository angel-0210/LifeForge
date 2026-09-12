# ⚔️ LifeForge - Life RPG

> **Gamify your real life into an epic 3D RPG progression system.**

LifeForge transforms real-world productivity, habit tracking, and personal growth into an engaging 3D RPG experience. Complete daily tasks and habits to earn Experience (XP), Gold, and Stat points, level up your character, customize your 3D avatar, buy custom rewards, and ascend to prestige ranks.

---

## 🔥 Prime Features

### 🛡️ 1. Interactive 3D Avatar & Customization Engine
- **Three.js 3D Viewport**: Live rendering of customizable 3D character avatars with unique class visuals (Warrior, Mage, Rogue, Paladin, Bard, Cyberpunk, Necromancer).
- **Dynamic Visuals & Effects**: Glowing particle auras, equipment updates, idle animations, rotation controls, and dance/power-up actions.

### ⚔️ 2. Quest & Habit Tracking System
- **Categorized Quests**: Organize daily tasks under core attributes (*Fitness, Learning, Work, Health, Mindfulness, Discipline*).
- **Difficulty Scaling**: Trivial, Easy, Medium, Hard, Epic, and Legendary difficulty ranks with dynamic XP and Gold rewards.
- **Streak & Multiplier Engine**: Track consecutive completion streaks to earn extra XP and Gold multipliers.

### 📊 3. RPG Progression & Attribute System
- **Leveling System**: Automatic level calculation driven by XP threshold curves.
- **Core Stat Tracking**: Train Intellect, Strength, Discipline, Focus, Vitality, and General stats.
- **Stat Analytics**: Interactive radar charts and visual breakdowns of personal growth.

### 🪙 4. In-Game Economy & Reward Shop
- **Custom Reward Store**: Spend earned Gold on real-life rewards (e.g., rest passes, treats) or in-game power-ups.
- **Inventory & Perks**: Equip items, track active power-ups (e.g., *Cognitive Focus Elixir*), and manage inventory.

### ✨ 5. Ascension & Prestige Chamber
- **Prestige System**: Reset level cap at endgame to earn permanent stat multipliers, legacy titles, and exclusive perk unlocks.

### 🔐 6. Authentication & Secure Sync
- **Supabase Auth**: Email & password authentication with session management.
- **PostgreSQL Row-Level Security (RLS)**: Direct data protection isolating user progress, tasks, and inventory.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Three.js, Tailwind CSS, Lucide Icons
- **Backend**: Express.js, Node.js, TypeScript, Zod Validation
- **Database**: Supabase PostgreSQL, Row Level Security (RLS), `pg` driver
- **Monorepo**: npm Workspaces

---

## 📂 Project Structure

```text
LIFE RPG/
├── client/              # Next.js App Router UI & Three.js 3D Viewport
│   ├── src/app/         # Pages (home, quests, character, progress, rewards, ascension)
│   ├── src/components/  # 3D Canvas, UI components, cards, navigation
├── server/              # Express API Server (Progression engine, Quests, Rewards, Auth)
├── database/            # SQL schemas & database seeding scripts
│   ├── schema.sql       # Table definitions & RLS policies
│   └── seed.sql         # Default attributes & reward catalog
└── shared/              # Shared TypeScript types & RPG constants
```

---

## 🚀 Quick Setup Guide

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)
- **Supabase / PostgreSQL** database instance

---

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/angel-0210/LifeForge.git
cd LifeForge
npm install
```

---

### Step 2: Configure Environment Variables

1. **Server Environment (`server/.env`)**:
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

2. **Client Environment (`client/.env.local`)**:
   Create a `.env.local` file inside the `client/` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

---

### Step 3: Run Database Migration

Initialize database tables and seed default attributes/rewards:

```bash
cd server
npx tsx migrate.ts
cd ..
```

---

### Step 4: Run Development Server

Start both the backend API server and Next.js frontend concurrently:

```bash
npm run dev
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

---

## 📜 NPM Commands

From the root directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts client and server concurrently |
| `npm run dev:client` | Starts Next.js frontend only |
| `npm run dev:server` | Starts Express server only |
| `npm run build` | Builds production bundles for client and server |
| `npm run typecheck` | Runs TypeScript type checking across workspace |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).