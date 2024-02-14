import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { TokenDecoded } from '../types/Auth';

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.header('authorization') || '';
    const token = authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, config.JWT_SECRET) as TokenDecoded;

    if (!verifiedToken.userId) {
      res.status(401).json({ authenticated: false });
    } else {
      next();
    }
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ authenticated: false });
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.header('authorization') || '';
    const token = authorization.replace('Bearer ', '');

    const verifiedToken = verify(token, config.JWT_SECRET) as TokenDecoded;

    if (verifiedToken.roles && verifiedToken.roles.includes('ADMIN')) {
      next();
    } else {
      return res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
    }
  } catch (error) {
    console.error('Error during token verification:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function getDecodedToken(rawToken: string): TokenDecoded {
  const token = rawToken.replace('Bearer ', '');
  return verify(token, config.JWT_SECRET) as TokenDecoded;
}