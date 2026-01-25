import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import config from './index';

/**
 * Prisma Client Configuration for NeonDB
 * 
 * NeonDB is a serverless PostgreSQL database that works perfectly with Prisma.
 * This configuration includes:
 * - Connection pooling for serverless environments
 * - Logging for development
 * - Proper error handling
 */

// Singleton pattern to prevent multiple instances in development
declare global {
    var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
    neonConfig.fetchConnectionCache = true;
    const pool = new Pool({ connectionString: config.databaseUrl });
    const adapter = new PrismaNeon(pool as any);
    
    return new PrismaClient({
        adapter,
        log: config.nodeEnv === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
        errorFormat: 'pretty',
    });
};

// Use global variable in development to prevent hot-reload issues
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Graceful shutdown handler
export const disconnectDatabase = async () => {
    await prisma.$disconnect();
};

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

export default prisma;
