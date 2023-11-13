import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../models';
import { compare, genSalt, hash } from 'bcryptjs';

import { IAuthService } from '../types/auth';
import { IUserService } from '../types/user';
import { HttpStatusCode } from '../types/http';
import { AuthHelper, HttpError } from '../helpers';
import { UserService } from '.';
import { jwtRefreshToken } from '../configs/jwt';
import { Response } from 'express';

class AuthService implements IAuthService {
  private userService: IUserService;
  private userModel = prisma.user;

  constructor() {
    this.userService = new UserService();
  }

  async login(res: Response, username: string, password: string) {
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

    // User is valid
    // Make refresh token
    const refreshToken = AuthHelper.createRefreshToken(user);

    // Send it to cookie
    AuthHelper.sendRefreshToken(res, refreshToken);

    // Make acess token
    const accessToken = AuthHelper.createAccessToken(user);

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id
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
    await this.userModel.create({
      data: {
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: hashedPassword
      },
    });

    return;
  }

  async refreshToken(res: Response, refreshToken: string | null) {
    if (!refreshToken) {
      throw new HttpError(
        HttpStatusCode.Unauthorized, 
        'Invalid credentials'
      );
    }

    let payload: string | JwtPayload | undefined;

    jwt.verify(refreshToken, jwtRefreshToken, (err, decoded) => {
      if (err) {
        throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
      }

      payload = decoded;
    });

    // Token is valid
    if (typeof payload !== 'string' && payload && 'user_id' in payload) {
      const user = await this.userService.getUserById(payload.user_id);

      if (!user) {
        throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
      }

      // User is valid
      // Refresh the token
      const newRefreshToken = AuthHelper.createRefreshToken(user);

      // Send it to cookie
      AuthHelper.sendRefreshToken(res, newRefreshToken);

      // Make acess token
      const accessToken = AuthHelper.createAccessToken(user);

      return {
        token: accessToken,
      };
    } else {
      throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
    }
  }
}

export default AuthService;
