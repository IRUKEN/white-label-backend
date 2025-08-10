import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';
import pino from 'pino';

import { buildPinoTargets } from './pino.stream';

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
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.token',
            'res.headers["set-cookie"]',
          ],
          censor: '[Redacted]',
        },

        autoLogging: {
          ignore: (req) => req.url === '/health' || req.url === '/metrics',
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
