import express from 'express';
import morgan from 'morgan';
import { authRouter } from './src/modules/auth/authRoutes.js';
import { errorHandler } from './src/common/middleware/errorHandler.js';
import { AppError } from './src/common/utils/appError.js';
import { userRouter } from './src/modules/user/userRoutes.js';
import { walletRouter } from './src/modules/wallet/walletRoutes.js';
import { dataRouter } from './src/modules/data/dataRoutes.js';
import { airtimeRouter } from './src/modules/airtime/airtimeRoutes.js';
import { paymentRouter } from './src/modules/payment/paymentRoutes.js';

const app = express();

// development logging

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser, reading data from body into req.body
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
    limit: '10kb',
  }),
);
app.set('query parser', 'extended');

// middleware to make req.query reeditable(multable)

// app.use((req, res, next) => {
//   Object.defineProperty(req, 'query', {
//     // eslint-disable-next-line node/no-unsupported-features/es-syntax
//     // eslint-disable-next-line node/no-unsupported-features/es-syntax
//     ...Object.getOwnPropertyDescriptor(req, 'query'),
//     value: req.query,
//     writable: true,
//   });
//   next();
// });

// Routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/airtime', airtimeRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export { app };
