import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';

// Define custom Request type with user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

// Middleware to authenticate JWT token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hyakki_isekai_secret_key') as jwt.JwtPayload;
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Attach user and token to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if ((error as Error).name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user is authenticated via session
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ error: 'Authentication required' });
};