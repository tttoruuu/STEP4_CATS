import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Play, Pause, SkipForward, Volume2, Users, Mic, CheckCircle, AlertCircle, RefreshCw, Edit2, Save, Download, X, Check } from 'lucide-react';

interface ConversationSegment {
  id: number;
  speaker: 'A' | 'B';
  name: string;
  start: number;
  end: number;
  text: string;
}

type PracticeMode = 'listen' | 'shadow' | 'roleplay' | 'check' | 'review';

const ConversationComprehensive: React.FC = () => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [segments, setSegments] = useState<ConversationSegment[]>([]);
  const [currentSegment, setCurrentSegment] = useState<ConversationSegment | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('listen');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [autoGap, setAutoGap] = useState(1000);
  const [selectedRole, setSelectedRole] = useState<'A' | 'B' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    empathy: false,
    question: false,
    points: false
  });
  const [reviewNotes, setReviewNotes] = useState('');
  const [voiceScore, setVoiceScore] = useState({ tempo: 0, silence: 0, overlap: 0 });
  const [isClient, setIsClient] = useState(false);
  const [continuousPlay, setContinuousPlay] = useState(false);
  const [isSegmentPlaying, setIsSegmentPlaying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSegmentId, setEditingSegmentId] = useState<number | null>(null);
  const [editedSegments, setEditedSegments] = useState<ConversationSegment[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      setEditedSegments(formattedSegments); // 編集用のコピーを作成
      if (formattedSegments.length > 0) {
        setCurrentSegment(formattedSegments[0]);
      }
    } catch (error) {
      console.error('セグメントデータの読み込みエラー:', error);
      // フォールバックデータ
      const fallbackSegments: ConversationSegment[] = [
        { id: 1, speaker: "A", name: "佐藤 (女性)", start: 1.0, end: 6.38, text: "こんにちは加藤さんですか お待たせしました佐藤です" },
        { id: 2, speaker: "B", name: "加藤 (男性)", start: 6.38, end: 11.7, text: "初めまして加藤です僕もちょうど着いたところです よろしくお願いします" },
        { id: 3, speaker: "A", name: "佐藤 (女性)", start: 12.16, end: 18.54, text: "初対面ってやっぱり緊張しますね そうですねでもお会いできて嬉しいです" }
      ];
      setSegments(fallbackSegments);
      setEditedSegments(fallbackSegments);
      setCurrentSegment(fallbackSegments[0]);
    }
  };

  // セグメント再生
  const playSegment = (segment: ConversationSegment) => {
    if (!audioRef.current) return;
    
    // 通し再生を停止
    if (continuousPlay) {
      stopContinuousPlay();
    }
    
    audioRef.current.currentTime = segment.start;
    audioRef.current.playbackRate = playbackSpeed;
    setCurrentSegment(segment);
    setIsPlaying(true);
    setIsSegmentPlaying(true);
    
    audioRef.current.play().catch(e => console.error('再生エラー:', e));
    
    // セグメント終了時に自動停止
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.currentTime >= segment.end) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsSegmentPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
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
    audioRef.current.playbackRate = playbackSpeed;
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
        
        if (activeSegment && activeSegment.id !== currentSegment?.id) {
          setCurrentSegment(activeSegment);
          const index = segments.findIndex(seg => seg.id === activeSegment.id);
          setCurrentSegmentIndex(index);
          
          // セグメントが変わったらスクロール
          scrollToSegment(activeSegment.id);
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
    setIsSegmentPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // セグメントへのスクロール
  const scrollToSegment = (segmentId: number) => {
    const element = document.getElementById(`segment-${segmentId}`);
    if (element && timelineRef.current) {
      const container = timelineRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      const elementHeight = element.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
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

  // 次のセグメントを再生
  const playNextSegment = () => {
    const nextIndex = currentSegmentIndex + 1;
    if (nextIndex < segments.length) {
      setCurrentSegmentIndex(nextIndex);
      playSegment(segments[nextIndex]);
    }
  };

  // 練習モード変更
  const handleModeChange = (mode: PracticeMode) => {
    setPracticeMode(mode);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentSegmentIndex(0);
    if (segments.length > 0) {
      setCurrentSegment(segments[0]);
    }
  };

  // チェック項目の切り替え
  const toggleCheck = (item: keyof typeof checkedItems) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // 音声評価のダミー計算
  const calculateVoiceScore = () => {
    setVoiceScore({
      tempo: Math.floor(Math.random() * 30) + 70,
      silence: Math.floor(Math.random() * 20) + 80,
      overlap: Math.floor(Math.random() * 15) + 85
    });
  };

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditingSegmentId(null);
  };

  // セグメントの編集開始
  const startEditingSegment = (segmentId: number) => {
    setEditingSegmentId(segmentId);
  };

  // セグメントの編集保存
  const saveSegmentEdit = (segmentId: number, newSpeaker: 'A' | 'B', newText: string) => {
    const updatedSegments = editedSegments.map(seg => {
      if (seg.id === segmentId) {
        return {
          ...seg,
          speaker: newSpeaker,
          name: newSpeaker === 'A' ? '佐藤 (女性)' : '加藤 (男性)',
          text: newText
        };
      }
      return seg;
    });
    setEditedSegments(updatedSegments);
    setEditingSegmentId(null);
    
    // segmentsも更新して即座に反映
    setSegments(updatedSegments);
    
    // currentSegmentも更新
    if (currentSegment && currentSegment.id === segmentId) {
      const updatedSegment = updatedSegments.find(s => s.id === segmentId);
      if (updatedSegment) {
        setCurrentSegment(updatedSegment);
      }
    }
  };

  // 編集のキャンセル
  const cancelEdit = () => {
    setEditingSegmentId(null);
  };

  // 編集内容のエクスポート
  const exportEditedData = () => {
    const dataStr = JSON.stringify(editedSegments, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'conversation_segments_edited.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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
          <span>聴く練習モード選択にもどる</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">総合練習</h1>
          <p className="text-[var(--text-medium)]">実践的な会話を通じて総合的なスキルを身につける</p>
          
          {/* 編集モードボタン */}
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                editMode 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 text-[var(--text-medium)] hover:bg-gray-300'
              }`}
            >
              <Edit2 size={18} />
              {editMode ? '編集モード終了' : '編集モード'}
            </button>
            
            {editMode && (
              <button
                onClick={exportEditedData}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 transition-all"
              >
                <Download size={18} />
                エクスポート
              </button>
            )}
          </div>
        </div>

        {/* 練習モード選択 */}
        <div className="neo-card mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { mode: 'listen' as PracticeMode, label: '見本', icon: Volume2 },
              { mode: 'shadow' as PracticeMode, label: 'シャドー', icon: Mic },
              { mode: 'roleplay' as PracticeMode, label: 'ロールプレイ', icon: Users },
              { mode: 'check' as PracticeMode, label: 'チェック', icon: CheckCircle },
              { mode: 'review' as PracticeMode, label: '振り返り', icon: RefreshCw }
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                  practiceMode === mode 
                    ? 'bg-[var(--primary-orange)] text-white' 
                    : 'bg-gray-200 text-[var(--text-medium)] hover:bg-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 音声プレーヤー */}
        <div className="neo-card mb-6">
          <audio 
            ref={audioRef}
            src="https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/conversation_full.mp3"
            className="w-full mb-4"
            controls
            preload="metadata"
            playsInline
          />
          
          {/* 再生コントロール */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
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
              
              {currentSegment && !continuousPlay && (
                <button
                  onClick={() => playSegment(currentSegment)}
                  className="p-2 rounded-full bg-gray-200 text-[var(--text-medium)] hover:bg-gray-300 transition-colors"
                  title="現在のセグメントを再生"
                >
                  <Play size={20} />
                </button>
              )}
              
              <button
                onClick={playNextSegment}
                className="p-2 rounded-full bg-gray-200 text-[var(--text-medium)] hover:bg-gray-300 transition-colors"
                disabled={continuousPlay}
              >
                <SkipForward size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-medium)]">速度:</span>
                <select 
                  value={playbackSpeed} 
                  onChange={(e) => {
                    const speed = parseFloat(e.target.value);
                    setPlaybackSpeed(speed);
                    if (audioRef.current) {
                      audioRef.current.playbackRate = speed;
                    }
                  }}
                  className="px-2 py-1 rounded border border-gray-300"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-medium)]">間隔:</span>
                <input 
                  type="number" 
                  value={autoGap} 
                  onChange={(e) => setAutoGap(parseInt(e.target.value))}
                  className="w-20 px-2 py-1 rounded border border-gray-300"
                  min="0"
                  max="5000"
                  step="100"
                />
                <span className="text-sm text-[var(--text-medium)]">ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 会話タイムライン */}
        <div className="neo-card">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">会話タイムライン</h3>
          
          <div ref={timelineRef} className="space-y-4 max-h-96 overflow-y-auto">
            {(editMode ? editedSegments : segments).map((segment, index) => (
              <div
                key={segment.id}
                id={`segment-${segment.id}`}
                className={`flex ${segment.speaker === 'A' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-md p-4 rounded-2xl cursor-pointer transition-all ${
                    segment.speaker === 'A' 
                      ? currentSegment?.id === segment.id
                        ? 'bg-blue-200 scale-105'
                        : 'bg-blue-100 hover:bg-blue-200' 
                      : currentSegment?.id === segment.id
                        ? 'bg-green-200 scale-105'
                        : 'bg-green-100 hover:bg-green-200'
                  } ${
                    currentSegment?.id === segment.id && !editMode ? 'ring-4 ring-[var(--primary-orange)] shadow-xl' : ''
                  } ${
                    editMode ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''
                  } ${
                    editMode && editingSegmentId === segment.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    if (editMode) {
                      startEditingSegment(segment.id);
                    } else {
                      setCurrentSegmentIndex(index);
                      playSegment(segment);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{segment.name}</span>
                    {!editMode && (
                      <button 
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-200 transition-colors"
                      title={isSegmentPlaying && currentSegment?.id === segment.id ? "停止" : "この部分を再生"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSegmentPlaying && currentSegment?.id === segment.id) {
                          // 再生中のセグメントをクリックしたら停止
                          if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                          }
                          audioRef.current?.pause();
                          setIsPlaying(false);
                          setIsSegmentPlaying(false);
                        } else {
                          playSegment(segment);
                        }
                      }}
                    >
                      {isSegmentPlaying && currentSegment?.id === segment.id ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                    )}
                  </div>
                  {editMode && editingSegmentId === segment.id ? (
                    // 編集モード
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">話者:</label>
                        <select
                          defaultValue={segment.speaker}
                          className="px-2 py-1 rounded border border-gray-300"
                          id={`speaker-${segment.id}`}
                        >
                          <option value="A">女性（佐藤）</option>
                          <option value="B">男性（加藤）</option>
                        </select>
                      </div>
                      <textarea
                        defaultValue={segment.text}
                        className="w-full p-2 rounded border border-gray-300 min-h-[60px]"
                        id={`text-${segment.id}`}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const speakerSelect = document.getElementById(`speaker-${segment.id}`) as HTMLSelectElement;
                            const textArea = document.getElementById(`text-${segment.id}`) as HTMLTextAreaElement;
                            if (speakerSelect && textArea) {
                              saveSegmentEdit(segment.id, speakerSelect.value as 'A' | 'B', textArea.value);
                            }
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                        >
                          <Check size={16} />
                          保存
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 flex items-center gap-1"
                        >
                          <X size={16} />
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[var(--text-dark)]">{segment.text}</p>
                  )}
                  
                  {/* ロールプレイモードで役割選択 */}
                  {practiceMode === 'roleplay' && (
                    <div className="mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRole(segment.speaker);
                        }}
                        className={`text-xs px-2 py-1 rounded ${
                          selectedRole === segment.speaker 
                            ? 'bg-[var(--primary-orange)] text-white' 
                            : 'bg-gray-200 text-[var(--text-medium)]'
                        }`}
                      >
                        この役を演じる
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* モード別追加UI */}
        {practiceMode === 'shadow' && (
          <div className="neo-card mt-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">シャドーイング練習</h3>
            <p className="text-[var(--text-medium)] mb-4">
              音声を聞きながら、同時に声に出して練習しましょう
            </p>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-6 py-3 rounded-full flex items-center gap-2 ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'bg-[var(--primary-orange)] text-white'
              }`}
            >
              <Mic size={20} />
              {isRecording ? '録音停止' : '録音開始'}
            </button>
          </div>
        )}

        {practiceMode === 'roleplay' && (
          <div className="neo-card mt-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">ロールプレイ練習</h3>
            <p className="text-[var(--text-medium)] mb-4">
              役割を選んで会話に参加しましょう
            </p>
            {selectedRole && (
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-[var(--primary-orange)]" />
                <span>選択中の役: {selectedRole === 'A' ? '佐藤 (女性)' : '加藤 (男性)'}</span>
              </div>
            )}
          </div>
        )}

        {practiceMode === 'check' && (
          <div className="neo-card mt-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">会話チェック</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={checkedItems.empathy}
                  onChange={() => toggleCheck('empathy')}
                  className="w-5 h-5"
                />
                <span>共感語を使えた</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={checkedItems.question}
                  onChange={() => toggleCheck('question')}
                  className="w-5 h-5"
                />
                <span>質問返しができた</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={checkedItems.points}
                  onChange={() => toggleCheck('points')}
                  className="w-5 h-5"
                />
                <span>要点をメモできた</span>
              </label>
            </div>
          </div>
        )}

        {practiceMode === 'review' && (
          <div className="neo-card mt-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">振り返り</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">5WHY分析</h4>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="なぜその反応をしたのか、深く振り返ってみましょう..."
                className="w-full p-3 rounded-lg border border-gray-300 min-h-[120px]"
              />
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">音声評価スコア</h4>
              <button
                onClick={calculateVoiceScore}
                className="mb-3 px-4 py-2 bg-[var(--primary-orange)] text-white rounded-lg hover:opacity-80"
              >
                スコアを計算
              </button>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>テンポ:</span>
                  <span className="font-bold">{voiceScore.tempo}%</span>
                </div>
                <div className="flex justify-between">
                  <span>間の取り方:</span>
                  <span className="font-bold">{voiceScore.silence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>被り防止:</span>
                  <span className="font-bold">{voiceScore.overlap}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationComprehensive;