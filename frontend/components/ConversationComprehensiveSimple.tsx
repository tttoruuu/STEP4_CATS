import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Play, Pause, Square } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  // セクション定義（会話の区切り）
  const sections = [
    { id: 'greeting', name: '挨拶', startId: 1, endId: 10 },
    { id: 'empathy', name: '相槌・共感', startId: 11, endId: 20 },
    { id: 'echo', name: '全返し', startId: 21, endId: 30 }
  ];

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
  const playSegment = async (segment: ConversationSegment) => {
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
    
    // 一度停止
    audioRef.current.pause();
    
    try {
      // 再生位置を設定
      audioRef.current.currentTime = segment.start;
      setCurrentSegment(segment);
      setIsPlaying(true);
      
      // 再生開始
      await audioRef.current.play();
      
      // セグメント終了時に自動停止
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          if (currentTime >= segment.end) {
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
    } catch (error) {
      console.error('再生エラー:', error);
      setIsPlaying(false);
    }
  };


  // 通し再生の開始（一時停止位置から再開可能）
  const startContinuousPlay = async (resumeFromPause = false) => {
    if (!audioRef.current) return;
    
    try {
      setContinuousPlay(true);
      setIsPlaying(true);
      
      // 一時停止からの再開でない場合のみ、最初から再生
      if (!resumeFromPause) {
        audioRef.current.currentTime = 0;
      }
      
      await audioRef.current.play();
      
      // 現在の再生位置を監視して対応するセグメントをハイライト
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          setCurrentTime(currentTime); // デバッグ用に現在時間を更新
          
          // 現在再生中のセグメントを見つける
          // 厳密なマッチング: 現在時間がセグメントの範囲内にあるかチェック
          const activeSegment = segments.find(
            seg => currentTime >= seg.start && currentTime < seg.end
          );
          
          if (activeSegment) {
            if (!currentSegment || currentSegment.id !== activeSegment.id) {
              setCurrentSegment(activeSegment);
              // ハイライトされたセグメントに自動スクロール
              setTimeout(() => {
                const element = document.getElementById(`segment-${activeSegment.id}`);
                if (element) {
                  // 画面の中央に表示されるようにスクロール
                  element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                  });
                }
              }, 100); // 少し遅延させてスムーズに
            }
          } else {
            // セグメント間の隙間にいる場合はハイライトをクリア
            setCurrentSegment(null);
          }
          
          // 音声が終了したら停止
          if (audioRef.current.ended) {
            stopContinuousPlay();
          }
        }
      }, 50); // より頻繁にチェック
    } catch (error) {
      console.error('再生エラー:', error);
      setContinuousPlay(false);
      setIsPlaying(false);
    }
  };

  // 通し再生の一時停止（位置を保持）
  const pauseContinuousPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // 通し再生の完全停止（リセット）
  const stopContinuousPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setContinuousPlay(false);
    setCurrentSegment(null);
    setIsPlaying(false);
    setSelectedSection(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // セクション単位での再生
  const playSectionSegments = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !audioRef.current) return;
    
    // セクション内のセグメントを取得
    const sectionSegments = segments.filter(
      seg => seg.id >= section.startId && seg.id <= section.endId
    );
    
    if (sectionSegments.length === 0) return;
    
    setSelectedSection(sectionId);
    setContinuousPlay(true);
    setIsPlaying(true);
    
    // セクションの最初のセグメントから再生
    const firstSegment = sectionSegments[0];
    audioRef.current.currentTime = firstSegment.start;
    await audioRef.current.play();
    
    // セクション終了時に自動停止
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        setCurrentTime(currentTime);
        
        // 現在のセグメントを更新
        const activeSegment = sectionSegments.find(
          seg => currentTime >= seg.start && currentTime < seg.end
        );
        
        if (activeSegment) {
          setCurrentSegment(activeSegment);
        }
        
        // セクションの最後のセグメントを超えたら停止
        const lastSegment = sectionSegments[sectionSegments.length - 1];
        if (currentTime >= lastSegment.end) {
          audioRef.current.pause();
          setIsPlaying(false);
          setContinuousPlay(false);
          setSelectedSection(null);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }
    }, 50);
  };


  // 音声イベントリスナー
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setContinuousPlay(false);
      setCurrentSegment(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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
          <span>会話練習モード選択にもどる</span>
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
            preload="metadata"
          />
          
          {/* セクション選択ボタン */}
          <div className="flex justify-center gap-2 mb-4">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => playSectionSegments(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSection === section.id
                    ? 'bg-[var(--primary-orange)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={`${section.name}を再生`}
              >
                {section.name}
              </button>
            ))}
          </div>
          
          {/* 再生コントロール */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                if (continuousPlay && isPlaying) {
                  // 再生中なら一時停止
                  pauseContinuousPlay();
                } else if (continuousPlay && !isPlaying) {
                  // 一時停止中なら再開
                  startContinuousPlay(true);  // resumeFromPause = true
                } else {
                  // 停止中なら最初から再生
                  startContinuousPlay(false); // resumeFromPause = false
                }
              }}
              className="p-3 rounded-full bg-[var(--primary-orange)] text-white hover:opacity-80 transition-opacity"
              title={isPlaying ? "一時停止" : (continuousPlay ? "再開" : "通し再生")}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            {/* 停止ボタン（最初に戻る） */}
            {continuousPlay && (
              <button
                onClick={() => {
                  stopContinuousPlay();
                }}
                className="p-3 rounded-full bg-gray-500 text-white hover:opacity-80 transition-opacity"
                title="停止（最初に戻る）"
              >
                <Square size={24} />
              </button>
            )}
          </div>
        </div>


        {/* 会話タイムライン */}
        <div className="neo-card">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">会話タイムライン</h3>
          
          <div ref={timelineRef} className="space-y-6 max-h-[600px] overflow-y-auto scroll-smooth p-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                id={`segment-${segment.id}`}
                className={`flex ${segment.speaker === 'A' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-md p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                    segment.speaker === 'A' 
                      ? currentSegment?.id === segment.id
                        ? 'bg-[var(--pale-orange)] ring-4 ring-[var(--primary-orange)] shadow-2xl scale-[1.02] ring-offset-8 ring-offset-transparent border-2 border-[var(--primary-orange)]'
                        : 'bg-[var(--pale-orange)] hover:shadow-lg' 
                      : currentSegment?.id === segment.id
                        ? 'bg-white ring-4 ring-[var(--primary-orange)] shadow-2xl scale-[1.02] ring-offset-8 ring-offset-transparent border-2 border-[var(--primary-orange)]'
                        : 'bg-white hover:shadow-lg border border-gray-200'
                  }`}
                  style={{
                    marginTop: currentSegment?.id === segment.id ? '8px' : '0',
                    marginBottom: currentSegment?.id === segment.id ? '8px' : '0'
                  }}
                  onClick={() => playSegment(segment)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${
                      segment.speaker === 'A' ? 'text-[var(--primary-orange)]' : 'text-gray-700'
                    }`}>
                      {segment.name}
                    </span>
                    <button 
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                        currentSegment?.id === segment.id && isPlaying ? 'bg-gray-200' : ''
                      } ${
                        segment.speaker === 'A' ? 'text-[var(--primary-orange)]' : 'text-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentSegment?.id === segment.id && isPlaying) {
                          audioRef.current?.pause();
                          setIsPlaying(false);
                        } else {
                          playSegment(segment);
                        }
                      }}
                    >
                      {currentSegment?.id === segment.id && isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
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