## Description

This boilerplate is a NestJS framework TypeScript starter repository tailored for rapid prototyping and scalable architecture.

## Project setup

```bash
$ bun install
```

## Compile and run the project

```bash
# development
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Run tests

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, check the [deployment documentation](https://docs.nestjs.com/deployment).

To deploy on AWS via Mau:

```bash
$ bun add -g @nestjs/mau
$ mau deploy
```

## Resources

- NestJS Documentation: [https://docs.nestjs.com](https://docs.nestjs.com)
- Discord Support: [https://discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)
- Video Courses: [https://courses.nestjs.com/](https://courses.nestjs.com/)
- AWS Deployment: [https://mau.nestjs.com](https://mau.nestjs.com)
- Devtools: [https://devtools.nestjs.com](https://devtools.nestjs.com)
- Enterprise Support: [https://enterprise.nestjs.com](https://enterprise.nestjs.com)
- Jobs Board: [https://jobs.nestjs.com](https://jobs.nestjs.com)

## Support

Nest is MIT-licensed open source. Growit thanks to our sponsors and backers. Learn more at [https://docs.nestjs.com/support](https://docs.nestjs.com/support).

## Stay in touch

- Author: tabash (enhanced in collaboration with AI Assistant)
- Twitter: @nestframework
- Website: [https://nestjs.com/](https://nestjs.com/)

## License

Nest is MIT licensed: [https://github.com/nestjs/nest/blob/master/LICENSE](https://github.com/nestjs/nest/blob/master/LICENSE)

---

# White-Label Backend Documentation

## Overview

This boilerplate is a **modular NestJS** application configured with GraphQL and PostgreSQL, designed to accelerate prototyping and enable seamless scaling.

## Background

The need for a "white-label" backend arises from the desire to rapidly deliver prototypes and production-ready APIs without repetitive setup. This base template provides core modules—authentication, authorization, data access, observability, and security—so teams can focus on business logic.

## Requirements

### Must Have

- Modular NestJS architecture ready for extension.
- AWS Cognito integration for user sign-up, sign-in, and JWT issuance.
- Programmatic access via API Keys.
- JWT validation for secure endpoints.
- ORM setup (Prisma) connected to PostgreSQL.
- Dockerfile and docker-compose configuration.
- Automated Swagger/OpenAPI documentation.
- API versioning (e.g., v1, v2).
- Configuration and secrets management (AWS Secrets Manager).
- Input validation and sanitization using NestJS ValidationPipe.

### Should Have

- Centralized JSON logging (Pino) with deduplication to AWS CloudWatch.
- Health checks and metrics endpoints (`/health`, `/metrics`) for Prometheus.
- Rate limiting via `@nestjs/throttler`.
- Redis caching for critical queries.
- CI/CD pipelines (GitHub Actions or AWS CodePipeline).
- Separate staging environment.
- Testing strategy: unit (Jest), integration, and e2e (Supertest).

### Could Have

- Infrastructure-as-Code templates (Terraform/CloudFormation).
- GraphQL subscriptions or WebSockets.
- Internationalization (i18n).
- Circuit breaker and resilience patterns.
- Advanced monitoring and alerting (Grafana, AlertManager).
- Dynamic documentation of workflows via PlantUML.

### Won't Have (for now)

- Multi-cloud high-availability.
- Distributed cache mesh.
- Multi-node database clusters.

## Technology Stack

| Layer               | Library / Tool                                                                                                                                                                       | Purpose                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Framework           | NestJS                                                                                                                                                                               | Modular Node.js framework for scalable architecture                         |
| ORM                 | Prisma                                                                                                                                                                               | Type-safe database client                                                   |
| API                 | GraphQL (Apollo / `@nestjs/graphql` + Nexus Prisma)                                                                                                                                  | Flexible schema-driven query language                                       |
| Auth                | AWS Cognito + `aws-jwt-verify`                                                                                                                                                       | User authentication and JWT validation                                      |
| Config & Validation | `@nestjs/config`, class-validator, class-transformer                                                                                                                                 | Environment configuration and DTO validation                                |
| Error Handling      | NestJS Exception Filters                                                                                                                                                             | Centralized error formatting                                                |
| Logging             | `nestjs-pino`, `pino`, `pino-multi-stream` / `pino-duplicate-stream`, Sentry                                                                                                         | High-performance JSON logs, deduplication, and error monitoring             |
| Tracing             | OpenTelemetry SDK (`@opentelemetry/sdk-node`, `auto-instrumentations-node`), OTLP gRPC exporter, AWS X-Ray exporter (`@mridang/exporter-xray`, `@opentelemetry/propagator-aws-xray`) | Distributed tracing across HTTP, Prisma, Redis, etc.                        |
| Metrics & Health    | `@willsoto/nestjs-prometheus`, `@nestjs/terminus`                                                                                                                                    | Prometheus exposure and health checks                                       |
| Caching             | `@nestjs/cache-manager`, `cache-manager-ioredis`, `dataloader`                                                                                                                       | Redis caching and batch loading for GraphQL                                 |
| Secrets             | `@aws-sdk/client-secrets-manager`                                                                                                                                                    | Secure retrieval of secrets from AWS Secrets Manager                        |
| Security & Monitor  | `@nestjs/throttler`, `helmet`, CORS decorators, Sentry, Prometheus                                                                                                                   | Rate limiting, HTTP security headers, cross-origin policies, error tracking |
| Documentation       | `@nestjs/swagger`, `swagger-ui-express`                                                                                                                                              | Automated interactive API documentation                                     |
| Testing             | Jest, Supertest                                                                                                                                                                      | Unit, integration, and end-to-end tests                                     |
| CI/CD & Docker      | Docker, Docker Compose, GitHub Actions/AWS CodePipeline                                                                                                                              | Containerization and automated deployment                                   |
| Database            | PostgreSQL                                                                                                                                                                           | Relational database                                                         |
| DataLoader          | `dataloader`                                                                                                                                                                         | Batch and cache resolution to prevent N+1 problems                          |

## Modular Architecture

The project follows a module-per-concern structure:

```
src/
├── auth/            # AWS Cognito JWT guards and strategies
├── cache/           # Redis cache integration
├── config/          # Environment configuration module
├── graphql/         # GraphQL schemas and resolvers (Nexus)
├── logging/         # Pino logger setup and transports
├── metrics/         # Prometheus instrumentation
├── prisma/          # Prisma client and migrations
├── secrets/         # AWS Secrets Manager provider
├── tracing/         # OpenTelemetry bootstrap
├── common/          # Shared pipes, filters, DTOs
└── main.ts          # Bootstrap (includes OTEL initialization)
```

## Component Interaction

```plantuml
@startuml
actor Client

