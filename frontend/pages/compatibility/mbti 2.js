import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ChevronLeft, ChevronRight, Brain } from 'lucide-react';

export default function MBTITest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  // サンプルMBTI質問（実際は60問）
  const questions = [
    {
      id: 1,
      text: "パーティーでは、多くの人と話すことを楽しみます",
      category: "E/I"
    },
    {
      id: 2,
      text: "詳細よりも全体像を把握することを重視します",
      category: "S/N"
    },
    {
      id: 3,
      text: "論理的な分析よりも人の気持ちを考慮して決断します",
      category: "T/F"
    },
    {
      id: 4,
      text: "計画を立てて行動することを好みます",
      category: "J/P"
    },
    {
      id: 5,
      text: "一人の時間を大切にし、内省することが多いです",
      category: "E/I"
    },
    {
      id: 6,
      text: "アイデアや可能性について考えることが好きです",
      category: "S/N"
    },
    {
      id: 7,
      text: "客観的事実に基づいて判断することを重視します",
      category: "T/F"
    },
    {
      id: 8,
      text: "柔軟性を保ち、状況に応じて対応することを好みます",
      category: "J/P"
    },
    {
      id: 9,
      text: "人との交流からエネルギーを得ることが多いです",
      category: "E/I"
    },
    {
      id: 10,
      text: "具体的な事実や現実的な情報を重視します",
      category: "S/N"
    }
  ];

  const answerOptions = [
    { value: 1, label: "全く当てはまらない" },
    { value: 2, label: "当てはまらない" },
    { value: 3, label: "どちらでもない" },
    { value: 4, label: "当てはまる" },
    { value: 5, label: "非常に当てはまる" }
  ];

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeTest = () => {
    // 簡単な結果計算（実際はより複雑な計算）
    const result = calculateMBTI();
    setIsCompleted(true);
    // 結果をローカルストレージに保存
    localStorage.setItem('mbtiResult', JSON.stringify(result));
  };

  const calculateMBTI = () => {
    // 簡易的なMBTI計算（実際はより詳細な分析が必要）
    const types = ['ENFP', 'INTJ', 'ESFJ', 'ISTP', 'ENFJ', 'INTP', 'ESFP', 'ISTJ'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      type: randomType,
      description: getMBTIDescription(randomType),
      strengths: ['共感力が高い', '創造性豊か', 'コミュニケーション上手'],
      compatibleTypes: ['INFJ', 'INTJ', 'ENFJ'],
      date: new Date().toISOString()
    };
  };

  const getMBTIDescription = (type) => {
    const descriptions = {
      'ENFP': '情熱的で創造的、人々との深いつながりを大切にするタイプです。',
      'INTJ': '独立心が強く、長期的な計画を立てて目標を達成するタイプです。',
      'ESFJ': '思いやりがあり、他人のニーズを理解して支援するタイプです。',
      'ISTP': '実用的で適応力があり、論理的に問題を解決するタイプです。'
    };
    return descriptions[type] || '独特な個性を持つ魅力的なタイプです。';
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    const result = calculateMBTI();
    return (
      <Layout title="MBTI診断結果">
        <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">診断完了！</h1>
            <p className="text-gray-600">あなたのMBTIタイプが分かりました</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-purple-600 mb-2">{result.type}</div>
              <p className="text-gray-700">{result.description}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4">あなたの強み</h3>
            <div className="space-y-2">
              {result.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h3 className="font-medium text-gray-800 mb-4">相性の良いタイプ</h3>
            <div className="flex flex-wrap gap-2">
              {result.compatibleTypes.map((type, index) => (
                <span key={index} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/compatibility')}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              他の診断も受ける
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="MBTI性格診断">
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">MBTI性格診断</h1>
            <p className="text-sm text-gray-600">
              質問 {currentQuestion + 1} / {questions.length}
            </p>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center">{Math.round(progress)}% 完了</p>
        </div>

        {/* 質問 */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
            {questions[currentQuestion].text}
          </h2>
          
          <div className="space-y-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion] === option.value
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === option.value && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex gap-4">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              前へ
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!(currentQuestion in answers)}
            className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? '結果を見る' : '次へ'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </Layout>
  );
}