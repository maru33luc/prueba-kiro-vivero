import { NestFactory } from '@nestjs/core';
console.log('🚀 [BACKEND] Starting application bootstrap process...');
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost';
  app.enableCors({
    origin: [frontendUrl, 'http://localhost', 'http://localhost:4200', 'http://localhost:80'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Puerto
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0'); // 0.0.0.0 para que escuche en todas las interfaces
  console.log(`✅ Application is running on http://localhost:${port}`);
}

bootstrap();
