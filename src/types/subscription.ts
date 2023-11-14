import { IRequestResponseHandler } from './http';

export type ISubscriptionController = {
  approveSubscription: IRequestResponseHandler;
  getAllSubscriptions: IRequestResponseHandler;
};

export type ISubscriptionService = {
  approveSubscription: (
    creator_id: number,
    creator_name: string,
    subscriber_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => Promise<void>;

  getAllSubscriptionBySubscriberID: (
    subscriber_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => Promise<ISubscription[]>;

  getAllSubscriptions: () => Promise<ISubscription[]>;

  getStatus: (
    creator_id: number,
    subscriber_id: number,
  ) => Promise<SUBSCRIPTION_STATUS>;

  getSubscribersByCreatorID: (
    creator_id: number,
    status: SUBSCRIPTION_STATUS,
  ) => Promise<ISubscription[]>;
};

export type ISubscription = {
  created_at: Date;
  updated_at: Date;
  creator_id: number;
  creator_name: string;
  subscriber_id: number;
  subscriber_name: string;
  status: SUBSCRIPTION_STATUS;
};

export type ISubscriptionSOAP = {
  createdAt: Date;
  updatedAt: Date;
  creatorID: number;
  creatorName: string;
  subscriberID: number;
  subscriberName: string;
  status: SUBSCRIPTION_STATUS;
};

export enum SUBSCRIPTION_STATUS {
  ALL = 'ALL',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NOT_SUBSCRIBED = 'NOT_SUBSCRIBED',
}

type StatusMapping = { [key in SUBSCRIPTION_STATUS]: string } & { ALL: string };

export const STATUS_MAPPING: StatusMapping = {
  [SUBSCRIPTION_STATUS.ALL]: 'All',
  [SUBSCRIPTION_STATUS.PENDING]: 'Pending',
  [SUBSCRIPTION_STATUS.ACCEPTED]: 'Subscribed',
  [SUBSCRIPTION_STATUS.REJECTED]: 'Rejected',
  [SUBSCRIPTION_STATUS.NOT_SUBSCRIBED]: 'Not Subscribed',
};
