import express from 'express';
import cors from 'cors';

import routes from './routes';
import cookieParser from 'cookie-parser';
import { client } from './models';

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

// Redis
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const start = async () => {
  try {
    await client.connect()
    app.listen(REDIS_PORT, () => {
      console.log(`Server is connected to redis and is listening on port ${REDIS_PORT}`);
    })
  } catch (error) {
    console.log(error)
  }
}

start();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/api/v1', routes);

export default app;
