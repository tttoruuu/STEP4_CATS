import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const ShadowingPractice = ({ 
  scenario, 
  onComplete, 
  onBack 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

  // 音声ファイルの有効性チェック（null、undefined、空文字、バッククォート等を全てnull扱い）
  const isValidAudio = (audioUrl) => {
    // undefinedやnullの場合は即座にfalse
    if (audioUrl === undefined || audioUrl === null) {
      return false;
    }
    
    // 空文字やfalsy値の場合
    if (!audioUrl) {
      return false;
    }
    
    const trimmed = String(audioUrl).trim();
    
    // バッククォートのパターンをチェック
    if (trimmed === '' || trimmed === '``' || trimmed === '` `' || trimmed.match(/^`+$/)) {
      return false;
    }
    
    // HTTPSで始まるかチェック
    if (!trimmed.startsWith('http')) {
      return false;
    }
    
    return true;
  };

  // elicit_003（問題6）は強制的に音声なしとして扱う
  if (!isValidAudio(scenario.shadowingAudio) || scenario.id === 'elicit_003') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 justify-center">
            <AlertCircle className="text-yellow-600" size={20} />
            <span className="text-yellow-800">音声は準備中です</span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
          
          {/* Azure Blob Storage MP3再生 */}
          {(!isValidAudio(scenario.shadowingAudio) || scenario.id === 'elicit_003') && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="text-yellow-800 text-sm">音声は準備中です</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isPlaying) return;
                
                let audioUrl = scenario.shadowingAudio;
                
                // advanced_002は強制的にa2-a.mp3を使用
                if (scenario.id === 'advanced_002') {
                  audioUrl = 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a2-a.mp3';
                }
                
                // advanced_002は強制的に音声再生を許可
                if (scenario.id === 'advanced_002') {
                  // 音声再生処理をスキップして直接再生
                } else if (!isValidAudio(audioUrl) || scenario.id === 'elicit_003') {
                  alert('音声は準備中です');
                  return;
                }
                
                // 音声を直接再生を試行
                setIsPlaying(true);
                
                const audio = new Audio(audioUrl);
                
                audio.addEventListener('ended', () => {
                  setIsPlaying(false);
                });
                
                audio.addEventListener('error', () => {
                  console.error('音声再生エラー:', audioUrl);
                  setIsPlaying(false);
                  alert('音声は準備中です');
                });
                
                audio.play().catch(error => {
                  console.error('音声再生エラー:', error);
                  setIsPlaying(false);
                  alert('音声は準備中です');
                });
              }}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isPlaying 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isPlaying ? '再生中...' : '練習する'}
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