import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';
import pino from 'pino';

import { buildPinoTargets } from './pino.stream';

function checkIntrospectionQuery(query: unknown): boolean {
  return (
    typeof query === 'string' &&
    (query.includes('__schema') ||
      query.includes('__type') ||
      query.trim() === '')
  );
}

function resolveLevel(
  environment: string,
  explicit?: string,
): pino.LevelWithSilent {
  if (explicit) return explicit as pino.LevelWithSilent;
  switch (environment) {
    case 'production':
      return 'warn';
    case 'qa':
      return 'info';
    default:
      return 'debug'; // dev
  }
}

const ENV = process.env.NODE_ENV ?? 'development';
const LEVEL = resolveLevel(ENV, process.env.LOG_LEVEL);

const targets = buildPinoTargets(ENV);

@Module({
  imports: [
    PinoModule.forRoot({
      pinoHttp: {
        level: LEVEL,
        // IMPORTANT: use either 'transport' or 'stream' (never both)
        ...(targets.transport ? { transport: targets.transport } : {}),
        ...(targets.stream ? { stream: targets.stream } : {}),

        redact: {
          paths: [],
        },
        autoLogging: {
          ignore: (req) => {
            const isHealthOrMetrics =
              req.url === '/health' || req.url === '/metrics';

            const isGraphQLPost =
              req.method === 'POST' && req.url === '/graphql';

            const body = (req as { body?: unknown }).body;
            const query =
              typeof body === 'object' && body !== null && 'query' in body
                ? (body as { query?: string }).query
                : undefined;

            const isIntrospection = checkIntrospectionQuery(query);

            return isHealthOrMetrics || (isGraphQLPost && isIntrospection);
          },
        },

        // keep serializers minimal to avoid heavy logs/loops
        serializers: {
          req(req: {
            id?: string;
            method?: string;
            url?: string;
            headers?: Record<string, unknown>;
          }) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              userAgent: req.headers?.['user-agent'],
            };
          },
          res(response: { statusCode?: number }) {
            return { statusCode: response.statusCode };
          },
          err: pino.stdSerializers.err,
        },

        customProps: (req) => ({
          env: ENV,
          requestId:
            typeof req === 'object' && req !== null && 'id' in req
              ? (req as { id?: string }).id
              : undefined,
        }),
      },
    }),
  ],
  exports: [PinoModule],
})
export class LoggerModule {}
