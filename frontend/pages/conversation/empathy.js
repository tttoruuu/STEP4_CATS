import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import VoiceRecorder from '../../components/VoiceRecorder';
import { ArrowLeft, Heart, RotateCcw } from 'lucide-react';

export default function EmpathyPractice() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scenarios = [
    {
      title: "仕事の話を聞く",
      situation: "相手が仕事での出来事について話しています。適切な相槌と共感を示しましょう。",
      aiMessages: [
        "最近、職場で新しいプロジェクトが始まったんです。",
        "でも、思ったより難しくて、毎日残業が続いていて...",
        "上司からの期待も大きくて、プレッシャーを感じています。"
      ],
      goodResponses: ["へえ", "そうなんですね", "大変ですね", "わかります", "それは", "お疲れ様です"],
      tips: [
        "相手の感情に寄り添う",
        "短い相槌で話を促進",
        "共感の言葉を適切に使う"
      ]
    },
    {
      title: "趣味の話を聞く",
      situation: "相手が趣味について熱心に話しています。興味を示しながら聞きましょう。",
      aiMessages: [
        "実は最近、写真を撮ることにハマっているんです。",
        "休日になると、いろんな場所に撮影に出かけて...",
        "特に風景写真が好きで、朝早く起きて日の出を撮ったりしています。"
      ],
      goodResponses: ["すてきですね", "いいですね", "ほう", "へー", "そうなんですか", "素晴らしい"],
      tips: [
        "相手の情熱を受け止める",
        "前向きな相槌を使う",
        "関心があることを示す"
      ]
    },
    {
      title: "悩みの相談を聞く",
      situation: "相手が個人的な悩みを打ち明けています。共感を示しながら聞きましょう。",
      aiMessages: [
        "実は、人間関係で少し悩んでいることがあって...",
        "友人とちょっとした行き違いがあったんです。",
        "どうやって仲直りすればいいのか、考えています。"
      ],
      goodResponses: ["そうですか", "つらいですね", "わかります", "なるほど", "そんなことが", "心配ですね"],
      tips: [
        "相手の気持ちを理解する",
        "否定せずに受け止める",
        "安心感を与える相槌"
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

    // 応答の評価
    setTimeout(() => {
      const scenario = scenarios[currentScenario];
      const isGoodResponse = scenario.goodResponses.some(good => 
        currentInput.toLowerCase().includes(good.toLowerCase())
      );

      let feedback = '';
      if (isGoodResponse) {
        feedback = "とても良い相槌ですね！相手が話しやすい雰囲気を作っています。";
      } else if (currentInput.length > 20) {
        feedback = "相槌はもう少し短く、シンプルにしてみましょう。";
      } else {
        feedback = "いいですね。さらに共感を込めた相槌を試してみましょう。";
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
        }, 1000);
      } else {
        // シナリオ完了
        setTimeout(() => {
          setIsCompleted(true);
        }, 1000);
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
    <Layout title="あいづち・共感練習">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-pink-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-pink-600" size={24} />
                <h1 className="text-xl font-bold text-pink-600">あいづち・共感練習</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">{scenario.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{scenario.situation}</p>
                
                <div className="bg-pink-50 p-3 rounded-lg">
                  <h3 className="font-medium text-pink-800 mb-2">ポイント:</h3>
                  <ul className="text-sm text-pink-700 space-y-1">
                    {scenario.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-pink-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 bg-pink-50 p-3 rounded-lg">
                  <h4 className="font-medium text-pink-800 mb-2">良い相槌の例:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scenario.goodResponses.map((response, index) => (
                      <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                        {response}
                      </span>
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
                        ? 'bg-pink-600 text-white'
                        : message.isFeedback
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : message.sender === 'system'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
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
                    placeholder="相槌を入力してください..."
                    className="flex-grow bg-[#FAFAFA] text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-pink-500 border border-gray-200"
                    rows="2"
                  />
                  <VoiceRecorder 
                    onTranscriptionReceived={handleTranscriptionReceived}
                    disabled={false}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl px-4 py-3 ${
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
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl px-6 py-2 hover:opacity-90"
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