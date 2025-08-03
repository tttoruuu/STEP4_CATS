import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Heart, Users, Target, Brain, ArrowRight, ArrowLeft, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import ErrorAlert from '../components/common/ErrorAlert';
import MarriageMBTIResultComponent from '../components/MarriageMBTIResult';
import {
  getMarriageMBTIQuestions,
  analyzeMarriageMBTI,
  saveMarriageMBTIResultToLocal,
  saveMarriageMBTIProgressToLocal,
  getMarriageMBTIProgressFromLocal,
  clearMarriageMBTIProgressFromLocal,
  clearMarriageMBTIResultFromLocal,
  validateMBTIAnswers,
  validateMarriageAnswers,
  MarriageMBTIAPIError,
  type MBTIQuestion,
  type MarriageQuestion,
  type MBTIAnswer,
  type MarriageAnswer,
  type MarriageMBTIResult
} from '../services/marriageMbtiAPI';

type Step = 'intro' | 'mbti' | 'marriage' | 'result';

interface PageState {
  currentStep: Step;
  currentQuestionIndex: number;
  mbtiQuestions: MBTIQuestion[];
  marriageQuestions: MarriageQuestion[];
  mbtiAnswers: MBTIAnswer[];
  marriageAnswers: MarriageAnswer[];
  result: MarriageMBTIResult | null;
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
}

