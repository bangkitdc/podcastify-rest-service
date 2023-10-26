import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '.';
import { IRequestResponseHandler } from '../types/http';
import { AnyZodObject } from 'zod';

class RequestHelper {
  static validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      } catch (error) {
        ErrorHandler.handle(res, error);
      }
    };
  };

  static exceptionGuard = (handler: IRequestResponseHandler) => {
    return async (req: Request, res: Response) => {
      try {
        await handler(req, res);
      } catch (error) {
        ErrorHandler.handle(res, error);
      }
    }
  }
}

export default RequestHelper;
