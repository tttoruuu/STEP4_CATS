import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { ArrowLeft, MessageCircle, Heart, Copy, Lightbulb, Search, Users } from 'lucide-react';

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
      id: 'elicit',
      title: '会話を引き出す',
      description: '相手が話しやすいように話題を広げる質問の練習',
      icon: Lightbulb,
      color: 'from-yellow-500 to-yellow-600',
      path: '/conversation/elicit'
    },
    {
      id: 'deepen',
      title: '深掘りする',
      description: '引き出した会話の中から相手が興味を持つポイントをさらに質問して掘り下げる練習',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      path: '/conversation/deepen'
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
    <Layout title="会話練習モード選択">
      <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] text-gray-800 px-6 py-4">
        <div className="w-full max-w-md mt-8 relative">
          <button 
            onClick={() => router.push('/')}
            className="text-[#FF8551] flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-0"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold mt-16 mb-8 text-center text-[#FF8551]">
          会話練習モードを選択
        </h1>
        
        <p className="text-center text-gray-600 mb-8 max-w-md">
          聞く力を向上させるための6つの練習モードから選択してください
        </p>
        
        <div className="w-full max-w-md space-y-4">
          {conversationModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Link key={mode.id} href={mode.path}>
                <div className={`bg-gradient-to-r ${mode.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer`}>
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
            <span className="text-[#FF8551] hover:opacity-80 transition-opacity cursor-pointer">
              会話のTips
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}