import { HttpStatusCode } from '../../types/http';

class HttpError extends Error {
  statusCode: HttpStatusCode;
  errors: object | null | undefined = null;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    errors: object | null | undefined = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
