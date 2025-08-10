import fs from 'node:fs';

import pino from 'pino';
import { multistream } from 'pino-multi-stream';

type BuildResult =
  | { transport: pino.TransportSingleOptions; stream?: undefined } // for DEV
  | { stream: pino.DestinationStream; transport?: undefined }; // for QA/PROD

export function buildPinoTargets(
  environment = process.env.NODE_ENV ?? 'development',
): BuildResult {
  // DEV: pretty console only, via transport (no multistream)
  if (environment === 'development') {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          singleLine: false,
        },
      },
    };
  }

  // QA/PROD: JSON console + file, via multistream (dedupe)
  const streams = [
    { level: 'info', stream: process.stdout }, // console JSON
    {
      level: 'info',
      stream: fs.createWriteStream('logs/app.log', { flags: 'a' }),
    }, // file
  ];

  if (typeof multistream !== 'function') {
    throw new Error('multistream is not a function');
  }
  const multiStreamFunction = multistream as unknown as (
    streams: unknown,
    options?: unknown,
  ) => pino.DestinationStream;
  return {
    stream: multiStreamFunction(streams, { dedupe: true }),
  };
}