rectangle "API Gateway" as APIGW {
  [GraphQL Endpoint]
}

rectangle "NestJS App" as Nest {
  component "Auth Module\n(Cognito JWT)"
  component "GraphQL Module\n(Resolvers & Schemas)"
  component "Prisma Module\n(ORM Client)"
  component "Cache Module\n(Redis)"
  component "Metrics Module\n(Prometheus)"
  component "Logging Module\n(Pino + dedupe)"
  component "Tracing Module\n(OpenTelemetry)"
}

database "PostgreSQL" as PG

Client --> APIGW : HTTP GraphQL Queries
APIGW --> Nest : Forward GraphQL Requests
Nest --> PG : Prisma CRUD Operations
Nest --> Redis : Cache Reads/Writes
Nest --> Cognito : JWT Validation
Nest --> Prometheus : Metrics Scrape
Nest --> X-Ray : Trace Export
@enduml
```

## Sample Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  roles     String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## Project Setup

```bash
# Install dependencies
bun install
```

## Running

```bash
# Development
bun run start:dev

# Production
bun run start:prod
```

## Testing

```bash
# Unit tests
bun run test

# End-to-end tests
bun run test:e2e

# Coverage report
bun run test:cov
```

## Deployment

Refer to the [NestJS deployment guide](https://docs.nestjs.com/deployment) or use Mau:

```bash
bun add -g @nestjs/mau
mau deploy
```

## Resources

- Official NestJS Docs: [https://docs.nestjs.com](https://docs.nestjs.com)
- Discord Support: [https://discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)
- Video Courses: [https://courses.nestjs.com/](https://courses.nestjs.com/)
- Devtools: [https://devtools.nestjs.com](https://devtools.nestjs.com)
- Enterprise Support: [https://enterprise.nestjs.com](https://enterprise.nestjs.com)
- Jobs Board: [https://jobs.nestjs.com](https://jobs.nestjs.com)

## Stay in touch

- Author: tabash (enhanced in collaboration with AI Assistant)
- Twitter: @nestframework
- Website: [https://nestjs.com/](https://nestjs.com/)

---

*This documentation has been improved and enriched through collaboration with AI technologies to ensure accuracy, clarity, and best practices.*

