import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Send, Mic, MicOff } from 'lucide-react';

export default function CounselorChat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'こんにちは！AIカウンセラーのミライムです。今日はどんなことでお悩みですか？婚活のことなら何でもお話しください。',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 実際のAPIを呼び出し
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/counselor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: messages.slice(-10).map(m => `${m.type}: ${m.content}`).join('\n')
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.message,
        timestamp: new Date(data.timestamp)
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      // フォールバック応答
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput) => {
    // 簡単なキーワードベースの応答（実際のAI APIに置き換える）
    const responses = {
      '不安': 'その不安な気持ち、とてもよく分かります。婚活では誰でも不安になるものです。具体的にはどのようなことが不安でしょうか？',
      'プロフィール': 'プロフィール作成は婚活の第一歩ですね。あなたらしさを表現することが大切です。どの部分で困っていますか？',
      '会話': '会話が続かないのは多くの方が抱える悩みです。相手に興味を持って質問することから始めてみましょう。',
      'デート': 'デートは緊張しますよね。相手に楽しんでもらうことより、まずはあなた自身がリラックスすることが大切です。',
      '自信': '自信がないのは自然なことです。小さな成功体験を積み重ねることで、少しずつ自信は育っていきます。'
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (userInput.includes(keyword)) {
        return response;
      }
    }

    return 'お話しを聞かせていただき、ありがとうございます。あなたの気持ちに寄り添いたいと思います。もう少し詳しく教えていただけますか？';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // 音声録音機能の実装（将来的に追加）
  };

  return (
    <Layout title="AIカウンセラー - チャット">
      <main className="max-w-sm mx-auto bg-[#F5F5F5] min-h-screen flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white px-6 py-4 border-b shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF8551] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AI</span>
              </div>
              <div>
                <h1 className="font-medium text-gray-800">ミライム</h1>
                <p className="text-xs text-green-500">オンライン</p>
              </div>
            </div>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-[#FF8551] text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ja-JP', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm max-w-xs px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="bg-white px-4 py-4 border-t">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-full ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="w-full px-4 py-2 border border-gray-200 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8551] focus:border-transparent"
                rows="1"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-[#FF8551] text-white rounded-full hover:bg-[#FF7043] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}