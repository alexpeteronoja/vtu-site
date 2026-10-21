import mongoSanitize from 'express-mongo-sanitize';

export const mongoSanitizer = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params && typeof req.params === 'object') {
    mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  if (req.query && typeof req.query === 'object') {
    mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  }
  next();
};
