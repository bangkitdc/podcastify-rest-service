import { Router } from 'express';

import { RequestHelper } from '../helpers';
import {
  approveSubscriptionSchema,
  getAllSubscriptionBySubscriberIdSchema,
} from '../dto';
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
  )
  
  .get(
    '/subscription/:subscriber_id',
    AuthMiddleware.authenticateToken,
    RequestHelper.validate(getAllSubscriptionBySubscriberIdSchema),
    RequestHelper.exceptionGuard(
      subscriptionController.getAllSubscriptionBySubscriberID,
    ),
  );

export default subscriptionRoute;
