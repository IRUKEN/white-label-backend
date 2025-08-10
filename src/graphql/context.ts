// src/graphql/context.ts
import type { Request } from 'express';
import type { Logger as PinoLogger } from 'pino';

import type { PrismaService } from '../prisma/prisma.service';

export interface GraphQLContext {
  req: Request; // if you switch to Fastify, change this type
  prisma: PrismaService; // Prisma singleton (injected in GraphQL context)
  logger?: PinoLogger; // request-scoped logger from nestjs-pino (req.log)
}
