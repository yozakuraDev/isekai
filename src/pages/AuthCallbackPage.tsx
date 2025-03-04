import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoggedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('No authentication token received');
          setLoading(false);
          return;
        }
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Fetch user data
        const userData = await authAPI.getCurrentUser(token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        
        // Show success animation
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    
    if (!isLoggedIn) {
      handleAuthCallback();
    } else {
      navigate('/');
    }
  }, [location, navigate, isLoggedIn]);

  if (loading) {
    return (
      <div className="content-container flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="magic-circle-large mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">認証中...</h2>
          <p className="text-gray-300">Discordアカウントと接続しています</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="content-container flex justify-center items-center min-h-[80vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-red-900 bg-opacity-70 p-8 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">認証エラー</h2>
          <p className="text-gray-200 mb-6">{error}</p>
          <button 
            className="bg-purple-700 text-white px-6 py-2 rounded-md"
            onClick={() => navigate('/login')}
          >
            ログインページに戻る
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="content-container flex justify-center items-center min-h-[80vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <div className="success-animation mb-6">
          <div className="checkmark"></div>
        </div>
        <h2 className="text-2xl font-bold text-green-400 mb-4">認証成功！</h2>
        <p className="text-gray-300">百鬼異世界へようこそ</p>
      </div>
      
      <style jsx>{`
        .magic-circle-large {
          width: 150px;
          height: 150px;
          background-image: url('https://i.imgur.com/JlOBUKj.gif');
          background-size: contain;
          background-repeat: no-repeat;
          animation: rotate 3s linear infinite;
        }
        
        .success-animation {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          position: relative;
        }
        
        .checkmark {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #4bb71b;
          stroke-miterlimit: 10;
          box-shadow: 0 0 20px #4bb71b;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
          position: relative;
          top: 5px;
          right: 5px;
          margin: 0 auto;
        }
        
        .checkmark:before {
          content: '';
          width: 3px;
          height: 30px;
          background-color: #4bb71b;
          position: absolute;
          left: 27px;
          top: 50px;
          transform: rotate(45deg);
        }
        
        .checkmark:after {
          content: '';
          width: 3px;
          height: 60px;
          background-color: #4bb71b;
          position: absolute;
          left: 56px;
          top: 35px;
          transform: rotate(-45deg);
        }
        
        @keyframes fill {
          100% {
            box-shadow: 0 0 30px #4bb71b;
          }
        }
        
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default AuthCallbackPage;