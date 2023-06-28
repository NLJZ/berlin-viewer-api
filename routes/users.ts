import { Request, Response } from 'express';
import express from 'express';
import {getDb} from '../db';


export const userRoutes = express.Router()
const db = getDb();

userRoutes.get('/', async (req: Request, res: Response) => {
  const users = await db.user.findMany()
  res.json(users)
})