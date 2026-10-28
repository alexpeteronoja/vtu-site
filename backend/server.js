import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

console.log('[BOOT] server.js loaded');
console.log('[BOOT] PORT:', process.env.PORT || 3000);
console.log('[BOOT] DATABASE configured:', Boolean(process.env.DATABASE));

process.on('uncaughtExceptionMonitor', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
});

async function startServer() {
  try {
    console.log('[BOOT] Connecting to MongoDB...');

    await mongoose.connect(process.env.DATABASE, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('[BOOT] MongoDB connected');

    const port = process.env.PORT || 3000;

    app.listen(port, '0.0.0.0', () => {
      console.log(`[BOOT] HTTP server listening on ${port}`);
    });
  } catch (err) {
    console.error('[BOOT] Startup failed:', err);
    process.exitCode = 1;
  }
}

startServer();
