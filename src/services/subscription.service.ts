import {
  ISubscriptionService,
  SUBSCRIPTION_STATUS,
} from '../types/subscription';
import { SoapService } from '.';
import { ISoapService } from '../types/soap';

class SubscriptionService implements ISubscriptionService {
  private SOAP_SUBSCRIPTION_ENDPOINT = '/subscription';
  private soapService: ISoapService;

  constructor() {
    this.soapService = new SoapService(this.SOAP_SUBSCRIPTION_ENDPOINT);
  }

  approveSubscription = async (
    creator_id: number,
    creator_name: string,
    subscriber_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => {
    const args = {
      creator_id,
      creator_name,
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
