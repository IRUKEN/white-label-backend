import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { HttpAdapterHost } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffers until logger is ready
  });

  // Bind nestjs-pino logger
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;

  // ✅ Global logging interceptor for all requests/responses
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // ✅ Global exception filter (adapter-agnostic)
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(Logger), httpAdapterHost),
  );

  // ✅ ENV var check log
  const appName = config.get<string>('APP_NAME');
  app.get(Logger).log(`🌱 Config APP_NAME = ${appName}`);

  await app.listen(port);
  app.get(Logger).log(`🚀 App is running on http://localhost:${port}`);
}

void bootstrap();
