import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        message = exceptionResponse.message as string;
      }
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
      errors = this.flattenValidationErrors(exception);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      path: request.originalUrl,
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  private flattenValidationErrors(validationError: ValidationError): string[] {
    return Object.values(validationError.constraints || {});
  }
}
