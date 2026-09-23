import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';
import { startPaymentReconciliation } from './src/common/jobs/reconcilePayment.js';
import { logger } from './src/common/utils/logger.js';
import { AppError } from './src/common/utils/appError.js';

const DB = process.env.DATABASE;
const port = process.env.PORT || 3000;

mongoose
  .connect(DB)
  .then(() => console.log('DB Connected'))
  .catch((err) => {
    logger.error('Error', err);
    throw new AppError('Error Connecting to the Database', 500);
  });

const server = app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);

  startPaymentReconciliation();
});

process.on('unhandledRejection', (err) => {
  logger.error(err.name, err.message);
  logger.error('UNHANDLED REJECTION! 🌤 Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error(err.name, err.message);
  logger.error('UNHANDLED EXCEPTION! 🌤 Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
