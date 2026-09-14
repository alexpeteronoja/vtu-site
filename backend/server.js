import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.error('Error', err));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started on Port 3000');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 🌤 Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! 🌤 Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
