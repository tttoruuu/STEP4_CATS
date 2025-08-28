import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { ArrowLeft, MessageCircle, Heart, Copy, TrendingUp, Users } from 'lucide-react';

export default function ConversationModes() {
  const router = useRouter();

  const conversationCategories = {
    basic: {
      title: '基本練習',
      description: '会話の基本スキルを練習',
      modes: [
        {
          id: 'greeting',
          title: '挨拶・アイスブレイク',
          icon: MessageCircle,
          path: '/conversation/greeting-new',
          step: 1
        },
        {
          id: 'empathy',
          title: 'あいづち・共感',
          icon: Heart,
          path: '/conversation/empathy-new',
          step: 2
        },
        {
          id: 'repeat',
          title: '会話ポイント全コピー',
          icon: Copy,
          path: '/conversation/repeat-new',
          step: 3
        }
      ]
    },
    advanced: {
      title: '応用練習',
      description: 'より高度な会話スキルを習得',
      modes: [
        {
          id: 'deepen-conversation',
          title: '深掘りトレーニング',
          icon: TrendingUp,
          path: '/conversation/deepen',
          step: 4
        },
        {
          id: 'integrated-practice',
          title: '総合練習',
          icon: Users,
          path: '/conversation/integrated-practice',
          step: 5
        },
        {
          id: 'free',
          title: 'フリー会話',
          icon: Users,
          path: '/conversation/practice-new',
          step: 6
        }
      ]
    }
  };

  return (
    <Layout title="聴く練習モード選択">
      <div className="flex flex-col items-center min-h-screen px-6 py-4 bg-[var(--bg-color)]">
        <div className="w-full max-w-md mt-8 relative">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-1 transition-opacity absolute left-0 text-[var(--primary-orange)]"
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mt-16 mb-8 text-center text-[var(--primary-orange)]">
          聴く練習モードを選択
        </h1>
        
        {/* ステップバイステップガイド */}
        <div className="neo-card mb-6 max-w-md">
          <h3 className="font-semibold mb-4 text-center text-[var(--primary-orange)]">📈 おすすめ学習フロー</h3>
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((step, index) => (
              <div key={step} className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    backgroundColor: step <= 1 ? 'var(--primary-orange)' : 'var(--pale-orange)',
                    color: step <= 1 ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {step}
                </div>
                {index < 5 && (
                  <div 
                    className="w-8 h-0.5 mx-1"
                    style={{backgroundColor: step < 1 ? 'var(--primary-orange)' : 'var(--pale-orange)'}}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-[var(--text-secondary)]">
            基本から始めて、ステップアップしていきましょう
          </p>
        </div>

        <div className="w-full max-w-md space-y-6">
          {Object.entries(conversationCategories).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              {/* カテゴリータイトル */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1 text-[var(--primary-orange)]">
                  {category.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {category.description}
                </p>
              </div>
              
              {/* モードボタン */}
              <div className="space-y-3">
                {category.modes.map((mode) => {
                  const IconComponent = mode.icon;
                  return (
                    <Link key={mode.id} href={mode.path}>
                      <div 
                        className="neo-btn relative transition-all duration-200 transform hover:scale-102 cursor-pointer flex items-center"
                        style={{
                          minHeight: '70px'
                        }}
                      >
                        {/* ステップ番号 */}
                        <div 
                          className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--primary-orange)] text-white"
                        >
                          {mode.step}
                        </div>
                        
                        <div className="flex items-center gap-4 h-full pl-10">
                          <div className="flex-shrink-0">
                            <IconComponent size={24} className="text-[var(--primary-orange)]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base text-[var(--text-primary)]">{mode.title}</h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/conversation/tips-selection">
            <span 
              className="transition-opacity cursor-pointer text-[var(--primary-orange)]"
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