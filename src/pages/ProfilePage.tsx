import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Key, Edit2, Save, X, Shield, Sword, Scroll, ThumbsUp, Sparkles, Skull } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../api';
import { UserProfile } from '../types/api';

const ProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const { user, token, isLoggedIn, logout } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'characters' | 'posts'>('profile');

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await profileAPI.getProfile(token!);
        setProfile(response.profile);
        setUsername(response.profile.username);
        setEmail(response.profile.email);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [isLoggedIn, token]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form
      setUsername(profile?.username || '');
      setEmail(profile?.email || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setUpdateError(null);
    }
    
    setIsEditing(!isEditing);
    setUpdateSuccess(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);
    
    // Validate form
    if (newPassword && newPassword !== confirmPassword) {
      setUpdateError(translations.passwordsDoNotMatch[language as keyof typeof translations.passwordsDoNotMatch]);
      return;
    }
    
    if (newPassword && !currentPassword) {
      setUpdateError(translations.currentPasswordRequired[language as keyof typeof translations.currentPasswordRequired]);
      return;
    }
    
    try {
      const updateData: any = {};
      
      if (username !== profile?.username) {
        updateData.username = username;
      }
      
      if (email !== profile?.email) {
        updateData.email = email;
      }
      
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      
      // Only send request if there are changes
      if (Object.keys(updateData).length > 0) {
        await profileAPI.updateProfile(token!, updateData);
        
        // Refresh profile data
        const response = await profileAPI.getProfile(token!);
        setProfile(response.profile);
        
        // Update user in localStorage
        if (user) {
          const updatedUser = {
            ...user,
            username: response.profile.username,
            email: response.profile.email
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        setUpdateSuccess(true);
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      
      setIsEditing(false);
    } catch (err) {
      setUpdateError((err as Error).message);
    }
  };

  const translations = {
    profile: {
      ja: 'プロフィール',
      en: 'Profile',
      ko: '프로필',
      ar: 'الملف الشخصي'
    },
    characters: {
      ja: 'キャラクター',
      en: 'Characters',
      ko: '캐릭터',
      ar: 'الشخصيات'
    },
    posts: {
      ja: '投稿',
      en: 'Posts',
      ko: '게시물',
      ar: 'المنشورات'
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
    currentPassword: {
      ja: '現在のパスワード',
      en: 'Current Password',
      ko: '현재 비밀번호',
      ar: 'كلمة المرور الحالية'
    },
    newPassword: {
      ja: '新しいパスワード',
      en: 'New Password',
      ko: '새 비밀번호',
      ar: 'كلمة المرور الجديدة'
    },
    confirmPassword: {
      ja: 'パスワードを確認',
      en: 'Confirm Password',
      ko: '비밀번호 확인',
      ar: 'تأكيد كلمة المرور'
    },
    edit: {
      ja: '編集',
      en: 'Edit',
      ko: '편집',
      ar: 'تعديل'
    },
    save: {
      ja: '保存',
      en: 'Save',
      ko: '저장',
      ar: 'حفظ'
    },
    cancel: {
      ja: 'キャンセル',
      en: 'Cancel',
      ko: '취소',
      ar: 'إلغاء'
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
    passwordsDoNotMatch: {
      ja: 'パスワードが一致しません',
      en: 'Passwords do not match',
      ko: '비밀번호가 일치하지 않습니다',
      ar: 'كلمات المرور غير متطابقة'
    },
    currentPasswordRequired: {
      ja: '現在のパスワードが必要です',
      en: 'Current password is required',
      ko: '현재 비밀번호가 필요합니다',
      ar: 'كلمة المرور الحالية مطلوبة'
    },
    updateSuccess: {
      ja: 'プロフィールが更新されました',
      en: 'Profile updated successfully',
      ko: '프로필이 성공적으로 업데이트되었습니다',
      ar: 'تم تحديث الملف الشخصي بنجاح'
    },
    memberSince: {
      ja: '登録日',
      en: 'Member since',
      ko: '가입일',
      ar: 'عضو منذ'
    },
    discordLinked: {
      ja: 'Discordアカウントが連携されています',
      en: 'Discord account linked',
      ko: 'Discord 계정이 연결되었습니다',
      ar: 'حساب Discord مرتبط'
    },
    noCharacters: {
      ja: 'キャラクターがありません',
      en: 'No characters yet',
      ko: '아직 캐릭터가 없습니다',
      ar: 'لا توجد شخصيات حتى الآن'
    },
    createCharacter: {
      ja: 'キャラクターを作成',
      en: 'Create Character',
      ko: '캐릭터 생성',
      ar: 'إنشاء شخصية'
    },
    noPosts: {
      ja: '投稿がありません',
      en: 'No posts yet',
      ko: '아직 게시물이 없습니다',
      ar: 'لا توجد منشورات حتى الآن'
    },
    race: {
      ja: '種族',
      en: 'Race',
      ko: '종족',
      ar: 'العرق'
    },
    class: {
      ja: '職業',
      en: 'Class',
      ko: '직업',
      ar: 'الفئة'
    },
    level: {
      ja: 'レベル',
      en: 'Level',
      ko: '레벨',
      ar: 'المستوى'
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
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div 
        className="content-container flex justify-center items-center min-h-[80vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-red-900 bg-opacity-70 p-8 rounded-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {translations.error[language as keyof typeof translations.error]}
          </h2>
          <p className="text-gray-200 mb-6">
            ログインが必要です
          </p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="content-container flex justify-center items-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
          <h2 className="text-2xl font-bold text-white mb-4">
            {translations.error[language as keyof typeof translations.error]}
          </h2>
          <p className="text-gray-200 mb-6">
            {error}
          </p>
        </div>
      </motion.div>
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
        {translations.profile[language as keyof typeof translations.profile]}
      </h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Profile tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex">
              <button
                className={`px-6 py-3 flex items-center ${activeTab === 'profile' ? 'bg-purple-900 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="w-5 h-5 mr-2" />
                {translations.profile[language as keyof typeof translations.profile]}
              </button>
              <button
                className={`px-6 py-3 flex items-center ${activeTab === 'characters' ? 'bg-purple-900 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setActiveTab('characters')}
              >
                <Shield className="w-5 h-5 mr-2" />
                {translations.characters[language as keyof typeof translations.characters]}
              </button>
              <button
                className={`px-6 py-3 flex items-center ${activeTab === 'posts' ? 'bg-purple-900 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setActiveTab('posts')}
              >
                <Scroll className="w-5 h-5 mr-2" />
                {translations.posts[language as keyof typeof translations.posts]}
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile tab content */}
        {activeTab === 'profile' && (
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg">
            {updateSuccess && (
              <div className="bg-green-900 bg-opacity-70 text-white p-4 rounded-md mb-6">
                {translations.updateSuccess[language as keyof typeof translations.updateSuccess]}
              </div>
            )}
            
            {updateError && (
              <div className="bg-red-900 bg-opacity-70 text-white p-4 rounded-md mb-6">
                {updateError}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and basic info */}
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">{profile?.username}</h2>
                  
                  {profile?.discordId && (
                    <div className="bg-indigo-900 px-3 py-1 rounded-full text-sm flex items-center mb-4">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#ffffff"/>
                      </svg>
                      <span>{translations.discordLinked[language as keyof typeof translations.discordLinked]}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-400 text-sm">
                    {translations.memberSince[language as keyof typeof translations.memberSince]}: {new Date(profile?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Profile form */}
              <div className="md:w-2/3">
                <div className="flex justify-end mb-4">
                  <button
                    className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        {translations.cancel[language as keyof typeof translations.cancel]}
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-1" />
                        {translations.edit[language as keyof typeof translations.edit]}
                      </>
                    )}
                  </button>
                </div>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-300 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {translations.username[language as keyof typeof translations.username]}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full"
                      />
                    ) : (
                      <div className="bg-gray-800 p-3 rounded-md">{profile?.username}</div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-300 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {translations.email[language as keyof typeof translations.email]}
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full"
                      />
                    ) : (
                      <div className="bg-gray-800 p-3 rounded-md">{profile?.email}</div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-gray-300 mb-2 flex items-center">
                          <Key className="w-4 h-4 mr-2" />
                          {translations.currentPassword[language as keyof typeof translations.currentPassword]}
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-300 mb-2 flex items-center">
                          <Key className="w-4 h-4 mr-2" />
                          {translations.newPassword[language as keyof typeof translations.newPassword]}
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 flex items-center">
                          <Key className="w-4 h-4 mr-2" />
                          {translations.confirmPassword[language as keyof typeof translations.confirmPassword]}
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-input bg-gray-800 text-white border-purple-700 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {translations.save[language as keyof typeof translations.save]}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Characters tab content */}
        {activeTab === 'characters' && (
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg">
            {profile?.characters && profile.characters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.characters.map(character => (
                  <div key={character.id} className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mr-4">
                        {character.race === 'human' && <User className="w-8 h-8" />}
                        {character.race === 'oni' && <Sword className="w-8 h-8" />}
                        {character.race === 'fairy' && <Sparkles className="w-8 h-8" />}
                        {character.race === 'undead' && <Skull className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{character.username}</h3>
                        <p className="text-purple-400">
                          {translations.level[language as keyof typeof translations.level]} {character.level}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {translations.race[language as keyof typeof translations.race]}
                        </p>
                        <p className="font-medium">
                          {translations[character.race][language as keyof typeof translations.human]}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {translations.class[language as keyof typeof translations.class]}
                        </p>
                        <p className="font-medium">
                          {translations[character.class][language as keyof typeof translations.warrior]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  {translations.noCharacters[language as keyof typeof translations.noCharacters]}
                </p>
                <button
                  className="bg-purple-700 text-white px-4 py-2 rounded-md"
                  onClick={() => window.location.href = '/character'}
                >
                  {translations.createCharacter[language as keyof typeof translations.createCharacter]}
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Posts tab content */}
        {activeTab === 'posts' && (
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg">
            {profile?.posts && profile.posts.length > 0 ? (
              <div className="space-y-6">
                {profile.posts.map(post => (
                  <div key={post.id} className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{post.author}</h3>
                        <p className="text-gray-400 text-sm">{post.displayTime || new Date(post.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <p className="mb-4">{post.content}</p>
                    
                    <div className="flex items-center">
                      <div className="flex items-center text-gray-400">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {translations.noPosts[language as keyof typeof translations.noPosts]}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;