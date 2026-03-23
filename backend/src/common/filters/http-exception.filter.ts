import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = HttpStatus[statusCode] ?? 'Error';
    } else {
      const res = exceptionResponse as Record<string, unknown>;
      message = (res.message as string | string[]) ?? exception.message;
      error = (res.error as string) ?? HttpStatus[statusCode] ?? 'Error';
    }

    response.status(statusCode).json({ statusCode, message, error });
  }
}
