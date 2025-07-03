import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { Heart, Brain, Users, Target, TrendingUp } from 'lucide-react';

export default function CompatibilityIndex() {
  const router = useRouter();
  const [completedTests, setCompletedTests] = useState({
    mbti: false,
    lifestyle: false,
    love: false
  });

  const testSections = [
    {
      id: 'mbti',
      title: 'MBTI性格診断',
      description: 'あなたの性格タイプを16型に分類し、相性の良いタイプを分析します',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-500',
      duration: '約10分',
      questions: '60問',
      link: '/compatibility/mbti'
    },
    {
      id: 'lifestyle',
      title: 'ライフスタイル診断',
      description: '価値観や生活習慣から理想のパートナー像を明確化します',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      duration: '約7分',
      questions: '40問',
      link: '/compatibility/lifestyle'
    },
    {
      id: 'love',
      title: '恋愛傾向分析',
      description: 'あなたの恋愛パターンや相性の良い関係性を分析します',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      duration: '約5分',
      questions: '25問',
      link: '/compatibility/love'
    }
  ];

  const overallCompletionRate = Object.values(completedTests).filter(Boolean).length / Object.keys(completedTests).length * 100;

  return (
    <Layout title="相性診断">
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
          <h1 className="text-2xl font-bold text-[#FF8551] mb-2">相性診断</h1>
          <p className="text-gray-600 text-sm">
            科学的な分析であなたの<br />
            理想のパートナー像を見つけましょう
          </p>
        </div>

        {/* 進捗状況 */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">診断進捗</h3>
            <span className="text-[#FF8551] font-medium">{Math.round(overallCompletionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallCompletionRate}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>
              {Object.values(completedTests).filter(Boolean).length} / {Object.keys(completedTests).length} 完了
            </span>
          </div>
        </div>

        {/* 診断メニュー */}
        <div className="space-y-4 mb-8">
          {testSections.map((test) => (
            <Link key={test.id} href={test.link}>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${test.color} p-3 rounded-xl text-white`}>
                    {test.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-800">{test.title}</h3>
                      {completedTests[test.id] && (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          完了
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ {test.duration}</span>
                      <span>📝 {test.questions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 総合結果 */}
        {overallCompletionRate === 100 && (
          <Link href="/compatibility/results">
            <div className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] p-6 rounded-xl text-white mb-6 hover:opacity-90 transition-opacity">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6" />
                <h3 className="font-medium">総合診断結果を見る</h3>
              </div>
              <p className="text-sm opacity-90">
                すべての診断が完了しました。あなたの理想のパートナー像を確認しましょう。
              </p>
            </div>
          </Link>
        )}

        {/* 診断について */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="font-medium text-gray-800 mb-4">診断について</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>科学的な心理学理論に基づいた信頼性の高い診断です</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>診断結果は個人情報として安全に管理されます</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8551] rounded-full mt-2 flex-shrink-0"></div>
              <p>定期的に診断を受け直すことで、より精度が向上します</p>
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