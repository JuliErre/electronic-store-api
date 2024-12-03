import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cors());
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
export default bootstrap();
