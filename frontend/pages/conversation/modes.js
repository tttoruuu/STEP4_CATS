import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { ArrowLeft, MessageCircle, Heart, Copy, TrendingUp, Users } from 'lucide-react';

export default function ConversationModes() {
  const router = useRouter();

  const conversationModes = [
    {
      id: 'greeting',
      title: '挨拶・アイスブレイク',
      icon: MessageCircle,
      path: '/conversation/greeting'
    },
    {
      id: 'empathy',
      title: 'あいづち・共感',
      icon: Heart,
      path: '/conversation/empathy-new'
    },
    {
      id: 'repeat',
      title: '会話ポイント全コピー',
      icon: Copy,
      path: '/conversation/repeat-new'
    },
    {
      id: 'integrated-conversation',
      title: '聞く力トレーニング',
      icon: TrendingUp,
      path: '/conversation/integrated-practice'
    },
    {
      id: 'free',
      title: 'フリー会話',
      icon: Users,
      path: '/conversation'
    }
  ];

  return (
    <Layout title="会話ゲームモード選択">
      <div className="flex flex-col items-center min-h-screen px-6 py-4" style={{background: 'var(--bg-gradient-main)', color: 'var(--color-gray-800)'}}>
        <div className="w-full max-w-md mt-8 relative">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-1 transition-opacity absolute left-0"
            style={{color: 'var(--color-primary-500)'}}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mt-16 mb-8 text-center" style={{color: 'var(--color-primary-500)'}}>
          会話ゲームモードを選択
        </h1>
        
        <p className="text-center mb-8 max-w-md" style={{color: 'var(--color-gray-600)'}}>
          会話スキルを練習して、素敵なコミュニケーションを身につけましょう
        </p>
        
        <div className="w-full max-w-md space-y-4">
          {conversationModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Link key={mode.id} href={mode.path}>
                <div 
                  className="card text-white relative transition-all duration-200 transform hover:scale-105 cursor-pointer"
                  style={{
                    background: 'var(--bg-gradient-primary)',
                    minHeight: '80px'
                  }}
                >
                  {mode.badge && (
                    <div className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded font-medium" style={{color: 'var(--color-success)'}}>
                      {mode.badge}
                    </div>
                  )}
                  <div className="flex items-center gap-4 h-full">
                    <div className="flex-shrink-0">
                      <IconComponent size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-center">{mode.title}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/conversation/tips-selection">
            <span 
              className="transition-opacity cursor-pointer"
              style={{color: 'var(--color-primary-500)'}}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              会話のTips
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}