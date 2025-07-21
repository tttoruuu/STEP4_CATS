import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import VoiceRecorder from '../../components/VoiceRecorder';
import { ArrowLeft, Search, RotateCcw } from 'lucide-react';

export default function DeepenPractice() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scenarios = [
    {
      title: "趣味の深掘り",
      situation: "相手の趣味について、より具体的で詳しい情報を引き出しましょう。",
      aiMessages: [
        "休日はよく映画を見に行きます。",
        "アクション映画が好きですね。最近は『○○』という映画を見ました。",
        "主人公の成長する姿に感動しました。"
      ],
      deepQuestions: [
        "どんな映画がお好きですか？",
        "その映画のどんなところが印象的でしたか？",
        "主人公のどんな成長に感動されたんですか？"
      ],
      tips: [
        "感情的な部分を深掘りする",
        "「なぜ」「どうして」で理由を聞く",
        "具体的なエピソードを引き出す"
      ]
    },
    {
      title: "仕事体験の深掘り",
      situation: "相手の仕事での体験や想いを、より深く聞き出しましょう。",
      aiMessages: [
        "仕事で大きなプロジェクトを成功させたことがあります。",
        "チームのみんなで協力して、半年かけて取り組みました。",
        "最初は不安でしたが、最後はやりがいを感じました。"
      ],
      deepQuestions: [
        "どんなプロジェクトだったんですか？",
        "チームでの協力で印象に残ったことはありますか？",
        "最初の不安から、やりがいに変わったのはどんな瞬間でしたか？"
      ],
      tips: [
        "感情の変化に注目する",
        "転換点となった出来事を聞く",
        "相手の価値観を探る"
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

    // 深掘り質問の評価
    setTimeout(() => {
      const scenario = scenarios[currentScenario];
      const userText = currentInput.toLowerCase();
      
      // 深掘りキーワードのチェック
      const deepenWords = ['なぜ', 'どうして', 'どんな気持ち', 'どんな想い', 'どんなところ', 'どの部分', 'どんな瞬間', 'どんな体験'];
      const hasDeepQuestionWords = deepenWords.some(word => userText.includes(word));
      const hasEmotionWords = ['感じ', '想い', '気持ち', '感動', '印象', '体験', '瞬間'].some(word => userText.includes(word));
      
      let feedback = '';
      if (hasDeepQuestionWords && hasEmotionWords) {
        feedback = "素晴らしい深掘り質問です！相手の感情や体験に踏み込んで聞けています。";
      } else if (hasDeepQuestionWords || hasEmotionWords) {
        feedback = "良い方向です。相手の気持ちや体験についてさらに深く聞いてみましょう。";
      } else {
        feedback = "もう少し深く聞いてみましょう。「どんな気持ちでしたか？」「どんなところが印象的でしたか？」のように聞いてみてください。";
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
    <Layout title="深掘り練習">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-purple-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <Search className="text-purple-600" size={24} />
                <h1 className="text-xl font-bold text-purple-600">深掘りする</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">{scenario.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{scenario.situation}</p>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">ポイント:</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {scenario.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">深掘り質問の例:</h4>
                  <div className="space-y-1">
                    {scenario.deepQuestions.slice(0, 2).map((question, index) => (
                      <p key={index} className="text-sm text-purple-700">
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
                        ? 'bg-purple-600 text-white'
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
                    placeholder="話を深掘りする質問をしてください..."
                    className="flex-grow bg-[#FAFAFA] text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-200"
                    rows="2"
                  />
                  <VoiceRecorder 
                    onTranscriptionReceived={handleTranscriptionReceived}
                    disabled={false}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl px-4 py-3 ${
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
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl px-6 py-2 hover:opacity-90"
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