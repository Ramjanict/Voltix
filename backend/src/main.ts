import * as dotenv from 'dotenv';
import * as path from 'path';

// Prioritize backend folder's .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for development & staging
    },
    credentials: true,
  });

  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Voltix E-Commerce REST API')
    .setDescription(
      'Interactive OpenAPI / Swagger documentation for Voltix Fullstack E-Commerce platform built with NestJS, PostgreSQL (Neon), Prisma, and Stripe.',
    )
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Bearer JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'token',
      description: 'Session cookie token',
    })
    .addTag('Authentication', 'User registration, login, logout, and profile endpoints')
    .addTag('Users', 'Admin user management')
    .addTag('Products', 'Product catalog, search, categories, and inventory management')
    .addTag('Cart', 'Shopping cart items and quantities')
    .addTag('Orders', 'Order processing, Stripe checkout sessions, and status tracking')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Voltix API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Voltix API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running at http://localhost:${port}/api`);
  console.log(`📚 Swagger Documentation available at http://localhost:${port}/docs and http://localhost:${port}/api/docs`);
}

bootstrap();
