import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ServerInfoPage from './pages/ServerInfoPage';
import RulesPage from './pages/RulesPage';
import CharacterRegistrationPage from './pages/CharacterRegistrationPage';
import ForumPage from './pages/ForumPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProfilePage from './pages/ProfilePage';
import BackgroundManager from './components/BackgroundManager';
import AudioPlayer from './components/AudioPlayer';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import './styles/App.css';

function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="magic-circle"></div>
          <h1 className="loading-text">百鬼異世界へ接続中...</h1>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <UserProvider>
        <AuthProvider>
          <ApiProvider>
            <Router>
              <div className="app-container">
                <BackgroundManager />
                <AudioPlayer isMuted={isMuted} volume={volume} />
                
                <Navbar 
                  isMuted={isMuted} 
                  setIsMuted={setIsMuted}
                  volume={volume}
                  setVolume={setVolume}
                />
                
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/server-info" element={<ServerInfoPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route path="/character" element={<CharacterRegistrationPage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/auth-callback" element={<AuthCallbackPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </Router>
          </ApiProvider>
        </AuthProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;