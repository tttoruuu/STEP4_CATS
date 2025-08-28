import React, { useState } from 'react';
import { Play, Pause, Volume2, MessageCircle, Clock, Award } from 'lucide-react';

const IntegratedPracticeGuide = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#FFF8F3' }}>
      <div className="max-w-2xl w-full">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#FF6B35' }}>
            聴く練習 総合編
          </h1>
          <p className="text-gray-600">
            実践的な会話の流れを体験しながら学ぶ
          </p>
        </div>

        {/* 機能説明カード */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-8 h-8 mr-3" style={{ color: '#FF6B35' }} />
            <h2 className="text-xl font-semibold">機能の説明</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            今まで練習してきた内容を、会話の一連の流れで練習することができます。
            実際の会話シーンを想定した総合的なトレーニングで、
            挨拶から共感、繰り返しまで、すべての要素を組み合わせて練習できます。
          </p>
        </div>

        {/* 練習方法カード */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Volume2 className="w-8 h-8 mr-3" style={{ color: '#FF6B35' }} />
            <h2 className="text-xl font-semibold">練習方法</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">1</span>
              </div>
              <div>
                <p className="text-gray-700">
                  <Play className="inline w-4 h-4 mr-1" />
                  再生ボタンを押す
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">2</span>
              </div>
              <div>
                <p className="text-gray-700">
                  女性の声が流れ終わったら
                  <Pause className="inline w-4 h-4 mx-1" />
                  一時停止ボタンを押す
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">3</span>
              </div>
              <div>
                <p className="text-gray-700">
                  声に出して返答をする
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">4</span>
              </div>
              <div>
                <p className="text-gray-700">
                  <Play className="inline w-4 h-4 mr-1" />
                  再生ボタンを押して正解例を聞く
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-orange-600 font-semibold">5</span>
              </div>
              <div>
                <p className="text-gray-700">
                  2に戻る（会話終了まで繰り返し）
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>💡 ポイント：</strong>
              実際の会話のように、自然な流れで練習することが大切です。
              正解例と違っても、自分らしい返答を心がけましょう。
            </p>
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
          練習を始める
        </button>
      </div>
    </div>
  );
};

export default IntegratedPracticeGuide;