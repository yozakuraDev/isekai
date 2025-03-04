import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';

export const setupPassport = () => {
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      done(null, user);
    } catch (error) {
      logger.error('Error deserializing user:', error);
      done(error, null);
    }
  });

  // Discord Strategy
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    callbackURL: process.env.DISCORD_CALLBACK_URL || '',
    scope: ['identify', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { discordId: profile.id }
      });
      
      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            discordId: profile.id,
            username: profile.username,
            email: profile.email || `${profile.id}@discord.com`,
            avatar: profile.avatar 
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : null
          }
        });
        
        logger.info(`New user created via Discord: ${user.username}`);
      } else {
        // Update user information in case it changed on Discord
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            username: profile.username,
            email: profile.email || user.email,
            avatar: profile.avatar 
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : user.avatar
          }
        });
        
        logger.info(`User updated via Discord: ${user.username}`);
      }
      
      return done(null, user);
    } catch (error) {
      logger.error('Discord authentication error:', error);
      return done(error as Error, undefined);
    }
  }));
};