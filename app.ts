import { config } from './config';
import express from 'express'
import cors from 'cors';
import compression from 'compression';
import { userRoutes } from './routes/users';
import { listingRoutes } from './routes/listings';
import { venueRoutes } from './routes/venues';


const app = express()

app.use(cors());
// app.options('*', cors());
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/users', userRoutes);
app.use('/listings', listingRoutes);
app.use('/venues', venueRoutes);

app.listen(config.PORT, () =>
  console.log(`Berlin Viewer API server ready at: ${config.PORT}`),
);