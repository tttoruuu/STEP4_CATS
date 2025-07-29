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
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  totalScore: number;
  levelProgress: {
    beginner: { completed: number; total: number; unlocked: boolean };
    intermediate: { completed: number; total: number; unlocked: boolean };
    advanced: { completed: number; total: number; unlocked: boolean };
  };
}

const ConversationPractice: React.FC = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'levelSelect' | 'quiz' | 'shadowing'>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedScenarios: [],
    currentLevel: 'beginner',
    totalScore: 0,
    levelProgress: {
      beginner: { completed: 0, total: 0, unlocked: true },
      intermediate: { completed: 0, total: 0, unlocked: false },
      advanced: { completed: 0, total: 0, unlocked: false }
    }
  });

  // 初期化とプログレス計算
  useEffect(() => {
    calculateProgress();
  }, []);

  const calculateProgress = () => {
    const scenarios = conversationQuizData.scenarios;
    const beginnerScenarios = scenarios.filter(s => s.level === 'beginner');
    const intermediateScenarios = scenarios.filter(s => s.level === 'intermediate');
    const advancedScenarios = scenarios.filter(s => s.level === 'advanced');

    // ローカルストレージから進捗を読み込み
    const savedProgress = localStorage.getItem('conversationPracticeProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      const completedIds = parsed.completedScenarios || [];
      
      // 各レベルの完了数を計算
      const beginnerCompleted = beginnerScenarios.filter(s => completedIds.includes(s.id)).length;
      const intermediateCompleted = intermediateScenarios.filter(s => completedIds.includes(s.id)).length;
      const advancedCompleted = advancedScenarios.filter(s => completedIds.includes(s.id)).length;
      
      // 中級解放条件：初級80%以上完了
      const intermediateUnlocked = beginnerCompleted >= Math.floor(beginnerScenarios.length * 0.8);
      // 上級解放条件：中級80%以上完了
      const advancedUnlocked = intermediateCompleted >= Math.floor(intermediateScenarios.length * 0.8);
      
      setUserProgress({
        ...parsed,
        levelProgress: {
          beginner: { 
            completed: beginnerCompleted, 
            total: beginnerScenarios.length, 
            unlocked: true 
          },
          intermediate: { 
            completed: intermediateCompleted, 
            total: intermediateScenarios.length, 
            unlocked: intermediateUnlocked 
          },
          advanced: { 
            completed: advancedCompleted, 
            total: advancedScenarios.length, 
            unlocked: advancedUnlocked 
          }
        }
      });
    } else {
      // 初回利用時の初期化
      setUserProgress(prev => ({
        ...prev,
        levelProgress: {
          beginner: { completed: 0, total: beginnerScenarios.length, unlocked: true },
          intermediate: { completed: 0, total: intermediateScenarios.length, unlocked: false },
          advanced: { completed: 0, total: advancedScenarios.length, unlocked: false }
        }
      }));
    }
  };

  const saveProgress = (updatedProgress: UserProgress) => {
    localStorage.setItem('conversationPracticeProgress', JSON.stringify(updatedProgress));
    setUserProgress(updatedProgress);
  };

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!userProgress.levelProgress[level].unlocked) {
      alert(`${level === 'intermediate' ? '中級' : '上級'}レベルはまだ解放されていません。前のレベルを80%以上完了してください。`);
      return;
    }
    
    setSelectedLevel(level);
    const levelScenarios = conversationQuizData.scenarios.filter(s => s.level === level);
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
    const levelScenarios = conversationQuizData.scenarios.filter(s => s.level === selectedLevel);
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

  const getLevelInfo = (level: 'beginner' | 'intermediate' | 'advanced') => {
    const info = {
      beginner: {
        title: '初級',
        description: '基本的な会話引き出し技術',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        icon: '🟢',
        skills: ['アイスブレイク質問', '基本的な引き出し質問', '適切な相槌技術']
      },
      intermediate: {
        title: '中級',
        description: '応用的な質問と軽い深堀り',
        color: 'from-yellow-500 to-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        icon: '🟡',
        skills: ['話題展開テクニック', '感情フォーカス質問', '価値観を探る入門']
      },
      advanced: {
        title: '上級',
        description: '高度な深堀り質問と分析技術',
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        icon: '🔴',
        skills: ['価値観深堀り技術', '高度な共感技術', '未来志向の会話']
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">統合型会話練習</h1>
            <p className="text-gray-600">聞く力マスタープログラム</p>
          </div>

          {/* 総合進捗 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">あなたの進捗</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userProgress.completedScenarios.length}</div>
                <div className="text-gray-600">完了した練習</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{userProgress.totalScore}</div>
                <div className="text-gray-600">獲得ポイント</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((userProgress.completedScenarios.length / conversationQuizData.scenarios.length) * 100)}%
                </div>
                <div className="text-gray-600">全体の完了率</div>
              </div>
            </div>
          </div>

          {/* レベル選択 */}
          <div className="grid md:grid-cols-3 gap-6">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
              const levelInfo = getLevelInfo(level);
              const progress = userProgress.levelProgress[level];
              const isUnlocked = progress.unlocked;
              
              return (
                <div
                  key={level}
                  className={`relative ${!isUnlocked ? 'opacity-60' : ''}`}
                >
                  <button
                    onClick={() => handleLevelSelect(level)}
                    disabled={!isUnlocked}
                    className={`w-full p-6 rounded-lg shadow-lg transition-all duration-200 ${
                      isUnlocked 
                        ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                        : 'cursor-not-allowed'
                    } ${levelInfo.bgColor} border-2 ${levelInfo.borderColor}`}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock size={24} className="text-gray-500" />
                      </div>
                    )}
                    
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
                    
                    {/* スキル一覧 */}
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 mb-2">習得スキル：</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {levelInfo.skills.map((skill, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="text-green-500">✓</span>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {!isUnlocked && (
                      <div className="mt-4 text-sm text-gray-500">
                        前のレベルを80%以上完了で解放
                      </div>
                    )}
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