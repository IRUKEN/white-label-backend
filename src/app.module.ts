import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { nexusSchema } from './graphql/schema';
import { LoggerModule } from './logging/logger.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LoggerModule,

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        schema: nexusSchema,
        path: '/graphql',
        context: ({
          req,
        }: {
          req: Request & { log?: import('pino').Logger };
        }): {
          req: Request & { log?: import('pino').Logger };
          prisma: PrismaService;
          logger: import('pino').Logger;
        } => ({
          req,
          prisma,
          logger: req.log as import('pino').Logger, // ✅ si estás usando nestjs-pino
        }),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
