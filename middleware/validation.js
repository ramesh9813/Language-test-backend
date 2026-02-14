export const validateWritingInput = (req, res, next) => {
  const { message } = req.body;

  // Validate input
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      error: 'Message is required and must be a non-empty string'
    });
  }

  // Additional validation rules can be added here
  if (message.length > 10000) {
    return res.status(400).json({
      error: 'Message is too long. Maximum length is 10,000 characters'
    });
  }

  next();
};