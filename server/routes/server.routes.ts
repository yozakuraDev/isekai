import express from 'express';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get server status
router.get('/', async (req, res) => {
  try {
    // Get server status from database
    const serverStatus = await prisma.serverStatus.findUnique({
      where: { id: 1 }
    });
    
    if (!serverStatus) {
      return res.status(404).json({ error: 'Server status not found' });
    }
    
    // Simulate some dynamic changes
    const randomPlayers = Math.floor(Math.random() * 20) + 30; // Random between 30-50
    
    // Update player count in database
    await prisma.serverStatus.update({
      where: { id: 1 },
      data: { players: randomPlayers }
    });
    
    res.json({
      online: serverStatus.online,
      players: randomPlayers,
      maxPlayers: serverStatus.maxPlayers,
      event: serverStatus.event,
      uptime: {
        days: serverStatus.uptimeDays,
        hours: serverStatus.uptimeHours,
        minutes: serverStatus.uptimeMinutes
      }
    });
  } catch (error) {
    logger.error('Get server status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update server status (admin only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    // In a real application, you would check if the user is an admin
    // For now, we'll just check if the user exists
    if (!req.user) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { online, maxPlayers, event, uptime } = req.body;
    
    // Validate input
    if (typeof online !== 'boolean' && online !== undefined) {
      return res.status(400).json({ error: 'Online status must be a boolean' });
    }
    
    if (maxPlayers !== undefined && (!Number.isInteger(maxPlayers) || maxPlayers < 1)) {
      return res.status(400).json({ error: 'Max players must be a positive integer' });
    }
    
    // Update server status
    const updatedStatus = await prisma.serverStatus.update({
      where: { id: 1 },
      data: {
        online: online !== undefined ? online : undefined,
        maxPlayers: maxPlayers !== undefined ? maxPlayers : undefined,
        event: event !== undefined ? event : undefined,
        uptimeDays: uptime?.days !== undefined ? uptime.days : undefined,
        uptimeHours: uptime?.hours !== undefined ? uptime.hours : undefined,
        uptimeMinutes: uptime?.minutes !== undefined ? uptime.minutes : undefined,
        lastUpdated: new Date()
      }
    });
    
    logger.info(`Server status updated by ${req.user.username}`);
    
    res.json({
      message: 'Server status updated successfully',
      status: {
        online: updatedStatus.online,
        players: updatedStatus.players,
        maxPlayers: updatedStatus.maxPlayers,
        event: updatedStatus.event,
        uptime: {
          days: updatedStatus.uptimeDays,
          hours: updatedStatus.uptimeHours,
          minutes: updatedStatus.uptimeMinutes
        }
      }
    });
  } catch (error) {
    logger.error('Update server status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;