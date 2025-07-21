import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AudioPlayer from '../../components/AudioPlayer';
import AudioRecorder from '../../components/AudioRecorder';
import { ArrowLeft, Heart, HelpCircle, RotateCcw } from 'lucide-react';
import { empathyAudioData, getRandomAudio } from '../../data/audioData';

export default function EmpathyPracticeNew() {
  const router = useRouter();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [userRecording, setUserRecording] = useState(null);
  const [currentStep, setCurrentStep] = useState('listening'); // listening, recording, completed
  const [practiceCount, setPracticeCount] = useState(0);

  // 初期音声設定
  useEffect(() => {
    const randomAudio = getRandomAudio(empathyAudioData);
    setCurrentAudio(randomAudio);
  }, []);

  const handleAudioPlayComplete = () => {
    setHasPlayedAudio(true);
    setCurrentStep('recording');
  };

  const handleRecordingComplete = (audioBlob, audioUrl) => {
    setUserRecording({ blob: audioBlob, url: audioUrl });
    setCurrentStep('completed');
  };

  const handleNextPractice = () => {
    const randomAudio = getRandomAudio(empathyAudioData);
    setCurrentAudio(randomAudio);
    setHasPlayedAudio(false);
    setUserRecording(null);
    setCurrentStep('listening');
    setPracticeCount(prev => prev + 1);
  };

  const handleShowExamples = () => {
    // NG/OK例ページに遷移
    router.push({
      pathname: '/conversation/empathy-examples',
      query: { 
        scenario: currentAudio?.scenario,
        audioId: currentAudio?.id 
      }
    });
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
    <Layout title="相槌練習（音声版）">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-pink-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            {/* ヘッダー */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-pink-600" size={24} />
                <h1 className="text-xl font-bold text-pink-600">あいづち・共感練習</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">
                  シナリオ: {currentAudio.scenario}
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  音声を聞いて、適切な相槌を声に出して練習しましょう
                </p>
                
                <div className="bg-pink-50 p-3 rounded-lg">
                  <p className="text-sm text-pink-700">
                    <strong>ワンポイント:</strong> {currentAudio.tip}
                  </p>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                練習回数: {practiceCount + 1}回目
              </div>
            </div>

            {/* Step 1: 音声を聞く */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'listening' ? 'bg-pink-600 text-white' : 'bg-pink-200 text-pink-600'
                }`}>
                  1
                </div>
                <span className="font-semibold text-gray-800">相手の話を聞く</span>
              </div>
              
              <AudioPlayer
                audioSrc={currentAudio.audioSrc}
                title="相手の話"
                description="以下の音声を聞いてください"
                onPlayComplete={handleAudioPlayComplete}
              />
              
              {/* 音声が再生できない場合のテキスト表示 */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>音声内容:</strong> {currentAudio.text}
                </p>
              </div>
            </div>

            {/* Step 2: 録音する */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'recording' || currentStep === 'completed' ? 'bg-pink-600 text-white' : 'bg-pink-200 text-pink-600'
                }`}>
                  2
                </div>
                <span className="font-semibold text-gray-800">あなたの相槌を録音</span>
              </div>
              
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                disabled={currentStep === 'listening'}
              />
              
              {currentStep === 'listening' && (
                <p className="text-sm text-gray-500 mt-2">
                  まず相手の音声を最後まで聞いてから録音してください
                </p>
              )}
            </div>

            {/* Step 3: 完了とアクション */}
            {currentStep === 'completed' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm border border-white/40">
                <h3 className="font-bold text-green-600 mb-4">録音完了！</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleShowExamples}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600 transition-all"
                  >
                    <HelpCircle size={20} />
                    NGとOK例を見る
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleNextPractice}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl px-6 py-2 hover:opacity-90"
                    >
                      次の練習
                    </button>
                    
                    <button
                      onClick={() => router.push('/conversation/modes')}
                      className="flex-1 bg-gray-500 text-white rounded-xl px-6 py-2 hover:opacity-90"
                    >
                      練習終了
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}