export const successResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    ...data,
  });
};
