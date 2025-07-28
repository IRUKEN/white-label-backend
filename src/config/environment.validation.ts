import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  NODE_ENV: string;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  AWS_REGION: string;

  @IsString()
  COGNITO_USER_POOL_ID: string;

  @IsString()
  COGNITO_CLIENT_ID: string;

  @IsString()
  JWT_ISSUER: string;

  @IsString()
  JWT_AUDIENCE: string;

  @IsOptional()
  @IsString()
  API_KEY_SECRET?: string;

  @IsOptional()
  @IsString()
  AWS_SECRET_ARN?: string;

  @IsOptional()
  @IsString()
  REDIS_HOST?: string;

  @IsOptional()
  @IsNumber()
  REDIS_PORT?: number;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsString()
  SENTRY_DSN?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    console.error(errors);
    throw new Error('❌ Invalid environment variables');
  }

  return validated;
}
