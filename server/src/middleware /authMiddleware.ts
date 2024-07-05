import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request type to include a 'User' property
declare global {
  namespace Express {
    interface Request {
      User?: any; // Using 'any' for the User property
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
    req.User = user; // Attach user information to the request object
    next();
  });
};



// Middleware to check if the authenticated user is an admin
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.User || req.User.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};


export default authenticateToken;
