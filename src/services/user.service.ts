import { IUserService } from '../types/user';
import prisma from '../models';
import { ISubscriptionService, SUBSCRIPTION_STATUS } from '../types/subscription';
import { SubscriptionService } from '.';

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

  async getCreators(issuer_id: number) {
    const creators = await this.userModel.findMany({
      where: {
        role_id: 2
      }
    });

    const creatorsStatus = await this.subscriptionService.getAllSubscriptionBySubscriberID(
      issuer_id, 
      SUBSCRIPTION_STATUS.ALL
    );

    // Map over creators and subscription status
    const creatorsWithStatus = creators.map((creator) => {
      // Find the subscription status for the current creator
      const status = creatorsStatus.find((status) => status.creator_id === creator.user_id);

      // Add subscription status to the creator
      return {
        user_id: creator.user_id,
        username: creator.username,
        first_name: creator.first_name,
        last_name: creator.last_name,
        status: status ? status.status : SUBSCRIPTION_STATUS.NOT_SUBSCRIBED,
      };
    });

    return creatorsWithStatus;
  }
}

export default UserService;
