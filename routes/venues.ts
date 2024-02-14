import express from 'express';
import * as venueController from '../controllers/venueController';
import { auth } from '../middleware/auth';

export const venueRoutes = express.Router();

venueRoutes.get('/', venueController.getAllVenues);
venueRoutes.get('/id/:venueId', venueController.getVenueById);
venueRoutes.get('/search', venueController.searchVenues);
venueRoutes.post('/create', auth, venueController.createVenue);
venueRoutes.delete('/delete', auth, venueController.deleteVenue);
venueRoutes.patch('/update/:id', auth, venueController.updateVenue);