import { Request, Response } from 'express';
import { ResponseHelper } from '../helpers';
import {
  ISubscriptionController,
  ISubscriptionService,
  SUBSCRIPTION_STATUS,
} from '../types/subscription';
import { HttpStatusCode } from '../types/http';
import { IUserService, UserRoleId } from '../types/user';

class SubscriptionController implements ISubscriptionController {
  constructor(private subscriptionService: ISubscriptionService, private userService: IUserService) {
    this.approveSubscription = this.approveSubscription.bind(this);
    this.getAllSubscriptions = this.getAllSubscriptions.bind(this);
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

  getAllSubscriptions = async (req: Request, res: Response) => {
    const user_id = res.locals.user.user_id;

    const is_creator = (await this.userService.getUserById(user_id))?.role_id === UserRoleId.User;
    if (is_creator) {
      const result = await this.subscriptionService.getSubscribersByCreatorID(
        Number(user_id),
        SUBSCRIPTION_STATUS.ACCEPTED
      );
      return ResponseHelper.responseSuccess(
        res,
        HttpStatusCode.Ok,
        'Operation success',
        result,
      );
    }

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
