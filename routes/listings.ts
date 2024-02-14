import { Router } from 'express';
import { getListings, getListingById, createListing, deleteListing, updateListing, getShowtimes, getMyListings, createShowtime, getListingByDate, updateShowtime, deleteShowtime } from '../controllers/listingController';
import { auth } from '../middleware/auth';

export const listingRoutes = Router();

listingRoutes.get('/', getListings);
listingRoutes.get('/listing/:listingId', getListingById);
listingRoutes.get('/showtimes', getShowtimes);
listingRoutes.get('/myListings', auth, getMyListings);
listingRoutes.get('/listingByDate', getListingByDate);

listingRoutes.post('/create', auth, createListing);
listingRoutes.patch('/update/:id', auth, updateListing);
listingRoutes.delete('/delete', auth, deleteListing);

listingRoutes.post('/showtime/create', auth, createShowtime);
listingRoutes.patch('/showtimes/update/:id', auth, updateShowtime);
listingRoutes.delete('/showtimes/delete/:id', auth, deleteShowtime); 