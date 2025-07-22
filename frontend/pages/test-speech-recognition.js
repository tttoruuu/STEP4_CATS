import { useState } from 'react';
import Layout from '../components/Layout';
import { Mic, MicOff } from 'lucide-react';

export default function TestSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 音声録音の開始/停止
  const handleRecordToggle = async () => {
    if (isRecording) {
      // 録音停止
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    } else {
      // 録音開始
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          
          // ローカルでテスト（ダミーのレスポンス）
          await processAudio(audioBlob);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setError('');
      } catch (error) {
        console.error('マイクアクセスエラー:', error);
        setError('マイクへのアクセスが拒否されました');
      }
    }
  };

  // 音声処理（ローカルテスト用）
  const processAudio = async (audioBlob) => {
    setLoading(true);
    
    // ローカルテスト用のダミー処理
    setTimeout(() => {
      setTranscribedText('これは音声認識のテストメッセージです。実際のAPIが実装されると、ここに音声から変換されたテキストが表示されます。');
      setLoading(false);
    }, 2000);

    // 実際のAPI実装時のコード（コメントアウト）
    /*
    try {
      const formData = new FormData();
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      formData.append('audio', audioFile);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setTranscribedText(data.text);
    } catch (error) {
      console.error('音声認識エラー:', error);
      setError('音声認識に失敗しました');
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <Layout title="音声認識テスト">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">音声認識機能テスト</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                マイクボタンをタップして録音を開始してください
              </p>
              
              <button
                onClick={handleRecordToggle}
                disabled={loading}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              
              {isRecording && (
                <p className="text-red-500 mt-3 animate-pulse">録音中...</p>
              )}
              
              {loading && (
                <p className="text-blue-500 mt-3">音声を処理中...</p>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {transcribedText && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">認識結果:</h3>
                <p className="text-gray-700">{transcribedText}</p>
              </div>
            )}
          </div>

          <div className="mt-8 bg-yellow-100 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 テスト情報</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• このページはローカルテスト用です</li>
              <li>• 実際のAPIは実装準備中です</li>
              <li>• 録音後2秒でダミーテキストが表示されます</li>
              <li>• ブラウザでマイクの許可が必要です</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}