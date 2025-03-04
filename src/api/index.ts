import { Character, Post, ServerStatus, WorldMap, Rankings, UserProfile } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include' // Include cookies for session-based auth
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  
  return response.json();
}

// Auth API
export const authAPI = {
  register: (username: string, email: string, password: string) => 
    apiRequest('/register', 'POST', { username, email, password }),
  
  login: (email: string, password: string) => 
    apiRequest('/login', 'POST', { email, password }),
    
  getCurrentUser: (token: string) =>
    apiRequest('/auth/user', 'GET', undefined, token)
};

// Server Status API
export const serverAPI = {
  getStatus: (): Promise<ServerStatus> => 
    apiRequest('/server-status')
};

// World Map API
export const worldAPI = {
  getWorldMap: (): Promise<WorldMap> => 
    apiRequest('/world-map')
};

// Rankings API
export const rankingsAPI = {
  getRankings: (): Promise<Rankings> => 
    apiRequest('/rankings')
};

// Character API
export const characterAPI = {
  createCharacter: (token: string, username: string, race: string, characterClass: string): Promise<{ character: Character }> => 
    apiRequest('/characters', 'POST', { username, race, characterClass }, token),
  
  getUserCharacters: (token: string): Promise<Character[]> => 
    apiRequest('/characters', 'GET', undefined, token)
};

// Forum API
export const forumAPI = {
  getPosts: (): Promise<Post[]> => 
    apiRequest('/posts'),
  
  createPost: (token: string, content: string): Promise<{ post: Post }> => 
    apiRequest('/posts', 'POST', { content }, token),
  
  likePost: (token: string, postId: string): Promise<{ likes: number, userLiked: boolean }> => 
    apiRequest(`/posts/${postId}/like`, 'POST', {}, token)
};

// Profile API
export const profileAPI = {
  getProfile: (token: string): Promise<{ profile: UserProfile }> =>
    apiRequest('/profile', 'GET', undefined, token),
    
  updateProfile: (token: string, data: { username?: string, email?: string, currentPassword?: string, newPassword?: string }) =>
    apiRequest('/profile', 'PUT', data, token)
};