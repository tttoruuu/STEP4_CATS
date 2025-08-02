import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function MyPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 認証トークンをチェック
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth/login-chat');
          return;
        }

        // ユーザーデータを取得（今後バックエンドAPIに接続）
        // 現在はダミーデータ
        setUserData({
          name: '山田太郎',
          email: 'example@example.com',
          age: 30,
          registrationDate: '2024-01-15'
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login-chat');
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/auth/login-chat');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">マイページ</h1>
              <p className="text-gray-600">Miraimへようこそ！</p>
            </div>

            {userData && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">基本情報</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">お名前:</span>
                        <span className="font-medium">{userData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">メールアドレス:</span>
                        <span className="font-medium">{userData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年齢:</span>
                        <span className="font-medium">{userData.age}歳</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">登録日:</span>
                        <span className="font-medium">{userData.registrationDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">利用状況</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">会話練習回数:</span>
                        <span className="font-medium">0回</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">相性診断回数:</span>
                        <span className="font-medium">0回</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AIカウンセラー利用:</span>
                        <span className="font-medium">0回</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => router.push('/conversation')}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    会話練習を始める
                  </button>
                  
                  <button
                    onClick={() => router.push('/personality-test')}
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    性格診断
                  </button>
                  
                  <button
                    onClick={() => router.push('/counselor')}
                    className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    AIカウンセラー
                  </button>
                </div>

                <div className="text-center pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}