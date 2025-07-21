import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import VoiceRecorder from '../../components/VoiceRecorder';
import { ArrowLeft, MessageCircle, RotateCcw } from 'lucide-react';

export default function GreetingPractice() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  const scenarios = [
    {
      title: "初回のお見合い",
      situation: "結婚相談所でセッティングされた初回のお見合いです。カフェで待ち合わせをしています。",
      aiFirstMessage: "こんにちは。○○さんでいらっしゃいますよね？お待たせしてしまって申し訳ございません。",
      tips: [
        "笑顔で挨拶をしましょう",
        "相手の名前を確認しながら自己紹介",
        "「こちらこそ」などの謙遜も大切"
      ]
    },
    {
      title: "婚活パーティーでの出会い",
      situation: "婚活パーティーで気になる方と初めて話す機会です。",
      aiFirstMessage: "こんばんは。このパーティー、参加されて初めてですか？",
      tips: [
        "軽い話題から始める",
        "相手の緊張もほぐす雰囲気作り",
        "共通の体験（パーティー参加）から話を発展"
      ]
    },
    {
      title: "紹介での出会い",
      situation: "友人から紹介された方と初めて会う場面です。",
      aiFirstMessage: "はじめまして。○○さんから紹介していただいた□□と申します。",
      tips: [
        "紹介者への感謝を示す",
        "紹介者との関係性を話題に",
        "お互いの緊張を和らげる配慮"
      ]
    }
  ];

  useEffect(() => {
    // 最初のシナリオでAIの挨拶を表示
    if (messages.length === 0) {
      const aiMessage = {
        sender: 'ai',
        text: scenarios[currentScenario].aiFirstMessage,
        timestamp: new Date()
      };
      setMessages([aiMessage]);
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
    setInputMessage('');

    // 簡単なAI応答シミュレーション（実際の実装では音声認識と組み合わせて評価）
    setTimeout(() => {
      let aiResponse = '';
      const userText = inputMessage.toLowerCase();
      
      if (userText.includes('こんにちは') || userText.includes('はじめまして')) {
        aiResponse = "とても良い挨拶ですね！自然で好印象です。";
      } else if (userText.includes('ありがとう') || userText.includes('感謝')) {
        aiResponse = "感謝の気持ちを伝えるのは素晴らしいですね。";
      } else {
        aiResponse = "良いですね。次はもう少し相手の話を受けて返してみましょう。";
      }

      const aiMessage = {
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date(),
        isAdvice: true
      };

      setMessages(prev => [...prev, aiMessage]);

      // 3回やり取りしたら完了
      if (messages.filter(m => m.sender === 'user').length >= 2) {
        setIsCompleted(true);
      }
    }, 1000);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setMessages([]);
      setIsCompleted(false);
    } else {
      // 全シナリオ完了
      router.push('/conversation/modes');
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setIsCompleted(false);
  };

  const scenario = scenarios[currentScenario];

  return (
    <Layout title="挨拶練習">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="w-full max-w-md mx-auto mt-8 px-6 relative">
          <button 
            onClick={() => router.push('/conversation/modes')}
            className="text-blue-600 flex items-center gap-1 hover:opacity-80 transition-opacity absolute left-6"
          >
            <ArrowLeft size={18} />
            <span>もどる</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="text-blue-600" size={24} />
                <h1 className="text-xl font-bold text-blue-600">挨拶練習</h1>
              </div>
              
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">{scenario.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{scenario.situation}</p>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">ポイント:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {scenario.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
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
                        ? 'bg-blue-600 text-white'
                        : message.isAdvice
                        ? 'bg-green-100 text-green-800 border border-green-200'
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
                    placeholder="挨拶を入力してください..."
                    className="flex-grow bg-[#FAFAFA] text-gray-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200"
                    rows="2"
                  />
                  <VoiceRecorder 
                    onTranscriptionReceived={handleTranscriptionReceived}
                    disabled={false}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-4 py-3 ${
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-6 py-2 hover:opacity-90"
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