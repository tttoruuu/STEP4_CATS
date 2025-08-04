import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  getComprehensiveProfile, 
  updateProfile,
  ComprehensiveProfile 
} from '../services/profileAPI';

export default function TestProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // テスト用のトークンを生成してローカルストレージに保存
  const generateTestToken = () => {
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payload = btoa(JSON.stringify({
      sub: 1,
      user_id: 1,
      email: 'test@example.com',
      name: 'テストユーザー',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24時間後
    }));
    const signature = 'test-signature';
    return `${header}.${payload}.${signature}`;
  };

  // プロフィール取得テスト
  const testGetProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // テスト用トークンを設定
      localStorage.setItem('token', generateTestToken());
      
      const profileData = await getComprehensiveProfile();
      setProfile(profileData);
      setSuccess('プロフィール取得成功！');
      
    } catch (err) {
      console.error('プロフィール取得エラー:', err);
      setError(err.message || 'プロフィール取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // プロフィール更新テスト
  const testUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const updateData = {
        full_name: 'テストユーザー（更新済み）',
        occupation: 'フロントエンドエンジニア',
        birthplace: '大阪府',
        current_location: '東京都',
        hobbies: ['プログラミング', '読書', '映画鑑賞'],
        holiday_style: 'コーディングを楽しんでいます'
      };
      
      const result = await updateProfile(updateData);
      setSuccess(`プロフィール更新成功！ - ${result.message}`);
      
      // 更新後に再取得
      await testGetProfile();
      
    } catch (err) {
      console.error('プロフィール更新エラー:', err);
      setError(err.message || 'プロフィール更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // APIエンドポイント確認
  const testApiEndpoints = async () => {
    try {
      setLoading(true);
      setError('');
      
      // テスト用エンドポイント確認
      const testResponse = await fetch('http://localhost:8000/api/profile/test');
      const testData = await testResponse.json();
      
      // デバッグ用エンドポイント確認
      const debugResponse = await fetch('http://localhost:8000/api/profile/comprehensive-debug');
      const debugData = await debugResponse.json();
      
      setSuccess(`APIエンドポイント確認成功！\nテスト: ${testData.message}\nデバッグ: ${debugData.success ? 'OK' : 'NG'}`);
      
    } catch (err) {
      setError('APIエンドポイント確認に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">プロフィールAPI テストページ</h1>
          <p className="text-gray-600 mb-6">
            このページでプロフィール機能の動作をテストできます。
          </p>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={testApiEndpoints}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '確認中...' : 'APIエンドポイント確認'}
            </button>
            
            <button
              onClick={testGetProfile}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '取得中...' : 'プロフィール取得テスト'}
            </button>
            
            <button
              onClick={testUpdateProfile}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? '更新中...' : 'プロフィール更新テスト'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>エラー:</strong> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>成功:</strong> <pre className="whitespace-pre-wrap">{success}</pre>
            </div>
          )}

          {profile && (
            <div className="bg-gray-100 border border-gray-300 rounded p-4">
              <h3 className="text-lg font-semibold mb-2">取得されたプロフィール:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">実際のプロフィール画面へ</h2>
          <div className="space-y-2">
            <Link href="/profile/comprehensive" className="block text-blue-600 hover:text-blue-800">
              → プロフィール表示ページ
            </Link>
            <Link href="/profile/edit" className="block text-blue-600 hover:text-blue-800">
              → プロフィール編集ページ
            </Link>
            <Link href="/auth/login" className="block text-blue-600 hover:text-blue-800">
              → ログインページ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}