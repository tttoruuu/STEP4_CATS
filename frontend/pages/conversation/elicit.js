import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import VoiceRecorder from '../../components/VoiceRecorder';
import { ArrowLeft, Lightbulb, RotateCcw } from 'lucide-react';

export default function ElicitPractice() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scenarios = [
    {
      title: "相手の趣味を引き出す",
      situation: "相手から趣味について簡単に話してもらった後、さらに詳しく話してもらいましょう。",
      aiMessages: [
        "趣味は読書です。",
        "そうですね、主に小説を読むことが多いです。",
        "最近はミステリー小説にハマっています。"
      ],
      goodQuestions: [
        "どんな本を読まれるんですか？",
        "どんな小説がお好きですか？",
        "最近読んだ本で印象に残ったものはありますか？",
        "ミステリーの中でも特に好きな作家さんはいますか？"
      ],
      tips: [
        "オープンクエスチョンを使う",
        "「どんな」「どのような」で質問",
        "相手の答えから次の質問を考える"
      ]
    },
    {
      title: "仕事について引き出す",
      situation: "相手の仕事について、具体的な内容や体験を聞き出しましょう。",
      aiMessages: [
        "営業の仕事をしています。",
        "主に法人向けの営業ですね。",
        "いろいろな会社を回って商品の説明をしています。"
      ],
      goodQuestions: [
        "どんな営業をされているんですか？",
        "どんな商品を扱っていらっしゃるんですか？",
        "営業のお仕事で大変なことはありますか？",
        "お客様とお話しする中で印象に残ったエピソードはありますか？"
      ],
      tips: [
        "具体的な内容を聞く",
        "体験談を引き出す",
        "感情的な部分にも注目"
      ]
    }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      const aiMessage = {
        sender: 'ai',
        text: scenarios[currentScenario].aiMessages[0],
        timestamp: new Date()
      };
      setMessages([aiMessage]);
      setStepCount(0);
    }
  }, [currentScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTranscriptionReceived = (transcribedText) => {
    setInputMessage(transcribedText);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');

    // 質問の評価
    setTimeout(() => {
      const scenario = scenarios[currentScenario];
      const userText = currentInput.toLowerCase();
      
      // 良い質問のキーワードチェック
      const hasQuestionWords = ['どんな', 'どのような', 'どうやって', 'どちら', 'なぜ', 'どこ', 'いつ', 'どうして'].some(word => 
        userText.includes(word)
      );
      const hasQuestionMark = userText.includes('？') || userText.includes('?') || userText.endsWith('ですか') || userText.endsWith('ますか');
      
      let feedback = '';
      if (hasQuestionWords && hasQuestionMark) {
        feedback = "とても良い質問です！相手がもっと話したくなるような聞き方ですね。";
      } else if (hasQuestionMark) {
        feedback = "質問できていますね。「どんな」「どのような」を使うとさらに話を引き出せます。";
      } else {
        feedback = "相手に質問して、もっと話してもらいましょう。「〜はどんな感じですか？」のように聞いてみてください。";
      }

      const feedbackMessage = {
        sender: 'system',
        text: feedback,
        timestamp: new Date(),
        isFeedback: true
      };

      setMessages(prev => [...prev, feedbackMessage]);

      // 次のAIメッセージ
      if (stepCount < scenario.aiMessages.length - 1) {
        setTimeout(() => {
          const nextAiMessage = {
            sender: 'ai',
            text: scenario.aiMessages[stepCount + 1],
            timestamp: new Date()
          };
          setMessages(prev => [...prev, nextAiMessage]);
          setStepCount(stepCount + 1);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsCompleted(true);
        }, 1500);
      }
    }, 500);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setMessages([]);
      setIsCompleted(false);
      setStepCount(0);
    } else {
      router.push('/conversation/modes');
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setIsCompleted(false);
    setStepCount(0);
  };

  const scenario = scenarios[currentScenario];

  return (
    <Layout title="会話引き出し練習">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-yellow-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-yellow-600" size={24} />
                <h1 className="text-xl font-bold text-yellow-600">会話を引き出す</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">{scenario.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{scenario.situation}</p>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">ポイント:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {scenario.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">良い質問の例:</h4>
                  <div className="space-y-1">
                    {scenario.goodQuestions.slice(0, 2).map((question, index) => (
                      <p key={index} className="text-sm text-yellow-700">
                        • {question}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                シナリオ {currentScenario + 1} / {scenarios.length}
              </div>
            </div>

            {/* メッセージエリア */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 h-64 overflow-y-auto shadow-sm border border-white/40">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs ${
                      message.sender === 'user'
                        ? 'bg-yellow-600 text-white'
                        : message.isFeedback
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 入力エリア */}
            {!isCompleted ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm border border-white/40">
                <div className="flex items-center gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="話を引き出す質問をしてください..."
                    className="flex-grow bg-[#FAFAFA] text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-yellow-500 border border-gray-200"
                    rows="2"
                  />
                  <VoiceRecorder 
                    onTranscriptionReceived={handleTranscriptionReceived}
                    disabled={false}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl px-4 py-3 ${
                      !inputMessage.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                  >
                    送信
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm border border-white/40">
                <h3 className="font-bold text-green-600 mb-4">シナリオ完了！</h3>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 bg-gray-500 text-white rounded-xl px-4 py-2 hover:opacity-90"
                  >
                    <RotateCcw size={16} />
                    もう一度
                  </button>
                  <button
                    onClick={handleNextScenario}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl px-6 py-2 hover:opacity-90"
                  >
                    {currentScenario < scenarios.length - 1 ? '次のシナリオ' : '完了'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}