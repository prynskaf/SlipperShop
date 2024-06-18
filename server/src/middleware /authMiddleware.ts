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

const secret = 'your_jwt_secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.User = user;
    next();
  });
};

export default authenticateToken;
