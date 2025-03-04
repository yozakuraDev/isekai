import express from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation schemas
const createCharacterSchema = z.object({
  username: z.string().min(3).max(30),
  race: z.enum(['human', 'oni', 'fairy', 'undead']),
  characterClass: z.enum(['warrior', 'mage', 'thief', 'exorcist'])
});

// Create a new character
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const validation = createCharacterSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validation.error.format() 
      });
    }
    
    const { username, race, characterClass } = validation.data;
    const userId = req.user.id;
    
    // Check if user already has a character
    const existingCharacters = await prisma.character.findMany({
      where: { userId }
    });
    
    if (existingCharacters.length >= 3) {
      return res.status(400).json({ error: 'Maximum character limit reached (3)' });
    }
    
    // Create new character
    const newCharacter = await prisma.character.create({
      data: {
        username,
        race,
        class: characterClass,
        level: 1,
        userId
      }
    });
    
    logger.info(`New character created: ${username} for user ${req.user.username}`);
    
    res.status(201).json({
      message: 'Character created successfully',
      character: newCharacter
    });
  } catch (error) {
    logger.error('Character creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's characters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const characters = await prisma.character.findMany({
      where: { userId }
    });
    
    res.json(characters);
  } catch (error) {
    logger.error('Get characters error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific character
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const characterId = req.params.id;
    const userId = req.user.id;
    
    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Check if character belongs to user
    if (character.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this character' });
    }
    
    res.json(character);
  } catch (error) {
    logger.error('Get character error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a character
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const characterId = req.params.id;
    const userId = req.user.id;
    
    // Find character
    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Check if character belongs to user
    if (character.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this character' });
    }
    
    // Update character (only username can be updated)
    const { username } = req.body;
    
    if (!username || typeof username !== 'string' || username.length < 3) {
      return res.status(400).json({ error: 'Valid username is required' });
    }
    
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: { username }
    });
    
    logger.info(`Character updated: ${updatedCharacter.username}`);
    
    res.json({
      message: 'Character updated successfully',
      character: updatedCharacter
    });
  } catch (error) {
    logger.error('Update character error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a character
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const characterId = req.params.id;
    const userId = req.user.id;
    
    // Find character
    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Check if character belongs to user
    if (character.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this character' });
    }
    
    // Delete character
    await prisma.character.delete({
      where: { id: characterId }
    });
    
    logger.info(`Character deleted: ${character.username}`);
    
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    logger.error('Delete character error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;