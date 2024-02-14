// controllers/venueController.ts
import { Request, Response } from 'express';
import { getDb } from '../db';


const db = getDb();

export async function getAllVenues(req: Request, res: Response) {
  const venues = await db.venue.findMany();
  res.json(venues);
}

export async function getVenueById(req: Request, res: Response) {
  const venueId = req.params.venueId;
  if (!venueId) {
    return res.status(400).json({ message: 'Venue id required.' });
  }
  const venue = await db.venue.findUnique({
    where: { id: venueId },
    include: {
      listings: true,
    },
  });
  res.json(venue);
}

export async function searchVenues(req: Request, res: Response) {
  const search = req.query.q;
  if (typeof search !== 'string') {
    return res.status(400).json({ message: 'Search must be a string value.' });
  }
  const venues = await db.venue.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
  });
  res.json(venues);
}

export async function createVenue(req: Request, res: Response) {
  const { name, address, phone, hours, url } = req.body;
  const venue = await db.venue.create({
    data: {
      name,
      address,
      phone,
      hours,
      url,
    },
  });
  res.json({ venue });
}

export async function deleteVenue(req: Request, res: Response) {
  const venueId = req.body.listingId;
  if (!venueId) {
    return res.status(400).json({ message: 'Venue id required.' });
  }

  await db.venue.delete({
    where: {
      id: venueId,
    },
  });
  return res.status(200).json({ message: 'Venue deleted successfully.' });
}

export async function updateVenue(req: Request, res: Response) {
  const venueId = req.params.id;
  if (!venueId) {
    return res.status(400).json({ message: 'Venue id required.' });
  }
  const { name, address, phone, hours, url } = req.body;

  const venue = await db.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    return res.status(404).json({ message: 'Venue does not exist.' });
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
}
