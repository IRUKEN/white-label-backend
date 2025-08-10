// src/prisma/prisma.service.ts
import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Prisma log levels:
 * - In production keep noise low (warn/error).
 * - In dev you may enable 'query' for deep debugging (optional).
 * You can also override via env (see PRISMA_LOG).
 */
function resolvePrismaLog(): Prisma.LogLevel[] {
  // Optional override: PRISMA_LOG="query,info,warn,error"
  const fromEnv = process.env.PRISMA_LOG?.split(',').map((s) => s.trim()) as
    | Prisma.LogLevel[]
    | undefined;

  if (fromEnv?.length) return fromEnv;

  return process.env.NODE_ENV === 'production'
    ? (['warn', 'error'] as const)
    : (['info', 'warn', 'error'] as const);
}

const prismaOptions: Prisma.PrismaClientOptions = {
  log: resolvePrismaLog(),
};

/**
 * Global cache for dev/HMR to avoid opening multiple DB connections.
 * Note: In NestJS, the DI container already provides a singleton per process;
 * this cache is only to protect against tooling that hot-reloads modules.
 */
const globalForPrisma = globalThis as unknown as { __PRISMA__?: PrismaClient };
const cached = globalForPrisma.__PRISMA__;

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'beforeExit'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Create the underlying PrismaClient
    super(prismaOptions);

    // Reuse the same PrismaClient during dev/HMR; in prod we return this instance.
    if (process.env.NODE_ENV !== 'production') {
      if (!cached) {
        globalForPrisma.__PRISMA__ = this;
      }
      // NOTE: returning here prevents injecting constructor deps; keep this class parameterless.
      return (globalForPrisma.__PRISMA__ as PrismaService) ?? this;
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /**
   * Gracefully close the NestJS app when Prisma emits "beforeExit".
   */
  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit', () => {
      void app.close();
    });
  }
}
