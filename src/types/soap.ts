import { SUBSCRIPTION_STATUS } from '../types/subscription';

export interface ISoapService {
  updateStatus: (args: {
    creator_id: number,
    subscriber_id: number;
    status: SUBSCRIPTION_STATUS;
  }) => Promise<IResponseModel>;
}

export interface IResponseModel {
  statusCode: number;
  message: string;
  data?: any;
}
