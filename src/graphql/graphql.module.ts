// src/graphql/graphql.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLSchema } from 'graphql';

import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { nexusSchema } from './schema';

@Module({
  imports: [
    PrismaModule, // PrismaModule is @Global(), but importing keeps intent explicit
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        schema: nexusSchema as GraphQLSchema,
        path: '/graphql',
        playground: true,
        // IMPORTANT: pass prisma + request-scoped logger (req.log) into context
        context: ({ req }: { req: Request & { log?: unknown } }) => ({
          req,
          prisma,
          logger: req.log, // provided by nestjs-pino (pino-http)
        }),
      }),
    }),
  ],
})
export class GqlAppModule {}
