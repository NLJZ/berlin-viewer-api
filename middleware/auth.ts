import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { TokenDecoded } from '../types/Auth';

export async function auth(req: Request, res: Response, next: NextFunction) {
  let userId: string | undefined;
  let verifiedToken: TokenDecoded;

  try {
    let Authorization = '';
    Authorization = req.header('authentication') || '';
    const token = Authorization.replace('Bearer ', '');
    verifiedToken = verify(token, config.JWT_SECRET) as TokenDecoded;

    if (!verifiedToken.userId) {
      userId = undefined;
    } else {
      userId = verifiedToken.userId;
      return next();
    }
  } catch (e) {
    userId = undefined;
  }

  res.status(401);
  return  res.json({authenticated: false})
}

export async function getDecodedToken(rawToken: string) {
  const token = rawToken.replace('Bearer ', '');
  const verifiedToken = verify(token, config.JWT_SECRET) as TokenDecoded;
  return verifiedToken
}