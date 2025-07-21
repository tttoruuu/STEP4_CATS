import React from 'react';
import { Heart, Users, Target, TrendingUp, Share2, RotateCcw } from 'lucide-react';

interface PersonalityScore {
  外向性: number;
  コミュニケーション: number;
  感情安定性: number;
  意思決定: number;
  共感性: number;
  コミット力: number;
}

interface PersonalityDescription {
  title: string;
  summary: string;
  strengths: string;
  marriage_advice: string;
  growth_points: string;
}

interface PersonalityResultProps {
  personalityType: string;
  scores: PersonalityScore;
  description: PersonalityDescription;
  compatibleTypes: string[];
  onRetake?: () => void;
  onShare?: () => void;
  onNext?: () => void;
}

const PersonalityResult: React.FC<PersonalityResultProps> = ({
  personalityType,
  scores,
  description,
  compatibleTypes,
  onRetake,
  onShare,
  onNext
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-[#FF8551] to-[#FFA46D]';
    if (score >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-gray-400 to-gray-600';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return '非常に高い';
    if (score >= 60) return '高い';
    if (score >= 40) return '標準的';
    return '成長の余地あり';
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5]">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">診断結果</h1>
        <p className="text-sm text-gray-600">あなたの性格分析が完了しました</p>
      </div>

      {/* 性格タイプ */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {description.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {description.summary}
          </p>
        </div>

        {/* 強み */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#FF8551]" />
            あなたの強み
          </h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {description.strengths}
            </p>
          </div>
        </div>
      </div>

      {/* スコア詳細 */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-[#FF8551]" />
          詳細スコア
        </h3>
        
        <div className="space-y-4">
          {Object.entries(scores).map(([dimension, score]) => (
            <div key={dimension}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {dimension}
                </span>
                <span className="text-sm text-gray-600">
                  {getScoreText(score)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreColor(score)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 婚活アドバイス */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-[#FF8551]" />
          婚活アドバイス
        </h3>
        <div className="bg-orange-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {description.marriage_advice}
          </p>
        </div>
        
        <h4 className="text-md font-medium text-gray-800 mb-2">成長ポイント</h4>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            {description.growth_points}
          </p>
        </div>
      </div>

      {/* 相性の良いタイプ */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-[#FF8551]" />
          相性の良いタイプ
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {compatibleTypes.map((type, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border border-pink-200"
            >
              <span className="text-sm font-medium text-gray-800">
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="space-y-4">
        {onNext && (
          <button
            onClick={onNext}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            次のステップへ進む
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {onShare && (
            <button
              onClick={onShare}
              className="py-2 px-4 bg-white border border-[#FF8551] text-[#FF8551] rounded-full font-medium text-sm hover:bg-orange-50 transition-colors flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-1" />
              シェア
            </button>
          )}
          
          {onRetake && (
            <button
              onClick={onRetake}
              className="py-2 px-4 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              再診断
            </button>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="text-center mt-8 text-xs text-gray-500">
        この診断結果は参考情報です。実際の相性は個人差があります。
      </div>
    </div>
  );
};

export default PersonalityResult;