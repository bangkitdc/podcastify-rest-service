import {
  ISubscriptionService,
  SUBSCRIPTION_STATUS,
} from '../types/subscription';
import prisma from '../models';
import { IUserService } from '../types/user';
import { SoapService, UserService } from '.';
import { ISoapService } from '../types/soap';
import { HttpStatusCode } from "../types/http";
import { HttpError } from "../helpers";

class SubscriptionService implements ISubscriptionService {
  private SOAP_SUBSCRIPTION_ENDPOINT = '/subscription';
  private subscriptionModel = prisma.subscription;
  private userService: IUserService;
  private soapService: ISoapService;

  constructor() {
    this.userService = new UserService();
    this.soapService = new SoapService(this.SOAP_SUBSCRIPTION_ENDPOINT);
  }

  approveSubscription = async (
    creator_id: number,
    subscriber_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => {
    const args = {
      creator_id,
      subscriber_id,
      status,
    };

    await this.soapService.updateStatus(args);

    if (status == SUBSCRIPTION_STATUS.ACCEPTED) {
      this.subscriptionModel.create({
        data: {
          creator_id: creator_id,
          subscriber_id: subscriber_id,
        },
      });
    }
  };

  getAllSubscriptionByCreatorId = async (
    creator_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => {
    const isCreatorExists = await this.userService.getUserById(creator_id);

    const errors: Record<string, string[]> = {};

    if (!isCreatorExists) {
      errors.creator_id = ["Creator Id is not exists"];
    }

    if (Object.keys(errors).length > 0) {
      throw new HttpError(
        HttpStatusCode.NotFound, 
        'Operation failed, please check your request again', 
        errors
      );
    }

    const args = {
      creator_id,
      status,
    };

    const response = await this.soapService.getAllSubscriptionByCreatorId(args);

    return response.data;
  };
}

export default SubscriptionService;
