import { Request, Response } from 'express';
import express from 'express';
import { getDb } from '../db';
import { auth } from '../middleware/auth';

export const venueRoutes = express.Router();

const db = getDb();

venueRoutes.get('/', async (req: Request, res: Response) => {
  const venues = await db.venue.findMany();
  res.json(venues);
});

venueRoutes.get('/id/:venueId', async (req: Request, res: Response) => {
  const venueId = req.params.venueId;
  if (!venueId) {
    throw new Error('Venue id required.');
  }
  const venue = await db.listing.findUnique({
    where: { id: venueId },
    include: {
      showtimes: true,
    },
  });
  res.json(venue);
});

venueRoutes.get('/search', async (req: Request, res: Response) => {
  const search = req.query.q;
  if (typeof(search) !== 'string') {
    throw new Error('Search must be a string value.');
  }
  const venues = await db.venue.findMany({
    where: {
      name: {
        contains: search,
      },
    },
  });
})

venueRoutes.post('/create', auth, async (req: Request, res: Response) => {
  const { name, address, phone, hours, url} = req.body;
  const venue = await db.venue.create({
    data: {
      name,
      address,
      phone,
      hours,
      url
    },
  });
  res.json({ venue });
});


venueRoutes.delete('/delete', auth, async (req: Request, res: Response) => {
  const venueId = req.body.listingId;
  if (!venueId) {
    throw new Error('Venue id required.');
  }

  await db.venue.delete({
    where: {
      id: venueId
    }
  })
  return res.status(200);
});

venueRoutes.patch('/update/:id', auth, async (req: Request, res: Response) => {
  const venueId = req.params.id;
  if (!venueId) {
    throw new Error('Venue id required.');
  }
  const { name, address, phone, hours, url} = req.body;

  const venue = await db.listing.findUnique({ where: { id: venueId } });
  if (!venue) {
    throw new Error('Venue does not exist.');
  }

  const updatedVenue = await db.venue.update({
    where: { id: venueId },
    data: {
      name,
      address,
      phone,
      hours,
      url,
    },
  });

  return res.status(200).json({ updatedVenue });
});