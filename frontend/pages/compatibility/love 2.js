import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export default function LoveTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  // 恋愛傾向分析の質問（25問）
  const questions = [
    {
      id: 1,
      text: "恋愛では相手との精神的なつながりを最も重視します",
      category: "emotional"
    },
    {
      id: 2,
      text: "デートでは相手のペースに合わせることが多いです",
      category: "communication"
    },
    {
      id: 3,
      text: "恋愛関係では自分の気持ちを素直に表現します",
      category: "expression"
    },
    {
      id: 4,
      text: "将来を一緒に考えられる相手を求めています",
      category: "commitment"
    },
    {
      id: 5,
      text: "相手の小さな変化にもすぐに気づきます",
      category: "attention"
    },
    {
      id: 6,
      text: "恋愛では相手の趣味や興味を尊重します",
      category: "respect"
    },
    {
      id: 7,
      text: "パートナーとは何でも話し合いたいと思います",
      category: "communication"
    },
    {
      id: 8,
      text: "恋愛関係では相手を支えることを大切にします",
      category: "support"
    },
    {
      id: 9,
      text: "相手の成長を見守り応援することが好きです",
      category: "growth"
    },
    {
      id: 10,
      text: "恋愛では安定感のある関係を求めます",
      category: "stability"
    },
    {
      id: 11,
      text: "相手との価値観の一致を重要視します",
      category: "values"
    },
    {
      id: 12,
      text: "恋愛関係では相手のプライベートを尊重します",
      category: "privacy"
    },
    {
      id: 13,
      text: "デートの計画は二人で一緒に立てたいです",
      category: "planning"
    },
    {
      id: 14,
      text: "相手の家族や友人とも良い関係を築きたいです",
      category: "social"
    },
    {
      id: 15,
      text: "恋愛では相手との信頼関係を何より大切にします",
      category: "trust"
    },
    {
      id: 16,
      text: "パートナーとは定期的にお互いの気持ちを確認し合いたいです",
      category: "communication"
    },
    {
      id: 17,
      text: "相手の意見が自分と違っても受け入れることができます",
      category: "acceptance"
    },
    {
      id: 18,
      text: "恋愛関係では相手との時間を大切にします",
      category: "time"
    },
    {
      id: 19,
      text: "相手の悩みには親身になって聞きます",
      category: "empathy"
    },
    {
      id: 20,
      text: "恋愛では相手の良いところを見つけることが得意です",
      category: "positive"
    },
    {
      id: 21,
      text: "パートナーとは一緒に成長していきたいと思います",
      category: "growth"
    },
    {
      id: 22,
      text: "恋愛関係では率直なコミュニケーションを心がけます",
      category: "honesty"
    },
    {
      id: 23,
      text: "相手の感情を理解しようと努力します",
      category: "understanding"
    },
    {
      id: 24,
      text: "恋愛では相手との共通の目標を持ちたいです",
      category: "shared_goals"
    },
    {
      id: 25,
      text: "パートナーとは互いに支え合える関係でありたいです",
      category: "mutual_support"
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
    const result = calculateLoveType();
    setIsCompleted(true);
    // 結果をローカルストレージに保存
    localStorage.setItem('loveResult', JSON.stringify(result));
  };

  const calculateLoveType = () => {
    // 回答を分析して恋愛タイプを決定
    const categoryScores = {};
    
    questions.forEach((question, index) => {
      const answer = answers[index] || 3;
      const category = question.category;
      
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(answer);
    });

    // 各カテゴリの平均スコアを計算
    const avgScores = {};
    Object.keys(categoryScores).forEach(category => {
      const scores = categoryScores[category];
      avgScores[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    // 恋愛タイプを決定（簡易版）
    const communicationScore = avgScores.communication || 3;
    const emotionalScore = avgScores.emotional || 3;
    const supportScore = avgScores.support || 3;

    let loveType = "";
    let description = "";
    let characteristics = [];
    let compatibleTypes = [];

    if (communicationScore >= 4 && emotionalScore >= 4) {
      loveType = "共感重視型";
      description = "相手の気持ちを理解し、深いつながりを大切にするタイプです。";
      characteristics = ["高い共感力", "深いコミュニケーション", "感情的なサポート"];
      compatibleTypes = ["安定志向型", "成長志向型"];
    } else if (supportScore >= 4 && avgScores.commitment >= 4) {
      loveType = "安定志向型";
      description = "長期的で安定した関係を築くことを重視するタイプです。";
      characteristics = ["責任感が強い", "計画的", "信頼性が高い"];
      compatibleTypes = ["共感重視型", "協調性重視型"];
    } else if (avgScores.growth >= 4 && avgScores.positive >= 4) {
      loveType = "成長志向型";
      description = "お互いの成長を支え合い、共に向上していくことを大切にするタイプです。";
      characteristics = ["向上心が強い", "ポジティブ思考", "相手の可能性を信じる"];
      compatibleTypes = ["共感重視型", "バランス型"];
    } else {
      loveType = "バランス型";
      description = "様々な要素をバランスよく重視する、柔軟性のあるタイプです。";
      characteristics = ["適応力が高い", "バランス感覚", "多様性を受け入れる"];
      compatibleTypes = ["成長志向型", "協調性重視型"];
    }

    return {
      type: loveType,
      description: description,
      characteristics: characteristics,
      compatibleTypes: compatibleTypes,
      scores: avgScores,
      date: new Date().toISOString()
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    const result = calculateLoveType();
    return (
      <Layout title="恋愛傾向分析結果">
        <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">診断完了！</h1>
            <p className="text-gray-600">あなたの恋愛傾向が分かりました</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-pink-600 mb-2">{result.type}</div>
              <p className="text-gray-700">{result.description}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4">あなたの特徴</h3>
            <div className="space-y-2">
              {result.characteristics.map((characteristic, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{characteristic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h3 className="font-medium text-gray-800 mb-4">相性の良いタイプ</h3>
            <div className="flex flex-wrap gap-2">
              {result.compatibleTypes.map((type, index) => (
                <span key={index} className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/compatibility')}
              className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
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
    <Layout title="恋愛傾向分析">
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
            <h1 className="text-lg font-bold text-gray-800">恋愛傾向分析</h1>
            <p className="text-sm text-gray-600">
              質問 {currentQuestion + 1} / {questions.length}
            </p>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
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
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion] === option.value
                      ? 'border-pink-500 bg-pink-500'
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
            className="flex-1 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? '結果を見る' : '次へ'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </Layout>
  );
}