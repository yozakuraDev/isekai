import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Sword, Wand2, Skull, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CharacterRegistrationPage: React.FC = () => {
  const { language } = useLanguage();
  const { isLoggedIn, createCharacter, character, loading } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [selectedRace, setSelectedRace] = useState<'human' | 'oni' | 'fairy' | 'undead' | null>(null);
  const [selectedClass, setSelectedClass] = useState<'warrior' | 'mage' | 'thief' | 'exorcist' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Redirect to home if already has a character
  useEffect(() => {
    if (character) {
      navigate('/');
    }
  }, [character, navigate]);

  const translations = {
    characterRegistration: {
      ja: 'キャラクター登録',
      en: 'Character Registration',
      ko: '캐릭터 등록',
      ar: 'تسجيل الشخصية'
    },
    enterUsername: {
      ja: 'ユーザー名を入力',
      en: 'Enter Username',
      ko: '사용자 이름 입력',
      ar: 'أدخل اسم المستخدم'
    },
    selectRace: {
      ja: '種族を選択',
      en: 'Select Race',
      ko: '종족 선택',
      ar: 'اختر العرق'
    },
    selectClass: {
      ja: '職業を選択',
      en: 'Select Class',
      ko: '직업 선택',
      ar: 'اختر الفئة'
    },
    human: {
      ja: '人間',
      en: 'Human',
      ko: '인간',
      ar: 'إنسان'
    },
    oni: {
      ja: '鬼',
      en: 'Oni',
      ko: '오니',
      ar: 'أوني'
    },
    fairy: {
      ja: '妖精',
      en: 'Fairy',
      ko: '요정',
      ar: 'جنية'
    },
    undead: {
      ja: 'アンデッド',
      en: 'Undead',
      ko: '언데드',
      ar: 'غير ميت'
    },
    warrior: {
      ja: '戦士',
      en: 'Warrior',
      ko: '전사',
      ar: 'محارب'
    },
    mage: {
      ja: '魔導士',
      en: 'Mage',
      ko: '마법사',
      ar: 'ساحر'
    },
    thief: {
      ja: '盗賊',
      en: 'Thief',
      ko: '도적',
      ar: 'لص'
    },
    exorcist: {
      ja: '祓魔師',
      en: 'Exorcist',
      ko: '퇴마사',
      ar: 'طارد الأرواح'
    },
    register: {
      ja: '登録',
      en: 'Register',
      ko: '등록',
      ar: 'تسجيل'
    },
    formContract: {
      ja: '契約を結ぶ',
      en: 'Form Contract',
      ko: '계약 체결',
      ar: 'تشكيل العقد'
    },
    raceDescription: {
      human: {
        ja: '適応力が高く、あらゆる職業に適している。特殊 能力はないが、経験値獲得量が10%増加。',
        en: 'Highly adaptable and suitable for any class. No special abilities, but experience gain is increased by 10%.',
        ko: '적응력이 높고 모든 직업에 적합합니다. 특수 능력은 없지만 경험치 획득량이 10% 증가합니다.',
        ar: 'قابل للتكيف بدرجة عالية ومناسب لأي فئة. لا توجد قدرات خاصة، ولكن اكتساب الخبرة يزداد بنسبة 10٪.'
      },
      oni: {
        ja: '強靭な肉体を持ち、物理攻撃に強い。夜間に攻撃力が25%上昇するが、昼間は5%低下する。',
        en: 'Has a robust physique and strong against physical attacks. Attack power increases by 25% at night but decreases by 5% during the day.',
        ko: '강인한 육체를 가지고 물리 공격에 강합니다. 밤에는 공격력이 25% 증가하지만 낮에는 5% 감소합니다.',
        ar: 'يتمتع ببنية قوية وقوي ضد الهجمات الجسدية. تزداد قوة الهجوم بنسبة 25٪ في الليل ولكنها تنخفض بنسبة 5٪ خلال النهار.'
      },
      fairy: {
        ja: '魔法親和性が高く、MPの自然回復速度が速い。物理防御は低いが、魔法攻撃に対する耐性がある。',
        en: 'High magic affinity and fast MP natural recovery rate. Low physical defense but resistant to magical attacks.',
        ko: '마법 친화성이 높고 MP 자연 회복 속도가 빠릅니다. 물리 방어력은 낮지만 마법 공격에 대한 저항력이 있습니다.',
        ar: 'تقارب سحري عالي ومعدل استرداد طبيعي سريع للطاقة السحرية. دفاع جسدي منخفض ولكن مقاوم للهجمات السحرية.'
      },
      undead: {
        ja: '不死の肉体を持ち、毒や病気に完全耐性がある。回復魔法の効果が半減するが、暗黒魔法の威力が増加。',
        en: 'Has an immortal body with complete immunity to poison and disease. Healing magic effects are halved, but dark magic power is increased.',
        ko: '불사의 육체를 가지고 독과 질병에 완전 내성이 있습니다. 회복 마법의 효과가 절반으로 줄어들지만 암흑 마법의 위력이 증가합니다.',
        ar: 'يمتلك جسدًا خالدًا مع حصانة كاملة ضد السم والمرض. تأثيرات السحر الشفائي تنخفض إلى النصف، لكن قوة السحر المظلم تزداد.'
      }
    },
    classDescription: {
      warrior: {
        ja: '近接戦闘のスペシャリスト。高い防御力と攻撃力を持つが、魔法の使用は限られている。',
        en: 'Specialist in close combat. Has high defense and attack power but limited use of magic.',
        ko: '근접 전투 전문가. 높은 방어력과 공격력을 가지고 있지만 마법 사용이 제한적입니다.',
        ar: 'متخصص في القتال عن قرب. يتمتع بقوة دفاع وهجوم عالية ولكن استخدام السحر محدود.'
      },
      mage: {
        ja: '強力な魔法を操る魔導士。遠距離攻撃に優れるが、物理防御が低い。',
        en: 'Mage who controls powerful magic. Excels at ranged attacks but has low physical defense.',
        ko: '강력한 마법을 다루는 마법사. 원거리 공격에 뛰어나지만 물리 방어력이 낮습니다.',
        ar: 'ساحر يتحكم في السحر القوي. يتفوق في الهجمات عن بعد ولكن لديه دفاع جسدي منخفض.'
      },
      thief: {
        ja: '素早さと隠密行動に長けている。クリティカル率が高く、レア素材の発見率も上昇。',
        en: 'Skilled in speed and stealth. High critical rate and increased chance of finding rare materials.',
        ko: '속도와 은밀 행동에 능숙합니다. 크리티컬 확률이 높고 희귀 재료 발견 확률도 증가합니다.',
        ar: 'ماهر في السرعة والتخفي. معدل حرج مرتفع وزيادة فرصة العثور على مواد نادرة.'
      },
      exorcist: {
        ja: '百鬼に対して特化した戦闘能力を持つ。百鬼への攻撃力が30%上昇し、特殊な封印魔法を使用可能。',
        en: 'Has combat abilities specialized against Hyakki. Attack power against Hyakki increases by 30%, and can use special sealing magic.',
        ko: '백귀에 대해 특화된 전투 능력을 가집니다. 백귀에 대한 공격력이 30% 증가하고 특수한 봉인 마법을 사용할 수 있습니다.',
        ar: 'لديه قدرات قتالية متخصصة ضد هياكي. تزداد قوة الهجوم ضد هياكي بنسبة 30٪، ويمكنه استخدام سحر الختم الخاص.'
      }
    },
    usernameRequired: {
      ja: 'ユーザー名を入力してください',
      en: 'Please enter a username',
      ko: '사용자 이름을 입력하세요',
      ar: 'الرجاء إدخال اسم المستخدم'
    },
    raceRequired: {
      ja: '種族を選択してください',
      en: 'Please select a race',
      ko: '종족을 선택하세요',
      ar: 'الرجاء اختيار العرق'
    },
    classRequired: {
      ja: '職業を選択してください',
      en: 'Please select a class',
      ko: '직업을 선택하세요',
      ar: 'الرجاء اختيار الفئة'
    },
    registrationComplete: {
      ja: '登録完了！',
      en: 'Registration Complete!',
      ko: '등록 완료!',
      ar: 'اكتمل التسجيل!'
    },
    welcomeMessage: {
      ja: '百鬼異世界へようこそ、',
      en: 'Welcome to Hyakki Isekai, ',
      ko: '백귀이세계에 오신 것을 환영합니다, ',
      ar: 'مرحبًا بك في هياكي إيسيكاي، '
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      alert(translations.usernameRequired[language as keyof typeof translations.usernameRequired]);
      return;
    }
    
    if (!selectedRace) {
      alert(translations.raceRequired[language as keyof typeof translations.raceRequired]);
      return;
    }
    
    if (!selectedClass) {
      alert(translations.classRequired[language as keyof typeof translations.classRequired]);
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedRace || !selectedClass) return;
    
    setIsRegistering(true);
    
    try {
      await createCharacter(username, selectedRace, selectedClass);
      
      // Add lightning effect
      const lightning = document.createElement('div');
      lightning.className = 'lightning-effect';
      document.body.appendChild(lightning);
      
      setTimeout(() => {
        lightning.remove();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Character registration error:', error);
      setIsRegistering(false);
      setShowConfirmation(false);
    }
  };

  const getRaceIcon = (race: string) => {
    switch (race) {
      case 'human':
        return <User className="w-6 h-6" />;
      case 'oni':
        return <Sword className="w-6 h-6" />;
      case 'fairy':
        return <Sparkles className="w-6 h-6" />;
      case 'undead':
        return <Skull className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case 'warrior':
        return <Sword className="w-6 h-6" />;
      case 'mage':
        return <Wand2 className="w-6 h-6" />;
      case 'thief':
        return <User className="w-6 h-6" />;
      case 'exorcist':
        return <Sparkles className="w-6 h-6" />;
      default:
        return null;
    }
  };

  if (loading || !isLoggedIn) {
    return (
      <div className="content-container flex justify-center items-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="content-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        {translations.characterRegistration[language as keyof typeof translations.characterRegistration]}
      </h1>
      
      {!showConfirmation ? (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg">
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                {translations.enterUsername[language as keyof typeof translations.enterUsername]}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full"
                maxLength={20}
              />
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl text-purple-300 mb-4">
                {translations.selectRace[language as keyof typeof translations.selectRace]}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['human', 'oni', 'fairy', 'undead'] as const).map((race) => (
                  <motion.div
                    key={race}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedRace === race ? 'bg-purple-900 border-2 border-purple-500' : 'bg-gray-800 border-2 border-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedRace(race)}
                  >
                    <div className="flex items-center mb-2">
                      {getRaceIcon(race)}
                      <h4 className="text-lg font-medium ml-2">
                        {translations[race][language as keyof typeof translations.human]}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      {translations.raceDescription[race][language as keyof typeof translations.raceDescription.human]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl text-purple-300 mb-4">
                {translations.selectClass[language as keyof typeof translations.selectClass]}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['warrior', 'mage', 'thief', 'exorcist'] as const).map((characterClass) => (
                  <motion.div
                    key={characterClass}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedClass === characterClass ? 'bg-purple-900 border-2 border-purple-500' : 'bg-gray-800 border-2 border-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedClass(characterClass)}
                  >
                    <div className="flex items-center mb-2">
                      {getClassIcon(characterClass)}
                      <h4 className="text-lg font-medium ml-2">
                        {translations[characterClass][language as keyof typeof translations.warrior]}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      {translations.classDescription[characterClass][language as keyof typeof translations.classDescription.warrior]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                type="submit"
                className="magic-btn bg-purple-900 text-white px-8 py-4 rounded-md text-xl font-bold border-2 border-purple-500 hover:bg-purple-800 transition-all duration-300 shadow-lg shadow-purple-900/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations.register[language as keyof typeof translations.register]}
              </motion.button>
            </div>
          </form>
        </div>
      ) : (
        <motion.div 
          className="max-w-2xl mx-auto bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="character-preview mb-8">
            <div className="w-32 h-32 mx-auto bg-purple-800 rounded-full flex items-center justify-center mb-4 border-4 border-purple-500">
              {selectedRace && getRaceIcon(selectedRace)}
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{username}</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="bg-purple-900 px-3 py-1 rounded-full text-sm flex items-center">
                {selectedRace && getRaceIcon(selectedRace)}
                <span className="ml-1">
                  {selectedRace && translations[selectedRace][language as keyof typeof translations.human]}
                </span>
              </div>
              <div className="bg-purple-900 px-3 py-1 rounded-full text-sm flex items-center">
                {selectedClass && getClassIcon(selectedClass)}
                <span className="ml-1">
                  {selectedClass && translations[selectedClass][language as keyof typeof translations.warrior]}
                </span>
              </div>
            </div>
          </div>
          
          {!isRegistering ? (
            <motion.button
              className="magic-btn bg-purple-900 text-white px-8 py-4 rounded-md text-xl font-bold border-2 border-purple-500 hover:bg-purple-800 transition-all duration-300 shadow-lg shadow-purple-900/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
            >
              {translations.formContract[language as keyof typeof translations.formContract]}
            </motion.button>
          ) : (
            <div className="registering-animation">
              <div className="magic-circle-large"></div>
              <p className="text-xl mt-4 text-purple-300">
                {translations.welcomeMessage[language as keyof typeof translations.welcomeMessage]}
                <span className="font-bold text-white">{username}</span>
              </p>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Race-specific animations */}
      {selectedRace === 'oni' && (
        <div className="oni-aura"></div>
      )}
      
      {selectedRace === 'fairy' && (
        <div className="fairy-sparkles"></div>
      )}
      
      {selectedRace === 'undead' && (
        <div className="undead-mist"></div>
      )}
      
      <style jsx>{`
        .oni-aura {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
          z-index: -1;
          animation: pulse 3s infinite;
        }
        
        .fairy-sparkles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background-image: url('https://i.imgur.com/JlOBUKj.gif');
          background-size: cover;
          opacity: 0.1;
          z-index: -1;
        }
        
        .undead-mist {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30%;
          pointer-events: none;
          background: linear-gradient(to top, rgba(0, 255, 0, 0.1), transparent);
          z-index: -1;
        }
        
        .magic-circle-large {
          width: 150px;
          height: 150px;
          margin: 0 auto;
          background-image: url('https://i.imgur.com/JlOBUKj.gif');
          background-size: contain;
          background-repeat: no-repeat;
          animation: rotate 3s linear infinite;
        }
        
        .lightning-effect {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: white;
          opacity: 0;
          pointer-events: none;
          z-index: 9999;
          animation: lightning 2s ease-out;
        }
        
        @keyframes lightning {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          15% { opacity: 0.2; }
          20% { opacity: 0.9; }
          25% { opacity: 0.3; }
          30% { opacity: 0.7; }
          100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0% { opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { opacity: 0.1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default CharacterRegistrationPage;