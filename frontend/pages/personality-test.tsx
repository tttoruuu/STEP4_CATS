import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';
import PersonalityForm from '../components/PersonalityForm';
import ErrorAlert from '../components/common/ErrorAlert';
import { 
  getPersonalityQuestions, 
  analyzePersonality,
  saveResultToLocal,
  saveProgressToLocal,
  getProgressFromLocal,
  clearProgressFromLocal,
  PersonalityAPIError,
  type Question,
  type PersonalityTestResult
} from '../services/personalityAPI';

interface PageState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  isAnalyzing: boolean;
  showStartScreen: boolean;
}

const PersonalityTestPage: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<PageState>({
    questions: [],
    isLoading: true,
    error: null,
    isAnalyzing: false,
    showStartScreen: true
  });

  // 質問データを取得
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const questionsData = await getPersonalityQuestions();
        
        setState(prev => ({
          ...prev,
          questions: questionsData.questions,
          isLoading: false
        }));
      } catch (error) {
        console.error('質問の取得に失敗:', error);
        
        const errorMessage = error instanceof PersonalityAPIError 
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

  // 診断開始
  const handleStartTest = () => {
    setState(prev => ({ ...prev, showStartScreen: false }));
  };

  // 戻るボタン
  const handleBack = () => {
    if (state.showStartScreen) {
      router.push('/');
    } else {
      setState(prev => ({ ...prev, showStartScreen: true }));
    }
  };

  // 診断完了 - 結果分析
  const handleTestComplete = async (answers: Record<number, number>) => {
    try {
      setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
      
      // 進捗を保存（分析中にページを離れても復帰できるように）
      saveProgressToLocal(answers);
      
      // 分析実行
      const result: PersonalityTestResult = await analyzePersonality(answers);
      
      // 結果を保存
      saveResultToLocal(result);
      
      // 進捗をクリア（完了したので不要）
      clearProgressFromLocal();
      
      // 結果ページへ遷移
      router.push('/personality-result');
      
    } catch (error) {
      console.error('性格分析に失敗:', error);
      
      const errorMessage = error instanceof PersonalityAPIError 
        ? error.message 
        : '分析処理に失敗しました。再度お試しください。';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));
    }
  };

  // エラーリトライ
  const handleRetry = () => {
    window.location.reload();
  };

  // ローディング画面
  if (state.isLoading) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">質問を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー画面
  if (state.error) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5]">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-800 ml-4">性格診断</h1>
        </div>
        
        <ErrorAlert
          error={state.error}
          onRetry={handleRetry}
          showRetry={true}
        />
      </div>
    );
  }

  // 分析中画面
  if (state.isAnalyzing) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">分析中...</h2>
          <p className="text-sm text-gray-600 mb-4">
            あなたの回答を基に<br />
            性格分析を行っています
          </p>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#FF8551] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 開始画面
  if (state.showStartScreen) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5]">
        {/* ヘッダー */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-800 ml-4">性格診断</h1>
        </div>

        {/* メインコンテンツ */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            性格診断テスト
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            婚活に向けた性格分析を行います。<br />
            あなたの性格タイプを診断し、<br />
            相性の良いパートナータイプや<br />
            改善ポイントをお教えします。
          </p>
        </div>

        {/* 診断の説明 */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">診断について</h3>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#FF8551] text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">質問数：{state.questions.length}問</p>
                <p>所要時間：約5分</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#FF8551] text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">4択形式</p>
                <p>各質問に最も当てはまる回答を選択</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#FF8551] text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">結果表示</p>
                <p>性格タイプ、スコア、アドバイスを表示</p>
              </div>
            </div>
          </div>
        </div>

        {/* 開始ボタン */}
        <button
          onClick={handleStartTest}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          診断を開始する
        </button>

        {/* 注意事項 */}
        <div className="text-center mt-6 text-xs text-gray-500">
          正直に回答することで、より正確な結果が得られます
        </div>
      </div>
    );
  }

  // 診断フォーム画面
  return (
    <PersonalityForm
      questions={state.questions}
      onComplete={handleTestComplete}
      onBack={() => setState(prev => ({ ...prev, showStartScreen: true }))}
    />
  );
};

export default PersonalityTestPage;