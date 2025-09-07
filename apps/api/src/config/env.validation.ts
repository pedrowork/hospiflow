import { z } from 'zod';

export const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	PORT: z.string().optional(),
	JWT_SECRET: z.string().min(10),
	JWT_EXPIRES_IN: z.string().default('15m'),
	JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type Env = z.infer<typeof envSchema>;
