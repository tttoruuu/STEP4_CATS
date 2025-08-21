import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Play, Pause, SkipForward, Volume2, Users, Mic, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

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

  // セグメントデータをロード
  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    // 実際のデータ
    const demoSegments: ConversationSegment[] = [
      { id: 1, speaker: "A", name: "佐藤 (女性)", start: 0.0, end: 5.0, text: "こんにちは、加藤さんですか？お待たせしました。佐藤です。" },
      { id: 2, speaker: "B", name: "加藤 (男性)", start: 5.0, end: 10.0, text: "はじめまして、加藤です。僕もちょうど着いたところです。" },
      { id: 3, speaker: "A", name: "佐藤 (女性)", start: 10.0, end: 18.0, text: "お休みの日はどんなことをされているんですか？" },
      { id: 4, speaker: "B", name: "加藤 (男性)", start: 18.0, end: 28.0, text: "映画を見たり、カフェでのんびりすることが多いですね。佐藤さんはどうですか？" },
      { id: 5, speaker: "A", name: "佐藤 (女性)", start: 28.0, end: 38.0, text: "私も映画が好きです！最近はどんな映画を見ましたか？" },
      { id: 6, speaker: "B", name: "加藤 (男性)", start: 38.0, end: 48.0, text: "先週、新作のアクション映画を見ました。迫力があって面白かったです。" },
      { id: 7, speaker: "A", name: "佐藤 (女性)", start: 48.0, end: 58.0, text: "いいですね！私はロマンス映画が好きで、感動する作品をよく見ます。" },
      { id: 8, speaker: "B", name: "加藤 (男性)", start: 58.0, end: 68.0, text: "そうなんですね。今度おすすめの映画があったら教えてください。" }
    ];
    setSegments(demoSegments);
    if (demoSegments.length > 0) {
      setCurrentSegment(demoSegments[0]);
    }
  };

  // セグメント再生
  const playSegment = (segment: ConversationSegment) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = segment.start;
    audioRef.current.playbackRate = playbackSpeed;
    setCurrentSegment(segment);
    setIsPlaying(true);
    
    audioRef.current.play().catch(e => console.error('再生エラー:', e));
    
    // セグメント終了を監視
    const checkEnd = setInterval(() => {
      if (audioRef.current && audioRef.current.currentTime >= segment.end) {
        audioRef.current.pause();
        setIsPlaying(false);
        clearInterval(checkEnd);
        
        // 連続再生の場合
        if (practiceMode === 'listen' || practiceMode === 'shadow') {
          setTimeout(() => {
            playNextSegment();
          }, autoGap);
        }
      }
    }, 100);
  };

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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">会話練習 総集編</h1>
          <p className="text-[var(--text-secondary)]">実践的な会話を通じて総合的なスキルを身につける</p>
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
                    : 'bg-gray-200 text-[var(--text-secondary)] hover:bg-gray-300'
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
          />
          
          {/* 再生コントロール */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isPlaying) {
                    audioRef.current?.pause();
                    setIsPlaying(false);
                  } else if (currentSegment) {
                    playSegment(currentSegment);
                  }
                }}
                className="p-3 rounded-full bg-[var(--primary-orange)] text-white hover:opacity-80 transition-opacity"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={playNextSegment}
                className="p-2 rounded-full bg-gray-200 text-[var(--text-secondary)] hover:bg-gray-300 transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">速度:</span>
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
                <span className="text-sm text-[var(--text-secondary)]">間隔:</span>
                <input 
                  type="number" 
                  value={autoGap} 
                  onChange={(e) => setAutoGap(parseInt(e.target.value))}
                  className="w-20 px-2 py-1 rounded border border-gray-300"
                  min="0"
                  max="5000"
                  step="100"
                />
                <span className="text-sm text-[var(--text-secondary)]">ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 会話タイムライン */}
        <div className="neo-card">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">会話タイムライン</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                className={`flex ${segment.speaker === 'A' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-md p-4 rounded-2xl cursor-pointer transition-all ${
                    segment.speaker === 'A' 
                      ? 'bg-blue-100 hover:bg-blue-200' 
                      : 'bg-green-100 hover:bg-green-200'
                  } ${
                    currentSegment?.id === segment.id ? 'ring-2 ring-[var(--primary-orange)]' : ''
                  }`}
                  onClick={() => {
                    setCurrentSegmentIndex(index);
                    setCurrentSegment(segment);
                    playSegment(segment);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{segment.name}</span>
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSegment(segment);
                      }}
                    >
                      <Play size={16} />
                    </button>
                  </div>
                  <p className="text-[var(--text-primary)]">{segment.text}</p>
                  
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
                            : 'bg-gray-200 text-[var(--text-secondary)]'
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
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">シャドーイング練習</h3>
            <p className="text-[var(--text-secondary)] mb-4">
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
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">ロールプレイ練習</h3>
            <p className="text-[var(--text-secondary)] mb-4">
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
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">会話チェック</h3>
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
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">振り返り</h3>
            
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