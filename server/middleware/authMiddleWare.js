// authMiddleware.js
import { sessions } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Grab the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Clerk
    const session = await sessions.verifySessionToken(token);
    if (!session || !session.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Find user in your database or create if not exists
    let user = await User.findById(session.userId);
    if (!user) {
      user = await User.create({ _id: session.userId, role: 'user' }); // optional default role
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
};
