import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

export default function LifestyleTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "理想的な休日の過ごし方は？",
      type: "multiple",
      options: [
        "家でゆっくり過ごす",
        "友人や恋人と外出する",
        "新しい場所を探索する",
        "趣味に時間を費やす"
      ]
    },
    {
      id: 2,
      text: "将来的に住みたい場所は？",
      type: "multiple",
      options: [
        "都市部の便利な場所",
        "自然豊かな郊外",
        "地方の静かな町",
        "海外も含めて検討したい"
      ]
    },
    {
      id: 3,
      text: "お金の使い方について最も重視することは？",
      type: "multiple",
      options: [
        "将来のための貯蓄",
        "経験や体験への投資",
        "家族や恋人との時間",
        "趣味や自分磨き"
      ]
    },
    {
      id: 4,
      text: "仕事とプライベートのバランスは？",
      type: "scale",
      question: "仕事中心（1） ←→ プライベート中心（5）"
    },
    {
      id: 5,
      text: "結婚について",
      type: "multiple",
      options: [
        "できるだけ早く結婚したい",
        "良い人がいれば結婚したい",
        "まだ具体的には考えていない",
        "結婚以外の形も考えている"
      ]
    },
    {
      id: 6,
      text: "子どもについて",
      type: "multiple",
      options: [
        "絶対に欲しい",
        "できれば欲しい",
        "どちらでも良い",
        "今は考えていない"
      ]
    },
    {
      id: 7,
      text: "料理について",
      type: "multiple",
      options: [
        "自分で作るのが好き",
        "作れるが外食も好き",
        "あまり得意ではない",
        "外食やテイクアウト中心"
      ]
    },
    {
      id: 8,
      text: "運動・健康管理について",
      type: "scale",
      question: "全く意識しない（1） ←→ とても意識している（5）"
    }
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
    const result = calculateLifestyleResult();
    setIsCompleted(true);
    localStorage.setItem('lifestyleResult', JSON.stringify(result));
  };

  const calculateLifestyleResult = () => {
    const types = [
      'アクティブ派',
      'ホーム派',
      'アドベンチャー派',
      'バランス派'
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      type: randomType,
      description: getLifestyleDescription(randomType),
      compatibility: ['同じく' + randomType, 'バランス派'],
      recommendations: getRecommendations(randomType),
      date: new Date().toISOString()
    };
  };

  const getLifestyleDescription = (type) => {
    const descriptions = {
      'アクティブ派': '外出や活動的なことが好きで、エネルギッシュなライフスタイルを送るタイプです。',
      'ホーム派': '家での時間を大切にし、落ち着いた環境でリラックスすることを好むタイプです。',
      'アドベンチャー派': '新しい体験や冒険を求め、変化に富んだ生活を楽しむタイプです。',
      'バランス派': 'アクティブさと落ち着きのバランスを取り、状況に応じて柔軟に対応するタイプです。'
    };
    return descriptions[type];
  };

  const getRecommendations = (type) => {
    const recommendations = {
      'アクティブ派': ['アウトドアデート', 'スポーツ観戦', '旅行プラン'],
      'ホーム派': ['お家デート', '料理', 'Netflix鑑賞'],
      'アドベンチャー派': ['新しい場所探索', '体験型デート', '旅行'],
      'バランス派': ['カフェデート', '散歩', '文化的な活動']
    };
    return recommendations[type] || ['カフェデート', '映画鑑賞', '食事'];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  if (isCompleted) {
    const result = calculateLifestyleResult();
    return (
      <Layout title="ライフスタイル診断結果">
        <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">診断完了！</h1>
            <p className="text-gray-600">あなたのライフスタイルタイプが分かりました</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">{result.type}</div>
              <p className="text-gray-700">{result.description}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4">おすすめのデート</h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h3 className="font-medium text-gray-800 mb-4">相性の良いタイプ</h3>
            <div className="flex flex-wrap gap-2">
              {result.compatibility.map((type, index) => (
                <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/compatibility')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <Layout title="ライフスタイル診断">
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
            <h1 className="text-lg font-bold text-gray-800">ライフスタイル診断</h1>
            <p className="text-sm text-gray-600">
              質問 {currentQuestion + 1} / {questions.length}
            </p>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center">{Math.round(progress)}% 完了</p>
        </div>

        {/* 質問 */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
            {currentQ.text}
          </h2>
          
          {currentQ.type === 'multiple' ? (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">{currentQ.question}</p>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      answers[currentQuestion] === value
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
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
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? '結果を見る' : '次へ'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </Layout>
  );
}