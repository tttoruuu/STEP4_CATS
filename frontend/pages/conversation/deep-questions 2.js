import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DeepQuestionStats from '../../components/DeepQuestionStats';
import { ArrowLeft, Play, Pause, Volume2, Mic, MicOff, RotateCcw, BarChart3 } from 'lucide-react';

export default function DeepQuestionsQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userAudioBlob, setUserAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const audioRef = useRef(null);

  // サンプル問題データ
  const questions = [
    {
      id: 1,
      category: "趣味について",
      level: 1,
      situation: "初めてのデートで、相手の女性が次のように話しました：",
      partnerInfo: {
        name: "みゆきさん",
        age: "26歳",
        occupation: "看護師"
      },
      statement: "最近ヨガを始めたんです",
      options: [
        {
          id: 'A',
          text: "ヨガって体に良さそうですね",
          isCorrect: false,
          explanation: "一般論で返答しており、会話が深まりません"
        },
        {
          id: 'B', 
          text: "どのくらいの頻度で通われているんですか？きっかけは何かあったんですか？",
          isCorrect: true,
          explanation: "具体的な質問で相手の興味を深堀りでき、さらにきっかけを聞くことで背景を理解できます"
        },
        {
          id: 'C',
          text: "僕もスポーツは好きです",
          isCorrect: false,
          explanation: "自分の話にすり替えてしまい、相手への関心を示せていません"
        },
        {
          id: 'D',
          text: "ヨガは難しくないですか？",
          isCorrect: false,
          explanation: "ネガティブな印象を与える可能性があります"
        }
      ],
      audioUrl: "/audio/samples/yoga-question.mp3",
      keyPoints: [
        "具体的な頻度を聞くことで相手の生活スタイルを知る",
        "きっかけを聞くことで相手の価値観や動機を理解",
        "2つの質問を自然につなげている"
      ]
    },
    {
      id: 2,
      category: "仕事について", 
      level: 1,
      situation: "カフェでの会話中、相手が仕事について話しました：",
      partnerInfo: {
        name: "さくらさん",
        age: "28歳", 
        occupation: "保育士"
      },
      statement: "保育士をしています。子供たちはとても可愛いです",
      options: [
        {
          id: 'A',
          text: "保育士さんは大変そうですね",
          isCorrect: false,
          explanation: "ネガティブな面にフォーカスしており、相手の気持ちを下げる可能性があります"
        },
        {
          id: 'B',
          text: "子供たちと接していて、一番やりがいを感じるのはどんな時ですか？",
          isCorrect: true,
          explanation: "仕事の喜びや価値観を聞き出す素晴らしい質問です。相手のポジティブな感情を引き出せます"
        },
        {
          id: 'C', 
          text: "何歳くらいの子供を担当しているんですか？",
          isCorrect: false,
          explanation: "悪くない質問ですが、感情面への踏み込みが不足しています"
        },
        {
          id: 'D',
          text: "保育士の資格を取るの大変でしたか？",
          isCorrect: false,
          explanation: "過去の苦労話にフォーカスしており、現在の楽しみを聞き出せません"
        }
      ],
      audioUrl: "/audio/samples/teacher-question.mp3",
      keyPoints: [
        "仕事のやりがいを聞くことで価値観を理解",
        "ポジティブな感情を引き出す質問",
        "相手の専門性への敬意を示している"
      ]
    },
    {
      id: 3,
      category: "価値観について",
      level: 2,
      situation: "お互いの価値観について話している時：",
      partnerInfo: {
        name: "あやかさん",
        age: "25歳",
        occupation: "事務職"
      },
      statement: "家族との時間をとても大切にしています",
      options: [
        {
          id: 'A',
          text: "家族思いなんですね",
          isCorrect: false,
          explanation: "共感は示していますが、会話が続きません"
        },
        {
          id: 'B',
          text: "ご家族とはどんな風に過ごされることが多いんですか？どんな時間が一番幸せですか？",
          isCorrect: true,
          explanation: "具体的な過ごし方と感情面の両方を聞き出す優れた質問です"
        },
        {
          id: 'C',
          text: "僕も家族は大切だと思います",
          isCorrect: false,
          explanation: "共感は良いですが、相手についてもっと知る機会を逃しています"
        },
        {
          id: 'D',
          text: "ご家族は何人ですか？",
          isCorrect: false,
          explanation: "情報収集に留まり、感情面に踏み込めていません"
        }
      ],
      audioUrl: "/audio/samples/family-question.mp3", 
      keyPoints: [
        "具体的な過ごし方を聞いて相手の日常を知る",
        "幸せを感じる瞬間を聞いて価値観を理解",
        "感情面に踏み込んだ深い質問"
      ]
    },
    {
      id: 4,
      category: "休日の過ごし方",
      level: 1,
      situation: "お互いの趣味について話している時：",
      partnerInfo: {
        name: "ゆりこさん",
        age: "27歳",
        occupation: "デザイナー"
      },
      statement: "休日はよくカフェ巡りをしています",
      options: [
        {
          id: 'A',
          text: "カフェ巡り良いですね",
          isCorrect: false,
          explanation: "共感は示していますが、会話が続きません"
        },
        {
          id: 'B',
          text: "お気に入りのカフェはありますか？どんな雰囲気のお店が好みですか？",
          isCorrect: true,
          explanation: "具体的なお店と好みの理由を聞くことで、相手の価値観や好みを深く知ることができます"
        },
        {
          id: 'C',
          text: "僕もコーヒーは好きです",
          isCorrect: false,
          explanation: "自分の話にすり替えてしまい、相手についてもっと知る機会を逃しています"
        },
        {
          id: 'D',
          text: "一人で行くんですか？",
          isCorrect: false,
          explanation: "やや踏み込みすぎで、相手が答えにくい可能性があります"
        }
      ],
      audioUrl: "/audio/samples/cafe-question.mp3",
      keyPoints: [
        "お気に入りを聞くことで相手の好みを知る",
        "雰囲気の好みから価値観を探る",
        "具体的な質問で会話を発展させる"
      ]
    },
    {
      id: 5,
      category: "将来について",
      level: 2,
      situation: "お互いの将来について話している時：",
      partnerInfo: {
        name: "かなこさん",
        age: "29歳",
        occupation: "営業職"
      },
      statement: "将来は海外で働いてみたいと思っています",
      options: [
        {
          id: 'A',
          text: "海外は大変そうですね",
          isCorrect: false,
          explanation: "ネガティブな印象を与え、相手の夢を萎縮させる可能性があります"
        },
        {
          id: 'B',
          text: "どの国で働きたいですか？その国の何に魅力を感じるんですか？",
          isCorrect: true,
          explanation: "具体的な希望と動機を聞くことで、相手の価値観と情熱を理解できます"
        },
        {
          id: 'C',
          text: "語学は得意なんですか？",
          isCorrect: false,
          explanation: "能力面の確認に留まり、夢への想いを聞き出せていません"
        },
        {
          id: 'D',
          text: "僕は日本が一番だと思います",
          isCorrect: false,
          explanation: "相手の価値観を否定するような返答です"
        }
      ],
      audioUrl: "/audio/samples/future-question.mp3",
      keyPoints: [
        "具体的な希望を聞いて夢を共有する",
        "動機を探ることで価値観を理解",
        "相手の情熱を尊重する姿勢を示す"
      ]
    },
    {
      id: 6,
      category: "恋愛観について",
      level: 3,
      situation: "恋愛観について話している時：",
      partnerInfo: {
        name: "あいかさん",
        age: "24歳",
        occupation: "学校教師"
      },
      statement: "パートナーには誠実さを一番大切にしてほしいです",
      options: [
        {
          id: 'A',
          text: "誠実さは大切ですね",
          isCorrect: false,
          explanation: "同意は示していますが、相手の価値観をより深く理解する機会を逃しています"
        },
        {
          id: 'B',
          text: "誠実さって具体的にはどういう行動や言葉に現れると思いますか？",
          isCorrect: true,
          explanation: "抽象的な価値観を具体的な行動レベルで聞くことで、相手の本当の気持ちを理解できます"
        },
        {
          id: 'C',
          text: "僕も誠実な人間だと思います",
          isCorrect: false,
          explanation: "自己アピールになってしまい、相手について知ることができません"
        },
        {
          id: 'D',
          text: "他に大切なことはありますか？",
          isCorrect: false,
          explanation: "悪くない質問ですが、誠実さについてもっと深く聞くことができます"
        }
      ],
      audioUrl: "/audio/samples/values-question.mp3",
      keyPoints: [
        "抽象的な価値観を具体化して聞く",
        "相手の本当の想いを理解する",
        "深いレベルでの価値観の共有"
      ]
    },
    {
      id: 7,
      category: "過去の経験",
      level: 2,
      situation: "お互いの経験について話している時：",
      partnerInfo: {
        name: "まいさん",
        age: "30歳",
        occupation: "会計士"
      },
      statement: "学生時代はバックパッカーでよく一人旅をしていました",
      options: [
        {
          id: 'A',
          text: "一人旅は危険じゃないですか？",
          isCorrect: false,
          explanation: "心配の気持ちは良いですが、ネガティブな面にフォーカスしすぎています"
        },
        {
          id: 'B',
          text: "どの国の旅行が一番印象に残っていますか？その旅であなたが変わったなと感じることはありますか？",
          isCorrect: true,
          explanation: "具体的な体験と、それが与えた影響を聞くことで相手の成長や価値観を理解できます"
        },
        {
          id: 'C',
          text: "何カ国くらい回ったんですか？",
          isCorrect: false,
          explanation: "数字の情報に留まり、体験の意味や影響を聞き出せていません"
        },
        {
          id: 'D',
          text: "今でも旅行は好きなんですか？",
          isCorrect: false,
          explanation: "現在の状況は聞けますが、過去の体験の意味を深掘りできていません"
        }
      ],
      audioUrl: "/audio/samples/travel-question.mp3",
      keyPoints: [
        "印象的な体験を具体的に聞く",
        "経験が与えた影響や変化を探る",
        "相手の成長ストーリーを理解する"
      ]
    },
    {
      id: 8,
      category: "人間関係",
      level: 2,
      situation: "友人関係について話している時：",
      partnerInfo: {
        name: "りかこさん",
        age: "26歳",
        occupation: "マーケター"
      },
      statement: "友達は少ないですが、長く付き合っている親友がいます",
      options: [
        {
          id: 'A',
          text: "友達が少ないのは寂しくないですか？",
          isCorrect: false,
          explanation: "ネガティブな面にフォーカスしており、相手を不快にさせる可能性があります"
        },
        {
          id: 'B',
          text: "その親友の方とはどんなきっかけで知り合ったんですか？長く続く友情の秘訣は何だと思いますか？",
          isCorrect: true,
          explanation: "出会いのストーリーと友情観を聞くことで、相手の人間関係の価値観を深く理解できます"
        },
        {
          id: 'C',
          text: "何年くらいのお付き合いなんですか？",
          isCorrect: false,
          explanation: "期間の情報に留まり、関係性の深さや価値観を探れていません"
        },
        {
          id: 'D',
          text: "僕も友達は多くないです",
          isCorrect: false,
          explanation: "共感は示していますが、相手について深く知ることができません"
        }
      ],
      audioUrl: "/audio/samples/friendship-question.mp3",
      keyPoints: [
        "出会いのエピソードで相手の背景を知る",
        "友情観から人間関係の価値観を理解",
        "長続きする関係性について探る"
      ]
    }
  ];

  // カテゴリー一覧
  const categories = [
    { value: 'all', label: 'すべて' },
    { value: '趣味について', label: '趣味について' },
    { value: '仕事について', label: '仕事について' },
    { value: '価値観について', label: '価値観について' },
    { value: '休日の過ごし方', label: '休日の過ごし方' },
    { value: '将来について', label: '将来について' },
    { value: '恋愛観について', label: '恋愛観について' },
    { value: '過去の経験', label: '過去の経験' },
    { value: '人間関係', label: '人間関係' }
  ];

  // カテゴリーでフィルタリング
  useEffect(() => {
    const filtered = selectedCategory === 'all' 
      ? questions 
      : questions.filter(q => q.category === selectedCategory);
    setFilteredQuestions(filtered);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResult(false);
    setScore(0);
  }, [selectedCategory]);

  // 初期化
  useEffect(() => {
    setFilteredQuestions(questions);
  }, []);

  const currentQ = filteredQuestions[currentQuestion];

  // 音声再生
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  // 録音機能
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setUserAudioBlob(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('マイクアクセスエラー:', error);
        alert('マイクへのアクセスが拒否されました');
      }
    }
  };

  // 回答選択
  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  // 回答送信
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const selectedOption = currentQ.options.find(opt => opt.id === selectedAnswer);
    if (selectedOption.isCorrect) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  // 次の問題へ
  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setUserAudioBlob(null);
    } else {
      setShowResult(true);
    }
  };

  // クイズリセット
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFeedback(false);
    setScore(0);
    setUserAudioBlob(null);
  };

  if (showResult) {
    return (
      <Layout title="深堀り質問練習 - 結果" hideHeader={true}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{Math.round((score / filteredQuestions.length) * 100)}%</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">練習完了！</h2>
                <p className="text-gray-600">
                  {filteredQuestions.length}問中{score}問正解
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">🎉 良かった点</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    {score >= 2 && <li>• 具体的な質問ができています</li>}
                    {score >= 1 && <li>• 相手への関心を示せています</li>}
                    <li>• 練習を継続する姿勢が素晴らしいです</li>
                  </ul>
                </div>

                {score < filteredQuestions.length && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">💡 改善ポイント</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 感情面への質問を増やしてみましょう</li>
                      <li>• 「なぜ」「どう感じるか」を意識しましょう</li>
                      <li>• 相手の価値観を探る質問を練習しましょう</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowStats(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <BarChart3 size={20} />
                  詳細な統計を見る
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  もう一度練習する
                </button>
                <button
                  onClick={() => router.push('/conversation')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  会話練習に戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 現在の問題が存在しない場合の対応
  if (!currentQ && filteredQuestions.length === 0) {
    return (
      <Layout title="深堀り質問練習" hideHeader={true}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">問題を読み込み中...</h2>
              <p className="text-gray-600">しばらくお待ちください</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentQ) {
    return (
      <Layout title="深堀り質問練習" hideHeader={true}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">問題が見つかりません</h2>
              <p className="text-gray-600 mb-6">選択したカテゴリーに問題がありません</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                全てのカテゴリーに戻る
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="深堀り質問練習" hideHeader={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* ヘッダー */}
        <div className="bg-white shadow-sm p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/conversation')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>戻る</span>
            </button>
            <div className="text-center">
              <h1 className="font-bold text-gray-800">深堀り質問練習</h1>
              <p className="text-sm text-gray-500">{currentQ.category} Level {currentQ.level}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
                title="統計を見る"
              >
                <BarChart3 size={20} />
              </button>
              <div className="text-sm text-gray-500">
                {currentQuestion + 1}/{filteredQuestions.length}
              </div>
            </div>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="bg-white p-4 border-b">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">進捗</span>
              <span className="text-sm text-gray-700 font-medium">
                {Math.round(((currentQuestion + 1) / filteredQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* カテゴリー選択 */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-center">📚 練習カテゴリー</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {selectedCategory === 'all' ? `全${questions.length}問` : `${filteredQuestions.length}問`}
              </p>
            </div>
            {/* 状況設定 */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  📝 状況設定
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentQ.situation}
                </p>
              </div>

              {/* 相手の情報 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {currentQ.partnerInfo.name} ({currentQ.partnerInfo.age}・{currentQ.partnerInfo.occupation})
                    </p>
                    <p className="text-lg text-gray-700 font-medium mt-1">
                      「{currentQ.statement}」
                    </p>
                  </div>
                </div>
              </div>

              {/* 音声再生 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">🎧 模範回答を聞く</span>
                  <button
                    onClick={toggleAudio}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {isAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isAudioPlaying ? '一時停止' : '再生'}
                  </button>
                </div>
                {/* 実際の音声ファイルがある場合 */}
                <audio
                  ref={audioRef}
                  src={currentQ.audioUrl}
                  onEnded={() => setIsAudioPlaying(false)}
                  preload="metadata"
                />
              </div>

              <p className="text-center text-gray-600 font-medium">
                この発言への最適な返答は？
              </p>
            </div>

            {/* 選択肢 */}
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedAnswer === option.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswer === option.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {option.id}
                    </span>
                    <p className="text-gray-700 leading-relaxed">
                      {option.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* フィードバック表示 */}
            {showFeedback && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <div className={`inline-block px-4 py-2 rounded-full text-white font-bold mb-3 ${
                    currentQ.options.find(opt => opt.id === selectedAnswer)?.isCorrect
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}>
                    {currentQ.options.find(opt => opt.id === selectedAnswer)?.isCorrect ? '✅ 正解！' : '❌ 不正解'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">📝 解説</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {currentQ.options.find(opt => opt.id === selectedAnswer)?.explanation}
                    </p>
                  </div>

                  {currentQ.options.find(opt => opt.id === selectedAnswer)?.isCorrect && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <h3 className="font-semibold text-green-800 mb-2">💡 ポイント</h3>
                      <ul className="text-sm text-green-700 space-y-1">
                        {currentQ.keyPoints.map((point, index) => (
                          <li key={index}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* シャドウィング練習 */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-800 mb-3">🎤 シャドウィング練習</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      正解の文章を音声に合わせて練習しましょう
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleRecording}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isRecording 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                        {isRecording ? '録音停止' : '録音開始'}
                      </button>
                      {userAudioBlob && (
                        <button
                          onClick={() => {
                            const audio = new Audio(URL.createObjectURL(userAudioBlob));
                            audio.play();
                          }}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Volume2 size={16} />
                          再生
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {currentQuestion < filteredQuestions.length - 1 ? '次の問題へ' : '結果を見る'}
                </button>
              </div>
            )}

            {/* 回答ボタン */}
            {!showFeedback && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                回答する
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 統計モーダル */}
      {showStats && (
        <DeepQuestionStats onClose={() => setShowStats(false)} />
      )}
    </Layout>
  );
}