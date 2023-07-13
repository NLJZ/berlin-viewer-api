import { Request, Response } from 'express';
import express from 'express';
import { getDb } from '../db';
import { auth } from '../middleware/auth';

export const listingRoutes = express.Router();

const db = getDb();

listingRoutes.post('/create', auth, async (req: Request, res: Response) => {
  const { type, title, year, runtime, language, subs, series, seriesId, director, artist, cast, venueId, showTimes, listingUrl } = req.body;

  const listing = await db.listing.create({
    data: { type, title, year, runtime, language, subs, series, seriesId, director, artist, cast, venueId, showTimes, listingUrl },
  });
  res.status(200).json({ data: listing });
});