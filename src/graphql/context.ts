// src/graphql/context.ts
import type { Request } from 'express';
import type { Logger as PinoLogger } from 'pino';

import { PrismaService } from '../prisma/prisma.service';

export interface GraphQLContext {
  req: Request;
  prisma: PrismaService;
  logger?: PinoLogger;
}

// Esto se usa en AppModule
export const createContext = ({
  req,
}: {
  req: Request;
}): Partial<GraphQLContext> => {
  return {
    req,
    prisma: req.app.get('PrismaService') as PrismaService, // 👈 importante: recupera PrismaService desde la app
    logger: req['log'], // 👈 si estás usando nestjs-pino, el logger va en req.log
  };
};
