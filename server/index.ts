import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger.js';
import { setupPassport } from './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import characterRoutes from './routes/character.routes.js';
import postRoutes from './routes/post.routes.js';
import serverRoutes from './routes/server.routes.js';
import worldRoutes from './routes/world.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import { seedDatabase } from './utils/seed.js';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma client
export const prisma = new PrismaClient();

// Initialize Redis client
let redisClient;
let redisStore;

try {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  await redisClient.connect();
  redisStore = new RedisStore({ client: redisClient });
  logger.info('Redis client connected');
} catch (err) {
  logger.error('Redis client connection error:', err);
  // Fallback to memory store if Redis is not available
  redisStore = undefined;
}

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Enhanced security in production
if (isProduction) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://i.imgur.com", "https://cdn.discordapp.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.cdnfonts.com"],
        connectSrc: ["'self'", "https://discord.com"]
      }
    }
  }));
  app.use(compression());
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
}

// Cookie parser
app.use(cookieParser());

// Session middleware
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'hyakki_isekai_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

// Middleware
app.use(cors({
  origin: isProduction ? 'https://yukkurinet.com' : 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Setup Passport strategies
setupPassport();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/server-status', serverRoutes);
app.use('/api/world-map', worldRoutes);
app.use('/api/rankings', rankingRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to 百鬼異世界 API',
    version: '1.0.0',
    endpoints: [
      '/api/server-status',
      '/api/world-map',
      '/api/rankings',
      '/api/auth',
      '/api/users',
      '/api/characters',
      '/api/posts'
    ]
  });
});

// Serve static files in production
if (isProduction) {
  const staticPath = path.join(__dirname, '../../dist');
  app.use(express.static(staticPath));
  
  // For any other routes, serve the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Seed the database if needed
    await seedDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  if (redisClient) {
    await redisClient.disconnect();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  if (redisClient) {
    await redisClient.disconnect();
  }
  process.exit(0);
});

// Start the server
startServer();

export default app;