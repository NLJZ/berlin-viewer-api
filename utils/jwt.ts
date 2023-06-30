import { sign, verify } from 'jsonwebtoken';
import { config } from '../config';

export const generateAccessToken = (userId: string, roles: string[] = []): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(
      {
        userId,
        timestamp: Date.now(),
        ...(roles.length > 0 ? { roles } : {}),
      },
      config.JWT_SECRET,
      {
        expiresIn: '8h',
      },
      (err, token) => {
        if (err) return reject(err);
        if (!token) return reject('Token is empty');
        return resolve(token);
      }
    );
  });
};
