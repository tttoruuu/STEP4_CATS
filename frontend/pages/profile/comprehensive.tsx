import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { 
  Edit3, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Users, 
  Coffee, 
  Brain,
  User,
  HomeIcon
} from 'lucide-react';
import { 
  getComprehensiveProfile, 
  updateProfile, 
  ComprehensiveProfile,
  getKonkatsuExperienceDisplay,
  getKonkatsuExperienceColor,
  getMBTITypeName
} from '../../services/profileAPI';

const ComprehensiveProfilePage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // プロフィールデータの取得（統合版）
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('プロフィール取得開始...');
        
        // まず統合APIからプロフィールデータを取得
        try {
          const profileData = await getComprehensiveProfile();
          console.log('プロフィール取得完了:', profileData);
          setProfile(profileData);
          setError(null);
          return;
        } catch (apiError) {
          console.log('統合API失敗、フォールバック処理開始:', apiError);
        }
        
        // フォールバック: JWTトークンとtest-profileから情報取得
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            router.replace('/auth/login');
            return;
          }
          
          // JWTトークンをデコード（日本語対応）
          const encodedPayload = storedToken.split('.')[1];
          const decodedPayload = decodeURIComponent(escape(atob(encodedPayload)));
          const payload = JSON.parse(decodedPayload);
          
          let fallbackProfile = {
            user_id: payload.sub || payload.user_id || 1,
            name: payload.name || payload.username || '未入力',
            age: payload.age || undefined,
            birth_date: payload.birth_date || '未入力',
            konkatsu_experience: payload.konkatsu_experience || '未入力',
            occupation: payload.occupation || '未入力',
            birthplace: payload.birthplace || '未入力',
            residence: payload.residence || '未入力',
            hobbies: payload.hobbies || ['未入力'],
            weekend_activities: payload.weekend_activities || '未入力',
            mbti: payload.mbti || undefined,
            profile_image_url: null,
            email: payload.email || '未入力',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // test-profileからデータを補完
          try {
            const API_BASE_URL = process.env.NODE_ENV === 'production' 
              ? 'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io'
              : 'http://localhost:8000';
            
            const response = await fetch(`${API_BASE_URL}/test-profile`);
            if (response.ok) {
              const testProfileData = await response.json();
              if (testProfileData.success && testProfileData.profile) {
                fallbackProfile = {
                  ...fallbackProfile,
                  ...testProfileData.profile,
                  name: testProfileData.profile.name || fallbackProfile.name
                };
              }
            }
          } catch (testApiError) {
            console.log('test-profile API失敗:', testApiError);
          }
          
          setProfile(fallbackProfile);
          setError(null);
        }
        
      } catch (err) {
        console.error('プロフィール取得でエラーが発生:', err);
        setError(err instanceof Error ? err.message : 'プロフィールの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  const handleMBTITest = () => {
    router.push('/marriage-mbti-test');
  };

  // 再試行処理
  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getComprehensiveProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロフィールの取得に失敗しました');
      console.error('プロフィール再取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // ローディング表示（統一デザイン）
  if (loading) {
    return (
      <Layout title="プロフィール" hideHeader={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-4" style={{border: '2px solid var(--color-primary-300)', borderTop: '2px solid var(--color-primary-500)'}}></div>
            <p style={{color: 'var(--color-gray-600)'}}>プロフィールを読み込んでいます...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // エラー表示（統一デザイン）
  if (error) {
    return (
      <Layout title="プロフィール" hideHeader={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
          <div className="text-center">
            <p className="mb-4" style={{color: 'var(--color-error)'}}>{error}</p>
            <button onClick={handleRetry} className="btn btn-primary">
              再試行
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // プロフィールデータがない場合
  if (!profile) {
    return (
      <Layout title="プロフィール" hideHeader={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
          <div className="text-center">
            <p style={{color: 'var(--color-gray-600)'}}>プロフィールデータが見つかりません。</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="プロフィール" hideHeader={true}>
      <div className="min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
      {/* Header Section */}
      <div className="pt-8 pb-8 px-4 rounded-b-3xl" style={{background: 'var(--bg-gradient-primary)'}}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
          <p className="text-white/90 text-lg mb-4">{profile.age ? `${profile.age}歳` : '年齢未設定'}</p>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 backdrop-blur-sm text-white px-4 py-2 rounded-full border transition-colors"
            style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.3)'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <Edit3 className="w-4 h-4" />
            編集
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        
        {/* Basic Info Card */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6" style={{color: 'var(--color-gray-800)'}}>基本情報</h2>
          
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>生年月日</p>
              <p style={{color: profile.birth_date && profile.birth_date !== '未設定' ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>
                {profile.birth_date || '未設定'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Users className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>婚活の経験</p>
              <span 
                className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: getKonkatsuExperienceColor(profile.konkatsu_experience) }}
              >
                {getKonkatsuExperienceDisplay(profile.konkatsu_experience)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Briefcase className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>職業</p>
              <p style={{color: profile.occupation && profile.occupation !== '未設定' ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>
                {profile.occupation || '未設定'}
              </p>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6" style={{color: 'var(--color-gray-800)'}}>居住地情報</h2>
          
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>出身地</p>
              <p style={{color: profile.birthplace && profile.birthplace !== '未設定' ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>
                {profile.birthplace || '未設定'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>現在の居住地</p>
              <p style={{color: profile.residence && profile.residence !== '未設定' ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>
                {profile.residence || '未設定'}
              </p>
            </div>
          </div>
        </div>

        {/* Hobbies Card */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6" style={{color: 'var(--color-gray-800)'}}>趣味・興味</h2>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies && Array.isArray(profile.hobbies) && profile.hobbies.length > 0 && profile.hobbies[0] !== '未設定' ? (
              profile.hobbies.map((hobby, index) => (
                <span 
                  key={index} 
                  className="px-3 py-2 rounded-full text-sm font-medium"
                  style={{backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-200)'}}
                >
                  {hobby}
                </span>
              ))
            ) : (
              <span className="px-3 py-2 rounded-full text-sm font-medium" style={{backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-400)', border: '1px solid var(--color-gray-200)'}}>
                未設定
              </span>
            )}
          </div>
        </div>

        {/* Weekend Activities Card */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-5 h-5" style={{color: 'var(--color-primary-500)'}} />
            <h2 className="text-xl font-bold" style={{color: 'var(--color-gray-800)'}}>休日の過ごし方</h2>
          </div>
          <p className="leading-relaxed" style={{color: profile.weekend_activities && profile.weekend_activities !== '未設定' ? 'var(--color-gray-700)' : 'var(--color-gray-400)'}}>
            {profile.weekend_activities || '未設定'}
          </p>
        </div>

        {/* MBTI Card */}
        {profile.mbti ? (
          <div className="card" style={{background: 'var(--bg-gradient-primary)', border: 'none'}}>
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-xl font-bold mb-1">{profile.mbti.mbti_type}</h3>
                  <p className="text-white/90 font-medium">{getMBTITypeName(profile.mbti.mbti_type)}</p>
                </div>
              </div>
              {profile.mbti.description && (
                <p className="text-white/90 leading-relaxed mb-4">
                  {profile.mbti.description}
                </p>
              )}
              <button
                onClick={handleMBTITest}
                className="btn btn-ghost text-white px-4 py-2"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)'}}
              >
                再診断する
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{background: 'linear-gradient(to right, var(--color-secondary-50), var(--color-accent-50))', border: '1px solid var(--color-secondary-200)'}}>
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--color-secondary-500)'}} />
              <h3 className="text-lg font-bold mb-2" style={{color: 'var(--color-gray-800)'}}>Marriage MBTI+を受けてみませんか？</h3>
              <p className="mb-4" style={{color: 'var(--color-gray-600)'}}>
                あなたの性格タイプを知ることで、より自分を客観的に見られるようになります。
              </p>
              <button
                onClick={handleMBTITest}
                className="btn btn-secondary px-6 py-3"
              >
                Marriage MBTI+を受ける
              </button>
            </div>
          </div>
        )}
      </div>

      </div>
    </Layout>
  );
};

export default ComprehensiveProfilePage;