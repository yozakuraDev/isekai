import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle, Mail, Lock, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const { login, register, loading, error, loginWithDiscord } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDoorAnimation, setShowDoorAnimation] = useState(false);

  // Check for token in URL (for Discord auth callback)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token && location.pathname === '/auth-callback') {
      // Store the token
      localStorage.setItem('token', token);
      
      // Show door animation
      setShowDoorAnimation(true);
      
      // Navigate to home after animation
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [location, navigate]);

  const translations = {
    login: {
      ja: 'ログイン',
      en: 'Login',
      ko: '로그인',
      ar: 'تسجيل الدخول'
    },
    register: {
      ja: '登録',
      en: 'Register',
      ko: '등록',
      ar: 'تسجيل'
    },
    username: {
      ja: 'ユーザー名',
      en: 'Username',
      ko: '사용자 이름',
      ar: 'اسم المستخدم'
    },
    email: {
      ja: 'メールアドレス',
      en: 'Email',
      ko: '이메일',
      ar: 'البريد الإلكتروني'
    },
    password: {
      ja: 'パスワード',
      en: 'Password',
      ko: '비밀번호',
      ar: 'كلمة المرور'
    },
    loginWithDiscord: {
      ja: 'Discordでログイン',
      en: 'Login with Discord',
      ko: 'Discord로 로그인',
      ar: 'تسجيل الدخول باستخدام Discord'
    },
    loginFailed: {
      ja: 'ログインに失敗しました。呪われた契約は拒否されました。',
      en: 'Login failed. The cursed contract has been rejected.',
      ko: '로그인에 실패했습니다. 저주받은 계약이 거부되었습니다.',
      ar: 'فشل تسجيل الدخول. تم رفض العقد الملعون.'
    },
    enterUsername: {
      ja: 'ユーザー名を入力してください',
      en: 'Please enter your username',
      ko: '사용자 이름을 입력하세요',
      ar: 'الرجاء إدخال اسم المستخدم الخاص بك'
    },
    enterEmail: {
      ja: 'メールアドレスを入力してください',
      en: 'Please enter your email',
      ko: '이메일을 입력하세요',
      ar: 'الرجاء إدخال البريد الإلكتروني الخاص بك'
    },
    enterPassword: {
      ja: 'パスワードを入力してください',
      en: 'Please enter your password',
      ko: '비밀번호를 입력하세요',
      ar: 'الرجاء إدخال كلمة المرور الخاصة بك'
    },
    noAccount: {
      ja: 'アカウントをお持ちでないですか？',
      en: 'Don\'t have an account?',
      ko: '계정이 없으신가요?',
      ar: 'ليس لديك حساب؟'
    },
    haveAccount: {
      ja: 'すでにアカウントをお持ちですか？',
      en: 'Already have an account?',
      ko: '이미 계정이 있으신가요?',
      ar: 'هل لديك حساب بالفعل؟'
    },
    createAccount: {
      ja: 'アカウントを作成',
      en: 'Create Account',
      ko: '계정 만들기',
      ar: 'إنشاء حساب'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLoginMode) {
        if (!email || !password) {
          return;
        }
        
        await login(email, password);
      } else {
        if (!username || !email || !password) {
          return;
        }
        
        await register(username, email, password);
      }
      
      // Show door animation on success
      setShowDoorAnimation(true);
      
      // Navigate to home after animation
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Authentication error:', err);
    }
  };

  const handleDiscordLogin = () => {
    loginWithDiscord();
  };

  return (
    <motion.div 
      className="content-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center min-h-[80vh]">
        <motion.div 
          className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg max-w-md w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <LogIn className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-purple-400">
              {isLoginMode 
                ? translations.login[language as keyof typeof translations.login]
                : translations.register[language as keyof typeof translations.register]
              }
            </h1>
          </div>
          
          {error && (
            <motion.div 
              className="bg-red-900 bg-opacity-70 text-white p-4 rounded-md mb-6 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label htmlFor="username" className="block text-gray-300 mb-2">
                  {translations.username[language as keyof typeof translations.username]}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full pl-10"
                    placeholder={translations.enterUsername[language as keyof typeof translations.enterUsername]}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">
                {translations.email[language as keyof typeof translations.email]}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full pl-10"
                  placeholder={translations.enterEmail[language as keyof typeof translations.enterEmail]}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2">
                {translations.password[language as keyof typeof translations.password]}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full pl-10"
                  placeholder={translations.enterPassword[language as keyof typeof translations.enterPassword]}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <motion.button
                type="submit"
                className="w-full bg-purple-700 text-white py-3 rounded-md font-bold hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    {isLoginMode 
                      ? translations.login[language as keyof typeof translations.login]
                      : translations.register[language as keyof typeof translations.register]
                    }
                  </>
                )}
              </motion.button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-purple-400 hover:text-purple-300 text-sm"
              onClick={() => setIsLoginMode(!isLoginMode)}
              disabled={loading}
            >
              {isLoginMode 
                ? translations.noAccount[language as keyof typeof translations.noAccount]
                : translations.haveAccount[language as keyof typeof translations.haveAccount]
              }
              {' '}
              <span className="font-bold">
                {isLoginMode 
                  ? translations.createAccount[language as keyof typeof translations.createAccount]
                  : translations.login[language as keyof typeof translations.login]
                }
              </span>
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <motion.button
              className="w-full bg-indigo-700 text-white py-3 rounded-md font-bold hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDiscordLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#ffffff"/>
                  </svg>
                  {translations.loginWithDiscord[language as keyof typeof translations.loginWithDiscord]}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Door opening animation */}
      {showDoorAnimation && (
        <div className="door-animation">
          <div className="door left"></div>
          <div className="door right"></div>
        </div>
      )}
      
      <style jsx="true">{`
        .door-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 100;
          pointer-events: none;
        }
        
        .door {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          background-color: #000;
          transition: transform 2s ease-in-out;
        }
        
        .door.left {
          left: 0;
          transform: translateX(-100%);
          animation: doorLeft 2s forwards;
        }
        
        .door.right {
          right: 0;
          transform: translateX(100%);
          animation: doorRight 2s forwards;
        }
        
        @keyframes doorLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes doorRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};

export default LoginPage;