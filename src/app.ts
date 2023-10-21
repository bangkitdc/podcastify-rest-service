import express from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();

const whitelist = ['http://localhost:3000'];
app.use(
  cors({
    origin: whitelist,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/v1', routes);

export default app;
