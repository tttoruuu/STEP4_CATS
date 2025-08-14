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

  // プロフィールデータの取得
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('プロフィール取得開始...');
        
        const profileData = await getComprehensiveProfile();
        console.log('プロフィール取得完了:', profileData);
        setProfile(profileData);
        setError(null);
        
      } catch (err) {
        console.error('プロフィール取得でエラーが発生:', err);
        setError(err instanceof Error ? err.message : 'プロフィールの取得に失敗しました');
        
        // 認証エラーの場合はログインページにリダイレクト（無限ループ対策で一時的に無効化）
        if (err instanceof Error && err.message.includes('認証が必要')) {
          console.log('認証エラーが発生しましたが、リダイレクトは無効化されています');
          // router.replace('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // 依存配列からrouterを削除して無限ループを防止

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
        <div className="min-h-screen flex items-center justify-center" style={{background: '#FAF5F2'}}>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-4" style={{border: '2px solid #FFB08A', borderTop: '2px solid #FF6B35'}}></div>
            <p style={{color: '#636E72'}}>プロフィールを読み込んでいます...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // エラー表示（統一デザイン）
  if (error) {
    return (
      <Layout title="プロフィール" hideHeader={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: '#FAF5F2'}}>
          <div className="text-center">
            <p className="mb-4" style={{color: '#E17055'}}>{error}</p>
            <button 
              onClick={handleRetry} 
              className="px-6 py-3 rounded-full font-semibold transition-all"
              style={{
                backgroundColor: '#FF6B35',
                color: '#FFFFFF',
                boxShadow: '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '12px 12px 24px rgba(209, 186, 172, 0.5), -12px -12px 24px rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)';
              }}
            >
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
        <div className="min-h-screen flex items-center justify-center" style={{background: '#FAF5F2'}}>
          <div className="text-center">
            <p style={{color: '#636E72'}}>プロフィールデータが見つかりません。</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="プロフィール" hideHeader={true}>
      <div className="min-h-screen" style={{background: '#FAF5F2'}}>
      {/* Header Section */}
      <div className="pt-8 pb-8 px-4 rounded-b-3xl" style={{
        background: 'linear-gradient(145deg, #FFF5F0, #FAF5F2)',
        boxShadow: '0 10px 30px rgba(209, 186, 172, 0.3)'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <div 
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center"
              style={{
                boxShadow: '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)'
              }}
            >
              <User className="w-12 h-12" style={{color: '#636E72'}} />
            </div>
            <div 
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full"
              style={{
                backgroundColor: '#10B981',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
              }}
            ></div>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{color: '#2D3436'}}>{profile.name || 'テストさん'}</h1>
          <p className="text-lg mb-4" style={{color: '#2D3436'}}>{profile.age ? `${profile.age}歳` : '年齢未設定'}</p>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors"
            style={{
              backgroundColor: '#FFFFFF', 
              borderColor: '#FF6B35',
              color: '#FF6B35',
              boxShadow: '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF5F0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
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