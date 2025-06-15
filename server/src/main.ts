import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Frontend URL
      'http://127.0.0.1:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  await app.listen(3000);

  // await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
