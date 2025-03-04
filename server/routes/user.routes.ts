import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files are allowed!'));
  }
});

// Validation schemas
const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional()
}).refine(data => {
  // If newPassword is provided, currentPassword must also be provided
  return !(data.newPassword && !data.currentPassword);
}, {
  message: "Current password is required when setting a new password",
  path: ["currentPassword"]
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with characters and posts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        characters: true,
        posts: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Format posts for display
    const formattedPosts = user.posts.map(post => {
      const postDate = new Date(post.timestamp);
      const now = new Date();
      const diffMs = now.getTime() - postDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      let displayTime;
      if (diffHours < 1) {
        displayTime = 'たった今'; // Just now
      } else if (diffHours < 24) {
        displayTime = `${diffHours}時間前`; // hours ago
      } else {
        const diffDays = Math.floor(diffHours / 24);
        displayTime = `${diffDays}日前`; // days ago
      }
      
      return {
        ...post,
        displayTime
      };
    });
    
    res.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        discordId: user.discordId,
        createdAt: user.createdAt,
        characters: user.characters,
        posts: formattedPosts
      }
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const validation = updateProfileSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validation.error.format() 
      });
    }
    
    const { username, email, currentPassword, newPassword } = validation.data;
    const userId = req.user.id;
    
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    // Update password if provided
    if (currentPassword && newPassword && user.password) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    
    logger.info(`User profile updated: ${updatedUser.username}`);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userId = req.user.id;
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Update user avatar
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl }
    });
    
    logger.info(`User avatar updated: ${updatedUser.username}`);
    
    res.json({
      message: 'Avatar uploaded successfully',
      avatar: avatarUrl
    });
  } catch (error) {
    logger.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;