import { IUserService } from '../types/user';
import { prisma } from '../models';
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
    const user = await this.userModel.findFirst({
      where: {
        user_id: user_id,
      },
    });

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

    const totalData = await this.userModel.count({
      where: {
        role_id: 2, // except admin
      },
    });
    
    const creators = await this.userModel.findMany({
      where: {
        role_id: 2 // except admin
      },
      orderBy: {
        user_id: 'desc'
      },
      take: limit,
      skip: offset
    });

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
