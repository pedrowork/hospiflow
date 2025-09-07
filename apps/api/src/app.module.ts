import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { envSchema } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EpisodesModule } from './episodes/episodes.module';
import { EventsModule } from './events/events.module';
import { DevModule } from './dev/dev.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => {
				const parsed = envSchema.safeParse(config);
				if (!parsed.success) {
					throw new Error(JSON.stringify(parsed.error.format(), null, 2));
				}
				return parsed.data;
			},
		}),
		PrismaModule,
		AuthModule,
		EpisodesModule,
		EventsModule,
		DevModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
