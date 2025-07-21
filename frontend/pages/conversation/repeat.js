import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import VoiceRecorder from '../../components/VoiceRecorder';
import { ArrowLeft, Copy, RotateCcw } from 'lucide-react';

export default function RepeatPractice() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scenarios = [
    {
      title: "仕事のエピソード",
      situation: "相手の話した内容をそのまま繰り返して、しっかり聞いていることを示しましょう。",
      aiMessages: [
        "昨日、会社で大きなプレゼンテーションがあったんです。",
        "3ヶ月間準備してきた企画を、役員の前で発表しました。",
        "緊張しましたが、無事に終わって、好評価をいただきました。"
      ],
      correctRepeats: [
        "大きなプレゼンテーションがあった",
        "3ヶ月間準備してきた企画を役員の前で発表",
        "緊張したけど無事に終わって好評価をいただいた"
      ],
      tips: [
        "相手の言葉をそのまま使う",
        "要約せずに重要な部分を繰り返す",
        "感情的な部分も含めて繰り返す"
      ]
    },
    {
      title: "趣味の体験談",
      situation: "相手が体験したことを、キーワードを使ってそのまま繰り返しましょう。",
      aiMessages: [
        "先週末、友人と一緒に山登りに行ってきたんです。",
        "頂上まで4時間くらいかかったんですが、景色が本当に綺麗でした。",
        "疲れたけれど、達成感があって、また行きたいと思いました。"
      ],
      correctRepeats: [
        "友人と一緒に山登りに行ってきた",
        "頂上まで4時間かかったけど景色が本当に綺麗だった",
        "疲れたけど達成感があってまた行きたいと思った"
      ],
      tips: [
        "時間や場所などの具体的な情報も含める",
        "相手の感想もそのまま繰り返す",
        "「〜ということですね」で確認"
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

    // 繰り返しの評価
    setTimeout(() => {
      const scenario = scenarios[currentScenario];
      const correctRepeat = scenario.correctRepeats[stepCount];
      const aiMessageText = scenario.aiMessages[stepCount];
      
      // キーワードマッチング評価
      const keywords = correctRepeat.toLowerCase().split(/[\s、。！？]/);
      const userWords = currentInput.toLowerCase();
      const matchCount = keywords.filter(keyword => 
        keyword.length > 1 && userWords.includes(keyword)
      ).length;
      
      let feedback = '';
      if (matchCount >= keywords.length * 0.7) {
        feedback = "素晴らしい！相手の話をしっかりと繰り返せています。";
      } else if (matchCount >= keywords.length * 0.4) {
        feedback = "良いですね。もう少し具体的な言葉も含めて繰り返してみましょう。";
      } else {
        feedback = `もう少し相手の言葉をそのまま使ってみましょう。例：「${correctRepeat}ということですね」`;
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
    <Layout title="全コピー練習">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-green-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <Copy className="text-green-600" size={24} />
                <h1 className="text-xl font-bold text-green-600">相手の会話ポイント全コピー</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">{scenario.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{scenario.situation}</p>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">ポイント:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    {scenario.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {stepCount < scenario.correctRepeats.length && (
                  <div className="mt-3 bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">参考例:</h4>
                    <p className="text-sm text-green-700">
                      「{scenario.correctRepeats[stepCount]}ということですね」
                    </p>
                  </div>
                )}
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
                        ? 'bg-green-600 text-white'
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
                    placeholder="相手の話を繰り返してください..."
                    className="flex-grow bg-[#FAFAFA] text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-200"
                    rows="2"
                  />
                  <VoiceRecorder 
                    onTranscriptionReceived={handleTranscriptionReceived}
                    disabled={false}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-4 py-3 ${
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
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-6 py-2 hover:opacity-90"
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