import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Layout from '../components/Layout';
import TopQuickLinks from '../components/TopQuickLinks';
import { MessageSquare, Heart, Palette, User } from 'lucide-react';
import { authAPI } from '../services/api';

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '', // 初期値は空にして、後で設定
    full_name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false); // 🐛 デバッグ: 初期状態をfalseに変更してローディング画面をスキップ
  const [error, setError] = useState('');
  
  // デバッグ用ログ（簡素化）
  console.log('[Index] ホームページがレンダリングされました');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 🚨 緊急処置: 無限リダイレクト問題の解決のため、認証チェックを一時的に無効化
        console.log('[Index] 緊急処置: 認証チェックを一時的に無効化');
        
        // SSR安全なlocalStorageアクセス
        if (typeof window !== 'undefined') {
          // クライアントサイドでのみlocalStorageにアクセス
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              // full_nameを優先、なければemailから@前を使用、それもなければ「ゲスト」
              const displayName = userData.full_name || 
                                 userData.email?.split('@')[0] || 
                                 userData.username || 
                                 'ゲスト';
              
              setUser({
                ...userData,
                username: displayName,
                full_name: userData.full_name || ''
              });
              console.log('[Index] ユーザー情報復元:', {
                full_name: userData.full_name,
                email: userData.email,
                displayName: displayName
              });
            } catch (e) {
              console.error('[Index] ユーザー情報の解析エラー:', e);
              setUser({ 
                username: 'ゲスト', 
                full_name: '', 
                email: '' 
              });
            }
          } else {
            // ユーザー情報がない場合はゲストとして扱う
            setUser({ 
              username: 'ゲスト', 
              full_name: '', 
              email: '' 
            });
          }
        } else {
          // サーバーサイドではデフォルトユーザーを設定
          setUser({ username: 'ゲスト', full_name: '', email: '' });
        }
        
        // 強制的にローディングを解除
        console.log('[Index] ローディング状態を解除');
        setLoading(false);
        
      } catch (error) {
        console.error('[Index] 初期化エラー:', error);
        setLoading(false); // エラーが発生してもローディングは解除
      }
    };

    initializeApp();
  }, []);

  const handleLogout = () => {
    // ローカルストレージをクリア
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    authAPI.logout(); // APIの関数を使用
    router.push('/auth/login');
  };

  // 🚨 EMERGENCY RESET FUNCTION
  const handleEmergencyReset = () => {
    console.log('🚨 EMERGENCY RESET - Clearing all localStorage');
    localStorage.clear();
    // リロードではなく、ログイン画面に直接移動
    window.location.href = '/auth/register';
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
            
            {/* 🚨 EMERGENCY RESET BUTTON */}
            <button 
              onClick={handleEmergencyReset}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              🚨 緊急リセット（無限ループ解消）
            </button>
            
            {/* 🧪 TEST LINKS */}
            <div className="mt-4 space-y-2">
              <div>
                <a 
                  href="/auth/register" 
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors inline-block"
                >
                  📝 新規登録ページ (直接リンク)
                </a>
              </div>
              <div>
                <a 
                  href="/auth/login" 
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors inline-block"
                >
                  🔑 ログインページ (直接リンク)
                </a>
              </div>
            </div>
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
      <TopQuickLinks />
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
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
        <div className="neo-card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden neo-avatar">
                <Image
                  src="/images/demo.png"
                  alt={user.username}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[var(--text-secondary)]">ようこそ</span>
                <span className="font-medium text-[var(--text-primary)]">{user.username}さん</span>
              </div>
            </div>
            
            <Link href="/profile">
              <button className="neo-btn px-3 py-2 text-sm whitespace-nowrap">
                編集する
              </button>
            </Link>
          </div>
        </div>

        {/* メインテキスト */}
        <h2 className="text-xl font-medium mb-8" style={{color: 'var(--color-primary-600)'}}>今日は何をしますか？</h2>

        {/* メニューボタン */}
        <nav className="flex flex-col space-y-4">
          {/* 会話練習機能 - 1番目 */}
          <Link href="/conversation/modes">
            <button className="neo-btn w-full flex items-center justify-center gap-3 py-4" style={{background: 'linear-gradient(135deg, var(--light-orange), var(--primary-orange))'}}>
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="font-medium text-white">聴く練習</span>
            </button>
          </Link>

          {/* AIカウンセラー - 2番目、白地にオレンジスタンプ */}
          <Link href="/counselor">
            <button className="neo-btn w-full flex items-center justify-center gap-3 py-4">
              <User className="w-5 h-5" style={{color: 'var(--primary-orange)'}} />
              <span className="font-medium">AIカウンセラー</span>
            </button>
          </Link>

          {/* MBTI Marriage診断機能 - 3番目 */}
          <Link href="/marriage-mbti-test">
            <button className="neo-btn w-full flex items-center justify-center gap-3 py-4">
              <Heart className="w-5 h-5" style={{color: 'var(--primary-orange)'}} />
              <span className="font-medium">MBTI Marriage</span>
            </button>
          </Link>

          {/* スタイリング提案機能 - 4番目 */}
          <Link href="/styling">
            <button className="neo-btn neo-btn-secondary w-full flex items-center justify-center gap-3 py-4">
              <Palette className="w-5 h-5" />
              <span className="font-medium">スタイリング提案</span>
            </button>
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
      </div>
    </Layout>
  );
}
