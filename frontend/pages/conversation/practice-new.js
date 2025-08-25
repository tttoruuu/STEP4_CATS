import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import CharacterSelect from '../../components/conversation/CharacterSelect';
import { ArrowLeft, Send, Mic, Square, Clock, User } from 'lucide-react';
import axios from 'axios';

export default function ConversationPracticeNew() {
  const router = useRouter();
  const { characterId, characterName } = router.query;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const textareaRef = useRef(null);

  // タイマー設定（10分 = 600秒）
  const SESSION_DURATION = 600;

  // キャラクター情報
  const getCharacterInfo = (id) => {
    const characters = {
      misaki: { 
        name: '佐藤美咲', 
        initial: 'M',
        bg: '#FFE0EC',
        color: '#E91E63'
      },
      ai: { 
        name: '鈴木愛', 
        initial: 'A',
        bg: '#FFF3E0',
        color: '#FF9800'
      },
      kaori: { 
        name: '田中香織', 
        initial: 'K',
        bg: '#E8EAF6',
        color: '#3F51B5'
      },
      shizuka: { 
        name: '山田静香', 
        initial: 'S',
        bg: '#F3E5F5',
        color: '#9C27B0'
      }
    };
    return characters[id] || { 
      name: 'キャラクター', 
      initial: '?',
      bg: '#F5F5F5',
      color: '#999'
    };
  };

  const character = characterId ? getCharacterInfo(characterId) : null;

  // タイマー開始
  useEffect(() => {
    if (characterId && !sessionStartTime) {
      setSessionStartTime(Date.now());
      
      // 初回挨拶
      setMessages([{
        sender: 'partner',
        text: getInitialGreeting(characterId),
        timestamp: new Date().toISOString()
      }]);
    }
  }, [characterId, sessionStartTime]);

  // タイマー更新
  useEffect(() => {
    if (sessionStartTime && !sessionComplete) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        setElapsedTime(elapsed);
        
        // 10分経過で自動終了
        if (elapsed >= SESSION_DURATION) {
          handleSessionComplete();
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [sessionStartTime, sessionComplete]);

  // 初回挨拶を取得
  const getInitialGreeting = (characterId) => {
    const greetings = {
      misaki: 'はじめまして、美咲です。今日はお会いできて嬉しいです。よろしくお願いします。',
      ai: 'こんにちは！愛です！今日は楽しくお話ししましょうね〜！',
      kaori: 'はじめまして、田中香織と申します。本日はよろしくお願いいたします。',
      shizuka: '...はじめまして。山田です。よろしくお願いします。'
    };
    return greetings[characterId] || 'はじめまして。よろしくお願いします。';
  };

  // API エラー時のフォールバック応答
  const getFallbackResponse = (characterId, userMessage) => {
    const responses = {
      misaki: [
        'そうなんですね！もっと詳しく聞かせてください。',
        'それは素敵ですね。私も興味があります。',
        'なるほど〜。それってどんな感じなんですか？'
      ],
      ai: [
        'えー！それめっちゃ面白そう！もっと教えて〜！',
        'へぇ〜！すごいね！私も気になる〜！',
        'わあ！楽しそう！詳しく聞きたいな〜！'
      ],
      kaori: [
        'そうですか。それは興味深いですね。',
        'なるほど、そういうことでしたか。',
        'そのお話、もう少し詳しく伺えますか？'
      ],
      shizuka: [
        '...そうなんですか。',
        '...なるほど。',
        '...それは...いいですね。'
      ]
    };
    
    const characterResponses = responses[characterId] || ['そうですね。'];
    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
  };

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/conversation/practice/chat`;
      
      const response = await axios.post(apiUrl, {
        character_id: characterId,
        message: inputMessage,
        conversation_history: messages,
        session_id: sessionStartTime
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const partnerMessage = {
        sender: 'partner',
        text: response.data.reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, partnerMessage]);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      
      // エラー時のフォールバックメッセージ
      const fallbackMessage = getFallbackResponse(characterId, inputMessage);
      const partnerMessage = {
        sender: 'partner',
        text: fallbackMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, partnerMessage]);
    } finally {
      setSending(false);
    }
  };

  // 音声入力の処理
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
      setSending(true);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('音声認識エラー:', error);
        throw new Error(error.details || '音声認識に失敗しました');
      }

      const data = await response.json();
      
      if (data.text && data.text.trim()) {
        const transcribedText = data.text.trim();
        setInputMessage(transcribedText);
        
        // テキストエリアの高さを調整
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
      alert('音声認識に失敗しました。マイクの設定を確認してください。');
    } finally {
      setSending(false);
    }
  };

  // テキストエリアの高さを自動調整
  const adjustTextareaHeight = (element) => {
    if (!element) return;
    element.style.height = 'auto';
    const scrollHeight = element.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
    element.style.height = newHeight + 'px';
  };

  // セッション完了処理
  const handleSessionComplete = () => {
    setSessionComplete(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // フィードバック画面へ遷移
    router.push({
      pathname: '/conversation/feedback-new',
      query: {
        characterId,
        characterName: character?.name,
        duration: elapsedTime,
        messages: JSON.stringify(messages)
      }
    });
  };

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // タイマー表示フォーマット
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // キャラクター選択画面を表示
  if (!characterId) {
    return (
      <Layout title="会話練習">
        <CharacterSelect />
      </Layout>
    );
  }

  return (
    <Layout title="会話練習" hideFooter={true}>
      <div className="flex flex-col h-screen bg-[#F5F5F5]">
        {/* ヘッダー - AIカウンセラーと同じスタイル */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/conversation/modes')}
                className="text-[var(--primary-orange)] hover:opacity-70 transition-opacity"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: character.bg }}>
                  <span className="font-bold text-lg" style={{ color: character.color }}>
                    {character.initial}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">{character.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span className={elapsedTime > 540 ? 'text-red-500' : 'text-green-500'}>
                      {formatTime(elapsedTime)} / 10:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleSessionComplete}
              className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
            >
              終了する
            </button>
          </div>
        </div>

        {/* メッセージエリア - AIカウンセラーと同じスタイル */}
        <div className="chat-container flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className="flex gap-3 max-w-[85%]">
                  {message.sender === 'partner' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: character.bg }}>
                      <span className="text-sm font-bold" style={{ color: character.color }}>
                        {character.initial}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${message.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white'
                      : 'bg-white shadow-sm border border-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {sending && (
              <div className="flex justify-start mb-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: character.bg }}>
                    <span className="text-sm font-bold" style={{ color: character.color }}>
                      {character.initial}
                    </span>
                  </div>
                  <div className="bg-white shadow-sm border border-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="typing-dot">•</span>
                      <span className="typing-dot" style={{ animationDelay: '0.2s' }}>•</span>
                      <span className="typing-dot" style={{ animationDelay: '0.4s' }}>•</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア - AIカウンセラーと同じスタイル */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="メッセージを入力..."
                disabled={sending || sessionComplete}
                className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 resize-none outline-none focus:border-[var(--primary-orange)] focus:bg-white transition-colors"
                style={{
                  minHeight: '40px',
                  maxHeight: '120px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
                rows={1}
              />
              
              <button
                onClick={toggleRecording}
                disabled={sessionComplete}
                className={`p-2.5 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                } ${sessionComplete ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {isRecording ? (
                  <Square size={18} className="text-white" />
                ) : (
                  <Mic size={18} className="text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sending || sessionComplete}
                className={`p-2.5 rounded-full transition-all ${
                  inputMessage.trim() && !sending && !sessionComplete
                    ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] hover:opacity-90 cursor-pointer'
                    : 'bg-gray-200 cursor-not-allowed'
                }`}
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-dot {
          animation: typing 1.4s infinite;
          display: inline-block;
        }
        
        @keyframes typing {
          0%, 60%, 100% { opacity: 0; }
          30% { opacity: 1; }
        }
      `}</style>
    </Layout>
  );
}