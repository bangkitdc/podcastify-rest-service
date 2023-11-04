import { SUBSCRIPTION_STATUS } from '../types/subscription';

export interface ISoapService {
  // subscription endpoint
  updateStatus: (args: {
    creator_id: number;
    subscriber_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => Promise<IResponseModel>;
  getAllSubscriptionByCreatorId: (args: {
    creator_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => Promise<IResponseModel>;

  // add more endpoint method
}

export interface IResponseModel {
  statusCode: number;
  message: string;
  data?: any;
}
