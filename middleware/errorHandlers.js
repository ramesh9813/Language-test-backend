// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  
  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    ...(isDevelopment && { details: err.message, stack: err.stack })
  });
};