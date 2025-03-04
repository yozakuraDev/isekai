import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Globe, ThumbsUp, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { forumAPI } from '../api';

const ForumPage: React.FC = () => {
  const { language } = useLanguage();
  const { isLoggedIn, token } = useAuth();
  const { posts, loading, error, fetchPosts } = useApi();
  
  const [newPost, setNewPost] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCheersEffect, setShowCheersEffect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setToastMessage(translations.loginRequired[language as keyof typeof translations.loginRequired]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    if (!newPost.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await forumAPI.createPost(token!, newPost);
      setNewPost('');
      fetchPosts(); // Refresh posts
      
      // Check for special keywords to trigger events
      if (newPost.includes('乾杯') || newPost.includes('cheers') || newPost.includes('건배') || newPost.includes('نخب')) {
        setShowCheersEffect(true);
        setTimeout(() => setShowCheersEffect(false), 3000);
      }
    } catch (error) {
      setToastMessage((error as Error).message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (!isLoggedIn) {
      setToastMessage(translations.loginRequired[language as keyof typeof translations.loginRequired]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    try {
      await forumAPI.likePost(token!, id);
      fetchPosts(); // Refresh posts to get updated likes
    } catch (error) {
      setToastMessage((error as Error).message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const translations = {
    forum: {
      ja: '旅の酒場',
      en: 'Traveler\'s Tavern',
      ko: '여행자의 술집',
      ar: 'حانة المسافر'
    },
    writePost: {
      ja: '投稿を書く...',
      en: 'Write a post...',
      ko: '게시물 작성...',
      ar: 'اكتب منشورًا...'
    },
    post: {
      ja: '投稿',
      en: 'Post',
      ko: '게시',
      ar: 'نشر'
    },
    justNow: {
      ja: 'たった今',
      en: 'Just now',
      ko: '방금',
      ar: 'الآن فقط'
    },
    loginRequired: {
      ja: '投稿するにはログインが必要です',
      en: 'Login required to post',
      ko: '게시하려면 로그인이 필요합니다',
      ar: 'تسجيل الدخول مطلوب للنشر'
    },
    hoursAgo: {
      ja: '時間前',
      en: 'hours ago',
      ko: '시간 전',
      ar: 'منذ ساعات'
    },
    daysAgo: {
      ja: '日前',
      en: 'days ago',
      ko: '일 전',
      ar: 'منذ أيام'
    },
    loading: {
      ja: '読み込み中...',
      en: 'Loading...',
      ko: '로딩 중...',
      ar: 'جار التحميل...'
    },
    error: {
      ja: 'エラーが発生しました',
      en: 'An error occurred',
      ko: '오류가 발생했습니다',
      ar: 'حدث خطأ'
    },
    refresh: {
      ja: '更新',
      en: 'Refresh',
      ko: '새로고침',
      ar: 'تحديث'
    },
    noPosts: {
      ja: '投稿がありません',
      en: 'No posts yet',
      ko: '게시물이 없습니다',
      ar: 'لا توجد منشورات بعد'
    }
  };

  return (
    <motion.div 
      className="content-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-purple-400">
            <MessageSquare className="inline-block mr-3 mb-1" />
            {translations.forum[language as keyof typeof translations.forum]}
          </h1>
          <div className="flex items-center">
            <div className="bg-purple-900 px-3 py-1 rounded-full text-sm flex items-center mr-3">
              <Globe className="w-4 h-4 mr-1" />
              <span>{language.toUpperCase()}</span>
            </div>
            
            <button 
              className="bg-purple-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
              onClick={fetchPosts}
              disabled={loading.posts}
            >
              {loading.posts ? (
                <span className="animate-spin mr-1">⟳</span>
              ) : (
                <span>⟳</span>
              )}
              <span className="ml-1">
                {translations.refresh[language as keyof typeof translations.refresh]}
              </span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-8">
          <form onSubmit={handlePostSubmit} className="flex items-center">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={translations.writePost[language as keyof typeof translations.writePost]}
              className="form-input bg-gray-800 text-white border-purple-700 rounded-md flex-grow mr-4"
              disabled={isSubmitting}
            />
            <motion.button
              type="submit"
              className="bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting || !newPost.trim()}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {translations.post[language as keyof typeof translations.post]}
            </motion.button>
          </form>
        </div>
        
        {loading.posts && posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>{translations.loading[language as keyof typeof translations.loading]}</p>
          </div>
        ) : error.posts ? (
          <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg text-center">
            <p>{translations.error[language as keyof typeof translations.error]}</p>
            <p className="text-sm mt-2">{error.posts}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 bg-gray-900 bg-opacity-80 rounded-lg">
            <p className="text-gray-400">{translations.noPosts[language as keyof typeof translations.noPosts]}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                className="bg-gray-900 bg-opacity-80 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{post.author}</h3>
                    <p className="text-gray-400 text-sm">{post.displayTime || post.timestamp}</p>
                  </div>
                </div>
                
                <p className="mb-4">{post.content}</p>
                
                <div className="flex items-center">
                  <button 
                    className={`flex items-center ${post.userLiked.includes(token || '') ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors duration-200`}
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-red-900 text-white px-4 py-2 rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
      
      {/* Cheers effect */}
      {showCheersEffect && (
        <div className="cheers-effect">
          <div className="beer-mug left"></div>
          <div className="beer-mug right"></div>
          <div className="cheers-text">🍻 CHEERS! 乾杯! 건배! نخب! 🍻</div>
        </div>
      )}
      
      <style jsx>{`
        .cheers-effect {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 100;
        }
        
        .beer-mug {
          position: absolute;
          width: 100px;
          height: 100px;
          background-image: url('https://i.imgur.com/XzMxmvC.gif');
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .beer-mug.left {
          top: 50%;
          left: 30%;
          transform: translateY(-50%);
          animation: moveLeft 3s ease-in-out;
        }
        
        .beer-mug.right {
          top: 50%;
          right: 30%;
          transform: translateY(-50%) scaleX(-1);
          animation: moveRight 3s ease-in-out;
        }
        
        .cheers-text {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 32px;
          font-weight: bold;
          color: gold;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
          opacity: 0;
          animation: fadeInOut 3s ease-in-out;
        }
        
        @keyframes moveLeft {
          0% { left: 20%; }
          50% { left: 40%; }
          100% { left: 20%; }
        }
        
        @keyframes moveRight {
          0% { right: 20%; }
          50% { right: 40%; }
          100% { right: 20%; }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </motion.div>
  );
};

export default ForumPage;