import { Response } from 'express';
import { HttpStatusCode, IApiBaseResponseError, IApiBaseResponseSuccess } from '../types/http';

class ResponseHelper {
  static responseSuccess(
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    data?: object[] | object | null | undefined,
  ) {
    const responseObj: IApiBaseResponseSuccess<object> = {
      status: 'success',
      message: message,
    };

    if (data !== null && data !== undefined) {
      responseObj.data = data;
    }

    return res.status(statusCode).json(responseObj);
  }

  static responseError(
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    errors?: object | null | undefined
  ) {
    const responseObj: IApiBaseResponseError<object> = {
      status: 'error',
      message: message,
    };

    if (errors !== null && errors !== undefined) {
      responseObj.errors = errors;
    }

    return res.status(statusCode).json(responseObj);
  }
}

export default ResponseHelper;
