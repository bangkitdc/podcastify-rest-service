import {
  ISubscriptionService,
  SUBSCRIPTION_STATUS,
} from '../types/subscription';
import { IUserService } from '../types/user';
import { SoapService, UserService } from '.';
import { ISoapService } from '../types/soap';
import { HttpStatusCode } from '../types/http';
import { HttpError } from '../helpers';

class SubscriptionService implements ISubscriptionService {
  private SOAP_SUBSCRIPTION_ENDPOINT = '/subscription';
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
  };

  getAllSubscriptionBySubscriberID = async (
    subscriber_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => {

    const args = {
      subscriber_id,
      status,
    };

    const response = await this.soapService.getAllSubscriptionBySubscriberID(args);

    return response.data;
  };

  getAllSubscriptions = async () => {
    const response = await this.soapService.getAllSubscriptions();

    return response.data;
  };
}

export default SubscriptionService;
