'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Heart, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import login from '../../components/login';
import ServiceVideoModal from '../../components/ui/ServiceVideoModal';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await login(formData.email, formData.password);
      
      if (res.success) {
        if (res.data && res.data.access_token) {
          localStorage.setItem('token', res.data.access_token);
          
          // ユーザー情報もローカルストレージに保存
          if (res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        }
        
        // サービス説明動画を表示するかチェック
        console.log('Login response:', res.data);
        console.log('show_service_video:', res.data?.user?.show_service_video);
        
        if (res.data?.user?.show_service_video) {
          console.log('Showing video modal');
          setShowVideoModal(true);
        } else {
          // リダイレクトパラメータがあるかチェック
          const redirectTo = router.query.redirect as string;
          const targetPath = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';
          router.push(targetPath);
        }
      } else {
        setError(res.error || 'メールアドレスまたはパスワードが間違っています');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoModalClose = () => {
    setShowVideoModal(false);
    // リダイレクトパラメータがあるかチェック
    const redirectTo = router.query.redirect as string;
    const targetPath = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';
    router.push(targetPath);
  };

  const handleDontShowAgain = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/user/video-preferences`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ show_service_video: false })
        });

        if (response.ok) {
          // ユーザー情報を更新
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.show_service_video = false;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error('Failed to update video preferences:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{background: 'var(--bg-gradient-main)'}}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="logo justify-center mb-4">
            <Heart className="w-10 h-10" style={{color: 'var(--color-primary-500)'}} />
            <span className="text-3xl font-bold">
              Miraim
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{color: 'var(--color-gray-800)'}}>おかえりなさい</h2>
          <p style={{color: 'var(--color-gray-600)'}}>アカウントにログインしてください</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-lg text-sm" style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)'}}>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: 'var(--color-gray-700)'}}>
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5" style={{color: 'var(--text-light)'}} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                  style={{paddingLeft: '2.5rem'}}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{color: 'var(--color-gray-700)'}}>
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5" style={{color: 'var(--text-light)'}} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input"
                  style={{paddingLeft: '2.5rem', paddingRight: '3rem'}}
                  placeholder="パスワードを入力"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors z-10"
                  style={{color: 'var(--text-light)'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-medium)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 px-4"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{color: 'var(--text-medium)'}}>
              アカウントをお持ちでない方は
            </p>
            <Link 
              href="/auth/register" 
              className="font-medium transition-colors inline-block mt-1"
              style={{color: 'var(--primary-orange)'}}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              新規登録はこちら
            </Link>
          </div>
        </div>
      </div>

      {/* サービス説明動画モーダル */}
      <ServiceVideoModal
        isOpen={showVideoModal}
        onClose={handleVideoModalClose}
        onDontShowAgain={handleDontShowAgain}
      />
    </div>
  );
}