import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { Palette, Shirt, Scissors, Sparkles, Camera, ShoppingBag } from 'lucide-react';

export default function StylingIndex() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({
    skincare: false,
    fashion: false,
    hair: false,
    grooming: false
  });

  const styleCategories = [
    {
      id: 'skincare',
      title: 'スキンケア',
      description: '清潔感のある肌作りのアドバイス',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      link: '/styling/skincare',
      features: ['肌質診断', 'ケアルーティン', '製品推薦']
    },
    {
      id: 'fashion',
      title: 'ファッション',
      description: '体型・年代別の服装提案',
      icon: <Shirt className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500',
      link: '/styling/fashion',
      features: ['体型診断', 'TPO別提案', 'コーディネート']
    },
    {
      id: 'hair',
      title: 'ヘアスタイル',
      description: '顔型に合う髪型提案',
      icon: <Scissors className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      link: '/styling/hair',
      features: ['顔型分析', 'スタイル提案', 'セット方法']
    },
    {
      id: 'grooming',
      title: '身だしなみ',
      description: '総合的なグルーミングアドバイス',
      icon: <Camera className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      link: '/styling/grooming',
      features: ['眉毛ケア', '髭の整え方', '体臭対策']
    }
  ];

  const completedCategories = Object.values(userProfile).filter(Boolean).length;
  const totalCategories = Object.keys(userProfile).length;
  const completionRate = (completedCategories / totalCategories) * 100;

  return (
    <Layout title="スタイリング提案">
      <main className="max-w-sm mx-auto px-6 py-8 min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 relative mb-4 flex justify-center mx-auto">
            <Image
              src="/images/logo.png"
              alt="Miraim ロゴ"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{color: 'var(--primary-orange)'}}>スタイリング提案</h1>
          <p className="text-sm" style={{color: 'var(--text-medium)'}}>
            あなたの魅力を最大限に引き出す<br />
            トータルスタイリングをサポート
          </p>
        </div>

        {/* 進捗状況 */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{color: 'var(--text-dark)'}}>スタイリング進捗</h3>
            <span className="font-medium" style={{color: 'var(--primary-orange)'}}>{Math.round(completionRate)}%</span>
          </div>
          <div className="progress mb-4">
            <div 
              className="progress-bar"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="text-sm" style={{color: 'var(--text-medium)'}}>
            {completedCategories} / {totalCategories} カテゴリー完了
          </p>
        </div>

        {/* スタイリングカテゴリー */}
        <div className="space-y-4 mb-8">
          {styleCategories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className="card">
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl text-white"
                    style={{
                      background: category.id === 'skincare' ? '#10B981' :
                                 category.id === 'fashion' ? 'linear-gradient(135deg, var(--light-orange), var(--pale-orange))' :
                                 category.id === 'hair' ? 'linear-gradient(135deg, var(--primary-orange), var(--light-orange))' :
                                 'linear-gradient(135deg, var(--primary-orange), var(--pale-orange))',
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    <div style={{position: 'relative', zIndex: 11}}>
                      {category.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium" style={{color: 'var(--text-dark)'}}>{category.title}</h3>
                      {userProfile[category.id] && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981'}}>
                          完了
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-3" style={{color: 'var(--text-medium)'}}>{category.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {category.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs rounded-full"
                          style={{backgroundColor: 'var(--pale-orange)', color: 'var(--text-medium)'}}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* マンダム製品推薦 */}
        <div className="neo-card p-6 text-white mb-6" style={{background: 'linear-gradient(135deg, var(--primary-orange), var(--light-orange))'}}>
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="w-6 h-6" style={{position: 'relative', zIndex: 11}} />
            <h3 className="font-medium">おすすめ製品</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            あなたに最適化されたマンダム製品をAIが選んでご提案します
          </p>
          <Link href="/styling/products">
            <button className="btn btn-ghost text-sm px-4 py-2" style={{backgroundColor: 'white', color: 'var(--primary-orange)'}}>
              製品を見る
            </button>
          </Link>
        </div>

        {/* スタイリングのコツ */}
        <div className="card mb-6">
          <h3 className="font-medium mb-4" style={{color: 'var(--text-dark)'}}>スタイリングのコツ</h3>
          <div className="space-y-3 text-sm" style={{color: 'var(--text-medium)'}}>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              <p>第一印象は見た目が55%を占めると言われています</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              <p>清潔感が最も重要なポイントです</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              <p>自分に似合うスタイルを見つけることが大切です</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: 'var(--primary-orange)'}}></div>
              <p>継続的なケアが美しさを保つ秘訣です</p>
            </div>
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="transition-colors"
            style={{color: 'var(--text-light)'}}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
          >
            ← ホームにもどる
          </button>
        </div>
      </main>
    </Layout>
  );
}