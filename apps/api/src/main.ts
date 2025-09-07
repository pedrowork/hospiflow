import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }) as any,
  );
  app.enableCors({
    // Permite localhost e IPs de redes privadas (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    origin: [
      /localhost(:\d+)?$/,
      /^(http|https):\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)[0-9.]+(:\d+)?$/,
    ],
    credentials: true,
  });
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
