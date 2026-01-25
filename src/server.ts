import app from './app';
import config from './config';
import { disconnectDatabase } from './config/database';

/**
 * Server Entry Point
 * 
 * Starts the Express server and handles graceful shutdown.
 */

const PORT = config.port;

// Start server
const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server is running`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
});

// ============================================
// Graceful Shutdown
// ============================================

const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    // Close server
    server.close(async () => {
        console.log('✅ HTTP server closed');

        // Disconnect from database
        try {
            await disconnectDatabase();
            console.log('✅ Database connection closed');
        } catch (error) {
            console.error('❌ Error closing database connection:', error);
        }

        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});
