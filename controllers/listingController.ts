import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { getDb } from '../db';
import { getDecodedToken } from '../middleware/auth';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const db = getDb();

dayjs.extend(utc);
dayjs.extend(timezone);

export const getListings = async (req: Request, res: Response) => {
  try {
    const listings = await db.listing.findMany({
      include: {
        showtimes: true,
        venue: true,
      },
    });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.listingId;
    const listing = await db.listing.findUnique({
      where: {
        id: listingId,
      },
    });
    if (listing) return res.json(listing);
    return res.status(404).json({ message: 'No listing found' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getListingByDate = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;

    if (!date) {
      return res.status(400).json({ error: 'date parameter is required' });
    }

    const listings = await db.listing.findMany({
      where: {
        showtimes: {
          some: {
            date: new Date(date), // Filter showtimes based on the provided date
          },
        },
      },
      include: {
        venue: true,
        organization: true,
        showtimes: {
          where: {
            date: new Date(date), // Filter showtimes based on the provided date
          },
        },
      },
    });

    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getShowtimes = async (req: Request, res: Response) => {
  try {
    const showtimes = await db.showtime.findMany();
    res.json(showtimes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyListings = async (req: Request, res: Response) => {
  try {
    const Authorization = req.header('authentication') || '';
    const rawToken = Authorization.replace('Bearer ', '');
    const userId = (await getDecodedToken(rawToken)).userId;
    const listings = await db.listing.findMany({
      where: { createdById: userId },
      include: {
        showtimes: true,
      },
    });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createShowtime = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateShowtime = async (req: Request, res: Response) => {
  try {
    const showtimeId = req.params.id;
    if (!showtimeId) {
      return res.status(400).json({ error: 'Showtime id required' });
    }

    const {
      time,
      endTime,
      date,
      endDate
    } = req.body;

    const berlinDate = dayjs(date).tz('Europe/Berlin').format();
    const dateTimeObject = dayjs(berlinDate).utc(true).toDate();

    const updatedShowtime = await db.showtime.update({
      where: { id: showtimeId },
      data: {
        time,
        endTime,
        date: dateTimeObject,
        endDate,
      },
    });

    return res.status(200).json({ updatedShowtime });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteShowtime = async (req: Request, res: Response) => {
  try {
    const showtimeId = req.params.id;
    if (!showtimeId) {
      return res.status(400).json({ error: 'Showtime id required' });
    }

    await db.showtime.delete({
      where: { id: showtimeId },
    });

    return res.status(200).json({ message: 'Showtime deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
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
        country,
      },
    });

    res.status(200).json({ data: listing });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteListing = async (req: Request, res: Response) => {
  try {
    const listingId = req.body.listingId;
    if (!listingId) {
      return res.status(400).json({ error: 'Listing id required' });
    }

    await db.showtime.deleteMany({
      where: {
        listingId,
      },
    });

    await db.listing.delete({
      where: {
        id: listingId,
      },
    });
    return res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;
    if (!listingId) {
      return res.status(400).json({ error: 'Listing id required' });
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
    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ error: 'Listing does not exist' });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

