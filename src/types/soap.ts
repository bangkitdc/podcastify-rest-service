import { SUBSCRIPTION_STATUS } from '../types/subscription';

export interface ISoapService {
  // subscription endpoint
  updateStatus: (args: {
    creator_id: number;
    subscriber_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => Promise<IResponseModel>;
  getAllSubscriptionBySubscriberID: (args: {
    subscriber_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => Promise<IResponseModel>;
  getAllSubscriptions: () => Promise<IResponseModel>;
  getStatus: (args: {
    creator_id: number;
    subscriber_id: number;
  }) => Promise<IResponseModel>;

  // add more endpoint method
}

export interface IResponseModel {
  statusCode: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
