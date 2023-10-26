import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

const router = Router();

router.use(authRoute);
router.use(userRoute);

export default router;
