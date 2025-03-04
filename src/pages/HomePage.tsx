import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Sword, Cloud, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApi } from '../contexts/ApiContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { serverStatus, fetchServerStatus, loading } = useApi();
  
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const [showSecretInfo, setShowSecretInfo] = useState(false);

  useEffect(() => {
    // Animate logo after a short delay
    const timer = setTimeout(() => {
      setIsLogoVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch server status
  useEffect(() => {
    fetchServerStatus();
  }, []);

  // Secret command handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTypedCommand('');
        setShowSecretInfo(false);
        return;
      }
      
      if (e.key === 'Backspace') {
        setTypedCommand(prev => prev.slice(0, -1));
        return;
      }
      
      if (e.key.length === 1) {
        setTypedCommand(prev => prev + e.key);
      }
      
      // Check for secret command
      if (typedCommand.includes('hyakki') || typedCommand.includes('百鬼')) {
        setShowSecretInfo(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedCommand]);

  const translations = {
    title: {
      ja: '百鬼異世界',
      en: 'Hyakki Isekai',
      ko: '백귀이세계',
      ar: 'هياكي إيسيكاي'
    },
    subtitle: {
      ja: '異世界サバイバルMinecraftサーバー',
      en: 'Isekai Survival Minecraft Server',
      ko: '이세계 서바이벌 마인크래프트 서버',
      ar: 'خادم ماينكرافت للبقاء على قيد الحياة في عالم آخر'
    },
    startAdventure: {
      ja: '冒険を始める',
      en: 'Start Adventure',
      ko: '모험 시작하기',
      ar: 'ابدأ المغامرة'
    },
    serverStatus: {
      ja: 'サーバーステータス',
      en: 'Server Status',
      ko: '서버 상태',
      ar: 'حالة الخادم'
    },
    online: {
      ja: 'オンライン',
      en: 'Online',
      ko: '온라인',
      ar: 'متصل'
    },
    offline: {
      ja: 'オフライン',
      en: 'Offline',
      ko: '오프라인',
      ar: 'غير متصل'
    },
    players: {
      ja: 'プレイヤー',
      en: 'Players',
      ko: '플레이어',
      ar: 'اللاعبين'
    },
    currentEvent: {
      ja: '現在のイベント',
      en: 'Current Event',
      ko: '현재 이벤트',
      ar: 'الحدث الحالي'
    },
    bloodMoonFestival: {
      ja: '血月祭',
      en: 'Blood Moon Festival',
      ko: '핏빛 달 축제',
      ar: 'مهرجان القمر الدموي'
    },
    secretCommand: {
      ja: '隠しコマンド検出: 百鬼の秘密が明らかに...',
      en: 'Secret Command Detected: Hyakki secrets revealed...',
      ko: '숨겨진 명령 감지: 백귀의 비밀이 드러납니다...',
      ar: 'تم اكتشاف أمر سري: تم الكشف عن أسرار هياكي...'
    },
    secretInfo: {
      ja: '【極秘情報】最強の百鬼「虚無の王」が血月の夜に目覚める。準備せよ。',
      en: '[TOP SECRET] The strongest Hyakki "King of Void" awakens on the night of the blood moon. Be prepared.',
      ko: '[극비 정보] 가장 강력한 백귀 "공허의 왕"이 핏빛 달의 밤에 깨어납니다. 준비하십시오.',
      ar: '[سري للغاية] يستيقظ أقوى هياكي "ملك الفراغ" في ليلة القمر الدموي. كن مستعدا.'
    },
    loading: {
      ja: '読み込み中...',
      en: 'Loading...',
      ko: '로딩 중...',
      ar: 'جار التحميل...'
    }
  };

  const eventTranslations: Record<string, Record<string, string>> = {
    blood_moon_festival: {
      ja: '血月祭',
      en: 'Blood Moon Festival',
      ko: '핏빛 달 축제',
      ar: 'مهرجان القمر الدموي'
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
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isLogoVisible ? 1 : 0.8, 
            opacity: isLogoVisible ? 1 : 0,
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 1,
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }
          }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-purple-400 mb-4 text-shadow">
            {translations.title[language as keyof typeof translations.title]}
          </h1>
          <p className="text-xl md:text-2xl text-purple-200">
            {translations.subtitle[language as keyof typeof translations.subtitle]}
          </p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="magic-btn bg-purple-900 text-white px-8 py-4 rounded-md text-xl font-bold mb-12 border-2 border-purple-500 hover:bg-purple-800 transition-all duration-300 shadow-lg shadow-purple-900/50"
          onClick={() => navigate('/character')}
        >
          {translations.startAdventure[language as keyof typeof translations.startAdventure]}
        </motion.button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {loading.server ? (
            <div className="col-span-3 text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>{translations.loading[language as keyof typeof translations.loading]}</p>
            </div>
          ) : serverStatus && (
            <>
              <motion.div 
                className="card flex flex-col items-center p-6"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(138, 43, 226, 0.4)' }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-xl font-bold">{translations.serverStatus[language as keyof typeof translations.serverStatus]}</h3>
                </div>
                <p className="text-lg mb-2">
                  {serverStatus.online 
                    ? translations.online[language as keyof typeof translations.online]
                    : translations.offline[language as keyof typeof translations.offline]
                  }
                </p>
              </motion.div>
              
              <motion.div 
                className="card flex flex-col items-center p-6"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(138, 43, 226, 0.4)' }}
              >
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  <h3 className="text-xl font-bold">{translations.players[language as keyof typeof translations.players]}</h3>
                </div>
                <p className="text-lg mb-2">{serverStatus.players} / {serverStatus.maxPlayers}</p>
              </motion.div>
              
              <motion.div 
                className="card flex flex-col items-center p-6"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(138, 43, 226, 0.4)' }}
              >
                <div className="flex items-center mb-4">
                  <Sword className="w-5 h-5 mr-2 text-purple-400" />
                  <h3 className="text-xl font-bold">{translations.currentEvent[language as keyof typeof translations.currentEvent]}</h3>
                </div>
                <p className="text-lg mb-2">
                  {eventTranslations[serverStatus.event]?.[language as keyof typeof eventTranslations.blood_moon_festival] || 
                   eventTranslations.blood_moon_festival[language as keyof typeof eventTranslations.blood_moon_festival]}
                </p>
              </motion.div>
            </>
          )}
        </div>
        
        {/* Secret command display */}
        {typedCommand && (
          <div className="fixed bottom-4 left-4 bg-black bg-opacity-70 p-2 rounded text-green-400 font-mono">
            &gt; {typedCommand}
          </div>
        )}
        
        {/* Secret info modal */}
        {showSecretInfo && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-gray-900 border-2 border-purple-600 p-8 rounded-md max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-xl font-bold text-red-400">
                  {translations.secretCommand[language as keyof typeof translations.secretCommand]}
                </h3>
              </div>
              <p className="text-lg mb-6 text-purple-200">
                {translations.secretInfo[language as keyof typeof translations.secretInfo]}
              </p>
              <div className="flex justify-end">
                <button 
                  className="bg-purple-900 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setShowSecretInfo(false);
                    setTypedCommand('');
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HomePage;