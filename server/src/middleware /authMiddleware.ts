import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request type to include a 'User' property
declare global {
  namespace Express {
    interface Request {
      User?: any; // Define the type of 'User' as needed
    }
  }
}

const secret = process.env.JWT_SECRET || '12345';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Missing token' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Access denied: Invalid token' });
    }
    req.User = user; // Attach user information to the request object for use in subsequent middleware or route handlers
    next();
  });
};

export default authenticateToken;
