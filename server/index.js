import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'hyakki_isekai_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
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

// In-memory database (replace with a real database in production)
const db = {
  users: [],
  characters: [],
  posts: [
    {
      id: '1',
      author: 'DarkSamurai',
      content: '血月祭の準備はできましたか？明日から始まります！',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      userLiked: []
    },
    {
      id: '2',
      author: 'MagicMaster99',
      content: '新しい魔法の森で珍しいアイテムを見つけました。興味がある方はDMしてください。',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      userLiked: []
    },
    {
      id: '3',
      author: 'ShadowHunter',
      content: '誰か「虚無の王」と戦った人いますか？どうやって倒せばいいか教えてください。',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 23,
      userLiked: []
    },
    {
      id: '4',
      author: 'NinjaWarrior',
      content: '新しいギルドを作りました！「月光の剣」です。一緒に冒険しましょう！',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 42,
      userLiked: []
    }
  ],
  serverStatus: {
    online: true,
    players: 42,
    maxPlayers: 100,
    event: 'blood_moon_festival',
    uptime: {
      days: 124,
      hours: 7,
      minutes: 32
    }
  },
  bosses: [
    { id: 1, name: '炎の守護者', location: '溶岩洞窟', defeated: true },
    { id: 2, name: '森の古老', location: '魔法の森', defeated: false },
    { id: 3, name: '深海の王', location: '沈没船', defeated: true },
    { id: 4, name: '虚無の王', location: '異界の門', defeated: false },
    { id: 5, name: '砂漠の幻影', location: '古代神殿', defeated: true }
  ],
  hyakkiRanking: [
    { rank: 1, player: 'DarkSamurai', defeats: 247 },
    { rank: 2, player: 'MagicMaster99', defeats: 213 },
    { rank: 3, player: 'NinjaWarrior', defeats: 189 },
    { rank: 4, player: 'ShadowHunter', defeats: 176 },
    { rank: 5, player: 'DragonSlayer', defeats: 154 }
  ],
  pvpRanking: [
    { rank: 1, player: 'BloodMoon', kills: 532 },
    { rank: 2, player: 'SilentAssassin', kills: 487 },
    { rank: 3, player: 'VoidWalker', kills: 421 },
    { rank: 4, player: 'ThunderBlade', kills: 398 },
    { rank: 5, player: 'FrostQueen', kills: 356 }
  ]
};

// JWT Secret (use a strong secret in production)
const JWT_SECRET = process.env.JWT_SECRET || 'hyakki_isekai_secret_key';

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = db.users.find(user => user.id === id);
  done(null, user || null);
});

// Discord Strategy
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = db.users.find(user => user.discordId === profile.id);
    
    if (!user) {
      // Create new user
      user = {
        id: uuidv4(),
        discordId: profile.id,
        username: profile.username,
        email: profile.email,
        avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        createdAt: new Date().toISOString()
      };
      
      db.users.push(user);
    } else {
      // Update user information in case it changed on Discord
      user.username = profile.username;
      user.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
      user.email = profile.email;
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Discord authentication error:', error);
    return done(error, null);
  }
}));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to 百鬼異世界 API',
    version: '1.0.0',
    endpoints: [
      '/api/server-status',
      '/api/world-map',
      '/api/rankings',
      '/api/register',
      '/api/login',
      '/api/auth/discord',
      '/api/characters',
      '/api/posts'
    ]
  });
});

// Server status
app.get('/api/server-status', (req, res) => {
  // Simulate some dynamic changes
  db.serverStatus.players = Math.floor(Math.random() * 20) + 30; // Random between 30-50
  res.json(db.serverStatus);
});

// World map and bosses
app.get('/api/world-map', (req, res) => {
  res.json({
    bosses: db.bosses,
    defeatedCount: db.bosses.filter(boss => boss.defeated).length,
    totalCount: db.bosses.length
  });
});

// Rankings
app.get('/api/rankings', (req, res) => {
  res.json({
    hyakkiRanking: db.hyakkiRanking,
    pvpRanking: db.pvpRanking
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    if (db.users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = db.users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Discord authentication routes
app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { id: req.user.id, username: req.user.username }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Redirect to the frontend with the token
      const redirectUrl = isProduction 
        ? `https://yukkurinet.com/auth-callback?token=${token}`
        : `http://localhost:5173/auth-callback?token=${token}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Discord callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// Get current user
app.get('/api/auth/user', authenticateToken, (req, res) => {
  const user = db.users.find(user => user.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      discordId: user.discordId
    }
  });
});

// Logout
app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Character registration
app.post('/api/characters', authenticateToken, (req, res) => {
  try {
    const { username, race, characterClass } = req.body;
    
    // Create new character
    const newCharacter = {
      id: uuidv4(),
      userId: req.user.id,
      username,
      race,
      class: characterClass,
      level: 1,
      createdAt: new Date().toISOString()
    };
    
    db.characters.push(newCharacter);
    
    res.status(201).json({
      message: 'Character created successfully',
      character: newCharacter
    });
  } catch (error) {
    console.error('Character creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's characters
app.get('/api/characters', authenticateToken, (req, res) => {
  const userCharacters = db.characters.filter(char => char.userId === req.user.id);
  res.json(userCharacters);
});

// Forum posts
app.get('/api/posts', (req, res) => {
  // Format timestamps for client display
  const formattedPosts = db.posts.map(post => {
    const postDate = new Date(post.timestamp);
    const now = new Date();
    const diffMs = now - postDate;
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
  
  res.json(formattedPosts);
});

// Create new post
app.post('/api/posts', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    
    const newPost = {
      id: uuidv4(),
      author: req.user.username,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      userLiked: []
    };
    
    db.posts.unshift(newPost); // Add to beginning of array
    
    // Format timestamp for display
    const displayTime = 'たった今'; // Just now
    
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...newPost,
        displayTime
      }
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike a post
app.post('/api/posts/:id/like', authenticateToken, (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    const post = db.posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userLikedIndex = post.userLiked.indexOf(userId);
    
    if (userLikedIndex === -1) {
      // User hasn't liked the post yet
      post.userLiked.push(userId);
      post.likes++;
    } else {
      // User already liked the post, so unlike
      post.userLiked.splice(userLikedIndex, 1);
      post.likes--;
    }
    
    res.json({
      message: userLikedIndex === -1 ? 'Post liked' : 'Post unliked',
      likes: post.likes,
      userLiked: post.userLiked.includes(userId)
    });
  } catch (error) {
    console.error('Post like error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User profile
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    const user = db.users.find(user => user.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's characters
    const characters = db.characters.filter(char => char.userId === user.id);
    
    // Get user's posts
    const posts = db.posts.filter(post => post.author === user.username);
    
    res.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null,
        discordId: user.discordId || null,
        createdAt: user.createdAt,
        characters,
        posts
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    
    const user = db.users.find(user => user.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update basic info
    if (username) user.username = username;
    if (email) user.email = email;
    
    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files in production
if (isProduction) {
  const staticPath = path.join(__dirname, '../dist');
  app.use(express.static(staticPath));
  
  // For any other routes, serve the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
});

export default app;