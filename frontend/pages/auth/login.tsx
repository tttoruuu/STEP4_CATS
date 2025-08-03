'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Heart, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import login from '../../components/login';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        }
        window.location.href = "/";
      } else {
        setError('メールアドレスまたはパスワードが間違っています');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
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
              <div className="px-4 py-3 rounded-lg text-sm" style={{backgroundColor: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-error)'}}>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: 'var(--color-gray-700)'}}>
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{color: 'var(--color-gray-400)'}} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="例：example@email.com"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{color: 'var(--color-gray-400)'}} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input pl-10 pr-12"
                  placeholder="パスワードを入力"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                  style={{color: 'var(--color-gray-400)'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-400)'}
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
            <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>
              アカウントをお持ちでない方は
            </p>
            <Link 
              href="/auth/register" 
              className="font-medium transition-colors"
              style={{color: 'var(--color-primary-600)'}}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-700)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
            >
              新規登録はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}