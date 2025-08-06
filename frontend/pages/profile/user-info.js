import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft, Edit } from 'lucide-react';
import { api } from '../../services/api';

export default function UserInfo() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        // 統合プロフィールAPIを使用
        const response = await api.get('/api/profile/comprehensive');
        if (response.data.success && response.data.profile) {
          setUser(response.data.profile);
        } else {
          setError('プロフィール情報の取得に失敗しました');
        }
      } catch (err) {
        setError('ユーザー情報の取得に失敗しました。');
        console.error('ユーザー情報の取得に失敗しました。', err);
        
        // 認証エラー（401）の場合はトークンをクリアしてログイン画面にリダイレクト
        if (err.response && err.response.status === 401) {
          console.log('認証エラー: トークンが無効または期限切れです。再ログインが必要です。');
          localStorage.removeItem('token');
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-4 text-center">
        <p className="text-red-600 mb-4">{error || 'ユーザー情報の取得に失敗しました'}</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">プロフィール情報</h1>
            <button
              onClick={() => router.push('/profile/edit')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Edit size={18} />
              編集する
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {user.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt="プロフィール画像"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">画像なし</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{user.name || user.full_name}</h2>
              <p className="text-gray-500">{user.age ? `${user.age}歳` : ''}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">生年月日</dt>
                  <dd className="text-sm text-gray-900">{user.birth_date || '未設定'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">出身地</dt>
                  <dd className="text-sm text-gray-900">{user.birthplace || user.hometown || '未設定'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">現在地</dt>
                  <dd className="text-sm text-gray-900">{user.residence || user.current_location || '未設定'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">その他の情報</h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">職業</dt>
                  <dd className="text-sm text-gray-900">{user.occupation || '未設定'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">趣味</dt>
                  <dd className="text-sm text-gray-900">
                    {Array.isArray(user.hobbies) ? user.hobbies.join('、') : (user.hobbies || '未設定')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">婚活経験</dt>
                  <dd className="text-sm text-gray-900">{user.konkatsu_experience || '未設定'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 