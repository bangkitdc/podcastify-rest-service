import { Response } from 'express';
import { HttpStatusCode, IApiBaseResponseError, IApiBaseResponseSuccess } from '../types/http';
import { existsSync } from 'fs';

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

  static responseFileSuccess(
    res: Response,
    statusCode: HttpStatusCode,
    message: string,
    filePath: string | null | undefined,
  ) {

    if(filePath && existsSync("./src/storage/" + filePath)){
      return res.status(statusCode).download("./src/storage/" + filePath)
    } else {
      return res.status(statusCode).download("./src/public/avatar-template.png")
    }
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
