import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';
import { startPaymentReconciliation } from './src/common/jobs/reconcilePayment.js';
import { logger } from './src/common/utils/logger.js';

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log('DB Connected'))
  .catch((err) => logger.error('Error', err));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started on Port 3000');

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
