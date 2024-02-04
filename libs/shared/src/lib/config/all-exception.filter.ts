import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponseModel } from '../models/exception-response.model';

interface HttpError {
  response: {
    statusCode: number;
    message: string[];
    error: string;
  };
  status: number;
  options: Record<any, any>;
}

/**
 * this function checks if the error we received was from class validator
 * since the error is not a definite class i use type guard to check if the error is
 * in the type of that serialized error
 * @param object
 */
function isValidationError(object: any): object is HttpError {
  return !!object?.response?.message;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    /**
     * In certain situations `httpAdapter` might not be available in the
     * constructor method, thus we should resolve it here.
     */
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = exception['message'];
    let customStatusCode: number | null;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    }

    if (isValidationError(exception)) {
      httpStatus = exception.status;
      message = exception.response.message;
    }

    // send to sentry
    const responseBody: ExceptionResponseModel = {
      statusCode: customStatusCode || httpStatus,
      timestamp: new Date().toISOString(),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
