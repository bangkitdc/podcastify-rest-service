import { IUserService } from '../types/user';
import prisma from '../models';

class UserService implements IUserService {
  private userModel = prisma.user;

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
}

export default UserService;
