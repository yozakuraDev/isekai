// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  discordId?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Character types
export interface Character {
  id: string;
  userId: string;
  username: string;
  race: 'human' | 'oni' | 'fairy' | 'undead';
  class: 'warrior' | 'mage' | 'thief' | 'exorcist';
  level: number;
  createdAt: string;
}

// Forum post types
export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  displayTime?: string;
  likes: number;
  userLiked: string[];
}

// Server status types
export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  event: string;
  uptime: {
    days: number;
    hours: number;
    minutes: number;
  };
}

// World map types
export interface Boss {
  id: number;
  name: string;
  location: string;
  defeated: boolean;
}

export interface WorldMap {
  bosses: Boss[];
  defeatedCount: number;
  totalCount: number;
}

// Rankings types
export interface HyakkiRanking {
  rank: number;
  player: string;
  defeats: number;
}

export interface PvPRanking {
  rank: number;
  player: string;
  kills: number;
}

export interface Rankings {
  hyakkiRanking: HyakkiRanking[];
  pvpRanking: PvPRanking[];
}

// User profile
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  discordId: string | null;
  createdAt: string;
  characters: Character[];
  posts: Post[];
}