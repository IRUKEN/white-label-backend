// src/config/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: BaseConfigService) {}

  get isProd(): boolean {
    return this.config.get('NODE_ENV') === 'production';
  }

  get port(): number {
    return this.config.get<number>('PORT') ?? 3000;
  }

  get databaseUrl(): string {
    const url = this.config.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    return url;
  }

  get cognitoRegion(): string {
    const region = this.config.get<string>('AWS_REGION');
    if (!region) {
      throw new Error('AWS_REGION environment variable is not set');
    }
    return region;
  }

  get cognitoUserPoolId(): string {
    const userPoolId = this.config.get<string>('COGNITO_USER_POOL_ID');
    if (!userPoolId) {
      throw new Error('COGNITO_USER_POOL_ID environment variable is not set');
    }
    return userPoolId;
  }

  get cognitoClientId(): string {
    const clientId = this.config.get<string>('COGNITO_CLIENT_ID');
    if (!clientId) {
      throw new Error('COGNITO_CLIENT_ID environment variable is not set');
    }
    return clientId;
  }

  get jwtIssuer(): string {
    const issuer = this.config.get<string>('JWT_ISSUER');
    if (!issuer) {
      throw new Error('JWT_ISSUER environment variable is not set');
    }
    return issuer;
  }

  get jwtAudience(): string {
    const audience = this.config.get<string>('JWT_AUDIENCE');
    if (!audience) {
      throw new Error('JWT_AUDIENCE environment variable is not set');
    }
    return audience;
  }

  get redisHost(): string {
    return this.config.get<string>('REDIS_HOST') ?? 'localhost';
  }

  get redisPort(): number {
    return this.config.get<number>('REDIS_PORT') ?? 6379;
  }

  get corsOrigin(): string {
    return this.config.get<string>('CORS_ORIGIN') ?? '*';
  }

  get sentryDsn(): string | undefined {
    return this.config.get<string>('SENTRY_DSN') ?? undefined;
  }
}
