import { Response } from 'express';
import { ZodError } from 'zod';

import { ResponseHelper, HttpError } from '..';
import { HttpStatusCode } from '../../types/http';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

abstract class ErrorHandler {
  protected nextHandler?: ErrorHandler;

  setNextHandler(nextHandler: ErrorHandler): ErrorHandler {
    this.nextHandler = nextHandler;
    return this;
  }

  handle(res: Response, error: unknown): Response {
    if (this.canHandle(error)) {
      return this.getResponse(res, error);
    } else if (this.nextHandler) {
      return this.nextHandler.handle(res, error);
    } else {
      return ResponseHelper.responseError(
        res,
        HttpStatusCode.InternalServerError,
        'Internal server error',
      );
    }
  }

  protected abstract canHandle(error: unknown): boolean;
  protected abstract getResponse(
    jsonResponse: Response,
    error: unknown,
  ): Response;
}

class HttpErrorHandler extends ErrorHandler {
  protected canHandle(error: unknown): boolean {
    return error instanceof HttpError;
  }

  protected getResponse(jsonResponse: Response, error: HttpError): Response {
    return ResponseHelper.responseError(
      jsonResponse,
      error.statusCode,
      error.message,
      error.errors,
    );
  }
}

class ZodErrorHandler extends ErrorHandler {
  protected canHandle(error: unknown): boolean {
    return error instanceof ZodError;
  }

  protected getResponse(jsonResponse: Response, error: ZodError): Response {
    const errors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
      const fieldName = issue.path[issue.path.length - 1];
      const errorMessage = issue.message;

      if (errors[fieldName] === undefined) {
        errors[fieldName] = [];
      }

      errors[fieldName].push(errorMessage);
    });

    return ResponseHelper.responseError(
      jsonResponse,
      HttpStatusCode.UnprocessableEntity,
      'Operation failed, please check your request again',
      errors,
    );
  }
}

class PrismaClientKnownRequestErrorHandler extends ErrorHandler { // TO BE CONTINUED: cuman bisa nge catch 1 exception doang jelek
  protected canHandle(error: unknown): boolean {
    return error instanceof PrismaClientKnownRequestError;
  }

  protected getResponse(
    jsonResponse: Response,
    error: PrismaClientKnownRequestError,
  ): Response {
    // let message = 'Internal server error';
    // let code = HttpStatusCode.InternalServerError;
    // const errors: Record<string, string[]> = {};

    switch (error.code) {
      case 'P2001': { // Not exist constraint

        break;
      }

      case 'P2002': { // Unique constraint
        // const matches = error.message.match(
        //   /Unique constraint failed on (.*?)\./g,
        // );
        
        // if (matches) {
        //   matches.forEach((match) => {
        //     const constraintMatch = match.match(/Unique constraint failed on (.*?)\./);
        //     if (constraintMatch && constraintMatch[1]) {
        //       const constraintName = constraintMatch[1];

        //       if (!errors[constraintName]) {
        //         errors[constraintName] = [];
        //       }

        //       errors[constraintName].push(`${constraintName} already exists`);
        //     }
        //   });
        // }

        // code = HttpStatusCode.Conflict;
        // message = 'Operation failed, please check your request again'
        break;
      }

      default:
        // message = error.message;
        break;
    }

    return ResponseHelper.responseError(
      jsonResponse, 
      HttpStatusCode.InternalServerError, 
      error.message,
      error
    );
  }
}

export default 
  new HttpErrorHandler().setNextHandler(
  new ZodErrorHandler().setNextHandler(
  new PrismaClientKnownRequestErrorHandler()));
