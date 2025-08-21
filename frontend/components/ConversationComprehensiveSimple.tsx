import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface ConversationSegment {
  id: number;
  speaker: 'A' | 'B';
  name: string;
  start: number;
  end: number;
  text: string;
}

const ConversationComprehensiveSimple: React.FC = () => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [segments, setSegments] = useState<ConversationSegment[]>([]);
  const [currentSegment, setCurrentSegment] = useState<ConversationSegment | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [continuousPlay, setContinuousPlay] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // セグメントデータをロード
  useEffect(() => {
    if (isClient) {
      loadSegments();
    }
  }, [isClient]);

  const loadSegments = async () => {
    try {
      // VSCodeで編集可能なデータを読み込む
      const response = await fetch('/conversation_segments_editable.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 話者名を整形
      const formattedSegments = data.map((seg: any) => ({
        ...seg,
        name: seg.speaker === 'A' ? '佐藤 (女性)' : '加藤 (男性)'
      }));
      
      setSegments(formattedSegments);
      if (formattedSegments.length > 0) {
        setCurrentSegment(formattedSegments[0]);
      }
    } catch (error) {
      console.error('セグメントデータの読み込みエラー:', error);
    }
  };

  // 個別セグメント再生
  const playSegment = (segment: ConversationSegment) => {
    console.log(`再生開始: ID ${segment.id}, ${segment.start}秒 - ${segment.end}秒, "${segment.text}"`);
    if (!audioRef.current) return;
    
    // 通し再生を停止
    if (continuousPlay) {
      stopContinuousPlay();
    }
    
    // 既存の監視を停止
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    audioRef.current.currentTime = segment.start;
    setCurrentSegment(segment);
    setIsPlaying(true);
    
    audioRef.current.play().catch(e => console.error('再生エラー:', e));
    
    // セグメント終了時に自動停止
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        if (currentTime >= segment.end) {
          console.log(`再生終了: ID ${segment.id}`);
          audioRef.current.pause();
          setIsPlaying(false);
          setCurrentSegment(null);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    }, 50);
  };

  // 通し再生の開始
  const startContinuousPlay = () => {
    if (!audioRef.current) return;
    
    setContinuousPlay(true);
    setIsPlaying(true);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.error('再生エラー:', e));
    
    // 現在の再生位置を監視して対応するセグメントをハイライト
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        
        // 現在再生中のセグメントを見つける
        const activeSegment = segments.find(
          seg => currentTime >= seg.start && currentTime < seg.end
        );
        
        if (activeSegment) {
          setCurrentSegment(activeSegment);
        } else {
          // セグメント間の隙間にいる場合はnullに設定
          setCurrentSegment(null);
        }
        
        // 音声が終了したら停止
        if (audioRef.current.ended) {
          stopContinuousPlay();
        }
      }
    }, 100);
  };

  // 通し再生の停止
  const stopContinuousPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setContinuousPlay(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };


  // クリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <button 
          onClick={() => router.push('/conversation/modes')}
          className="text-[var(--primary-orange)] flex items-center gap-1 hover:opacity-80 transition-opacity mb-6"
        >
          <ArrowLeft size={18} />
          <span>会話練習モード選択に戻る</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">会話練習 総集編</h1>
          <p className="text-[var(--text-medium)]">実践的な会話を通じて総合的なスキルを身につける</p>
        </div>

        {/* 音声プレーヤー */}
        <div className="neo-card mb-6">
          <audio 
            ref={audioRef}
            src="https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/conversation_full.mp3"
            className="w-full mb-4"
            controls
            crossOrigin="anonymous"
          />
          
          {/* 再生コントロール */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (continuousPlay) {
                  stopContinuousPlay();
                } else {
                  startContinuousPlay();
                }
              }}
              className="p-3 rounded-full bg-[var(--primary-orange)] text-white hover:opacity-80 transition-opacity"
              title={continuousPlay ? "停止" : "通し再生"}
            >
              {continuousPlay ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>

        {/* 会話タイムライン */}
        <div className="neo-card">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">会話タイムライン</h3>
          
          <div ref={timelineRef} className="space-y-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                id={`segment-${segment.id}`}
                className={`flex ${segment.speaker === 'A' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-md p-4 rounded-2xl cursor-pointer transition-all ${
                    segment.speaker === 'A' 
                      ? currentSegment?.id === segment.id
                        ? 'bg-[var(--pale-orange)] ring-4 ring-[var(--primary-orange)] shadow-xl'
                        : 'bg-[var(--pale-orange)] hover:shadow-lg' 
                      : currentSegment?.id === segment.id
                        ? 'bg-white ring-4 ring-[var(--primary-orange)] shadow-xl'
                        : 'bg-white hover:shadow-lg border border-gray-200'
                  }`}
                  onClick={() => playSegment(segment)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${
                      segment.speaker === 'A' ? 'text-[var(--primary-orange)]' : 'text-gray-700'
                    }`}>
                      {segment.name} (ID: {segment.id})
                    </span>
                    <button 
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                        segment.speaker === 'A' ? 'text-[var(--primary-orange)]' : 'text-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        playSegment(segment);
                      }}
                    >
                      <Play size={16} />
                    </button>
                  </div>
                  <p className="text-[var(--text-dark)]">{segment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationComprehensiveSimple;