// src/common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const type = host.getType();

    if (type !== 'http') {
      this.handleNonHttpException(exception, type);
      return;
    }

    const http = host.switchToHttp();
    const request: Record<string, unknown> = http.getRequest();
    const response: Record<string, unknown> = http.getResponse();

    const { httpAdapter } = this.adapterHost;
    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception, isHttp);
    const path: string = String(httpAdapter.getRequestUrl(request));
    const method: string = String(httpAdapter.getRequestMethod(request));
    const requestId: string =
      (request?.id as string) ??
      ((request?.headers && typeof request.headers === 'object'
        ? (request.headers as Record<string, string>)['x-request-id']
        : undefined) as string) ??
      undefined;

    this.logException(exception, status, method, path, requestId);

    const body = {
      statusCode: status,
      message,
      path,
      timestamp: new Date().toISOString(),
      requestId,
    };

    httpAdapter.reply(response, body, status);
  }

  private handleNonHttpException(exception: unknown, type: string): void {
    this.logger.error(
      { err: exception, contextType: type },
      'Non-HTTP exception',
    );
  }

  private extractMessage(exception: unknown, isHttp: boolean): string {
    if (!isHttp) return 'Internal server error';
    const httpException = exception as HttpException;
    const payload = httpException.getResponse() as
      | string
      | { message?: string | string[]; error?: string; [k: string]: unknown };
    if (typeof payload === 'string') return payload;
    if (Array.isArray(payload?.message)) return payload.message.join(', ');
    if (typeof payload?.message === 'string') return payload.message;
    if (typeof httpException.message === 'string') return httpException.message;
    return 'Internal server error';
  }

  private logException(
    exception: unknown,
    status: number,
    method: string,
    path: string,
    requestId: string,
  ): void {
    this.logger.error(
      {
        err: exception,
        status,
        method,
        path,
        requestId,
        stack:
          process.env.NODE_ENV === 'production'
            ? undefined
            : (exception as Error)?.stack,
      },
      'Unhandled exception',
    );
  }
}
