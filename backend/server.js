import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';
import { startPaymentReconciliation } from './src/common/jobs/reconcilePayment.js';
import { logger } from './src/common/utils/logger.js';
import { AppError } from './src/common/utils/appError.js';

const DB = process.env.DATABASE;
const port = process.env.PORT || 3000;

let server;

async function startServer() {
  if (!DB) {
    throw new AppError('DATABASE environment variable is missing', 500);
  }

  await mongoose.connect(DB);
  console.log('DB Connected');

  server = app.listen(port, () => {
    console.log(`Server Started on Port ${port}`);

    startPaymentReconciliation();
  });

  server.on('error', (err) => {
    console.error('HTTP server error:', err);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});

// mongoose
//   .connect(DB)
//   .then(() => console.log('DB Connected'))
//   .catch((err) => {
//     logger.error('Error', err);
//     throw new AppError('Error Connecting to the Database', 500);
//   });

process.on('unhandledRejection', (err) => {
  logger.error(err.name, err.message);
  logger.error('UNHANDLED REJECTION! 🌤 Shutting down...');

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  logger.error(err.name, err.message);
  logger.error('UNHANDLED EXCEPTION! 🌤 Shutting down...');

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
