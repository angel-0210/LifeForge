import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from './database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing or invalid authentication token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'Session expired or token invalid' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Authentication verification failed' });
  }
}
