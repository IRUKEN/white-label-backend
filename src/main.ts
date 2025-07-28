import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;

  // ✅ VALIDACIÓN DE VARIABLE DE ENTORNO
  const appName = config.get<string>('APP_NAME');
  console.log(`🌱 Config APP_NAME = ${appName}`);

  await app.listen(port);
  console.log(`🚀 App is running on http://localhost:${port}`);
}

void bootstrap();
