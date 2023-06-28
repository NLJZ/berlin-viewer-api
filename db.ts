import { Prisma, PrismaClient } from '@prisma/client';
import { config } from './config';

let db: PrismaClient;

export const getDb = () => {
  if (!db) {
    db = new PrismaClient();
  }
  return db;
};
