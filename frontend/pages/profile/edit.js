import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { api } from '../../services/api';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    konkatsu_status: 'beginner',
    occupation: '',
    birthplace: '',
    current_location: '',
    hobbies: [],
    holiday_style: ''
  });

  const [hobbyInput, setHobbyInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile/comprehensive');
      if (response.data.success && response.data.profile) {
        const profile = response.data.profile;
        
        // 日付フォーマットの変換
        let birthDate = '';
        if (profile.birth_date && profile.birth_date !== '未設定') {
          // "YYYY年MM月DD日" → "YYYY-MM-DD"
          const match = profile.birth_date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (match) {
            birthDate = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
          }
        }
        
        // 婚活経験の逆マッピング
        const konkatsuMap = {
          '初心者': 'beginner',
          '経験あり': 'experienced',
          '再チャレンジ': 'returning'
        };
        
        setFormData({
          full_name: profile.name || '',
          birth_date: birthDate,
          konkatsu_status: konkatsuMap[profile.konkatsu_experience] || 'beginner',
          occupation: profile.occupation !== '未設定' ? profile.occupation : '',
          birthplace: profile.birthplace !== '未設定' ? profile.birthplace : '',
          current_location: profile.residence !== '未設定' ? profile.residence : '',
          hobbies: Array.isArray(profile.hobbies) ? 
            profile.hobbies.filter(h => h !== '未設定') : [],
          holiday_style: profile.weekend_activities !== '未設定' ? profile.weekend_activities : ''
        });
      }
    } catch (err) {
      console.error('プロフィール取得エラー:', err);
      setError('プロフィール情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addHobby = () => {
    if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()]
      }));
      setHobbyInput('');
    }
  };

  const removeHobby = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/api/profile/update', formData);
      if (response.data.success) {
        setSuccess('プロフィールを更新しました');
        setTimeout(() => {
          router.push('/profile/user-info');
        }, 1500);
      }
    } catch (err) {
      console.error('更新エラー:', err);
      setError('プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">基本情報</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お名前
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="山田 太郎"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生年月日
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  職業
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="会社員、エンジニア など"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  婚活経験
                </label>
                <select
                  name="konkatsu_status"
                  value={formData.konkatsu_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">初心者</option>
                  <option value="experienced">経験あり</option>
                  <option value="returning">再チャレンジ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出身地
                </label>
                <input
                  type="text"
                  name="birthplace"
                  value={formData.birthplace}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="東京都"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在地
                </label>
                <input
                  type="text"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="神奈川県横浜市"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">趣味・ライフスタイル</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  趣味
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={hobbyInput}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="趣味を入力してEnterキー"
                  />
                  <button
                    type="button"
                    onClick={addHobby}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    追加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.hobbies.map(hobby => (
                    <span
                      key={hobby}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {hobby}
                      <button
                        type="button"
                        onClick={() => removeHobby(hobby)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  休日の過ごし方
                </label>
                <textarea
                  name="holiday_style"
                  value={formData.holiday_style}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="カフェでコーヒーを飲みながら読書をするのが好きです"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save size={18} />
                  保存する
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}