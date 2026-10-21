import { rateLimit } from 'express-rate-limit';

// Global API Limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message:
      'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Transaction Limiter
export const transactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many transaction requests submitted. Please slow down.',
  },
});
