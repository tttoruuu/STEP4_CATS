import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @ts-ignore
import ConversationQuiz from './ConversationQuiz';
// @ts-ignore
import ShadowingPractice from './ShadowingPractice';
// @ts-ignore
import { conversationQuizData, getScenariosByCategory } from '../data/conversationQuizData';
import { ArrowLeft, Lightbulb, Search, TrendingUp, Star, Lock } from 'lucide-react';

interface UserProgress {
  completedScenarios: string[];
  currentLevel: 'beginner' | 'advanced';
  totalScore: number;
  levelProgress: {
    beginner: { completed: number; total: number; unlocked: boolean };
    advanced: { completed: number; total: number; unlocked: boolean };
  };
}

const ConversationPractice: React.FC = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'levelSelect' | 'quiz' | 'shadowing'>('levelSelect');
  const [showCompletionDialog, setShowCompletionDialog] = useState<{ show: boolean; type: 'beginner' | 'advanced' | null }>({ show: false, type: null });
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'advanced' | null>(null);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedScenarios: [],
    currentLevel: 'beginner',
    totalScore: 0,
    levelProgress: {
      beginner: { completed: 0, total: 0, unlocked: true },
      advanced: { completed: 0, total: 0, unlocked: true }
    }
  });

  // 初期化とプログレス計算
  useEffect(() => {
    calculateProgress();
  }, []);
  


  const calculateProgress = () => {
    const scenarios = conversationQuizData.scenarios;
    const beginnerScenarios = scenarios.filter(s => s.level === 'beginner');
    const advancedScenarios = scenarios.filter(s => s.level === 'advanced');


    // ローカルストレージから進捗を読み込み
    const savedProgress = localStorage.getItem('conversationPracticeProgress');
    
    if (savedProgress && savedProgress !== 'null') {
      const parsed = JSON.parse(savedProgress);
      const completedIds = parsed.completedScenarios || [];
      
      // 各レベルの完了数を計算
      const beginnerCompleted = beginnerScenarios.filter(s => completedIds.includes(s.id)).length;
      const advancedCompleted = advancedScenarios.filter(s => completedIds.includes(s.id)).length;
      
      setUserProgress({
        ...parsed,
        levelProgress: {
          beginner: { 
            completed: beginnerCompleted, 
            total: beginnerScenarios.length, 
            unlocked: true 
          },
          advanced: { 
            completed: advancedCompleted, 
            total: advancedScenarios.length, 
            unlocked: true 
          }
        }
      });
    } else {
      // 初回利用時の初期化
      setUserProgress(prev => ({
        ...prev,
        levelProgress: {
          beginner: { completed: 0, total: beginnerScenarios.length, unlocked: true },
          advanced: { completed: 0, total: advancedScenarios.length, unlocked: true }
        }
      }));
    }
  };

  const saveProgress = (updatedProgress: UserProgress) => {
    localStorage.setItem('conversationPracticeProgress', JSON.stringify(updatedProgress));
    setUserProgress(updatedProgress);
    
    // 進捗を即座に更新
    const scenarios = conversationQuizData.scenarios;
    const beginnerScenarios = scenarios.filter(s => s.level === 'beginner');
    const advancedScenarios = scenarios.filter(s => s.level === 'advanced');
    
    const beginnerCompleted = beginnerScenarios.filter(s => updatedProgress.completedScenarios.includes(s.id)).length;
    const advancedCompleted = advancedScenarios.filter(s => updatedProgress.completedScenarios.includes(s.id)).length;
    
    setUserProgress(prev => ({
      ...updatedProgress,
      levelProgress: {
        beginner: { 
          completed: beginnerCompleted, 
          total: beginnerScenarios.length, 
          unlocked: true 
        },
        advanced: { 
          completed: advancedCompleted, 
          total: advancedScenarios.length, 
          unlocked: true 
        }
      }
    }));
  };

  const handleLevelSelect = (level: 'beginner' | 'advanced') => {
    setSelectedLevel(level);
    
    let levelScenarios;
    if (level === 'beginner') {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'beginner');
    } else {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'advanced');
    }
    
    // 現在のレベルの完了済み問題のみを抽出
    const levelCompletedIds = userProgress.completedScenarios.filter(id => 
      levelScenarios.some(scenario => scenario.id === id)
    );
    const uncompletedScenarios = levelScenarios.filter(s => !levelCompletedIds.includes(s.id));
    
    
    if (uncompletedScenarios.length > 0) {
      // 音声がある設問を優先して選択
      const scenariosWithAudio = uncompletedScenarios.filter(s => 
        s.shadowingAudio && 
        s.shadowingAudio !== '``' && 
        s.shadowingAudio.startsWith('http')
      );
      
      if (scenariosWithAudio.length > 0) {
        // 音声がある設問から最初のものを選択
        setCurrentScenario(scenariosWithAudio[0]);
      } else {
        // 音声がない設問から最初のものを選択
        setCurrentScenario(uncompletedScenarios[0]);
      }
    } else {
      // 全て完了していたら音声がある設問から最初のもの
      const scenariosWithAudio = levelScenarios.filter(s => 
        s.shadowingAudio && 
        s.shadowingAudio !== '``' && 
        s.shadowingAudio.startsWith('http')
      );
      
      if (scenariosWithAudio.length > 0) {
        setCurrentScenario(scenariosWithAudio[0]);
      } else {
        setCurrentScenario(levelScenarios[0]);
      }
    }
    
    setCurrentView('quiz');
  };

  const handleQuizComplete = () => {
    if (!currentScenario || !selectedLevel) {
      return;
    }
    
    // 進捗を更新
    const updatedCompletedScenarios = [...userProgress.completedScenarios];
    if (!updatedCompletedScenarios.includes(currentScenario.id)) {
      updatedCompletedScenarios.push(currentScenario.id);
    }
    
    const updatedProgress = {
      ...userProgress,
      completedScenarios: updatedCompletedScenarios,
      totalScore: userProgress.totalScore + 10
    };
    
    saveProgress(updatedProgress);
    
    // 次の問題を選択
    let levelScenarios;
    if (selectedLevel === 'beginner') {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'beginner');
    } else {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'advanced');
    }
    // 現在のレベルの完了した問題のIDのみをフィルタリング
    const levelCompletedIds = updatedCompletedScenarios.filter(id => 
      levelScenarios.some(scenario => scenario.id === id)
    );
    const uncompletedScenarios = levelScenarios.filter(s => !levelCompletedIds.includes(s.id));
    
    
    if (uncompletedScenarios.length > 0) {
      // 音声がある設問を優先して選択
      const scenariosWithAudio = uncompletedScenarios.filter(s => 
        s.shadowingAudio && 
        s.shadowingAudio !== '``' && 
        s.shadowingAudio.startsWith('http')
      );
      
      if (scenariosWithAudio.length > 0) {
        setCurrentScenario(scenariosWithAudio[0]);
      } else {
        setCurrentScenario(uncompletedScenarios[0]);
      }
    } else {
      // レベル完了
      setShowCompletionDialog({ show: true, type: selectedLevel });
    }
  };

  const handleShadowingStart = () => {
    setCurrentView('shadowing');
  };

  const handleShadowingComplete = () => {
    if (!currentScenario || !selectedLevel) return;
    
    // 進捗を更新
    const updatedCompletedScenarios = [...userProgress.completedScenarios];
    if (!updatedCompletedScenarios.includes(currentScenario.id)) {
      updatedCompletedScenarios.push(currentScenario.id);
    }
    
    const updatedProgress = {
      ...userProgress,
      completedScenarios: updatedCompletedScenarios,
      totalScore: userProgress.totalScore + 10
    };
    
    saveProgress(updatedProgress);
    
    // 次の問題を選択
    let levelScenarios;
    if (selectedLevel === 'beginner') {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'beginner');
    } else {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'advanced');
    }
    // 現在のレベルの完了した問題のIDのみをフィルタリング
    const levelCompletedIds = updatedCompletedScenarios.filter(id => 
      levelScenarios.some(scenario => scenario.id === id)
    );
    const uncompletedScenarios = levelScenarios.filter(s => !levelCompletedIds.includes(s.id));
    
    
    if (uncompletedScenarios.length > 0) {
      // 音声がある設問を優先して選択
      const scenariosWithAudio = uncompletedScenarios.filter(s => 
        s.shadowingAudio && 
        s.shadowingAudio !== '``' && 
        s.shadowingAudio.startsWith('http')
      );
      
      if (scenariosWithAudio.length > 0) {
        setCurrentScenario(scenariosWithAudio[0]);
      } else {
        setCurrentScenario(uncompletedScenarios[0]);
      }
      setCurrentView('quiz');
    } else {
      // レベル完了
      setShowCompletionDialog({ show: true, type: selectedLevel });
    }
  };

  const handleBackToQuiz = () => {
    setCurrentView('quiz');
  };

  const handleBackToLevelSelect = () => {
    setCurrentView('levelSelect');
    setSelectedLevel(null);
    setCurrentScenario(null);
  };

  const handleCompletionDialogYes = () => {
    setShowCompletionDialog({ show: false, type: null });
    
    // 完了後は進捗をリセットして新しいレベルを開始
    const resetProgress = {
      completedScenarios: [],
      currentLevel: showCompletionDialog.type === 'beginner' ? 'advanced' : 'beginner',
      totalScore: userProgress.totalScore,
      levelProgress: {
        beginner: { completed: 0, total: 7, unlocked: true },
        advanced: { completed: 0, total: 9, unlocked: true }
      }
    };
    
    saveProgress(resetProgress);
    
    if (showCompletionDialog.type === 'beginner') {
      // 初級完了時は上級レベルへ
      handleLevelSelect('advanced');
    } else if (showCompletionDialog.type === 'advanced') {
      // 上級完了時は初級レベルへ
      handleLevelSelect('beginner');
    }
  };

  const handleCompletionDialogNo = () => {
    setShowCompletionDialog({ show: false, type: null });
    setCurrentView('levelSelect');
    setSelectedLevel(null);
    setCurrentScenario(null);
  };

  const getLevelInfo = (level: 'beginner' | 'advanced') => {
    const info = {
      beginner: {
        title: '初級',
        description: '初対面の女性とも自然に話せる！会話を引き出すテクニック',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        icon: '🟢'
      },
      advanced: {
        title: '上級',
        description: 'お見合い・デートで差をつける！相手の本音を引き出すプロ技術',
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        icon: '🔴'
      }
    };
    return info[level];
  };

  if (currentView === 'levelSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-blue-600 flex items-center gap-1 hover:opacity-80 transition-opacity mb-6"
          >
            <ArrowLeft size={18} />
            <span>会話練習モード選択に戻る</span>
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">聞く力トレーニング</h1>
            <p className="text-gray-600">会話を引き出す・深掘りするためのプログラム</p>
            
          </div>


          {/* レベル選択 */}
          <div className="grid md:grid-cols-2 gap-6">
            {(['beginner', 'advanced'] as const).map((level) => {
              const levelInfo = getLevelInfo(level);
              const progress = userProgress.levelProgress[level];
              const isUnlocked = progress.unlocked;
              
              return (
                <div key={level}>
                  <button
                    onClick={() => handleLevelSelect(level)}
                    className={`w-full p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer ${levelInfo.bgColor} border-2 ${levelInfo.borderColor}`}
                  >
                    <div className="text-4xl mb-2">{levelInfo.icon}</div>
                    <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent`}>
                      {levelInfo.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{levelInfo.description}</p>
                    
                    {/* 進捗バー */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>進捗</span>
                        <span>{progress.completed}/{progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${levelInfo.color}`}
                          style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* ヘッダー */}
      <div className="w-full max-w-6xl mx-auto pt-8 px-6">
        <button 
          onClick={handleBackToLevelSelect}
          className="text-blue-600 flex items-center gap-1 hover:opacity-80 transition-opacity mb-6"
        >
          <ArrowLeft size={18} />
          <span>レベル選択に戻る</span>
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getLevelInfo(selectedLevel!).color}`}>
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getLevelInfo(selectedLevel!).title}レベル - 聞く力トレーニング
            </h1>
            <p className="text-gray-600">{getLevelInfo(selectedLevel!).description}</p>
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
          {selectedLevel && (
            <>
              {getLevelInfo(selectedLevel).title}: {userProgress.levelProgress[selectedLevel].completed}/{userProgress.levelProgress[selectedLevel].total}問完了
            </>
          )}
        </div>
      </div>

      {/* レベル完了ダイアログ */}
      {showCompletionDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {showCompletionDialog.type === 'beginner' ? '初級' : '上級'}レベルを完了しました！
              </h2>
              <p className="text-lg text-gray-600 mb-6">おめでとうございます。</p>
              <p className="text-gray-700 mb-8">
                {showCompletionDialog.type === 'beginner' 
                  ? '上級レベルに進みますか？' 
                  : 'もう1回初級レベルに取り組みますか？'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCompletionDialogYes}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  はい
                </button>
                <button
                  onClick={handleCompletionDialogNo}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  いいえ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationPractice;