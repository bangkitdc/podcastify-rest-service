import {
  ISubscriptionService,
  SUBSCRIPTION_STATUS,
} from '../types/subscription';
import { SoapService } from '.';
import { ISoapService } from '../types/soap';
import { HttpStatusCode } from '../types/http';
import { HttpError } from '../helpers';

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

    const response =
      await this.soapService.getAllSubscriptionBySubscriberID(args);

    return response.data;
  };

  getSubscribersByCreatorID = async (creator_id: number, status: SUBSCRIPTION_STATUS) => {
    const args = {
      creator_id,
      status
    };
    const response =
      await this.soapService.getSubscribersByCreatorID(args);

    return response.data;
  };

  getAllSubscriptions = async () => {
    const response = await this.soapService.getAllSubscriptions();

    return response.data;
  };

  getStatus = async (creator_id: number, subscriber_id: number) => {
    const args = {
      creator_id,
      subscriber_id,
    };
    const response = await this.soapService.getStatus(args);

    if (response.statusCode !== HttpStatusCode.Ok) {
      throw new HttpError(
        response.statusCode,
        'Error from external API: ' + response.message,
      );
    }

    return response.data;
  };
}

export default SubscriptionService;
