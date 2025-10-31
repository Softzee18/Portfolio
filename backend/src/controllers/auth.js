import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // In a real app, you'd validate against a database
    // For demo, we use environment variables
    if (username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};