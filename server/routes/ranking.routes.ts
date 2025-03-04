import express from 'express';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get rankings
router.get('/', async (req, res) => {
  try {
    // Get hyakki rankings
    const hyakkiRanking = await prisma.ranking.findMany({
      where: { type: 'hyakki' },
      orderBy: { rank: 'asc' }
    });
    
    // Get PvP rankings
    const pvpRanking = await prisma.ranking.findMany({
      where: { type: 'pvp' },
      orderBy: { rank: 'asc' }
    });
    
    // Format rankings
    const formattedHyakkiRanking = hyakkiRanking.map(entry => ({
      rank: entry.rank,
      player: entry.player,
      defeats: entry.score
    }));
    
    const formattedPvpRanking = pvpRanking.map(entry => ({
      rank: entry.rank,
      player: entry.player,
      kills: entry.score
    }));
    
    res.json({
      hyakkiRanking: formattedHyakkiRanking,
      pvpRanking: formattedPvpRanking
    });
  } catch (error) {
    logger.error('Get rankings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ranking (admin only)
router.put('/:type/:rank', authenticateToken, async (req, res) => {
  try {
    // In a real application, you would check if the user is an admin
    // For now, we'll just check if the user exists
    if (!req.user) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { type, rank } = req.params;
    const { player, score } = req.body;
    
    if (!['hyakki', 'pvp'].includes(type)) {
      return res.status(400).json({ error: 'Invalid ranking type' });
    }
    
    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum < 1) {
      return res.status(400).json({ error: 'Rank must be a positive integer' });
    }
    
    if (!player || typeof player !== 'string') {
      return res.status(400).json({ error: 'Player name is required' });
    }
    
    if (!score || !Number.isInteger(score) || score < 0) {
      return res.status(400).json({ error: 'Score must be a non-negative integer' });
    }
    
    // Find ranking entry
    const rankingEntry = await prisma.ranking.findFirst({
      where: {
        type,
        rank: rankNum
      }
    });
    
    let updatedRanking;
    
    if (rankingEntry) {
      // Update existing entry
      updatedRanking = await prisma.ranking.update({
        where: { id: rankingEntry.id },
        data: {
          player,
          score
        }
      });
    } else {
      // Create new entry
      updatedRanking = await prisma.ranking.create({
        data: {
          type,
          rank: rankNum,
          player,
          score
        }
      });
    }
    
    logger.info(`Ranking updated by ${req.user.username}: ${type} rank ${rankNum}`);
    
    res.json({
      message: 'Ranking updated successfully',
      ranking: updatedRanking
    });
  } catch (error) {
    logger.error('Update ranking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;