import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import AudioRecorder from './AudioRecorder';
import TTSAudioPlayer from './TTSAudioPlayer';
import { conversationAPI } from '../services/api';

const ShadowingPractice = ({ 
  scenario, 
  onComplete, 
  onBack 
}) => {
  const [practiceStep, setPracticeStep] = useState('listen'); // 'listen', 'practice', 'record', 'complete'
  const [userRecording, setUserRecording] = useState(null);
  const [practiceCount, setPracticeCount] = useState(0);

  // シナリオが変わったらリセット
  useEffect(() => {
    setPracticeStep('listen');
    setUserRecording(null);
    setPracticeCount(0);
  }, [scenario?.id]);

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

  const correctChoice = scenario && scenario.options ? scenario.options.find(option => option.id === scenario.correctAnswer) : null;

  const handleListenComplete = () => {
    setPracticeStep('practice');
  };

  const handleStartPractice = () => {
    setPracticeStep('practice');
  };

  const handleStartRecording = () => {
    setPracticeStep('record');
  };

  const handleRecordingComplete = (audioBlob, audioUrl) => {
    setUserRecording({ blob: audioBlob, url: audioUrl });
    setPracticeStep('complete');
    setPracticeCount(prev => prev + 1);
  };

  const handleTryAgain = () => {
    setUserRecording(null);
    setPracticeStep('listen');
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
  };

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
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${scenario.category === 'elicit' ? 'from-yellow-500 to-yellow-600' : 'from-purple-500 to-purple-600'} text-white`}>
            {scenario.category === 'elicit' ? '引き出す' : '深める'}
          </span>
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

      {/* 進捗表示 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">練習回数</span>
          <span className="text-sm font-medium text-gray-800">{practiceCount}回</span>
        </div>
        <div className="flex gap-2">
          {['listen', 'practice', 'record', 'complete'].map((step, index) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded ${
                practiceStep === step 
                  ? 'bg-blue-500' 
                  : index < ['listen', 'practice', 'record', 'complete'].indexOf(practiceStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 正解文章表示 */}
      <div className="mb-8">
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
          <h3 className="font-medium text-green-800 mb-3">正解の返答</h3>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            「{scenario.shadowingText || (correctChoice && correctChoice.text)}」
          </p>
          
          {/* OpenAI TTSを使用した音声再生 */}
          <TTSAudioPlayer
            text={scenario.shadowingText || (correctChoice && correctChoice.text)}
            onPlayComplete={practiceStep === 'listen' ? handleListenComplete : undefined}
            onStartPractice={handleStartPractice}
          />
        </div>
      </div>

      {/* ステップ別コンテンツ */}
      {practiceStep === 'listen' && (
        <div className="mb-8 text-center">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              ステップ1: まずは聞いてみましょう
            </h3>
            <p className="text-blue-700 mb-4">
              上の音声を再生して、正解の返答を確認してください
            </p>
            <button
              onClick={handleStartPractice}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              練習を始める
            </button>
          </div>
        </div>
      )}

      {practiceStep === 'practice' && (
        <div className="mb-8 text-center">
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              ステップ2: シャドーイング練習
            </h3>
            <p className="text-yellow-700 mb-4">
              音声を再生しながら、同じタイミングで声に出して練習してください<br/>
              何度でも練習できます
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleStartRecording}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                録音して確認
              </button>
            </div>
          </div>
        </div>
      )}

      {practiceStep === 'record' && (
        <div className="mb-8">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              ステップ3: 録音してみましょう
            </h3>
            <p className="text-red-700 mb-4">
              今度は実際に録音して、あなたの発話を確認してみましょう
            </p>
            
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={false}
            />
          </div>
        </div>
      )}

      {practiceStep === 'complete' && userRecording && (
        <div className="mb-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-4 text-center">
              練習完了！お疲れさまでした
            </h3>
            
            {/* 録音した音声の再生 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">あなたの録音</h4>
              <audio controls className="w-full">
                <source src={userRecording.url} type="audio/wav" />
                お使いのブラウザは音声再生に対応していません。
              </audio>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                もう一度練習
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                練習終了
              </button>
            </div>
          </div>
        </div>
      )}

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