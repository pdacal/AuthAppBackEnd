import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//senon da fallo no frontend
  app.enableCors();

  //para face ro backend restrinxido, que so acepte informacion coma eu definin 
  //se en postman ponhemos nome en vez de name: error 400 Bad request
  //npm install class-validator class-transformer
  app.useGlobalPipes( new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    })
);

  await app.listen(3000);
}
bootstrap();
