import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const app = createApp();
const PORT = env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🌍 GlobeTrotter Backend API is running!`);
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`⚙️  Environment: ${env.NODE_ENV}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully via Prisma');
  } catch (error) {
    console.warn('⚠️  Database connection warning (check DATABASE_URL in .env):', (error as Error).message);
  }
});

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('🔒 HTTP server closed');
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
