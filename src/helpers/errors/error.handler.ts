import { Response } from 'express';
import { ZodError } from 'zod';

import { ResponseHelper, HttpError } from '..';
import { HttpStatusCode } from '../../types/http';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaErrorForeignKeyConstraint, PrismaErrorUniqueConstraint } from '../../types/error';

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
        error as object
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

class PrismaClientKnownRequestErrorHandler extends ErrorHandler {
  // THINGS TO NOTICE: cuman bisa nge catch 1 exception

  protected canHandle(error: unknown): boolean {
    return error instanceof PrismaClientKnownRequestError;
  }

  protected capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  protected formatConstraintName(name: string): string {
    const words = name.split('_');
    const formattedWords = words.map((word) => this.capitalizeFirstLetter(word));
    return formattedWords.join(' ');
  }

  protected getResponse(
    jsonResponse: Response,
    error: PrismaClientKnownRequestError,
  ): Response {
    let message = 'Internal server error';
    let code = HttpStatusCode.InternalServerError;
    let errors: Record<string, string[]> | null = {};

    switch (error.code) {
      case 'P2001': { // Not exist constraint

        break;
      }

      case 'P2002': { // Unique constraint        
        if (error.meta && error.meta.target) {
          const constraintName = (error as PrismaErrorUniqueConstraint).meta.target[0];

          if (!errors[constraintName]) {
            errors[constraintName] = [];
          }

          errors[constraintName].push(`${this.formatConstraintName(constraintName)} already exists`);

          code = HttpStatusCode.Conflict;
          message = 'Operation failed, please check your request again';
        }
        break;
      }

      case 'P2003': { // Foreign key constraint
        if (error.meta) {
          const fieldName = (error as PrismaErrorForeignKeyConstraint).meta.field_name.match(/_(.+)_fkey/);

          if (fieldName) {
            const constraintName = fieldName[1];

            if (!errors[constraintName]) {
              errors[constraintName] = [];
            }
            
            errors[constraintName].push(`${this.formatConstraintName(constraintName)} is not exists`);
          }

          code = HttpStatusCode.Conflict;
          message = 'Operation failed, please check your request again';
        }
        break;
      }

      default:
        message = error.message;
        break;
    }

    if (Object.keys(errors).length === 0) {
      errors = null;
    }

    return ResponseHelper.responseError(
      jsonResponse, 
      code, 
      message,
      errors
    );
  }
}

export default 
  new HttpErrorHandler().setNextHandler(
  new ZodErrorHandler().setNextHandler(
  new PrismaClientKnownRequestErrorHandler()));
