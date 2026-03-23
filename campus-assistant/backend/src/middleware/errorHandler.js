const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose 错误
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message,
      error: err.name
    });
  }

  // Mongoose 重复字段错误
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      message,
      error: err.name
    });
  }

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message,
      error: err.name
    });
  }

  // Multer 错误
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'File field missing'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error'
    });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // 默认错误
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: err.name || 'ServerError'
  });
};

module.exports = errorHandler;