import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AudioPlayer from '../../components/AudioPlayer';
import { ArrowLeft, Heart, HelpCircle, RotateCcw } from 'lucide-react';
import { empathyAudioData } from '../../data/audioData';

export default function EmpathyPracticeNew() {
  const router = useRouter();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswerAudioPlayed, setCorrectAnswerAudioPlayed] = useState(false);
  const correctAudioRef = useRef(null);

  const currentAudio = empathyAudioData[currentScenarioIndex];

  const handleAudioPlayComplete = () => {
    setHasPlayedAudio(true);
  };

  const handleShowCorrectAnswer = () => {
    setShowCorrectAnswer(true);
    // 正解音声を自動再生
    if (correctAudioRef.current) {
      correctAudioRef.current.play();
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < empathyAudioData.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setHasPlayedAudio(false);
      setShowCorrectAnswer(false);
      setCorrectAnswerAudioPlayed(false);
    } else {
      // 全シナリオ完了
      router.push('/conversation/modes');
    }
  };

  const handlePreviousScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1);
      setHasPlayedAudio(false);
      setShowCorrectAnswer(false);
      setCorrectAnswerAudioPlayed(false);
    }
  };

  if (!currentAudio) {
    return (
      <Layout title="相槌練習">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="あいづち・共感練習">
      <div className="flex flex-col min-h-screen bg-[var(--bg-color)]">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative h-10">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-[var(--primary-orange)] flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6 top-0"
          >
            <ArrowLeft size={18} />
            <span className="leading-normal">もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            {/* ヘッダー */}
            <div className="neo-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-[var(--primary-orange)]" size={24} />
                <h1 className="text-xl font-bold text-[var(--primary-orange)]">あいづち・共感練習</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-[var(--text-primary)] mb-2">
                  {currentAudio.scenario}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mb-3">
                  音声を聞いて、適切な返答を考えてみましょう
                </p>
                
                <div className="bg-[var(--pale-orange)] p-3 rounded-lg">
                  <p className="text-sm text-[var(--primary-orange)]">
                    <strong>ワンポイント:</strong> {currentAudio.tip}
                  </p>
                </div>
              </div>
              
              <div className="text-center text-sm text-[var(--text-secondary)]">
                シナリオ {currentScenarioIndex + 1} / {empathyAudioData.length}
              </div>
            </div>

            {/* 女性の発言表示 */}
            <div className="mb-6">
              <div className="neo-card p-4">
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">①女性の発言</h3>
                <p className="text-[var(--text-primary)] mb-3">{currentAudio.text}</p>
                
                <AudioPlayer
                  audioSrc={currentAudio.audioSrc}
                  title=""
                  description=""
                  onPlayComplete={handleAudioPlayComplete}
                />
              </div>
            </div>

            {/* 正解を聞くボタン */}
            {hasPlayedAudio && !showCorrectAnswer && (
              <div className="mb-6">
                <button
                  onClick={handleShowCorrectAnswer}
                  className="w-full bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange)] text-white rounded-xl px-6 py-3 hover:opacity-90 transition-all neo-card"
                >
                  正解を聞く
                </button>
              </div>
            )}

            {/* 男性の返し（正解）表示 */}
            {showCorrectAnswer && (
              <div className="mb-6">
                <div className="neo-card p-4">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-3">②男性の返し（正解）</h3>
                  <p className="text-[var(--text-primary)] mb-3">{currentAudio.correctResponse}</p>
                  
                  <audio
                    ref={correctAudioRef}
                    src={currentAudio.correctResponseAudioSrc}
                    className="w-full"
                    controls
                  />
                </div>

                {/* ナビゲーションボタン */}
                <div className="flex gap-3 mt-4">
                  {currentScenarioIndex > 0 && (
                    <button
                      onClick={handlePreviousScenario}
                      className="flex-1 bg-gray-500 text-white rounded-xl px-6 py-2 hover:opacity-90"
                    >
                      戻る
                    </button>
                  )}
                  
                  <button
                    onClick={handleNextScenario}
                    className="flex-1 bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange)] text-white rounded-xl px-6 py-2 hover:opacity-90 neo-card"
                  >
                    {currentScenarioIndex < empathyAudioData.length - 1 ? '次に進む' : '練習終了'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}