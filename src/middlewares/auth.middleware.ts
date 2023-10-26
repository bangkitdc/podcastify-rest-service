import { NextFunction, Request, Response } from "express";
import { ErrorHandler, HttpError } from "../helpers";
import { HttpStatusCode } from "../types/http";
import jwt from 'jsonwebtoken';
import { jwtSecretKey } from "../configs/jwt";

class AuthMiddleware {
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

      if (!token) {
        throw new HttpError(HttpStatusCode.Unauthorized, 'Unauthorized');
      }

      jwt.verify(token, jwtSecretKey, (err, user) => {
        if (err) {
          throw new HttpError(HttpStatusCode.Unauthorized, 'Unauthorized', err);
        }

        res.locals.user = user;
        next();
      })
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }
}

export default AuthMiddleware;