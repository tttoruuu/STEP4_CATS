import React from 'react';
import { Heart, Users, Target, TrendingUp, Share2, RotateCcw, ArrowRight, Brain, Award, Star } from 'lucide-react';
import type { MarriageMBTIResult } from '../services/marriageMbtiAPI';

interface MarriageMBTIResultProps {
  result: MarriageMBTIResult;
  onRetake?: () => void;
  onShare?: () => void;
  onNext?: () => void;
}

const MarriageMBTIResultComponent: React.FC<MarriageMBTIResultProps> = ({
  result,
  onRetake,
  onShare,
  onNext
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'from-green-400 to-green-600';
    if (score >= 3.0) return 'from-[#FF8551] to-[#FFA46D]';
    if (score >= 2.0) return 'from-yellow-400 to-yellow-600';
    return 'from-gray-400 to-gray-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 4.0) return '非常に高い';
    if (score >= 3.0) return '高い';
    if (score >= 2.0) return '標準的';
    return '成長の余地あり';
  };

  const getMBTIScorePercentage = (score: number, total: number = 16) => {
    return Math.round((score / total) * 100);
  };

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      communication: 'コミュニケーション',
      lifestyle: 'ライフスタイル', 
      values: '価値観',
      future: '将来設計',
      intimacy: '親密さ'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-indigo-100">
      {/* ヘッダー結果 */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-2xl font-bold text-white">{result.mbtiType}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{result.typeName}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* メイングリッド */}
      <div className="space-y-6">
        {/* MBTIスコアと結婚観スコア */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* MBTIスコア詳細 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200/30 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-rose-500" />
              MBTI分析結果
            </h2>
            
            <div className="space-y-4">
              {/* 4軸のペアごとに表示 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                  <span className="font-medium text-gray-800">外向性 vs 内向性</span>
                  <div className="flex gap-2">
                    <div className="text-sm font-bold text-rose-600">
                      E: {result.mbtiScores.E} ({getMBTIScorePercentage(result.mbtiScores.E)}%)
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      I: {result.mbtiScores.I} ({getMBTIScorePercentage(result.mbtiScores.I)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-800">感覚 vs 直感</span>
                  <div className="flex gap-2">
                    <div className="text-sm font-bold text-rose-600">
                      S: {result.mbtiScores.S} ({getMBTIScorePercentage(result.mbtiScores.S)}%)
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      N: {result.mbtiScores.N} ({getMBTIScorePercentage(result.mbtiScores.N)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium text-gray-800">思考 vs 感情</span>
                  <div className="flex gap-2">
                    <div className="text-sm font-bold text-rose-600">
                      T: {result.mbtiScores.T} ({getMBTIScorePercentage(result.mbtiScores.T)}%)
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      F: {result.mbtiScores.F} ({getMBTIScorePercentage(result.mbtiScores.F)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-gray-800">判断 vs 知覚</span>
                  <div className="flex gap-2">
                    <div className="text-sm font-bold text-rose-600">
                      J: {result.mbtiScores.J} ({getMBTIScorePercentage(result.mbtiScores.J)}%)
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      P: {result.mbtiScores.P} ({getMBTIScorePercentage(result.mbtiScores.P)}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 結婚観スコア */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/30 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-500" />
              結婚観分析
            </h2>
            
            <div className="space-y-4">
              {Object.entries(result.marriageScores).map(([dimension, score]) => (
                <div key={dimension}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{getCategoryName(dimension)}</span>
                    <span className="text-sm font-bold text-blue-600">
                      {score.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-300`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getScoreText(score)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 恋愛・結婚の特徴 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200/30 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-rose-500" />
            恋愛・結婚の特徴
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {result.loveCharacteristics.map((characteristic, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
                <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 font-medium">{characteristic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 相性の良いタイプ */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/30 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            相性の良いタイプ
          </h2>
          <div className="grid md:grid-cols-1 gap-4">
            {result.compatibleTypes.map((type, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200/30">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <div className="font-semibold text-blue-800">{type.type}</div>
                </div>
                <div className="text-sm text-blue-600 pl-8">{type.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* パーソナライズアドバイス */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            あなたへのアドバイス
          </h2>
          <div className="space-y-4">
            {result.advice.map((advice, index) => (
              <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <div className="font-semibold text-indigo-800">{advice.category}</div>
                </div>
                <div className="text-indigo-700 leading-relaxed">{advice.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {onShare && (
            <button
              onClick={onShare}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Share2 className="w-5 h-5" />
              結果をシェア
            </button>
          )}
          
          {onNext && (
            <button
              onClick={onNext}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              次のステップへ
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          
          {onRetake && (
            <button
              onClick={onRetake}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              もう一度診断する
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarriageMBTIResultComponent;