import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8000',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    // credentials: true, // cookies/sessões
  });

  const config = new DocumentBuilder()
    .setTitle('APIs do Discool')
    .setDescription('documentação de todas as apis do Discool disponiveis')
    .setVersion('1.0')
    .addTag('disc')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});
