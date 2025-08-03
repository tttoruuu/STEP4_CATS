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
      title: '挨拶（アイスブレイク含む）',
      description: '切り出し方や初めて会う人との会話導入練習',
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-600',
      path: '/conversation/greeting'
    },
    {
      id: 'empathy',
      title: 'あいづち・共感',
      description: '「へえ」「ほう」などの適切な相槌、相手の話に共感を示す練習',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      path: '/conversation/empathy-new'
    },
    {
      id: 'repeat',
      title: '相手の会話ポイント全コピー',
      description: '相手の言葉を要約せずそのまま繰り返す練習',
      icon: Copy,
      color: 'from-green-500 to-green-600',
      path: '/conversation/repeat-new'
    },
    {
      id: 'integrated-conversation',
      title: '聞く力トレーニング（初級・上級）',
      description: '会話を引き出す・深掘りするスキルを初級・上級のレベル別で体系的に習得',
      icon: TrendingUp,
      color: 'from-green-500 to-blue-500',
      path: '/conversation/integrated-practice'
    },
    {
      id: 'free',
      title: 'フリー会話する',
      description: '相手を登録して自由に会話を練習',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
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
          聞く力を向上させるための5つの練習モードから選択してください
        </p>
        
        <div className="w-full max-w-md space-y-4">
          {conversationModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Link key={mode.id} href={mode.path}>
                <div 
                  className={`card text-white relative transition-all duration-200 transform hover:scale-105 cursor-pointer`}
                  style={{
                    background: mode.id === 'greeting' ? 'var(--bg-gradient-secondary)' :
                               mode.id === 'empathy' ? 'var(--bg-gradient-accent)' :
                               mode.id === 'repeat' ? 'var(--color-success)' :
                               mode.id === 'integrated-conversation' ? 'var(--bg-gradient-mixed)' :
                               'var(--bg-gradient-primary)'
                  }}
                >
                  {mode.badge && (
                    <div className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded font-medium" style={{color: 'var(--color-success)'}}>
                      {mode.badge}
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{mode.title}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {mode.description}
                      </p>
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