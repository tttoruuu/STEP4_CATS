import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ConversationQuiz from '../../components/ConversationQuiz';
import ShadowingPractice from '../../components/ShadowingPractice';
import { getScenariosByCategory, getRandomScenario } from '../../data/conversationQuizData';
import { ArrowLeft, Lightbulb } from 'lucide-react';

export default function ElicitPractice() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('quiz'); // 'quiz' | 'shadowing'
  const [currentScenario, setCurrentScenario] = useState(null);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  useEffect(() => {
    // 初回ロード時にランダムなシナリオを取得
    const randomScenario = getRandomScenario('elicit');
    setCurrentScenario(randomScenario);
  }, []);

  const handleQuizComplete = () => {
    // 完了したシナリオを記録
    if (currentScenario) {
      setCompletedScenarios(prev => [...prev, currentScenario.id]);
    }
    
    // 新しいランダムシナリオを取得
    const newScenario = getRandomScenario('elicit');
    setCurrentScenario(newScenario);
    setCurrentView('quiz');
  };

  const handleShadowingStart = (scenario) => {
    setCurrentView('shadowing');
  };

  const handleShadowingComplete = () => {
    // シャドーイング完了後、新しいクイズへ
    handleQuizComplete();
  };

  const handleBackToQuiz = () => {
    setCurrentView('quiz');
  };

  const handleBackToModes = () => {
    router.push('/conversation/modes');
  };

  if (!currentScenario) {
    return (
      <Layout title="会話引き出し練習">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="会話引き出し練習">
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
        {/* ヘッダー */}
        <div className="w-full max-w-6xl mx-auto pt-8 px-6">
          <button 
            onClick={handleBackToModes}
            className="text-yellow-600 flex items-center gap-1 hover:opacity-80 transition-opacity mb-6"
          >
            <ArrowLeft size={18} />
            <span>モード選択に戻る</span>
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="text-yellow-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-yellow-600">会話を引き出す練習</h1>
              <p className="text-gray-600">4択クイズでコミュニケーションスキルを向上させましょう</p>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="pb-8">
          {currentView === 'quiz' ? (
            <ConversationQuiz
              scenario={currentScenario}
              onComplete={handleQuizComplete}
              onShadowingStart={handleShadowingStart}
              showShadowingButton={true}
            />
          ) : (
            <ShadowingPractice
              scenario={currentScenario}
              onComplete={handleShadowingComplete}
              onBack={handleBackToQuiz}
            />
          )}
        </div>

        {/* 進捗表示 */}
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-white/40">
          <div className="text-sm text-gray-600">
            完了したクイズ: {completedScenarios.length}問
          </div>
        </div>
      </div>
    </Layout>
  );
}