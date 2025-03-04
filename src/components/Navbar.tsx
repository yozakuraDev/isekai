import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Volume2, VolumeX, Globe, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMuted, setIsMuted, volume, setVolume }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMagicParticles, setShowMagicParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  const { language, setLanguage } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setParticlePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    setShowMagicParticles(true);
  };

  const handleMouseLeave = () => {
    setShowMagicParticles(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Hide menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.navbar') && !target.closest('.mobile-menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const translations = {
    home: {
      ja: 'ホーム',
      en: 'Home',
      ko: '홈',
      ar: 'الرئيسية'
    },
    serverInfo: {
      ja: 'サーバー情報',
      en: 'Server Info',
      ko: '서버 정보',
      ar: 'معلومات الخادم'
    },
    rules: {
      ja: 'ルール',
      en: 'Rules',
      ko: '규칙',
      ar: 'القواعد'
    },
    character: {
      ja: 'キャラクター登録',
      en: 'Character',
      ko: '캐릭터 등록',
      ar: 'تسجيل الشخصية'
    },
    forum: {
      ja: '旅の酒場',
      en: 'Forum',
      ko: '여행자의 술집',
      ar: 'منتدى المسافرين'
    },
    login: {
      ja: 'ログイン',
      en: 'Login',
      ko: '로그인',
      ar: 'تسجيل الدخول'
    },
    logout: {
      ja: 'ログアウト',
      en: 'Logout',
      ko: '로그아웃',
      ar: 'تسجيل الخروج'
    },
    profile: {
      ja: 'プロフィール',
      en: 'Profile',
      ko: '프로필',
      ar: 'الملف الشخصي'
    }
  };

  return (
    <>
      <nav className="navbar fixed top-0 left-0 w-full bg-opacity-80 bg-black backdrop-blur-md z-50 border-b border-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-xl font-bold text-purple-400">百鬼異世界</h1>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4"
                onMouseMove={handleMouseMove}
              >
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {translations.home[language as keyof typeof translations.home]}
                </Link>
                <Link 
                  to="/server-info" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/server-info' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {translations.serverInfo[language as keyof typeof translations.serverInfo]}
                </Link>
                <Link 
                  to="/rules" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/rules' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {translations.rules[language as keyof typeof translations.rules]}
                </Link>
                <Link 
                  to="/character" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/character' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {translations.character[language as keyof typeof translations.character]}
                </Link>
                <Link 
                  to="/forum" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/forum' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {translations.forum[language as keyof typeof translations.forum]}
                </Link>
                
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/profile" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/profile' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <User className="h-4 w-4 inline-block mr-1" />
                      {translations.profile[language as keyof typeof translations.profile]}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {translations.logout[language as keyof typeof translations.logout]}
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/login' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {translations.login[language as keyof typeof translations.login]}
                  </Link>
                )}
                
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-800 focus:outline-none"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      const nextLang = {
                        ja: 'en',
                        en: 'ko',
                        ko: 'ar',
                        ar: 'ja'
                      }[language] as 'ja' | 'en' | 'ko' | 'ar';
                      setLanguage(nextLang);
                    }}
                  >
                    <Globe className="h-5 w-5" />
                    <span className="ml-2">{language.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-800 focus:outline-none"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              
              {!isMuted && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider hidden md:block"
                />
              )}
              
              <div className="md:hidden">
                <button
                  type="button"
                  className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-800 focus:outline-none"
                  onClick={toggleMenu}
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-90">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
            >
              {translations.home[language as keyof typeof translations.home]}
            </Link>
            <Link 
              to="/server-info" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/server-info' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
            >
              {translations.serverInfo[language as keyof typeof translations.serverInfo]}
            </Link>
            <Link 
              to="/rules" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/rules' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
            >
              {translations.rules[language as keyof typeof translations.rules]}
            </Link>
            <Link 
              to="/character" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/character' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
            >
              {translations.character[language as keyof typeof translations.character]}
            </Link>
            <Link 
              to="/forum" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/forum' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
            >
              {translations.forum[language as keyof typeof translations.forum]}
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/profile' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
                >
                  <User className="h-4 w-4 inline-block mr-1" />
                  {translations.profile[language as keyof typeof translations.profile]}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                >
                  {translations.logout[language as keyof typeof translations.logout]}
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/login' ? 'text-white bg-purple-900' : 'text-gray-300 hover:text-white'}`}
              >
                {translations.login[language as keyof typeof translations.login]}
              </Link>
            )}
            
            <div className="flex items-center px-3 py-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white focus:outline-none"
                onClick={() => {
                  const nextLang = {
                    ja: 'en',
                    en: 'ko',
                    ko: 'ar',
                    ar: 'ja'
                  }[language] as 'ja' | 'en' | 'ko' | 'ar';
                  setLanguage(nextLang);
                }}
              >
                <Globe className="h-5 w-5" />
                <span className="ml-2">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Magic particles effect */}
      {showMagicParticles && (
        <div 
          className="magic-particles" 
          style={{ 
            left: `${particlePosition.x - 50}px`, 
            top: `${particlePosition.y - 50}px`,
            opacity: 0.5
          }}
        />
      )}
    </>
  );
};

export default Navbar;