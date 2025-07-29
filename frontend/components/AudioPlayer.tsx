import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  onPlayComplete?: () => void;
  showSpeedControl?: boolean;
  showLoopControl?: boolean;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = '音声ファイル',
  onPlayComplete,
  showSpeedControl = true,
  showLoopControl = true,
  autoPlay = false
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onPlayComplete) {
        onPlayComplete();
      }
    };

    const handleError = () => {
      setError('音声ファイルの読み込みに失敗しました');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        audio.play().catch(err => {
          console.error('自動再生エラー:', err);
        });
      }
    };

    // イベントリスナー追加
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // 初期設定
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.loop = isLooping;

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, autoPlay, onPlayComplete, volume, playbackRate, isLooping]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('再生エラー:', err);
      setError('音声の再生に失敗しました');
    }
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
    setPlaybackRate(speed);
  };

  const toggleLoop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(audio.currentTime + 5, duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(audio.currentTime - 5, 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* タイトル */}
      {title && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        </div>
      )}

      {/* メインコントロール */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={skipBackward}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isLoading}
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`p-3 rounded-full transition-all ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} className="ml-0.5" />
          )}
        </button>

        <button
          onClick={skipForward}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isLoading}
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={handleReset}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isLoading}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* プログレスバー */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              disabled={isLoading}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 追加コントロール */}
      <div className="flex items-center justify-between">
        {/* 音量調整 */}
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 再生速度 */}
        {showSpeedControl && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 mr-1">速度:</span>
            {[0.5, 0.75, 1.0, 1.25, 1.5].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  playbackRate === speed
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}

        {/* ループ */}
        {showLoopControl && (
          <button
            onClick={toggleLoop}
            className={`px-3 py-1 text-sm rounded transition-all ${
              isLooping
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔁 リピート
          </button>
        )}
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }

        input[type="range"]::-webkit-slider-track {
          background: #e5e7eb;
          border-radius: 4px;
        }

        input[type="range"]::-moz-range-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;