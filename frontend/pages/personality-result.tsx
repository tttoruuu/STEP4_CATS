import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import PersonalityResult from '../components/PersonalityResult';
import ErrorAlert from '../components/common/ErrorAlert';
import { 
  getResultFromLocal,
  clearResultFromLocal,
  clearProgressFromLocal,
  type PersonalityTestResult
} from '../services/personalityAPI';

interface PageState {
  result: PersonalityTestResult | null;
  isLoading: boolean;
  error: string | null;
}

const PersonalityResultPage: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<PageState>({
    result: null,
    isLoading: true,
    error: null
  });

  // 結果データを取得
  useEffect(() => {
    const loadResult = () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const savedResult = getResultFromLocal();
        
        if (!savedResult) {
          setState(prev => ({
            ...prev,
            error: '診断結果が見つかりません。性格診断を実行してください。',
            isLoading: false
          }));
          return;
        }
        
        // タイムスタンプをチェック（24時間以内の結果のみ有効）
        const resultTime = new Date(savedResult.timestamp).getTime();
        const now = new Date().getTime();
        const hoursSinceResult = (now - resultTime) / (1000 * 60 * 60);
        
        if (hoursSinceResult > 24) {
          clearResultFromLocal();
          setState(prev => ({
            ...prev,
            error: '診断結果の有効期限が切れています。再度診断を実行してください。',
            isLoading: false
          }));
          return;
        }
        
        setState(prev => ({
          ...prev,
          result: savedResult,
          isLoading: false
        }));
        
      } catch (error) {
        console.error('結果の読み込みに失敗:', error);
        setState(prev => ({
          ...prev,
          error: '結果の読み込みに失敗しました。',
          isLoading: false
        }));
      }
    };

    loadResult();
  }, []);

  // 戻るボタン
  const handleBack = () => {
    router.push('/');
  };

  // 再診断
  const handleRetake = () => {
    // 保存されたデータをクリア
    clearResultFromLocal();
    clearProgressFromLocal();
    
    // 診断ページへ遷移
    router.push('/personality-test');
  };

  // シェア機能
  const handleShare = async () => {
    if (!state.result) return;
    
    const shareText = `私の性格タイプは「${state.result.description.title}」でした！\n\n${state.result.description.summary}\n\nMiraimで性格診断をやってみよう！`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Miraim 性格診断結果',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        // シェアがキャンセルされた場合は何もしない
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('シェアに失敗:', error);
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  };

  // フォールバックシェア（クリップボードコピー）
  const fallbackShare = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('結果をクリップボードにコピーしました！');
    } catch (error) {
      console.error('クリップボードコピーに失敗:', error);
      // 最後の手段：テキストエリアを使用
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('結果をクリップボードにコピーしました！');
      } catch (e) {
        alert('シェア機能が利用できません。');
      }
      document.body.removeChild(textArea);
    }
  };

  // 次のステップへ
  const handleNext = () => {
    // Marriage MBTI診断ページへ遷移
    router.push('/marriage-mbti-test');
  };

  // エラー再試行
  const handleRetry = () => {
    router.push('/personality-test');
  };

  // ローディング画面
  if (state.isLoading) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">結果を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー画面
  if (state.error || !state.result) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5]">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-800 ml-4">診断結果</h1>
        </div>
        
        <div className="text-center mb-8">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            結果が見つかりません
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {state.error || '診断結果を表示できませんでした'}
          </p>
        </div>
        
        <button
          onClick={handleRetry}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          性格診断を実行する
        </button>
      </div>
    );
  }

  // 結果表示画面
  return (
    <>
      {/* ヘッダー（結果コンポーネントの外側に配置） */}
      <div className="max-w-sm mx-auto px-6 pt-8 bg-[#F5F5F5]">
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-800 ml-4">診断結果</h1>
        </div>
      </div>

      {/* 結果コンポーネント */}
      <PersonalityResult
        personalityType={state.result.personality_type}
        scores={{
          外向性: state.result.scores.外向性,
          コミュニケーション: state.result.scores.コミュニケーション,
          感情安定性: state.result.scores.感情安定性,
          意思決定: state.result.scores.意思決定,
          共感性: state.result.scores.共感性,
          コミット力: state.result.scores.コミット力
        }}
        description={state.result.description}
        compatibleTypes={state.result.compatible_types}
        onRetake={handleRetake}
        onShare={handleShare}
        onNext={handleNext}
      />
    </>
  );
};

export default PersonalityResultPage;