import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { z } from 'zod';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validation.error.format() 
      });
    }
    
    const { username, email, password } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username }, 
      process.env.JWT_SECRET || 'hyakki_isekai_secret_key', 
      { expiresIn: '24h' }
    );
    
    logger.info(`New user registered: ${username}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validation.error.format() 
      });
    }
    
    const { email, password } = validation.data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'hyakki_isekai_secret_key', 
      { expiresIn: '24h' }
    );
    
    logger.info(`User logged in: ${user.username}`);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Discord authentication routes
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const user = req.user as any;
      
      const token = jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.JWT_SECRET || 'hyakki_isekai_secret_key', 
        { expiresIn: '24h' }
      );
      
      // Redirect to the frontend with the token
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? `https://yukkurinet.com/auth-callback?token=${token}`
        : `http://localhost:5173/auth-callback?token=${token}`;
      
      logger.info(`User authenticated via Discord: ${user.username}`);
      
      res.redirect(redirectUrl);
    } catch (error) {
      logger.error('Discord callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// Get current user
router.get('/user', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        discordId: user.discordId
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;