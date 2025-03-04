import express from 'express';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get world map and bosses
router.get('/', async (req, res) => {
  try {
    // Get all bosses
    const bosses = await prisma.boss.findMany();
    
    // Calculate defeated count
    const defeatedCount = bosses.filter(boss => boss.defeated).length;
    const totalCount = bosses.length;
    
    res.json({
      bosses,
      defeatedCount,
      totalCount
    });
  } catch (error) {
    logger.error('Get world map error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update boss status (admin only)
router.put('/boss/:id', authenticateToken, async (req, res) => {
  try {
    // In a real application, you would check if the user is an admin
    // For now, we'll just check if the user exists
    if (!req.user) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const bossId = parseInt(req.params.id);
    const { defeated } = req.body;
    
    if (typeof defeated !== 'boolean') {
      return res.status(400).json({ error: 'Defeated status must be a boolean' });
    }
    
    // Find boss
    const boss = await prisma.boss.findUnique({
      where: { id: bossId }
    });
    
    if (!boss) {
      return res.status(404).json({ error: 'Boss not found' });
    }
    
    // Update boss status
    const updatedBoss = await prisma.boss.update({
      where: { id: bossId },
      data: { defeated }
    });
    
    logger.info(`Boss ${updatedBoss.name} status updated by ${req.user.username}`);
    
    res.json({
      message: 'Boss status updated successfully',
      boss: updatedBoss
    });
  } catch (error) {
    logger.error('Update boss status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;