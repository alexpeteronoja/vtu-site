import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './src/modules/auth/authRoutes.js';
import { errorHandler } from './src/common/middleware/errorHandler.js';
import { AppError } from './src/common/utils/appError.js';
import { userRouter } from './src/modules/user/userRoutes.js';
import { walletRouter } from './src/modules/wallet/walletRoutes.js';
import { dataRouter } from './src/modules/data/dataRoutes.js';
import { airtimeRouter } from './src/modules/airtime/airtimeRoutes.js';
import { paymentRouter } from './src/modules/payment/paymentRoutes.js';
import {
  globalLimiter,
  transactionLimiter,
} from './src/common/middleware/rateLimiter.js';
import { mongoSanitizer } from './src/common/middleware/mongoSanitize.js';

const app = express();

// Trust reverse proxy (Render, Heroku, AWS ELB, Nginx, Cloudflare) for accurate client IP resolution
app.set('trust proxy', 1);

// Set HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

//  CORS Configuration
const allowedOrigins = ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Global API Rate Limiter
app.use('/api', globalLimiter);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser, reading data from body into req.body with 10kb limit
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
    limit: '10kb',
  }),
);
app.set('query parser', 'extended');

// Data Sanitization against NoSQL query injection
app.use(mongoSanitizer);

// Routes with targeted rate limiters
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/data', transactionLimiter, dataRouter);
app.use('/api/v1/payment', transactionLimiter, paymentRouter);
app.use('/api/v1/airtime', transactionLimiter, airtimeRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export { app };
