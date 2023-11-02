import { Response } from "express";
import { jwtAccessToken, jwtAccessTokenExpiration, jwtRefreshToken, jwtRefreshTokenExpiration } from "../configs/jwt";
import jwt from 'jsonwebtoken';
import { IUser } from "../types/user";

class AuthHelper {
  static createAccessToken = (user: IUser) => {
    return jwt.sign(
      { user_id: user.user_id },
      jwtAccessToken,
      {
        expiresIn: jwtAccessTokenExpiration
      }
    );
  }

  static createRefreshToken = (user: IUser) => {
    return jwt.sign(
      { user_id: user.user_id },
      jwtRefreshToken,
      {
        expiresIn: jwtRefreshTokenExpiration
      }
    );
  }

  static sendRefreshToken = (res: Response, token: string) => {
    res.cookie(
      "jid",
      token,
      {
        httpOnly: true,
        // TODO: domain
      }
    );
  }
}

export default AuthHelper;
