import { Router } from 'express';

import authRoute from './auth.route';

export default () => {
  const router = Router();

  router.get('/', (req, res) => {
    res.send('Server is running!');
  });

  router.use(authRoute);

  return router;
};
