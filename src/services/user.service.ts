import { IUser, IUserService } from '../types/user';
import { client, prisma } from '../models';
import { ISubscriptionService, STATUS_MAPPING, SUBSCRIPTION_STATUS } from '../types/subscription';
import { SubscriptionService } from '.';
import { HttpError } from '../helpers';
import { HttpStatusCode } from '../types/http';
class UserService implements IUserService {
  private subscriptionService: ISubscriptionService;
  private userModel = prisma.user;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async getUserById(user_id: number) {
    // Use redis
    const cacheKey = `user:${user_id}`;
    const cachedData = await client.get(cacheKey);

    let user: IUser | null;

    if (cachedData) {
      user = JSON.parse(cachedData);
    } else {
      user = await this.userModel.findFirst({
        where: {
          user_id: user_id,
        },
      });

      // Storing data in cache for 15 minutes
      await client.setEx(cacheKey, 15 * 60, JSON.stringify(user));
    }

    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userModel.findFirst({
      where: {
        username: username,
      },
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }

  async getCreatorsBySubscriberId(issuer_id: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    // Use redis
    const cacheKey = `creators:${page}:${limit}`;
    const cachedData = await client.get(cacheKey);

    let totalData: number, 
        creators: IUser[];

    if (cachedData) {
      const { 
        totalData: cachedTotalData, 
        creators: cachedCreators 
      } = JSON.parse(cachedData);

      totalData = cachedTotalData;
      creators = cachedCreators;
    } else {
      totalData = await this.userModel.count({
        where: {
          role_id: 2, // except admin
        },
      });
      
      creators = await this.userModel.findMany({
        where: {
          role_id: 2 // except admin
        },
        orderBy: {
          user_id: 'desc'
        },
        take: limit,
        skip: offset
      });

      // Storing data in cache for 1 hour
      await client.setEx(cacheKey, 3600, JSON.stringify({ totalData, creators }));
    }

    const creatorsStatus = await this.subscriptionService.getAllSubscriptionBySubscriberID(
      issuer_id, 
      SUBSCRIPTION_STATUS.ALL
    );

    // Map over creators and subscription status
    const creatorsWithStatus = creators.map((creator) => {
      // Find the subscription for the current creator
      const subscription = creatorsStatus.find((subscription) => subscription.creator_id == creator.user_id);

      // Add subscription status to the creator
      return {
        user_id: creator.user_id,
        email: creator.email,
        username: creator.username,
        first_name: creator.first_name,
        last_name: creator.last_name,
        status: subscription ? STATUS_MAPPING[subscription.status] : STATUS_MAPPING[SUBSCRIPTION_STATUS.NOT_SUBSCRIBED],
      };
    });

    const totalPage = Math.ceil(totalData / limit);

    if (totalPage === 0) {
      return {
        total: totalData,
        current_page: 0,
        last_page: totalPage,
        data: creatorsWithStatus,
      }
    }

    if (page > totalPage) {
      throw new HttpError(HttpStatusCode.NotFound, "Requested page not found")
    }

    return {
      total: totalData,
      current_page: page,
      last_page: totalPage,
      data: creatorsWithStatus,
    };
  }

  async getCreatorWithStatus(creator_id: number, subscriber_id: number) {
    const creator = await this.userModel.findFirst({
      where: {
        user_id: creator_id
      },
    });

    if (!creator) {
      throw new HttpError(HttpStatusCode.NotFound, "Data not found");
    }

    const creatorStatus = await this.subscriptionService.getStatus(
      creator_id, 
      subscriber_id
    );
    
    if (!creatorStatus) {
      throw new HttpError(HttpStatusCode.NotFound, "Data not found");
    }

    return {
      user_id: creator.user_id,
      email: creator.email,
      username: creator.username,
      first_name: creator.first_name,
      last_name: creator.last_name,
      status: creatorStatus ? STATUS_MAPPING[creatorStatus] : STATUS_MAPPING[SUBSCRIPTION_STATUS.NOT_SUBSCRIBED]
    }
  }
}

export default UserService;
