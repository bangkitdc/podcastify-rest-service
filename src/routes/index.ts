import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import episodeRoute from './episode.route';

const router = Router();

router.use(authRoute);
router.use(userRoute);
router.use(episodeRoute);

export default router;
