import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import episodeRoute from './episode.route';
import subscriptionRoute from './subscription.route';

const router = Router();

router.use(authRoute);
router.use(userRoute);
router.use(episodeRoute);
router.use(subscriptionRoute);

export default router;
