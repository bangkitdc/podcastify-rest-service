import { Router } from 'express';

import { RequestHelper } from '../helpers';
import {
  approveSubscriptionSchema,
  getAllSubscriptionByCreatorIdSchema,
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
    '/subscription/:creator_id',
    RequestHelper.validate(getAllSubscriptionByCreatorIdSchema),
    RequestHelper.exceptionGuard(
      subscriptionController.getAllSubscriptionByCreatorId,
    ),
  );

export default subscriptionRoute;
