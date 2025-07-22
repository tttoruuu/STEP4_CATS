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
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
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
          <h1 className="text-2xl font-bold text-[#FF8551] mb-2">スタイリング提案</h1>
          <p className="text-gray-600 text-sm">
            あなたの魅力を最大限に引き出す<br />
            トータルスタイリングをサポート
          </p>
        </div>

        {/* 進捗状況 */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">スタイリング進捗</h3>
            <span className="text-[#FF8551] font-medium">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {completedCategories} / {totalCategories} カテゴリー完了
          </p>
        </div>

        {/* スタイリングカテゴリー */}
        <div className="space-y-4 mb-8">
          {styleCategories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${category.color} p-3 rounded-xl text-white`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-800">{category.title}</h3>
                      {userProfile[category.id] && (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          完了
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {category.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
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
        <div className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] p-6 rounded-xl text-white mb-6">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="w-6 h-6" />
            <h3 className="font-medium">おすすめ製品</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            あなたに最適化されたマンダム製品をAIが選んでご提案します
          </p>
          <Link href="/styling/products">
            <button className="bg-white text-[#FF8551] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
              製品を見る
            </button>
          </Link>
        </div>

        {/* スタイリングのコツ */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="font-medium text-gray-800 mb-4">スタイリングのコツ</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>第一印象は見た目が55%を占めると言われています</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>清潔感が最も重要なポイントです</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>自分に似合うスタイルを見つけることが大切です</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>継続的なケアが美しさを保つ秘訣です</p>
            </div>
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← ホームに戻る
          </button>
        </div>
      </main>
    </Layout>
  );
}