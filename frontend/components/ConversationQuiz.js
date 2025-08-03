import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

const ConversationQuiz = ({ 
  scenario, 
  onComplete, 
  onShadowingStart,
  showShadowingButton = true 
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // シナリオが変わったらリセット
  useEffect(() => {
    setSelectedChoice(null);
    setShowResult(false);
    setIsAnswered(false);
  }, [scenario?.id]);

  if (!scenario) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-gray-500">
          シナリオが見つかりません
        </div>
      </div>
    );
  }

  const handleChoiceSelect = (choice) => {
    if (isAnswered) return;
    
    setSelectedChoice(choice);
    setShowResult(true);
    setIsAnswered(true);
  };

  const handleShadowing = () => {
    if (onShadowingStart) {
      onShadowingStart(scenario);
    }
  };

  const handleNextScenario = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* シナリオ情報 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
            {scenario.level === 'beginner' ? '初級' : scenario.level === 'intermediate' ? '中級' : '上級'}
          </span>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-800 mb-1">場面設定</h3>
          <p className="text-gray-700 text-sm">{scenario.situation}</p>
        </div>
      </div>

      {/* 女性の発言 */}
      <div className="mb-8">
        <div className="bg-pink-50 border-l-4 border-pink-400 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">女性</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-800 leading-relaxed">
                「{scenario.womanText}」
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 選択肢 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          どのように返答しますか？
        </h3>
        
        <div className="space-y-3">
          {scenario.options.map((choice, index) => {
            const isSelected = selectedChoice?.id === choice.id;
            const isCorrect = choice.id === scenario.correctAnswer;
            const isIncorrect = choice.id !== scenario.correctAnswer;
            
            let buttonClasses = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
            
            if (!isAnswered) {
              buttonClasses += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
            } else if (isSelected && isCorrect) {
              buttonClasses += "border-green-500 bg-green-50 text-green-800";
            } else if (isSelected && isIncorrect) {
              buttonClasses += "border-red-500 bg-red-50 text-red-800";
            } else if (isCorrect) {
              buttonClasses += "border-green-500 bg-green-50 text-green-800";
            } else {
              buttonClasses += "border-gray-200 bg-gray-50 text-gray-500";
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                className={buttonClasses}
                disabled={isAnswered}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <p className="flex-1">{choice.text}</p>
                  {isAnswered && isCorrect && (
                    <span className="text-green-600">✓</span>
                  )}
                  {isAnswered && isSelected && isIncorrect && (
                    <span className="text-red-600">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 結果表示 */}
      {showResult && selectedChoice && (
        <div className="mb-8">
          <div className={`p-6 rounded-lg border-2 ${selectedChoice.id === scenario.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-2xl ${selectedChoice.id === scenario.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {selectedChoice.id === scenario.correctAnswer ? '✓' : '✗'}
              </span>
              <h3 className={`text-lg font-medium ${selectedChoice.id === scenario.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                {selectedChoice.id === scenario.correctAnswer ? '正解です！' : '不正解です'}
              </h3>
            </div>
            
            <div className={`${selectedChoice.id === scenario.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
              <h4 className="font-medium mb-2">フィードバック</h4>
              <p className="leading-relaxed">{selectedChoice.feedback}</p>
            </div>
            
            {scenario.explanation && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2 text-gray-800">解説</h4>
                <p className="text-gray-700 leading-relaxed">{scenario.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ヒント */}
      {showResult && scenario.tip && (
        <div className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-lg">💡</span>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">ヒント</h4>
                <p className="text-yellow-700 text-sm">{scenario.tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アクションボタン */}
      {showResult && (
        <div className="flex gap-3 justify-center">
          {showShadowingButton && scenario.shadowingAudio && (
            <button
              onClick={handleShadowing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              シャドーイング練習へ
            </button>
          )}
          
          <button
            onClick={handleNextScenario}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationQuiz;