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
    const advancedScenarios = scenarios.filter(s => s.level === 'intermediate' || s.level === 'advanced');

    // ローカルストレージから進捗を読み込み
    const savedProgress = localStorage.getItem('conversationPracticeProgress');
    if (savedProgress) {
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
  };

  const handleLevelSelect = (level: 'beginner' | 'advanced') => {
    setSelectedLevel(level);
    
    let levelScenarios;
    if (level === 'beginner') {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'beginner');
    } else {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'intermediate' || s.level === 'advanced');
    }
    
    const uncompletedScenarios = levelScenarios.filter(s => !userProgress.completedScenarios.includes(s.id));
    
    if (uncompletedScenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * uncompletedScenarios.length);
      setCurrentScenario(uncompletedScenarios[randomIndex]);
    } else {
      // 全て完了していたら最初から
      const randomIndex = Math.floor(Math.random() * levelScenarios.length);
      setCurrentScenario(levelScenarios[randomIndex]);
    }
    
    setCurrentView('quiz');
  };

  const handleQuizComplete = () => {
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
    calculateProgress();
    
    // 次の問題を選択
    let levelScenarios;
    if (selectedLevel === 'beginner') {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'beginner');
    } else {
      levelScenarios = conversationQuizData.scenarios.filter(s => s.level === 'intermediate' || s.level === 'advanced');
    }
    const uncompletedScenarios = levelScenarios.filter(s => !updatedCompletedScenarios.includes(s.id));
    
    if (uncompletedScenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * uncompletedScenarios.length);
      setCurrentScenario(uncompletedScenarios[randomIndex]);
    } else {
      // レベル完了
      alert('このレベルの全ての問題を完了しました！');
      setCurrentView('levelSelect');
    }
  };

  const handleShadowingStart = () => {
    setCurrentView('shadowing');
  };

  const handleShadowingComplete = () => {
    handleQuizComplete();
    setCurrentView('quiz');
  };

  const handleBackToQuiz = () => {
    setCurrentView('quiz');
  };

  const handleBackToLevelSelect = () => {
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
    </div>
  );
};

export default ConversationPractice;