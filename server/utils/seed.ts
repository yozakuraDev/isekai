import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from './logger.js';

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const serverStatusCount = await prisma.serverStatus.count();
    
    if (serverStatusCount > 0) {
      logger.info('Database already seeded, skipping...');
      return;
    }
    
    logger.info('Seeding database...');
    
    // Create server status
    await prisma.serverStatus.create({
      data: {
        online: true,
        players: 42,
        maxPlayers: 100,
        event: 'blood_moon_festival',
        uptimeDays: 124,
        uptimeHours: 7,
        uptimeMinutes: 32
      }
    });
    
    // Create bosses
    await prisma.boss.createMany({
      data: [
        { name: '炎の守護者', location: '溶岩洞窟', defeated: true },
        { name: '森の古老', location: '魔法の森', defeated: false },
        { name: '深海の王', location: '沈没船', defeated: true },
        { name: '虚無の王', location: '異界の門', defeated: false },
        { name: '砂漠の幻影', location: '古代神殿', defeated: true }
      ]
    });
    
    // Create rankings
    // Hyakki rankings
    await prisma.ranking.createMany({
      data: [
        { type: 'hyakki', rank: 1, player: 'DarkSamurai', score: 247 },
        { type: 'hyakki', rank: 2, player: 'MagicMaster99', score: 213 },
        { type: 'hyakki', rank: 3, player: 'NinjaWarrior', score: 189 },
        { type: 'hyakki', rank: 4, player: 'ShadowHunter', score: 176 },
        { type: 'hyakki', rank: 5, player: 'DragonSlayer', score: 154 }
      ]
    });
    
    // PvP rankings
    await prisma.ranking.createMany({
      data: [
        { type: 'pvp', rank: 1, player: 'BloodMoon', score: 532 },
        { type: 'pvp', rank: 2, player: 'SilentAssassin', score: 487 },
        { type: 'pvp', rank: 3, player: 'VoidWalker', score: 421 },
        { type: 'pvp', rank: 4, player: 'ThunderBlade', score: 398 },
        { type: 'pvp', rank: 5, player: 'FrostQueen', score: 356 }
      ]
    });
    
    // Create demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const demoUser = await prisma.user.create({
      data: {
        username: 'DarkSamurai',
        email: 'demo@example.com',
        password: hashedPassword
      }
    });
    
    // Create character for demo user
    await prisma.character.create({
      data: {
        username: 'DarkSamurai',
        race: 'human',
        class: 'warrior',
        level: 25,
        userId: demoUser.id
      }
    });
    
    // Create some posts
    const posts = [
      {
        content: '血月祭の準備はできましたか？明日から始まります！',
        authorId: demoUser.id
      },
      {
        content: '新しい魔法の森で珍しいアイテムを見つけました。興味がある方はDMしてください。',
        authorId: demoUser.id
      },
      {
        content: '誰か「虚無の王」と戦った人いますか？どうやって倒せばいいか教えてください。',
        authorId: demoUser.id
      },
      {
        content: '新しいギルドを作りました！「月光の剣」です。一緒に冒険しましょう！',
        authorId: demoUser.id
      }
    ];
    
    for (const post of posts) {
      await prisma.post.create({
        data: post
      });
    }
    
    logger.info('Database seeded successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}