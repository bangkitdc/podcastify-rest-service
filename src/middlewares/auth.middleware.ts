/* eslint-disable no-case-declarations */
import { NextFunction, Request, Response } from "express";
import { ErrorHandler, HttpError } from "../helpers";
import { ApiService, HttpStatusCode } from "../types/http";
import jwt from 'jsonwebtoken';
import { jwtAccessToken } from "../configs/jwt";
import * as crypto from 'crypto';

class AuthMiddleware {
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

      if (!token) {
        throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
      }

      jwt.verify(token, jwtAccessToken, (err, user) => {
        if (err) {
          throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials', err);
        }

        res.locals.user = user;
        next();
      })
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  }

  static authenticateApiKey(service: ApiService) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const header = req.headers['x-api-key'];

        let expectedApiKey: string;
        switch (service) {
          case ApiService.APP_SERVICE:
            expectedApiKey = process.env.APP_API_KEY as string;

            // Get Issuer Id
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

            if (!token) {
              throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
            }

            // Decrypt AES Key
            const encryptionKey = process.env.ENCRYPTION_KEY as string;
            
            // Decode base64 values
            const tokenBuffer = Buffer.from(token, 'base64');

            // Use the first 16 bytes as IV
            const iv = tokenBuffer.slice(0, 16);
            
            // Use the rest as the encrypted user ID
            const encryptedUserId = tokenBuffer.slice(16);

            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
            let decryptedUserId = decipher.update(encryptedUserId);
            decryptedUserId = Buffer.concat([decryptedUserId, decipher.final()]);

            res.locals.id = decryptedUserId.toString('utf8');            
            break;
          case ApiService.SOAP_SERVICE:
            expectedApiKey = process.env.SOAP_API_KEY as string;
            break;
          default:
            throw new HttpError(HttpStatusCode.InternalServerError, 'Invalid service');
        }

        if (header !== expectedApiKey) {
          throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid credentials');
        }

        next();
      } catch (error) {
        ErrorHandler.handle(res, error);
      }
    };
  }
}

export default AuthMiddleware;