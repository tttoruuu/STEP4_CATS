'use client';

import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import AuthChat from '../../components/AuthChat';

export default function RegisterPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
      {!showChat ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center space-y-8 max-w-md">
            {/* Logo */}
            <div className="logo justify-center">
              <Heart className="w-8 h-8" style={{color: 'var(--primary-orange)', zIndex: 10, position: 'relative'}} />
              <span className="text-4xl font-bold" style={{color: 'var(--primary-orange)'}}>
                Miraim
              </span>
            </div>
            
            {/* Hero Text */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold" style={{color: 'var(--text-dark)'}}>
                婚活を頑張るあなたを<br />
                全力でサポート
              </h2>
              <p className="leading-relaxed" style={{color: 'var(--text-medium)'}}>
                内面スタイリングで、<br />
                素敵な出会いを見つけましょう ✨
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowChat(true)}
              className="btn btn-primary w-full py-4 px-8 text-lg"
              style={{borderRadius: '25px'}}
            >
              <MessageCircle className="w-5 h-5" style={{zIndex: 10, position: 'relative'}} />
              <span>新規登録を始める</span>
            </button>

            <p className="text-sm" style={{color: 'var(--text-light)'}}>
              親しみやすい会話形式で<br />
              簡単に登録できます
            </p>

            {/* Login Link */}
            <div className="mt-6">
              <p className="text-sm" style={{color: 'var(--text-medium)'}}>
                既にアカウントをお持ちの方は
              </p>
              <Link 
                href="/auth/login" 
                className="font-medium transition-colors"
                style={{color: 'var(--primary-orange)'}}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-orange)'}
              >
                ログインはこちら
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <AuthChat />
      )}
    </div>
  );
}