import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

const ComprehensiveProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    age: null,
    birth_date: '',
    konkatsu_experience: '',
    occupation: '',
    birthplace: '',
    residence: '',
    hobbies: [],
    weekend_activities: '',
    mbti: null,
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // ブラウザ環境でない場合は処理を停止
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        // トークンの存在確認
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          router.replace('/auth/login');
          return;
        }
        
        // JWTトークンをデコードしてユーザー情報を取得
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        
        // 基本情報をトークンから設定
        setUser({
          name: payload.name || payload.username || 'お名前',
          age: payload.age || null,
          birth_date: payload.birth_date || '',
          konkatsu_experience: payload.konkatsu_experience || '',
          occupation: payload.occupation || '',
          birthplace: payload.birthplace || '',
          residence: payload.residence || '',
          hobbies: payload.hobbies || [],
          weekend_activities: payload.weekend_activities || '',
          mbti: payload.mbti || null,
          email: payload.email || ''
        });
        
        // 追加でAPIからプロフィール情報を取得（可能であれば）
        try {
          const API_BASE_URL = process.env.NODE_ENV === 'production' 
            ? 'https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io'
            : 'http://localhost:8000';
          
          const response = await fetch(`${API_BASE_URL}/test-profile`);
          if (response.ok) {
            const profileData = await response.json();
            console.log('API プロフィールデータ取得成功:', profileData);
            if (profileData.success && profileData.profile) {
              setUser(prev => ({
                ...prev,
                ...profileData.profile,
                name: profileData.profile.name || prev.name
              }));
            }
          }
        } catch (apiError) {
          console.log('プロフィールAPI呼び出しに失敗（トークン情報を使用）:', apiError);
        }
        
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        setError('プロフィール情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  const handleMBTITest = () => {
    router.push('/marriage-mbti-test');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-4" style={{border: '2px solid var(--color-primary-300)', borderTop: '2px solid var(--color-primary-500)'}}></div>
          <p style={{color: 'var(--color-gray-600)'}}>プロフィールを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
        <div className="text-center">
          <p className="mb-4" style={{color: 'var(--color-error)'}}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
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
          <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-white/90 text-lg mb-4">{user.age ? `${user.age}歳` : '年齢未設定'}</p>
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
              <p style={{color: user.birth_date ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>{user.birth_date || '未設定'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Users className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>婚活の経験</p>
              <span 
                className="px-3 py-1 rounded-full text-sm font-semibold text-white" 
                style={{backgroundColor: user.konkatsu_experience ? 'var(--color-primary-500)' : 'var(--color-gray-400)'}}
              >
                {user.konkatsu_experience || '未設定'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <Briefcase className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>職業</p>
              <p style={{color: user.occupation ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>{user.occupation || '未設定'}</p>
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
              <p style={{color: user.birthplace ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>{user.birthplace || '未設定'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5" style={{color: 'var(--color-primary-500)'}} />
            <div className="flex-1">
              <p className="text-sm mb-1" style={{color: 'var(--color-gray-600)'}}>現在の居住地</p>
              <p style={{color: user.residence ? 'var(--color-gray-800)' : 'var(--color-gray-400)'}}>{user.residence || '未設定'}</p>
            </div>
          </div>
        </div>

        {/* Hobbies Card */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6" style={{color: 'var(--color-gray-800)'}}>趣味・興味</h2>
          <div className="flex flex-wrap gap-2">
            {user.hobbies && user.hobbies.length > 0 ? (
              user.hobbies.map((hobby, index) => (
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
          <p className="leading-relaxed" style={{color: user.weekend_activities ? 'var(--color-gray-700)' : 'var(--color-gray-400)'}}>
            {user.weekend_activities || '未設定'}
          </p>
        </div>

        {/* MBTI Card */}
        <div className="card" style={{background: user.mbti ? 'var(--bg-gradient-primary)' : 'linear-gradient(to right, var(--color-secondary-50), var(--color-accent-50))', border: user.mbti ? 'none' : '1px solid var(--color-secondary-200)'}}>
          {user.mbti ? (
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-xl font-bold mb-1">{user.mbti.mbti_type}</h3>
                  <p className="text-white/90 font-medium">{user.mbti.type_name}</p>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed mb-4">
                {user.mbti.description}
              </p>
              <button
                onClick={handleMBTITest}
                className="btn btn-ghost text-white px-4 py-2"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)'}}
              >
                再診断する
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* LayoutでFooterが自動追加されるので、ここの重複フッターは削除 */}
    </div>
  );
};

export default ComprehensiveProfilePage;