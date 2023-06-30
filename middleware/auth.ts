import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { TokenDecoded } from '../types/Auth';

export async function auth(req: Request, res: Response, next: NextFunction) {
  console.log(req.header);
  let userId: string | undefined;
  let rawToken: string | undefined;
  let verifiedToken: TokenDecoded;

  try {
    console.log(req.header);
    let Authorization = '';

    // for queries and mutations
    Authorization = req.header('Authorization') || '';

    const token = Authorization.replace('Bearer ', '');
    verifiedToken = verify(token, config.JWT_SECRET) as TokenDecoded;

    if (!verifiedToken.userId) {
      userId = undefined;
    } else {
      userId = verifiedToken.userId;
      rawToken = token;
      return next();
    }
  } catch (e) {
    userId = undefined;
  }

  return res.status(401).send({ message: 'Not authorized hey now' });
}