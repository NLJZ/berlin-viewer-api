import { PrismaClient } from '@prisma/client';
import { config } from './config';
import express from 'express'
import cors from 'cors';
import { userRoutes } from './routes/users';

const app = express()

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.listen(config.PORT, () =>
  console.log(`Berlin Viewer API server ready at: ${config.PORT}`),
);