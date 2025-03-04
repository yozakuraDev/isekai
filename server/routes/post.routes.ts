import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation schemas
const createPostSchema = z.object({
  content: z.string().min(1).max(500)
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    // Get all posts ordered by timestamp (newest first)
    const posts = await prisma.post.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        likedBy: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Format posts for client display
    const formattedPosts = posts.map(post => {
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
      
      // Extract user IDs who liked the post
      const userLiked = post.likedBy.map(user => user.id);
      
      return {
        id: post.id,
        author: post.author.username,
        authorId: post.author.id,
        authorAvatar: post.author.avatar,
        content: post.content,
        timestamp: post.timestamp.toISOString(),
        displayTime,
        likes: post.likes,
        userLiked
      };
    });
    
    res.json(formattedPosts);
  } catch (error) {
    logger.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const validation = createPostSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validation.error.format() 
      });
    }
    
    const { content } = validation.data;
    const userId = req.user.id;
    
    // Create new post
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: userId
      },
      include: {
        author: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    });
    
    logger.info(`New post created by ${req.user.username}`);
    
    // Format timestamp for display
    const displayTime = 'たった今'; // Just now
    
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: newPost.id,
        author: newPost.author.username,
        authorAvatar: newPost.author.avatar,
        content: newPost.content,
        timestamp: newPost.timestamp.toISOString(),
        displayTime,
        likes: 0,
        userLiked: []
      }
    });
  } catch (error) {
    logger.error('Post creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike a post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // Find post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likedBy: {
          where: { id: userId }
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const hasLiked = post.likedBy.length > 0;
    
    if (hasLiked) {
      // User already liked the post, so unlike
      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: { decrement: 1 },
          likedBy: {
            disconnect: { id: userId }
          }
        }
      });
      
      logger.info(`User ${req.user.username} unliked post ${postId}`);
      
      res.json({
        message: 'Post unliked',
        likes: post.likes - 1,
        userLiked: false
      });
    } else {
      // User hasn't liked the post yet
      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: { increment: 1 },
          likedBy: {
            connect: { id: userId }
          }
        }
      });
      
      logger.info(`User ${req.user.username} liked post ${postId}`);
      
      res.json({
        message: 'Post liked',
        likes: post.likes + 1,
        userLiked: true
      });
    }
  } catch (error) {
    logger.error('Post like error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // Find post
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if post belongs to user
    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    // Delete post
    await prisma.post.delete({
      where: { id: postId }
    });
    
    logger.info(`Post ${postId} deleted by ${req.user.username}`);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Post deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;