const MarriageMBTITestPage: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<PageState>({
    currentStep: 'intro',
    currentQuestionIndex: 0,
    mbtiQuestions: [],
    marriageQuestions: [],
    mbtiAnswers: [],
    marriageAnswers: [],
    result: null,
    isLoading: true,
    isAnalyzing: false,
    error: null
  });

  const totalMBTIQuestions = state.mbtiQuestions.length;
  const totalMarriageQuestions = state.marriageQuestions.length;

  // 質問データを取得
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const questionsData = await getMarriageMBTIQuestions();
        
        setState(prev => ({
          ...prev,
          mbtiQuestions: questionsData.mbtiQuestions,
          marriageQuestions: questionsData.marriageQuestions,
          isLoading: false
        }));
        
        // 自動復元は無効化：常に開始画面から表示
        // ユーザーが明示的に「続きから」を選択した場合のみ進捗を復元
        
      } catch (error) {
        console.error('質問の取得に失敗:', error);
        
        const errorMessage = error instanceof MarriageMBTIAPIError 
          ? error.message 
          : '質問の読み込みに失敗しました。再度お試しください。';
        
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false
        }));
      }
    };

    loadQuestions();
  }, []);

  // 進捗を保存
  const saveProgress = () => {
    saveMarriageMBTIProgressToLocal(
      state.mbtiAnswers,
      state.marriageAnswers,
      state.currentStep,
      state.currentQuestionIndex
    );
  };

  // MBTI 回答処理
  const handleMBTIAnswer = (answer: 'A' | 'B') => {
    const newAnswers = [...state.mbtiAnswers, { 
      questionId: state.currentQuestionIndex, 
      answer 
    }];
    
    setState(prev => ({ ...prev, mbtiAnswers: newAnswers }));

    if (state.currentQuestionIndex < totalMBTIQuestions - 1) {
      setState(prev => ({ 
        ...prev, 
        currentQuestionIndex: prev.currentQuestionIndex + 1 
      }));
      // 進捗保存
      setTimeout(() => saveProgress(), 100);
    } else {
      // MBTI完了 → 結婚観診断へ
      setState(prev => ({
        ...prev,
        currentStep: 'marriage',
        currentQuestionIndex: 0
      }));
      // 進捗保存
      setTimeout(() => saveProgress(), 100);
    }
  };

  // 結婚観回答処理
  const handleMarriageAnswer = (answer: number) => {
    const newAnswers = [...state.marriageAnswers, { 
      questionId: state.currentQuestionIndex, 
      answer 
    }];
    
    setState(prev => ({ ...prev, marriageAnswers: newAnswers }));

    if (state.currentQuestionIndex < totalMarriageQuestions - 1) {
      setState(prev => ({ 
        ...prev, 
        currentQuestionIndex: prev.currentQuestionIndex + 1 
      }));
      // 進捗保存
      setTimeout(() => saveProgress(), 100);
    } else {
      // 結婚観診断完了 → 分析実行
      handleAnalyze(state.mbtiAnswers, newAnswers);
    }
  };

  // 分析実行
  const handleAnalyze = async (mbtiAnswers: MBTIAnswer[], marriageAnswers: MarriageAnswer[]) => {
    try {
      setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
      
      // 回答データの検証
      const mbtiValidation = validateMBTIAnswers(mbtiAnswers);
      const marriageValidation = validateMarriageAnswers(marriageAnswers);
      
      if (!mbtiValidation.isValid || !marriageValidation.isValid) {
        throw new Error([...mbtiValidation.errors, ...marriageValidation.errors].join(', '));
      }
      
      // 分析実行
      const result = await analyzeMarriageMBTI(mbtiAnswers, marriageAnswers);
      
      // 結果を保存
      saveMarriageMBTIResultToLocal(result);
      
      // 進捗をクリア（完了したので不要）
      clearMarriageMBTIProgressFromLocal();
      
      setState(prev => ({
        ...prev,
        result,
        currentStep: 'result',
        isAnalyzing: false
      }));
      
    } catch (error) {
      console.error('Marriage MBTI+ 分析に失敗:', error);
      
      const errorMessage = error instanceof MarriageMBTIAPIError 
        ? error.message 
        : '分析処理に失敗しました。再度お試しください。';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));
    }
  };

  // 前に戻る
  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ 
        ...prev, 
        currentQuestionIndex: prev.currentQuestionIndex - 1 
      }));
      
      if (state.currentStep === 'mbti') {
        setState(prev => ({ 
          ...prev, 
          mbtiAnswers: prev.mbtiAnswers.slice(0, -1) 
        }));
      } else if (state.currentStep === 'marriage') {
        setState(prev => ({ 
          ...prev, 
          marriageAnswers: prev.marriageAnswers.slice(0, -1) 
        }));
      }
      
      // 進捗保存
      setTimeout(() => saveProgress(), 100);
    } else if (state.currentStep === 'marriage') {
      // 結婚観の最初の質問からMBTIの最後に戻る
      setState(prev => ({
        ...prev,
        currentStep: 'mbti',
        currentQuestionIndex: totalMBTIQuestions - 1,
        marriageAnswers: []
      }));
      // 進捗保存
      setTimeout(() => saveProgress(), 100);
    } else if (state.currentStep === 'mbti') {
      // MBTIの最初の質問から開始画面に戻る
      setState(prev => ({
        ...prev,
        currentStep: 'intro',
        currentQuestionIndex: 0,
        mbtiAnswers: []
      }));
    }
  };

  // テストをリセット
  const resetTest = () => {
    setState({
      currentStep: 'intro',
      currentQuestionIndex: 0,
      mbtiQuestions: state.mbtiQuestions,
      marriageQuestions: state.marriageQuestions,
      mbtiAnswers: [],
      marriageAnswers: [],
      result: null,
      isLoading: false,
      isAnalyzing: false,
      error: null
    });
    clearMarriageMBTIProgressFromLocal();
    clearMarriageMBTIResultFromLocal();
  };

  // 進捗計算
  const getProgress = () => {
    if (state.currentStep === 'mbti') {
      return (state.currentQuestionIndex / totalMBTIQuestions) * 50;
    } else if (state.currentStep === 'marriage') {
      return 50 + (state.currentQuestionIndex / totalMarriageQuestions) * 50;
    }
    return 0;
  };

  // エラー再試行
  const handleRetry = () => {
    window.location.reload();
  };

  // ローディング画面
  if (state.isLoading) {
    return (
      <Layout title="Marriage MBTI+ 診断" hideFooter={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'var(--bg-gradient-primary)'}}>
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-lg font-medium mb-2" style={{color: 'var(--color-gray-800)'}}>質問を読み込んでいます...</h2>
            <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>Marriage MBTI+ 診断の準備中です</p>
          </div>
        </div>
      </Layout>
    );
  }

  // エラー画面
  if (state.error) {
    return (
      <Layout title="Marriage MBTI+ 診断" hideFooter={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
          <div className="max-w-md mx-auto px-6 py-8">
            <div className="card card-glass">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--color-error)', opacity: 0.1}}>
                  <AlertCircle className="w-8 h-8" style={{color: 'var(--color-error)'}} />
                </div>
                <h2 className="text-lg font-medium mb-2" style={{color: 'var(--color-gray-800)'}}>エラーが発生しました</h2>
              </div>
              
              <ErrorAlert
                error={state.error}
                onRetry={handleRetry}
                showRetry={true}
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 分析中画面
  if (state.isAnalyzing) {
    return (
      <Layout title="Marriage MBTI+ 診断" hideFooter={true}>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-gradient-main)'}}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'var(--bg-gradient-primary)'}}>
              <Brain className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-4" style={{color: 'var(--color-gray-800)'}}>分析中...</h2>
            <p className="text-lg mb-4" style={{color: 'var(--color-gray-600)'}}>
              あなたのMBTIタイプと結婚観を<br />
              詳しく分析しています
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'var(--color-primary-400)', animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Marriage MBTI+ 診断" hideFooter={false}>
      <div className="min-h-screen" style={{background: 'var(--bg-gradient-main)'}}>
        {/* ヘッダー */}
        <header className="header">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" style={{color: 'var(--color-primary-500)'}} />
              <h1 className="text-xl font-bold" style={{color: 'var(--color-gray-800)'}}>Marriage MBTI+</h1>
            </div>
            {(state.currentStep === 'mbti' || state.currentStep === 'marriage') && (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{color: 'var(--color-gray-600)'}}>
                  {state.currentStep === 'mbti' ? 'MBTI診断' : '結婚観診断'}
                </span>
                <span className="text-sm font-medium" style={{color: 'var(--color-primary-600)'}}>
                  {state.currentQuestionIndex + 1} / {state.currentStep === 'mbti' ? totalMBTIQuestions : totalMarriageQuestions}
                </span>
              </div>
            )}
          </div>
          {(state.currentStep === 'mbti' || state.currentStep === 'marriage') && (
            <div className="progress">
              <div 
                className="progress-bar"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 開始画面 */}
        {state.currentStep === 'intro' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{background: 'var(--bg-gradient-primary)'}}>
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold" style={{color: 'var(--color-gray-800)'}}>Marriage MBTI+</h2>
              <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--color-gray-600)'}}>
                MBTI診断と結婚観の分析により、あなたに最適なパートナーのタイプと<br />
                恋愛・結婚における傾向を詳しく診断します。
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="card card-glass">
                <Users className="w-8 h-8 mb-3" style={{color: 'var(--color-primary-500)'}} />
                <h3 className="font-semibold mb-2" style={{color: 'var(--color-gray-800)'}}>MBTI診断</h3>
                <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>16の性格タイプから、あなたの基本的な性格を分析</p>
                <div className="text-xs mt-2 font-medium" style={{color: 'var(--color-primary-600)'}}>16問・選択式</div>
              </div>
              <div className="card card-glass">
                <Heart className="w-8 h-8 mb-3" style={{color: 'var(--color-secondary-500)'}} />
                <h3 className="font-semibold mb-2" style={{color: 'var(--color-gray-800)'}}>結婚観診断</h3>
                <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>恋愛・結婚に対する価値観と優先度を詳細分析</p>
                <div className="text-xs mt-2 font-medium" style={{color: 'var(--color-secondary-600)'}}>10問・5段階評価</div>
              </div>
              <div className="card card-glass">
                <Target className="w-8 h-8 mb-3" style={{color: 'var(--color-accent-500)'}} />
                <h3 className="font-semibold mb-2" style={{color: 'var(--color-gray-800)'}}>相性アドバイス</h3>
                <p className="text-sm" style={{color: 'var(--color-gray-600)'}}>最適なパートナータイプと具体的なアドバイスを提供</p>
                <div className="text-xs mt-2 font-medium" style={{color: 'var(--color-accent-600)'}}>総合26問・約10分</div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  // 新しく診断を開始（進捗をクリア）
                  clearMarriageMBTIProgressFromLocal();
                  setState(prev => ({ 
                    ...prev, 
                    currentStep: 'mbti',
                    currentQuestionIndex: 0,
                    mbtiAnswers: [],
                    marriageAnswers: []
                  }));
                }}
                className="btn btn-primary btn-lg mx-auto text-lg px-8 py-4"
              >
                診断を開始する
                <ArrowRight className="w-5 h-5" />
              </button>
              
              {/* 保存された進捗がある場合は続行ボタンも表示 */}
              {getMarriageMBTIProgressFromLocal() && (
                <button
                  onClick={() => {
                    const savedProgress = getMarriageMBTIProgressFromLocal();
                    if (savedProgress) {
                      setState(prev => ({
                        ...prev,
                        currentStep: savedProgress.currentStep as Step,
                        currentQuestionIndex: savedProgress.currentQuestionIndex,
                        mbtiAnswers: savedProgress.mbtiAnswers,
                        marriageAnswers: savedProgress.marriageAnswers
                      }));
                    }
                  }}
                  className="btn btn-ghost mx-auto px-6 py-3"
                >
                  前回の続きから
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="text-xs max-w-md mx-auto" style={{color: 'var(--color-gray-500)'}}>
              正直に回答することで、より正確で詳細な分析結果が得られます。<br />
              診断は途中で中断・再開が可能です。
            </div>
          </div>
        )}

        {/* MBTI診断画面 */}
        {state.currentStep === 'mbti' && state.mbtiQuestions.length > 0 && (
          <div className="max-w-2xl mx-auto animate-slide-in">
            <div className="card card-glass">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" style={{backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'}}>
                  MBTI診断
                </span>
                <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-gray-800)'}}>
                  質問 {state.currentQuestionIndex + 1}
                </h3>
                <p className="text-lg leading-relaxed" style={{color: 'var(--color-gray-700)'}}>
                  {state.mbtiQuestions[state.currentQuestionIndex]?.question}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleMBTIAnswer('A')}
                  className="w-full p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group" 
                  style={{
                    background: 'linear-gradient(to right, var(--color-primary-50), var(--color-accent-50))',
                    borderColor: 'var(--color-primary-200)',
                    ':hover': {
                      background: 'linear-gradient(to right, var(--color-primary-100), var(--color-accent-100))',
                      borderColor: 'var(--color-primary-300)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--color-primary-100), var(--color-accent-100))';
                    e.currentTarget.style.borderColor = 'var(--color-primary-300)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--color-primary-50), var(--color-accent-50))';
                    e.currentTarget.style.borderColor = 'var(--color-primary-200)';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{color: 'var(--color-gray-800)'}}>
                      A. {state.mbtiQuestions[state.currentQuestionIndex]?.optionA}
                    </span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{color: 'var(--color-primary-500)'}} />
                  </div>
                </button>
                
                <button
                  onClick={() => handleMBTIAnswer('B')}
                  className="w-full p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group"
                  style={{
                    background: 'linear-gradient(to right, var(--color-secondary-50), var(--color-accent-50))',
                    borderColor: 'var(--color-secondary-200)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--color-secondary-100), var(--color-accent-100))';
                    e.currentTarget.style.borderColor = 'var(--color-secondary-300)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--color-secondary-50), var(--color-accent-50))';
                    e.currentTarget.style.borderColor = 'var(--color-secondary-200)';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{color: 'var(--color-gray-800)'}}>
                      B. {state.mbtiQuestions[state.currentQuestionIndex]?.optionB}
                    </span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{color: 'var(--color-secondary-500)'}} />
                  </div>
                </button>
              </div>

              {(state.currentQuestionIndex > 0 || state.currentStep !== 'mbti' || state.mbtiAnswers.length > 0) && (
                <button
                  onClick={handlePrevious}
                  className="mt-6 flex items-center gap-2 transition-colors"
                  style={{color: 'var(--color-gray-600)'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gray-800)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
                >
                  <ArrowLeft className="w-4 h-4" />
                  前の質問に戻る
                </button>
              )}
            </div>
          </div>
        )}

        {/* 結婚観診断画面 */}
        {state.currentStep === 'marriage' && state.marriageQuestions.length > 0 && (
          <div className="max-w-2xl mx-auto animate-slide-in">
            <div className="card card-glass">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" style={{backgroundColor: 'var(--color-secondary-100)', color: 'var(--color-secondary-700)'}}>
                  結婚観診断
                </span>
                <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-gray-800)'}}>
                  質問 {state.currentQuestionIndex + 1}
                </h3>
                <p className="text-lg leading-relaxed" style={{color: 'var(--color-gray-700)'}}>
                  {state.marriageQuestions[state.currentQuestionIndex]?.question}
                </p>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleMarriageAnswer(value)}
                    className="w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group"
                    style={{
                      background: 'linear-gradient(to right, var(--color-secondary-50), var(--color-accent-50))',
                      borderColor: 'var(--color-secondary-200)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, var(--color-secondary-100), var(--color-accent-100))';
                      e.currentTarget.style.borderColor = 'var(--color-secondary-300)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, var(--color-secondary-50), var(--color-accent-50))';
                      e.currentTarget.style.borderColor = 'var(--color-secondary-200)';
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{color: 'var(--color-gray-800)'}}>
                        {state.marriageQuestions[state.currentQuestionIndex]?.options[value - 1]}
                      </span>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{color: 'var(--color-secondary-500)'}} />
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handlePrevious}
                className="mt-6 flex items-center gap-2 transition-colors"
                style={{color: 'var(--color-gray-600)'}}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gray-800)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
              >
                <ArrowLeft className="w-4 h-4" />
                前の質問に戻る
              </button>
            </div>
          </div>
        )}

        {/* 結果画面 */}
        {state.currentStep === 'result' && state.result && (
          <div className="animate-fade-in">
            <MarriageMBTIResultComponent
              result={state.result}
              onRetake={resetTest}
              onShare={async () => {
                const shareText = `私のMBTI性格タイプは「${state.result?.mbtiType}」（${state.result?.typeName}）でした！\n\n${state.result?.description}\n\nMarriage MBTI+で診断を受けてみよう！`;
                
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'Marriage MBTI+ 診断結果',
                      text: shareText,
                      url: window.location.origin
                    });
                  } catch (error) {
                    if (error instanceof Error && error.name !== 'AbortError') {
                      console.error('シェアに失敗:', error);
                      // フォールバック: クリップボードコピー
                      try {
                        await navigator.clipboard.writeText(shareText);
                        alert('結果をクリップボードにコピーしました！');
                      } catch {
                        alert('シェア機能が利用できません。');
                      }
                    }
                  }
                } else {
                  // フォールバック: クリップボードコピー
                  try {
                    await navigator.clipboard.writeText(shareText);
                    alert('結果をクリップボードにコピーしました！');
                  } catch {
                    alert('シェア機能が利用できません。');
                  }
                }
              }}
              onNext={() => {
                router.push('/');
              }}
            />
          </div>
        )}
        </main>
      </div>
    </Layout>
  );
};

export default MarriageMBTITestPage;