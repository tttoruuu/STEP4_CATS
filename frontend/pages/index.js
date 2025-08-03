import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Layout from '../components/Layout';
import { MessageSquare, Heart, Palette, User } from 'lucide-react';
import { authAPI } from '../services/api';

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      
      // ブラウザ環境でない場合は処理を停止
      if (typeof window === 'undefined') {
        console.log('DEBUG: サーバーサイドレンダリング中のため処理を停止');
        setLoading(false);
        return;
      }
      
      // 🔥 URGENT FIX v20250803 🔥
      console.log('🚨 URGENT FIX VERSION LOADED 🚨');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // トークンの存在確認
      const storedToken = localStorage.getItem('token');
      console.log('🔍 Token check v2:', !!storedToken);
      
      if (!storedToken) {
        console.log('❌ No token v2 - redirect to login');
        setLoading(false);
        router.replace('/auth/login-chat');
        return;
      }
      
      // トークンが存在する場合はユーザー情報を取得
      console.log('✅ Token found v2 - fetching user info');
      try {
        // JWTトークンをデコードしてユーザー情報を取得（日本語対応）
        const encodedPayload = storedToken.split('.')[1];
        const decodedPayload = decodeURIComponent(escape(atob(encodedPayload)));
        const payload = JSON.parse(decodedPayload);
        console.log('Token payload:', payload);
        
        setUser({
          id: payload.sub || payload.user_id || 1,
          username: payload.name || payload.username || 'ユーザー',
          email: payload.email || 'user@example.com'
        });
      } catch (error) {
        console.error('Token decode error:', error);
        // フォールバック: デフォルト情報を使用
        setUser({
          id: 1,
          username: 'ユーザー',
          email: 'user@example.com'
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    authAPI.logout(); // APIの関数を使用
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-800" style={{background: 'var(--bg-gradient-main)'}}>
        <div className="text-center space-y-6">
          {/* ロゴ */}
          <div className="logo mb-4">
            <Heart className="w-8 h-8" style={{color: 'var(--color-primary-500)'}} />
            <span>Miraim</span>
          </div>
          
          {/* ローディングアニメーション */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: 'var(--color-primary-400)'}}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: 'var(--color-primary-400)', animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: 'var(--color-primary-400)', animationDelay: '0.2s'}}></div>
            </div>
            <p className="font-medium" style={{color: 'var(--color-primary-600)'}}>ホーム画面を準備中...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && !user.username) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 px-6" style={{background: 'var(--bg-gradient-main)'}}>
        <div className="card text-center">
          <p className="mb-4" style={{color: 'var(--color-error)'}}>{error}</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="btn btn-primary"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout title="ホーム" hideHeader={true}>
      <main className="max-w-sm mx-auto px-6 py-8 min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
      <div className="w-40 h-40 relative mb-4 flex justify-center mx-auto">
              <Image
                src="/images/logo.png"
                alt="Miraim ロゴ"
                width={160}
                height={160}
                className="object-contain"
              />
            </div> 

        {/* プロフィールセクション */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 bg-white" style={{borderColor: 'var(--color-gray-200)'}}>
                <Image
                  src="/images/demo.png"
                  alt={user.username}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium" style={{color: 'var(--color-gray-800)'}}>{user.username}</span>
                <span className="text-sm" style={{color: 'var(--color-gray-500)'}}>ようこそ！</span>
              </div>
            </div>
            
            <button className="btn btn-outline btn-sm">
              編集する
            </button>
          </div>
        </div>

        {/* メインテキスト */}
        <h2 className="text-xl font-medium mb-8" style={{color: 'var(--color-primary-600)'}}>今日は何をしますか？</h2>

        {/* メニューボタン */}
        <nav className="flex flex-col space-y-4">
          {/* AIカウンセラー */}
          <Link href="/counselor">
            <div className="btn btn-primary btn-lg w-full">
              <User className="w-5 h-5" />
              <span>AIカウンセラー</span>
            </div>
          </Link>

          {/* 会話練習機能 */}
          <Link href="/conversation/modes">
            <div className="btn btn-accent btn-lg w-full">
              <MessageSquare className="w-5 h-5" />
              <span>会話練習</span>
            </div>
          </Link>

          {/* MBTI Marriage診断機能 */}
          <Link href="/marriage-mbti-test">
            <div className="btn btn-secondary btn-lg w-full">
              <Heart className="w-5 h-5" />
              <span>MBTI Marriage</span>
            </div>
          </Link>

          {/* スタイリング提案機能 */}
          <Link href="/styling">
            <div className="btn btn-mixed btn-lg w-full">
              <Palette className="w-5 h-5" />
              <span>スタイリング提案</span>
            </div>
          </Link>
        </nav>

        {/* ログアウト */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 text-center text-sm transition-colors py-2 hover:underline"
          style={{color: 'var(--color-error)'}}
        >
          ログアウト
        </button>
      </main>
    </Layout>
  );
}
