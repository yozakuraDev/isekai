import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Map, Activity, Users, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApi } from '../contexts/ApiContext';

const ServerInfoPage: React.FC = () => {
  const { language } = useLanguage();
  const { 
    serverStatus, 
    worldMap, 
    rankings,
    loading, 
    error,
    fetchServerStatus,
    fetchWorldMap,
    fetchRankings
  } = useApi();
  const [activeTab, setActiveTab] = useState('status');

  // Fetch data when component mounts
  useEffect(() => {
    fetchServerStatus();
    fetchWorldMap();
    fetchRankings();
  }, []);

  const translations = {
    serverInfo: {
      ja: 'サーバー情報',
      en: 'Server Information',
      ko: '서버 정보',
      ar: 'معلومات الخادم'
    },
    status: {
      ja: 'ステータス',
      en: 'Status',
      ko: '상태',
      ar: 'الحالة'
    },
    map: {
      ja: 'ワールドマップ',
      en: 'World Map',
      ko: '월드맵',
      ar: 'خريطة العالم'
    },
    rankings: {
      ja: 'ランキング',
      en: 'Rankings',
      ko: '랭킹',
      ar: 'التصنيفات'
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
    uptime: {
      ja: '稼働時間',
      en: 'Uptime',
      ko: '가동 시간',
      ar: 'وقت التشغيل'
    },
    days: {
      ja: '日',
      en: 'days',
      ko: '일',
      ar: 'أيام'
    },
    hours: {
      ja: '時間',
      en: 'hours',
      ko: '시간',
      ar: 'ساعات'
    },
    minutes: {
      ja: '分',
      en: 'minutes',
      ko: '분',
      ar: 'دقائق'
    },
    worldMap: {
      ja: 'ワールドマップ',
      en: 'World Map',
      ko: '월드맵',
      ar: 'خريطة العالم'
    },
    bossLocations: {
      ja: 'ボス出現地点',
      en: 'Boss Locations',
      ko: '보스 출현 지점',
      ar: 'مواقع الزعماء'
    },
    defeatedBosses: {
      ja: '討伐済みボス',
      en: 'Defeated Bosses',
      ko: '처치된 보스',
      ar: 'الزعماء المهزومين'
    },
    hyakkiRanking: {
      ja: '百鬼討伐ランキング',
      en: 'Hyakki Defeat Ranking',
      ko: '백귀 토벌 랭킹',
      ar: 'تصنيف هزيمة هياكي'
    },
    pvpRanking: {
      ja: 'PvPランキング',
      en: 'PvP Ranking',
      ko: 'PvP 랭킹',
      ar: 'تصنيف لاعب ضد لاعب'
    },
    rank: {
      ja: '順位',
      en: 'Rank',
      ko: '순위',
      ar: 'مرتبة'
    },
    player: {
      ja: 'プレイヤー',
      en: 'Player',
      ko: '플레이어',
      ar: 'لاعب'
    },
    defeats: {
      ja: '討伐数',
      en: 'Defeats',
      ko: '처치 수',
      ar: 'الهزائم'
    },
    kills: {
      ja: 'キル数',
      en: 'Kills',
      ko: '킬 수',
      ar: 'عمليات القتل'
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
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        {translations.serverInfo[language as keyof typeof translations.serverInfo]}
      </h1>
      
      <div className="flex justify-center mb-8">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex">
            <button
              className={`px-6 py-3 flex items-center ${activeTab === 'status' ? 'bg-purple-900 text-white' : 'bg-gray-800 text-gray-300'}`}
              onClick={() => setActiveTab('status')}
            >
              <Activity className="w-5 h-5 mr-2" />
              {translations.status[language as keyof typeof translations.status]}
            </button>
            <button
              className={`px-6 py-3 flex items-center ${activeTab === 'map' ? 'bg-purple-900 text-white' : 'bg-gray-800 text-gray-300'}`}
              onClick={() => setActiveTab('map')}
            >
              <Map className="w-5 h-5 mr-2" />
              {translations.map[language as keyof typeof translations.map]}
            </button>
            <button
              className={`px-6 py-3 flex items-center ${activeTab === 'rankings' ? 'bg-purple-900 text-white' : 'bg-gray-800 text-gray-300'}`}
              onClick={() => setActiveTab('rankings')}
            >
              <Trophy className="w-5 h-5 mr-2" />
              {translations.rankings[language as keyof typeof translations.rankings]}
            </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'status' && (
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-300">
              {translations.serverStatus[language as keyof typeof translations.serverStatus]}
            </h2>
            
            <button 
              className="bg-purple-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
              onClick={fetchServerStatus}
              disabled={loading.server}
            >
              {loading.server ? (
                <span className="animate-spin mr-1">⟳</span>
              ) : (
                <span>⟳</span>
              )}
              <span className="ml-1">
                {translations.refresh[language as keyof typeof translations.refresh]}
              </span>
            </button>
          </div>
          
          {loading.server && !serverStatus ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>{translations.loading[language as keyof typeof translations.loading]}</p>
            </div>
          ) : error.server ? (
            <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg text-center">
              <p>{translations.error[language as keyof typeof translations.error]}</p>
              <p className="text-sm mt-2">{error.server}</p>
            </div>
          ) : serverStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-xl font-medium">
                    {serverStatus.online 
                      ? translations.online[language as keyof typeof translations.online]
                      : translations.offline[language as keyof typeof translations.online]
                    }
                  </h3>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  <h3 className="text-xl font-medium">
                    {translations.players[language as keyof typeof translations.players]}
                  </h3>
                </div>
                <p className="text-2xl font-bold">{serverStatus.players} / {serverStatus.maxPlayers}</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 mr-2 text-purple-400" />
                  <h3 className="text-xl font-medium">
                    {translations.currentEvent[language as keyof typeof translations.currentEvent]}
                  </h3>
                </div>
                <p className="text-xl">
                  {eventTranslations[serverStatus.event]?.[language as keyof typeof eventTranslations.blood_moon_festival] || 
                   eventTranslations.blood_moon_festival[language as keyof typeof eventTranslations.blood_moon_festival]}
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  <h3 className="text-xl font-medium">
                    {translations.uptime[language as keyof typeof translations.uptime]}
                  </h3>
                </div>
                <p className="text-xl">
                  {serverStatus.uptime.days} {translations.days[language as keyof typeof translations.days]}{' '}
                  {serverStatus.uptime.hours} {translations.hours[language as keyof typeof translations.hours]}{' '}
                  {serverStatus.uptime.minutes} {translations.minutes[language as keyof typeof translations.minutes]}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {activeTab === 'map' && (
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-300">
              {translations.worldMap[language as keyof typeof translations.worldMap]}
            </h2>
            
            <button 
              className="bg-purple-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
              onClick={fetchWorldMap}
              disabled={loading.world}
            >
              {loading.world ? (
                <span className="animate-spin mr-1">⟳</span>
              ) : (
                <span>⟳</span>
              )}
              <span className="ml-1">
                {translations.refresh[language as keyof typeof translations.refresh]}
              </span>
            </button>
          </div>
          
          {loading.world && !worldMap ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>{translations.loading[language as keyof typeof translations.loading]}</p>
            </div>
          ) : error.world ? (
            <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg text-center">
              <p>{ translations.error[language as keyof typeof translations.error]}</p>
              <p className="text-sm mt-2">{error.world}</p>
            </div>
          ) : worldMap && (
            <>
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80" 
                  alt="World Map" 
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Boss markers */}
                {worldMap.bosses.map((boss, index) => (
                  <div 
                    key={boss.id}
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center ${boss.defeated ? 'bg-green-500' : 'bg-red-500'} bg-opacity-70`}
                    style={{
                      top: `${20 + (index * 15)}%`,
                      left: `${15 + (index * 17)}%`,
                      transform: 'translate(-50%, -50%)',
                      border: '2px solid white'
                    }}
                    title={boss.name}
                  >
                    <span className="text-white font-bold">{boss.id}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-300 mb-4">
                    {translations.bossLocations[language as keyof typeof translations.bossLocations]}
                  </h3>
                  <ul className="space-y-2">
                    {worldMap.bosses.map(boss => (
                      <li key={boss.id} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${boss.defeated ? 'bg-green-500' : 'bg-red-500'} mr-3`}></div>
                        <span className="mr-2">{boss.id}.</span>
                        <span className="font-medium">{boss.name}</span>
                        <span className="mx-2">-</span>
                        <span className="text-gray-300">{boss.location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-purple-300 mb-4">
                    {translations.defeatedBosses[language as keyof typeof translations.defeatedBosses]}
                  </h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-center">
                      {worldMap.defeatedCount} / {worldMap.totalCount}
                    </div>
                    <div className="w-full bg-gray-700 h-4 rounded-full mt-4">
                      <div 
                        className="bg-purple-600 h-4 rounded-full"
                        style={{ width: `${(worldMap.defeatedCount / worldMap.totalCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
      
      {activeTab === 'rankings' && (
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-300">
              {translations.rankings[language as keyof typeof translations.rankings]}
            </h2>
            
            <button 
              className="bg-purple-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
              onClick={fetchRankings}
              disabled={loading.rankings}
            >
              {loading.rankings ? (
                <span className="animate-spin mr-1">⟳</span>
              ) : (
                <span>⟳</span>
              )}
              <span className="ml-1">
                {translations.refresh[language as keyof typeof translations.refresh]}
              </span>
            </button>
          </div>
          
          {loading.rankings && !rankings ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>{translations.loading[language as keyof typeof translations.loading]}</p>
            </div>
          ) : error.rankings ? (
            <div className="bg-red-900 bg-opacity-50 text-white p-4 rounded-lg text-center">
              <p>{translations.error[language as keyof typeof translations.error]}</p>
              <p className="text-sm mt-2">{error.rankings}</p>
            </div>
          ) : rankings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-300 mb-6">
                  {translations.hyakkiRanking[language as keyof typeof translations.hyakkiRanking]}
                </h2>
                
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 text-left">
                        {translations.rank[language as keyof typeof translations.rank]}
                      </th>
                      <th className="py-3 text-left">
                        {translations.player[language as keyof typeof translations.player]}
                      </th>
                      <th className="py-3 text-right">
                        {translations.defeats[language as keyof typeof translations.defeats]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.hyakkiRanking.map((entry) => (
                      <tr key={entry.rank} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3">
                          <div className="flex items-center">
                            {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500 mr-1" />}
                            {entry.rank === 2 && <Trophy className="w-5 h-5 text-gray-400 mr-1" />}
                            {entry.rank === 3 && <Trophy className="w-5 h-5 text-yellow-700 mr-1" />}
                            {entry.rank > 3 && <span className="w-5 h-5 inline-block mr-1">{entry.rank}</span>}
                          </div>
                        </td>
                        <td className="py-3 font-medium">{entry.player}</td>
                        <td className="py-3 text-right font-bold">{entry.defeats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-purple-300 mb-6">
                  {translations.pvpRanking[language as keyof typeof translations.pvpRanking]}
                </h2>
                
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 text-left">
                        {translations.rank[language as keyof typeof translations.rank]}
                      </th>
                      <th className="py-3 text-left">
                        {translations.player[language as keyof typeof translations.player]}
                      </th>
                      <th className="py-3 text-right">
                        {translations.kills[language as keyof typeof translations.kills]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.pvpRanking.map((entry) => (
                      <tr key={entry.rank} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3">
                          <div className="flex items-center">
                            {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500 mr-1" />}
                            {entry.rank === 2 && <Trophy className="w-5 h-5 text-gray-400 mr-1" />}
                            {entry.rank === 3 && <Trophy className="w-5 h-5 text-yellow-700 mr-1" />}
                            {entry.rank > 3 && <span className="w-5 h-5 inline-block mr-1">{entry.rank}</span>}
                          </div>
                        </td>
                        <td className="py-3 font-medium">{entry.player}</td>
                        <td className="py-3 text-right font-bold">{entry.kills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServerInfoPage;