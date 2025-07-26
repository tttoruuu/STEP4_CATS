import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Send, Mic, Square } from 'lucide-react';

export default function CounselorChat() {
  const router = useRouter();
  const conversationId = useRouter().query.conversationId;
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
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [isSaved, setIsSaved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const messagesEndRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsMounted(true);
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchCurrentTime();
    // 1分ごとに時刻を更新
    const timeInterval = setInterval(fetchCurrentTime, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // サーバーから現在時刻を取得
  const fetchCurrentTime = async () => {
    try {
      const apiUrl = 'http://localhost:8000/api/counselor/current-time';
      console.log('Fetching current time from:', apiUrl);
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Current time received:', data);
        setCurrentTime(data.formatted_time);
      } else {
        console.error('Time fetch failed:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch current time:', error);
    }
  };

  // 会話履歴から継続する場合の処理
  useEffect(() => {
    if (conversationId) {
      loadConversationHistory(conversationId);
    }
  }, [conversationId]);

  // 自動保存タイマーの設定（無効化 - 即座保存に変更したため）
  // useEffect(() => {
  //   // 最後のアクティビティから1分後に自動保存
  //   const resetAutoSaveTimer = () => {
  //     if (autoSaveTimerRef.current) {
  //       clearTimeout(autoSaveTimerRef.current);
  //     }
      
  //     autoSaveTimerRef.current = setTimeout(() => {
  //       if (messages.length > 1 && !isSaved) {
  //         saveConversation();
  //       }
  //     }, 60000); // 1分後
  //   };

  //   resetAutoSaveTimer();
  //   setLastActivityTime(Date.now());

  //   return () => {
  //     if (autoSaveTimerRef.current) {
  //       clearTimeout(autoSaveTimerRef.current);
  //     }
  //   };
  // }, [messages, isSaved]);

  // 会話履歴を読み込む
  const loadConversationHistory = async (convId) => {
    try {
      const headers = {};
      
      // 開発環境以外では認証が必要
      if (process.env.NODE_ENV !== 'development') {
        const token = localStorage.getItem('token');
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/counselor/history/${convId}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages.map((msg, index) => ({
          id: index + 1,
          type: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(loadedMessages);
        
        // 会話履歴を読み込んだ後、最下部へスクロール
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  // 会話を保存する（メッセージ配列を受け取るバージョン）
  const saveConversationWithMessages = async (messagesToSave) => {
    // AIメッセージがない場合は保存しない
    if (messagesToSave.length < 2) return;
    
    console.log('Saving conversation with messages:', messagesToSave);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // 開発環境以外では認証が必要
      if (process.env.NODE_ENV !== 'development') {
        const token = localStorage.getItem('token');
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const body = {
        messages: messagesToSave.map(msg => ({
          role: msg.type,
          content: msg.content,
          timestamp: msg.timestamp
        }))
      };
      
      console.log('Sending save request with body:', body);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/counselor/save`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Save response:', data);
        setIsSaved(true);
        // 会話IDを保存（URLに反映させるため）
        if (data.conversation_id && !conversationId) {
          window.history.replaceState({}, '', `/counselor/chat?conversationId=${data.conversation_id}`);
        }
        console.log('Conversation saved successfully');
      } else {
        const errorData = await response.text();
        console.error('Save failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  // 会話を保存する（現在のmessagesを使用）
  const saveConversation = async () => {
    await saveConversationWithMessages(messages);
  };

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
    setIsSaved(false); // 新しいメッセージが追加されたので未保存状態に

    try {
      // 実際のAPIを呼び出し
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // 開発環境以外では認証が必要
      if (process.env.NODE_ENV !== 'development') {
        const token = localStorage.getItem('token');
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/counselor/chat`, {
        method: 'POST',
        headers,
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
      
      setMessages(prev => {
        const updatedMessages = [...prev, aiResponse];
        // AIレスポンス後に即座に保存（非同期で実行）
        setTimeout(() => {
          saveConversationWithMessages(updatedMessages);
        }, 100);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // フォールバック応答
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => {
        const updatedMessages = [...prev, aiResponse];
        // フォールバック時も保存
        setTimeout(() => {
          saveConversationWithMessages(updatedMessages);
        }, 100);
        return updatedMessages;
      });
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

  // テキストエリアの高さを調整する関数
  const adjustTextareaHeight = (element) => {
    if (!element) return;
    
    // 高さをリセットしてから実際の高さを計算
    element.style.height = 'auto';
    const scrollHeight = element.scrollHeight;
    
    // 最小40px、最大120pxで調整
    const minHeight = 40;
    const maxHeight = 120;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    element.style.height = newHeight + 'px';
  };

  // テキストエリアの高さを自動調整（手動入力時）
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // 高さをリセットしてから実際の高さを計算
    e.target.style.height = 'auto';
    const scrollHeight = e.target.scrollHeight;
    
    // 最小40px、最大120pxで調整
    const minHeight = 40;
    const maxHeight = 120;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    e.target.style.height = newHeight + 'px';
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // 録音停止
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // 録音開始
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await handleAudioTranscription(audioBlob);
          
          // ストリームを停止
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('マイクアクセスエラー:', error);
        alert('マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。');
      }
    }
  };

  const handleAudioTranscription = async (audioBlob) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('音声認識に失敗しました');
      }

      const data = await response.json();
      
      if (data.text && data.text.trim()) {
        const transcribedText = data.text.trim();
        setInputMessage(transcribedText);
        
        // 音声認識後にテキストエリアの高さを調整
        setTimeout(() => {
          if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
          }
        }, 10);
      } else {
        alert('音声が認識できませんでした。もう一度お試しください。');
      }
    } catch (error) {
      console.error('音声認識エラー:', error);
      alert('音声認識に失敗しました: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Layout title="AIカウンセラー - チャット">
      <main className="max-w-sm mx-auto bg-[#F5F5F5] min-h-screen flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white px-6 py-4 border-b shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/counselor">
              <button className="text-gray-500 hover:text-gray-700">
                ←
              </button>
            </Link>
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
        <div className="flex-1 px-4 py-6 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
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
                    {currentTime || 'loading...'}
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
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8551] focus:border-transparent overflow-hidden"
                rows="1"
                style={{ 
                  minHeight: '40px', 
                  maxHeight: '120px',
                  height: '40px',
                  lineHeight: '1.5'
                }}
                disabled={isRecording}
              />
            </div>

            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isRecording ? '録音を停止' : '音声入力を開始'}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isRecording}
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