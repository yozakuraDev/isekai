# 百鬼異世界 (Hyakki Isekai) API

A production-ready backend for the Hyakki Isekai game portal built with Node.js, Express, Prisma, and SQLite.

## Technologies Used

- **Node.js with TypeScript**: For type-safe server-side JavaScript
- **Express.js**: Lightweight web framework for building APIs
- **Prisma**: Modern ORM for database access
- **SQLite**: Embedded database for data storage
- **JWT**: For token-based authentication
- **Redis**: For session management and caching
- **Multer**: For handling file uploads
- **Passport.js**: For OAuth2 authentication (Discord)
- **Winston**: For logging
- **Zod**: For request validation
- **Docker**: For containerization and deployment

## Features

- User authentication (JWT and Discord OAuth)
- Character management
- Forum posts with likes
- Server status tracking
- World map with boss locations
- Player rankings
- File uploads for avatars
- Comprehensive error handling and logging
- Production-ready Docker setup

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Redis (optional for development, required for production)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env` and update the values as needed.

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Seed the database:

```bash
npx prisma db seed
```

### Development

Start the development server:

```bash
npm run server:dev
```

### Production

Build the application:

```bash
npm run build
npm run server:build
```

Start the production server:

```bash
npm run server:prod
```

### Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose up -d
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/discord` - Authenticate with Discord
- `GET /api/auth/discord/callback` - Discord OAuth callback
- `GET /api/auth/user` - Get current user
- `GET /api/auth/logout` - Logout

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar

### Characters

- `POST /api/characters` - Create a new character
- `GET /api/characters` - Get user's characters
- `GET /api/characters/:id` - Get a specific character
- `PUT /api/characters/:id` - Update a character
- `DELETE /api/characters/:id` - Delete a character

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/:id/like` - Like/unlike a post
- `DELETE /api/posts/:id` - Delete a post

### Server Status

- `GET /api/server-status` - Get server status
- `PUT /api/server-status` - Update server status (admin only)

### World Map

- `GET /api/world-map` - Get world map and bosses
- `PUT /api/world-map/boss/:id` - Update boss status (admin only)

### Rankings

- `GET /api/rankings` - Get rankings
- `PUT /api/rankings/:type/:rank` - Update ranking (admin only)

## License

This project is licensed under the MIT License - see the LICENSE file for details.# isekai
#   i s e k a i  
 