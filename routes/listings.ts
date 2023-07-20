import { Request, Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import express from 'express';
import { getDb } from '../db';
import { auth, getDecodedToken } from '../middleware/auth';

dayjs.extend(utc);
dayjs.extend(timezone);

export const listingRoutes = express.Router();

const db = getDb();

listingRoutes.get('/', async (req: Request, res: Response) => {
  const listings = await db.listing.findMany({
    include: {
      showtimes: true,
      venue: true,
    },
  });
  res.json(listings);
});

listingRoutes.get('/showtimes', async (req: Request, res: Response) => {
  const showtimes = await db.showtime.findMany();
  res.json(showtimes);
});

listingRoutes.get('/date/:date', async (req: Request, res: Response) => {
  const date = req.params.date;
  const time = dayjs(date).toDate();
  const berlinTime = dayjs(date).format();
  const dateTimeObject = dayjs(berlinTime).toDate();
  console.log(berlinTime, dateTimeObject);
  res.json({ date: berlinTime });
});

listingRoutes.get('/myListings', auth, async (req: Request, res: Response) => {
  let Authorization = '';
  Authorization = req.header('authentication') || '';
  const rawToken = Authorization.replace('Bearer ', '');
  const userId = (await getDecodedToken(rawToken)).userId;
  const listings = await db.listing.findMany({
    where: { createdById: userId },
    include: {
      showtimes: true,
    },
  });
  res.json(listings);
});

listingRoutes.post('/create/showtime', async (req: Request, res: Response) => {
  const { listingId, time, endTime, date, endDate } = req.body;
  const berlinDate = dayjs(date).tz('Europe/Berlin').format();
  const dateTimeObject = dayjs(berlinDate).utc(true).toDate();
  const showtime = await db.showtime.create({
    data: {
      date: dateTimeObject,
      endDate,
      time,
      endTime,
      listing: { connect: { id: listingId } },
    },
  });
  res.json({ showtime });
});

listingRoutes.post('/create', async (req: Request, res: Response) => {
  const {
    type,
    title,
    year,
    runtime,
    language,
    subs,
    series,
    seriesId,
    director,
    artist,
    cast,
    venueId,
    showtimes,
    listingUrl,
    createdById,
    format,
    country,
  } = req.body;
  const listing = await db.listing.create({
    data: {
      type,
      title,
      year,
      runtime,
      language,
      subs,
      series,
      seriesId,
      director,
      artist,
      cast,
      venueId,
      showtimes,
      listingUrl,
      createdById,
      format,
      country
    },
  });
  res.status(200).json({ data: listing });
});

listingRoutes.delete('/delete', auth, async (req: Request, res: Response) => {
  const listingId = req.body.listingId;
  if (!listingId) {
    throw new Error('Listing id required.');
  }

  await db.showtime.deleteMany({
    where: {
      listingId,
    },
  })

  await db.listing.delete({
    where: {
      id: listingId
    }
  })
  return res.status(200);
});

listingRoutes.patch('/update/:id', auth, async (req: Request, res: Response) => {
  const listingId = req.params.id;
  if (!listingId) {
    throw new Error('Listing id required.');
  }
  const {
    type,
    title,
    year,
    runtime,
    language,
    subs,
    series,
    seriesId,
    director,
    artist,
    cast,
    venueId,
    showtimes,
    listingUrl,
  } = req.body;
  // make sure listing exists
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new Error('Listing does not exist.');
  }

  const updatedListing = await db.listing.update({
    where: { id: listingId },
    data: {
      type,
      title,
      year,
      runtime,
      language,
      subs,
      series,
      seriesId,
      director,
      artist,
      cast,
      venueId,
      showtimes,
      listingUrl,
    },
  });

  return res.status(200).json({ updatedListing });
});


