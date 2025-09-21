import { PrismaClient } from '@prisma/client';
import config from './config';

const prisma = new PrismaClient({
  log: config.server.env === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: config.server.env === 'development' ? 'pretty' : 'minimal',
});

// データベース接続の確認
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// グレースフルシャットダウン
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

export default prisma;
