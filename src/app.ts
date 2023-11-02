import express from 'express';
import cors from 'cors';

import routes from './routes';
import cookieParser from 'cookie-parser';

const app = express();

const whitelist = ['http://localhost:5173'];
app.use(
  cors({
    origin: whitelist,
    credentials: true
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/api/v1', routes);

export default app;
