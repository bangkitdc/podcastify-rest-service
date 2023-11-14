import { Router } from 'express';

import { RequestHelper } from '../helpers';
import { approveSubscriptionSchema } from '../dto';
import { SubscriptionService } from '../services';
import { SubscriptionController } from '../controllers';
import { AuthMiddleware } from '../middlewares';

const subscriptionService = new SubscriptionService();
const subscriptionController = new SubscriptionController(subscriptionService);

const subscriptionRoute = Router();

subscriptionRoute
  .patch(
    '/subscription',
    AuthMiddleware.authenticateToken,
    RequestHelper.validate(approveSubscriptionSchema),
    RequestHelper.exceptionGuard(subscriptionController.approveSubscription),
  )
  .get(
    '/subscription',
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(subscriptionController.getAllSubscriptions),
  );

export default subscriptionRoute;
