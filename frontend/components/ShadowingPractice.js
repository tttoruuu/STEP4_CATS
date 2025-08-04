import { useState, useEffect } from 'react';
import { getPlayableAudioUrl } from '../utils/audioUtils';

const ShadowingPractice = ({ 
  scenario, 
  onComplete, 
  onBack 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!scenario) {
    console.error('シナリオが未定義:', scenario);
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-gray-500">
          シナリオデータが見つかりません
        </div>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          戻る
        </button>
      </div>
    );
  }

  if (!scenario.shadowingAudio) {
    console.warn('シャドーイング音声が見つかりません:', scenario);
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center text-gray-500">
          シャドーイング練習音声が設定されていません
        </div>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          戻る
        </button>
      </div>
    );
  }

  const correctChoice = scenario?.choices?.find(choice => choice.isCorrect) || 
                       (scenario?.options ? scenario.options.find(option => option.id === scenario.correctAnswer) : null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        >
          ← クイズに戻る
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
            シャドーイング練習
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">
          実践練習
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          正解の文章を聞きながら、同じタイミングで発話してみましょう
        </p>
      </div>


      {/* 正解文章表示 */}
      <div className="mb-8">
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
          <h3 className="font-medium text-green-800 mb-3">正解の返答</h3>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            「{scenario.shadowingText || (correctChoice && correctChoice.text)}」
          </p>
          
          <p className="text-gray-700 text-sm mb-4">
            実際に音声を聞いてから、シャドウイングしてみましょう。
          </p>
          
          {/* Azure Blob音声再生 */}
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);

                  // Azure Blob Storageから音声URL取得
                  const audioUrl = await getPlayableAudioUrl(scenario.shadowingAudio);
                  
                  // 音声を再生
                  const audio = new Audio(audioUrl);
                  audio.play().catch(error => {
                    console.error('音声再生エラー:', error);
                    alert('音声の再生に失敗しました。');
                  });

                } catch (error) {
                  console.error('音声取得エラー:', error);
                  alert('音声の再生に失敗しました。ネットワーク接続を確認してください。');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '音声読み込み中...' : '音声で練習する'}
            </button>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3 justify-center mb-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          クイズに戻る
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          練習終了
        </button>
      </div>

      {/* 練習のヒント */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">💡 シャドーイングのコツ</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 最初は音声の後を追うように発話してみましょう</li>
          <li>• 慣れてきたら同じタイミングで発話してみましょう</li>
          <li>• 発音よりも自然なリズムとイントネーションを意識しましょう</li>
          <li>• 感情を込めて話すことで、より自然な会話に近づきます</li>
        </ul>
      </div>
    </div>
  );
};

export default ShadowingPractice;