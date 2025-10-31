import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

export const validateRecaptcha = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA token is required'
      });
    }

    // TODO: Implement reCAPTCHA verification
    // const { Recaptcha } = await import('recaptcha-v3');
    // const recaptcha = new Recaptcha(process.env.RECAPTCHA_SECRET_KEY);
    // const result = await recaptcha.verify(token);
    
    // For now, bypass verification in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'reCAPTCHA verification failed'
    });
  }
};