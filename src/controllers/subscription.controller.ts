import { Request, Response } from 'express';
import { ResponseHelper } from '../helpers';
import {
  ISubscriptionController,
  ISubscriptionService,
  SUBSCRIPTION_STATUS,
} from '../types/subscription';
import { HttpStatusCode } from '../types/http';

class SubscriptionController implements ISubscriptionController {
  constructor(private subscriptionService: ISubscriptionService) {
    this.approveSubscription = this.approveSubscription.bind(this);
  }

  approveSubscription = async (req: Request, res: Response) => {
    const { creator_id, creator_name, subscriber_id, status } = req.body as {
      creator_id: number;
      creator_name: string;
      subscriber_id: number;
      status: SUBSCRIPTION_STATUS;
    };

    await this.subscriptionService.approveSubscription(
      creator_id,
      creator_name,
      subscriber_id,
      status,
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
    );
  };

  getAllSubscriptionBySubscriberID = async (req: Request, res: Response) => {
    const { subscriber_id } = req.params;
    const { status } = req.query;

    const result = await this.subscriptionService.getAllSubscriptionBySubscriberID(
      Number(subscriber_id),
      status as SUBSCRIPTION_STATUS,
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      result,
    );
  };

  getAllSubscriptions = async (req: Request, res: Response) => {
    const result = await this.subscriptionService.getAllSubscriptions();

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      result,
    );
  };
}

export default SubscriptionController;
