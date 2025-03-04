import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authAPI, characterAPI } from '../api';
import { User, Character } from '../types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  character: Character | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createCharacter: (username: string, race: string, characterClass: string) => Promise<void>;
  fetchUserCharacter: () => Promise<void>;
  loginWithDiscord: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedCharacter = localStorage.getItem('character');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      
      if (storedCharacter) {
        setCharacter(JSON.parse(storedCharacter));
      }
    }
  }, []);
  
  // Fetch user data if we have a token but no user
  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !user) {
        try {
          setLoading(true);
          const response = await authAPI.getCurrentUser(storedToken);
          setUser(response.user);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(username, email, password);
      
      setUser(response.user);
      setToken(response.token);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(email, password);
      
      setUser(response.user);
      setToken(response.token);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      // Fetch user's character if they have one
      await fetchUserCharacter();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithDiscord = () => {
    // Get the API URL from environment variables
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    // Use the production URL for Discord auth
    const discordAuthUrl = `https://api.yukkurinet.com/api/auth/discord`;
    
    // Redirect to Discord OAuth
    window.location.href = discordAuthUrl;
  };
  
  const logout = () => {
    // Call logout API if needed
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    fetch(`${apiUrl.replace('/api', '')}/api/auth/logout`, {
      credentials: 'include'
    }).catch(err => console.error('Logout error:', err));
    
    setUser(null);
    setToken(null);
    setCharacter(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('character');
  };
  
  const createCharacter = async (username: string, race: string, characterClass: string) => {
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await characterAPI.createCharacter(token, username, race, characterClass);
      
      setCharacter(response.character);
      
      // Save to localStorage
      localStorage.setItem('character', JSON.stringify(response.character));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserCharacter = async () => {
    if (!token) return;
    
    setLoading(true);
    
    try {
      const characters = await characterAPI.getUserCharacters(token);
      
      if (characters.length > 0) {
        setCharacter(characters[0]); // Use the first character
        localStorage.setItem('character', JSON.stringify(characters[0]));
      }
    } catch (err) {
      console.error('Error fetching character:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        character,
        isLoggedIn: !!user && !!token,
        loading,
        error,
        register,
        login,
        logout,
        createCharacter,
        fetchUserCharacter,
        loginWithDiscord
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};