import { useState, useRef } from 'react';
import { conversationAPI } from '../services/api';
import enhancedTTSAPI from '../services/enhancedTTSApi';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

const TTSAudioPlayer = ({ text, onPlayComplete, onStartPractice }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);

  const handleGenerateAndPlay = async () => {
    if (!text) {
      setError('読み上げるテキストがありません。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('TTS音声生成開始:', text.substring(0, 50) + '...');
      
      // 拡張TTSサービスを使用（MP3優先、APIフォールバック）
      const audioUrl = await enhancedTTSAPI.textToSpeech(text, {
        preferMp3: true,
        voice: 'alloy',
        speed: 0.9
      });
      
      setAudioUrl(audioUrl);
      
      // 音声を自動再生
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
      }
      
    } catch (error) {
      console.error('TTS音声生成エラー:', error);
      setError(error.message || '音声生成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('音声再生エラー:', error);
      setError('音声再生に失敗しました。');
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onPlayComplete) {
      onPlayComplete();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* 正解文章表示 */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
        <h3 className="font-medium text-green-800 mb-3">正解の返答</h3>
        <p className="text-lg text-gray-800 leading-relaxed mb-4">
          「{text}」
        </p>
        
        {/* TTS音声コントロール */}
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔊 AI音声読み上げ</h4>
            <p className="text-blue-700 text-sm mb-3">
              OpenAI TTSで生成された高品質な音声でシャドーイング練習ができます。
            </p>
            
            {/* 音声生成・再生ボタン */}
            <div className="flex items-center gap-3 mb-3">
              {!audioUrl ? (
                <button
                  onClick={handleGenerateAndPlay}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      音声生成中...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      音声を生成して再生
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePlayPause}
                    className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all"
                  >
                    <Square size={16} />
                  </button>
                  
                  <button
                    onClick={() => {
                      setAudioUrl(null);
                      setIsPlaying(false);
                      setCurrentTime(0);
                      setDuration(0);
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all"
                  >
                    <RotateCcw size={16} />
                  </button>
                </>
              )}
              
              {audioUrl && (
                <button
                  onClick={onStartPractice}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  🎤 シャドーイング練習を始める
                </button>
              )}
            </div>
            
            {/* 音声進捗バー */}
            {audioUrl && duration > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                    style={{ 
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600">{formatTime(duration)}</span>
              </div>
            )}
          </div>
          
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-red-700 text-sm">❌ {error}</p>
              <p className="text-red-600 text-xs mt-1">
                音声が生成できない場合は、文章を見ながら音読練習してください。
              </p>
            </div>
          )}
          
          {/* 音読練習のコツ */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm">
            <h5 className="font-medium text-gray-700 mb-2">📝 シャドーイング練習のコツ</h5>
            <ul className="text-gray-600 space-y-1 text-xs">
              <li>• 音声と同じタイミングで発話し、自然なイントネーションを真似る</li>
              <li>• 相手に対する優しさと関心を込めて発音</li>
              <li>• ためらわずに、落ち着いたトーンで話す</li>
              <li>• 音声が止まっても続けて、流れを意識する</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 隠れた音声要素 */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
      )}
    </div>
  );
};

export default TTSAudioPlayer;