import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create server status
  await prisma.serverStatus.upsert({
    where: { id: 1 },
    update: {},
    create: {
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
  const bosses = [
    { id: 1, name: '炎の守護者', location: '溶岩洞窟', defeated: true },
    { id: 2, name: '森の古老', location: '魔法の森', defeated: false },
    { id: 3, name: '深海の王', location: '沈没船', defeated: true },
    { id: 4, name: '虚無の王', location: '異界の門', defeated: false },
    { id: 5, name: '砂漠の幻影', location: '古代神殿', defeated: true }
  ];
  
  for (const boss of bosses) {
    await prisma.boss.upsert({
      where: { id: boss.id },
      update: {},
      create: boss
    });
  }
  
  // Create rankings
  // Hyakki rankings
  const hyakkiRankings = [
    { type: 'hyakki', rank: 1, player: 'DarkSamurai', score: 247 },
    { type: 'hyakki', rank: 2, player: 'MagicMaster99', score: 213 },
    { type: 'hyakki', rank: 3, player: 'NinjaWarrior', score: 189 },
    { type: 'hyakki', rank: 4, player: 'ShadowHunter', score: 176 },
    { type: 'hyakki', rank: 5, player: 'DragonSlayer', score: 154 }
  ];
  
  for (const ranking of hyakkiRankings) {
    await prisma.ranking.upsert({
      where: {
        id: `hyakki-${ranking.rank}`
      },
      update: {},
      create: {
        id: `hyakki-${ranking.rank}`,
        ...ranking
      }
    });
  }
  
  // PvP rankings
  const pvpRankings = [
    { type: 'pvp', rank: 1, player: 'BloodMoon', score: 532 },
    { type: 'pvp', rank: 2, player: 'SilentAssassin', score: 487 },
    { type: 'pvp', rank: 3, player: 'VoidWalker', score: 421 },
    { type: 'pvp', rank: 4, player: 'ThunderBlade', score: 398 },
    { type: 'pvp', rank: 5, player: 'FrostQueen', score: 356 }
  ];
  
  for (const ranking of pvpRankings) {
    await prisma.ranking.upsert({
      where: {
        id: `pvp-${ranking.rank}`
      },
      update: {},
      create: {
        id: `pvp-${ranking.rank}`,
        ...ranking
      }
    });
  }
  
  // Create demo user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'DarkSamurai',
      email: 'demo@example.com',
      password: hashedPassword
    }
  });
  
  // Create character for demo user
  await prisma.character.upsert({
    where: { id: 'demo-character' },
    update: {},
    create: {
      id: 'demo-character',
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
      id: 'post-1',
      content: '血月祭の準備はできましたか？明日から始まります！',
      authorId: demoUser.id
    },
    {
      id: 'post-2',
      content: '新しい魔法の森で珍しいアイテムを見つけました。興味がある方はDMしてください。',
      authorId: demoUser.id
    },
    {
      id: 'post-3',
      content: '誰か「虚無の王」と戦った人いますか？どうやって倒せばいいか教えてください。',
      authorId: demoUser.id
    },
    {
      id: 'post-4',
      content: '新しいギルドを作りました！「月光の剣」です。一緒に冒険しましょう！',
      authorId: demoUser.id
    }
  ];
  
  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: post
    });
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });