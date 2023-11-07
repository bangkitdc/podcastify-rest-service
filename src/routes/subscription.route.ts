import { Router } from 'express';

import { RequestHelper } from '../helpers';
import {
  approveSubscriptionSchema,
  getAllSubscriptionBySubscriberIdSchema,
} from '../dto';
import { SubscriptionService } from '../services';
import { SubscriptionController } from '../controllers';

const subscriptionService = new SubscriptionService();
const subscriptionController = new SubscriptionController(subscriptionService);

const subscriptionRoute = Router();

subscriptionRoute
  .patch(
    '/subscription',
    RequestHelper.validate(approveSubscriptionSchema),
    RequestHelper.exceptionGuard(subscriptionController.approveSubscription),
  )
  .get(
    '/subscription',
    RequestHelper.exceptionGuard(
      subscriptionController.getAllSubscriptions,
    ),
  )
  .get(
    '/subscription/:subscriber_id',
    RequestHelper.validate(getAllSubscriptionBySubscriberIdSchema),
    RequestHelper.exceptionGuard(
      subscriptionController.getAllSubscriptionBySubscriberID,
    ),
  );

export default subscriptionRoute;
