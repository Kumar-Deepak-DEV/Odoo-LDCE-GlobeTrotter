import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env file from server root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL is required in .env file',
  }).min(1, 'DATABASE_URL cannot be empty'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required in .env file for secure authentication',
  }).min(16, 'JWT_SECRET must be at least 16 characters long for security'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_SEED_EMAIL: z.string().email().optional(),
  ADMIN_SEED_PASSWORD: z.string().min(6).optional(),
  DEMO_SEED_EMAIL: z.string().email().optional(),
  DEMO_SEED_PASSWORD: z.string().min(6).optional(),
  GEODB_API_KEY: z.string().optional().default(''),
  GEODB_HOST: z.string().optional().default('wft-geo-db.p.rapidapi.com'),
  UNSPLASH_API_KEY: z.string().optional().default(''),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('\n❌ [FATAL] Environment Configuration Validation Error:');
    for (const error of result.error.errors) {
      console.error(`  - ${error.path.join('.')}: ${error.message}`);
    }
    console.error('\nPlease check your .env file and ensure all required variables are set.\n');
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
export type EnvConfig = z.infer<typeof envSchema>;
