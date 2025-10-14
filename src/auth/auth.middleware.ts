//JWT 인증 미들웨어

import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.utils';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });

  req.userId = payload.userId;
  next();
}
