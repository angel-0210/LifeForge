import express from 'express';
import cors from 'cors';
import { authenticate } from './auth';
import { questsRouter } from './quests';
import { rewardsRouter } from './rewards';
import { usersRouter } from './users';

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Public health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'LifeForge API' });
});

// Authenticated API routes
app.use('/api/quests', authenticate, questsRouter);
app.use('/api/rewards', authenticate, rewardsRouter);
app.use('/api/users', authenticate, usersRouter);

// 404 Fallback
app.use((_req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'API route not found' });
});
