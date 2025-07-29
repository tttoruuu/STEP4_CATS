import { useState } from 'react';
import enhancedTTSAPI from '../services/enhancedTTSApi';

export default function TestTTSSystem() {
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const testTexts = [
    'そうなんですね。もう少し詳しく教えていただけますか？',
    'なるほど、それは大変でしたね。',
    '素晴らしいですね！どんなところが特に好きですか？',
    'これはマッピングされていないテキストです。' // TTS APIフォールバックテスト用
  ];

  const testTTSSystem = async () => {
    setStatus('テスト開始...');
    setResults([]);
    
    const testResults = [];

    for (const text of testTexts) {
      try {
        setStatus(`テスト中: "${text.substring(0, 20)}..."`);
        
        const startTime = Date.now();
        const audioUrl = await enhancedTTSAPI.textToSpeech(text, {
          preferMp3: true,
          voice: 'alloy',
          speed: 0.9
        });
        const endTime = Date.now();

        const result = {
          text,
          audioUrl,
          duration: endTime - startTime,
          source: audioUrl.includes('.mp3') ? 'MP3' : 'TTS API',
          status: 'success'
        };

        testResults.push(result);
        setResults([...testResults]);

      } catch (error) {
        testResults.push({
          text,
          error: error.message,
          status: 'error'
        });
        setResults([...testResults]);
      }
    }

    setStatus('テスト完了！');
  };

  const playAudio = async (audioUrl) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
      audio.addEventListener('ended', () => setIsPlaying(false));
    } catch (error) {
      console.error('再生エラー:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">TTS システムテスト</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">システム概要</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>MP3ファイルが存在する場合は、MP3を優先使用</li>
          <li>MP3がない場合は、OpenAI TTS APIを使用</li>
          <li>すべて失敗した場合は、デフォルト音声を使用</li>
        </ul>
      </div>

      <button
        onClick={testTTSSystem}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-8"
        disabled={status.includes('テスト中')}
      >
        TTSシステムをテスト
      </button>

      {status && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="font-mono">{status}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">テスト結果</h2>
          {results.map((result, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 ${
                result.status === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
              }`}
            >
              <p className="font-medium mb-2">{result.text}</p>
              {result.status === 'success' ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    ソース: <span className="font-mono">{result.source}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    処理時間: <span className="font-mono">{result.duration}ms</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    URL: <span className="font-mono text-xs">{result.audioUrl}</span>
                  </p>
                  <button
                    onClick={() => playAudio(result.audioUrl)}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    disabled={isPlaying}
                  >
                    {isPlaying ? '再生中...' : '再生'}
                  </button>
                </div>
              ) : (
                <p className="text-red-600">エラー: {result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">MP3ファイル設置手順</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            <code className="bg-gray-100 px-2 py-1 rounded">scripts/generate-tts-samples.js</code> を実行
          </li>
          <li>
            または手動で <code className="bg-gray-100 px-2 py-1 rounded">frontend/public/audio/conversation/</code> に配置
          </li>
          <li>
            ファイル名は <code className="bg-gray-100 px-2 py-1 rounded">enhancedTTSApi.js</code> の audioMappings を参照
          </li>
        </ol>
      </div>
    </div>
  );
}