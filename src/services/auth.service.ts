import jwt from 'jsonwebtoken';
import prisma from '../models';
import { compare, genSalt, hash } from 'bcryptjs';

import { IAuthService } from '../types/auth';
import { IUserService } from '../types/user';
import { HttpStatusCode } from '../types/http';
import { HttpError } from '../helpers';
import { jwtSecretKey, jwtTimeExpiration } from '../configs/jwt';
import { UserService } from '.';

class AuthService implements IAuthService {
  private userService: IUserService;
  private userModel = prisma.user;

  constructor() {
    this.userService = new UserService();
  }

  async login(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);

    // Check user
    if (!user) {
      throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
    }

    // Password validation
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
    }

    // Make token
    const accessToken = jwt.sign(
      {
        sub: user.user_id,
        username: user.username,
        name: user.first_name + ' ' + user.last_name,
        role_id: user.role_id
      },
      jwtSecretKey,
      {
        expiresIn: jwtTimeExpiration
      }
    );

    return {
      user: {
        username: user.username,
        name: user.first_name + ' ' + user.last_name,
      },
      token: accessToken,
    };
  }

  async register(
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string,
  ) {
    const isUsernameExists = await this.userService.getUserByUsername(username);
    const isEmailExists = await this.userService.getUserByEmail(email);

    // Check uniqueness
    const errors: Record<string, string[]> = {};

    if (isUsernameExists) {
      errors.username = ["Username already exists"];
    }

    if (isEmailExists) {
      errors.email = ["Email already exists"];
    }

    if (Object.keys(errors).length > 0) {
      throw new HttpError(
        HttpStatusCode.Conflict, 
        'Operation failed, please check your request again', 
        errors
      );
    }

    const hashedPassword = await hash(password, await genSalt());
    const createdUser = await this.userModel.create({
      data: {
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: hashedPassword
      },
    });

    return {
      user: {
        username: createdUser.username,
        name: createdUser.first_name + ' ' + createdUser.last_name,
      },
    };
  }
}

export default AuthService;
