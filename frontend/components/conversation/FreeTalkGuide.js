import React, { useState } from 'react';
import { Users, MessageCircle, Clock, Award, Heart, Star } from 'lucide-react';

const FreeTalkGuide = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#FFF8F3' }}>
      <div className="max-w-2xl w-full">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#FF6B35' }}>
            フリー聴く練習
          </h1>
          <p className="text-gray-600">
            いろいろなタイプの女性と自由に会話
          </p>
        </div>

        {/* 機能説明カード */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-8 h-8 mr-3" style={{ color: '#FF6B35' }} />
            <h2 className="text-xl font-semibold">機能の説明</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            さまざまなタイプの女性キャラクターと自由に会話の練習ができます。
            4人の個性的なキャラクターから選んで、
            実際のデートや婚活の場面を想定した聴く練習を行いましょう。
          </p>
        </div>

        {/* 練習方法カード */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 mr-3" style={{ color: '#FF6B35' }} />
            <h2 className="text-xl font-semibold">練習方法</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">1</span>
              </div>
              <div>
                <p className="text-gray-700">
                  <Users className="inline w-4 h-4 mr-1" />
                  相手を選ぶ
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  4人のキャラクターから会話したい相手を選びます
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">2</span>
              </div>
              <div>
                <p className="text-gray-700">
                  <MessageCircle className="inline w-4 h-4 mr-1" />
                  自由に会話する
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  テキストや音声入力で自然な会話を楽しみます
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">3</span>
              </div>
              <div>
                <p className="text-gray-700">
                  <Clock className="inline w-4 h-4 mr-1" />
                  5分以上練習すると評価が返ってくる
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  会話を続けて5分経過すると、詳しいフィードバックがもらえます
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>💡 ポイント：</strong>
              相手のキャラクター特性を理解して、それぞれに合った話題や話し方を心がけましょう。
              最低5分間は会話を続けることで、より実践的な練習になります。
            </p>
          </div>
        </div>

        {/* キャラクター紹介 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 mr-3" style={{ color: '#FF6B35' }} />
            <h2 className="text-xl font-semibold">キャラクター紹介</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="text-lg font-semibold text-pink-600 mb-1">佐藤美咲</div>
              <div className="text-sm text-gray-600">28歳・看護師</div>
              <div className="text-xs text-gray-500 mt-1">優しく穏やか・初級</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-600 mb-1">鈴木愛</div>
              <div className="text-sm text-gray-600">26歳・イベントプランナー</div>
              <div className="text-xs text-gray-500 mt-1">明るく社交的・中級</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600 mb-1">田中香織</div>
              <div className="text-sm text-gray-600">32歳・コンサルタント</div>
              <div className="text-xs text-gray-500 mt-1">知的で論理的・中級</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600 mb-1">山田静香</div>
              <div className="text-sm text-gray-600">30歳・図書館司書</div>
              <div className="text-xs text-gray-500 mt-1">控えめで慎重・上級</div>
            </div>
          </div>
        </div>

        {/* 練習開始ボタン */}
        <button
          onClick={onStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full py-4 px-6 rounded-full font-semibold text-lg transition-all duration-300 transform ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          style={{
            background: isHovered 
              ? 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)'
              : 'linear-gradient(135deg, #FF6B35 0%, #F4511E 100%)',
            color: 'white',
            boxShadow: isHovered 
              ? '0 8px 25px rgba(255, 107, 53, 0.35)'
              : '0 4px 15px rgba(255, 107, 53, 0.25)'
          }}
        >
          聴く練習を始める
        </button>
      </div>
    </div>
  );
};

export default FreeTalkGuide;