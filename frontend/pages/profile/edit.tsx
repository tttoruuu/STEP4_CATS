import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import {
  ArrowLeft,
  Save,
  User,
  Calendar,
  Users,
  Briefcase,
  MapPin,
  Coffee,
  Plus,
  X
} from 'lucide-react';
import {
  getComprehensiveProfile,
  updateProfile,
  ComprehensiveProfile,
  getKonkatsuExperienceDisplay,
  getKonkatsuExperienceColor
} from '../../services/profileAPI';

const ProfileEdit: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    konkatsu_experience: '',
    occupation: '',
    birthplace: '',
    residence: '',
    hobbies: [] as string[],
    weekend_activities: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newHobby, setNewHobby] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getComprehensiveProfile();
        setProfile(profileData);
        
        // フォームデータを初期化
        setFormData({
          name: profileData.name === '未入力' ? '' : profileData.name,
          birth_date: profileData.birth_date === '未入力' ? '' : (profileData.birth_date || ''),
          konkatsu_experience: profileData.konkatsu_experience === '未入力' ? '' : profileData.konkatsu_experience,
          occupation: profileData.occupation === '未入力' ? '' : (profileData.occupation || ''),
          birthplace: profileData.birthplace === '未入力' ? '' : (profileData.birthplace || ''),
          residence: profileData.residence === '未入力' ? '' : (profileData.residence || ''),
          hobbies: profileData.hobbies.filter(h => h !== '未入力'),
          weekend_activities: profileData.weekend_activities === '未入力' ? '' : (profileData.weekend_activities || '')
        });
        setError('');
      } catch (err) {
        console.error('プロフィール取得エラー:', err);
        setError('プロフィール情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }));
      setNewHobby('');
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobbyToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // APIに送信するデータを準備
      const updateData = {
        full_name: formData.name || undefined,
        birth_date: formData.birth_date || undefined,
        konkatsu_status: formData.konkatsu_experience || undefined,
        occupation: formData.occupation || undefined,
        birthplace: formData.birthplace || undefined,
        current_location: formData.residence || undefined,
        hobbies: formData.hobbies.length > 0 ? formData.hobbies : undefined,
        holiday_style: formData.weekend_activities || undefined
      };

      await updateProfile(updateData);
      setSuccess('プロフィールが更新されました！');
      
      // 3秒後にプロフィール表示ページに戻る
      setTimeout(() => {
        router.push('/profile/comprehensive');
      }, 2000);
      
    } catch (err) {
      console.error('プロフィール更新エラー:', err);
      
      // エラーメッセージを分かりやすく表示
      let errorMessage = 'プロフィールの更新に失敗しました。';
      if (err instanceof Error) {
        if (err.message.includes('Network Error') || err.message.includes('CORS')) {
          errorMessage = 'ネットワーク接続に問題があります。しばらく時間をおいて再度お試しください。';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'サーバーへの接続がタイムアウトしました。再度お試しください。';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#FAF5F2'}}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full animate-spin mx-auto mb-4" style={{border: '2px solid #FFB08A', borderTop: '2px solid #FF6B35'}}></div>
          <p style={{color: '#636E72'}}>プロフィールを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#FAF5F2'}}>
        <div className="text-center">
          <p className="mb-4" style={{color: '#E17055'}}>{error || 'プロフィール情報の取得に失敗しました'}</p>
          <button 
            onClick={() => router.push('/profile/comprehensive')}
            className="px-6 py-3 rounded-full font-semibold transition-all"
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)'
            }}
          >
            プロフィールページに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout title="プロフィール編集" hideHeader={true}>
      <div className="min-h-screen" style={{background: '#FAF5F2'}}>
      {/* Header */}
      <div className="pt-8 pb-6 px-4 rounded-b-3xl" style={{
        background: 'linear-gradient(145deg, #FFF5F0, #FAF5F2)',
        boxShadow: '0 10px 30px rgba(209, 186, 172, 0.3)'
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => router.push('/profile/comprehensive')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#FF6B35',
                boxShadow: '4px 4px 8px rgba(209, 186, 172, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFF5F0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold" style={{color: '#2D3436'}}>プロフィール編集</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">基本情報</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="お名前を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生年月日
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                婚活の経験
              </label>
              <select
                value={formData.konkatsu_experience}
                onChange={(e) => handleInputChange('konkatsu_experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">選択してください</option>
                <option value="初心者">初心者</option>
                <option value="経験あり">経験あり</option>
                <option value="再チャレンジ">再チャレンジ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                職業
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="職業を入力してください"
              />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">居住地情報</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出身地
              </label>
              <input
                type="text"
                value={formData.birthplace}
                onChange={(e) => handleInputChange('birthplace', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="出身地を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                現在の居住地
              </label>
              <input
                type="text"
                value={formData.residence}
                onChange={(e) => handleInputChange('residence', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="現在の居住地を入力してください"
              />
            </div>
          </div>
        </div>

        {/* Hobbies */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">趣味・興味</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="趣味を追加"
              />
              <button
                onClick={addHobby}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                >
                  {hobby}
                  <button
                    onClick={() => removeHobby(hobby)}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Weekend Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Coffee className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">休日の過ごし方</h2>
          </div>
          
          <textarea
            value={formData.weekend_activities}
            onChange={(e) => handleInputChange('weekend_activities', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="普段の休日はどのように過ごされていますか？"
          />
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/profile/comprehensive')}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: '#FAF5F2',
              color: '#636E72',
              boxShadow: '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1ECE9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FAF5F2';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              boxShadow: saving ? 'inset 4px 4px 8px rgba(209, 186, 172, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.8)' : '8px 8px 16px rgba(209, 186, 172, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8)'
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#E55A2B';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#FF6B35';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default ProfileEdit; 