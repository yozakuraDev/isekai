import React, { createContext, useContext, ReactNode, useState } from 'react';
import { serverAPI, worldAPI, rankingsAPI, forumAPI } from '../api';
import { ServerStatus, WorldMap, Rankings, Post } from '../types/api';

interface ApiContextType {
  serverStatus: ServerStatus | null;
  worldMap: WorldMap | null;
  rankings: Rankings | null;
  posts: Post[];
  loading: {
    server: boolean;
    world: boolean;
    rankings: boolean;
    posts: boolean;
  };
  error: {
    server: string | null;
    world: string | null;
    rankings: string | null;
    posts: string | null;
  };
  fetchServerStatus: () => Promise<void>;
  fetchWorldMap: () => Promise<void>;
  fetchRankings: () => Promise<void>;
  fetchPosts: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [worldMap, setWorldMap] = useState<WorldMap | null>(null);
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [loading, setLoading] = useState({
    server: false,
    world: false,
    rankings: false,
    posts: false
  });
  
  const [error, setError] = useState({
    server: null as string | null,
    world: null as string | null,
    rankings: null as string | null,
    posts: null as string | null
  });
  
  const fetchServerStatus = async () => {
    setLoading(prev => ({ ...prev, server: true }));
    setError(prev => ({ ...prev, server: null }));
    
    try {
      const data = await serverAPI.getStatus();
      setServerStatus(data);
    } catch (err) {
      setError(prev => ({ ...prev, server: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, server: false }));
    }
  };
  
  const fetchWorldMap = async () => {
    setLoading(prev => ({ ...prev, world: true }));
    setError(prev => ({ ...prev, world: null }));
    
    try {
      const data = await worldAPI.getWorldMap();
      setWorldMap(data);
    } catch (err) {
      setError(prev => ({ ...prev, world: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, world: false }));
    }
  };
  
  const fetchRankings = async () => {
    setLoading(prev => ({ ...prev, rankings: true }));
    setError(prev => ({ ...prev, rankings: null }));
    
    try {
      const data = await rankingsAPI.getRankings();
      setRankings(data);
    } catch (err) {
      setError(prev => ({ ...prev, rankings: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, rankings: false }));
    }
  };
  
  const fetchPosts = async () => {
    setLoading(prev => ({ ...prev, posts: true }));
    setError(prev => ({ ...prev, posts: null }));
    
    try {
      const data = await forumAPI.getPosts();
      setPosts(data);
    } catch (err) {
      setError(prev => ({ ...prev, posts: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };
  
  return (
    <ApiContext.Provider
      value={{
        serverStatus,
        worldMap,
        rankings,
        posts,
        loading,
        error,
        fetchServerStatus,
        fetchWorldMap,
        fetchRankings,
        fetchPosts
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};