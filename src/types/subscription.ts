import { IRequestResponseHandler } from './http';

export type ISubscriptionController = {
  approveSubscription: IRequestResponseHandler;
  getAllSubscriptionByCreatorId: IRequestResponseHandler;
};

export type ISubscriptionService = {
  approveSubscription: (
    creator_id: number,
    subscriber_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => Promise<void>;

  getAllSubscriptionByCreatorId: (
    creator_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => Promise<ISubscription[]>;
};

export type ISubscription = {
  created_at: Date;
  updated_at: Date;
  creator_id: number;
  subscriber_id: string;
};

export enum SUBSCRIPTION_STATUS {
  ALL = "ALL",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

