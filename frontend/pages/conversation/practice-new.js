import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import CharacterSelect from '../../components/conversation/CharacterSelect';
import VoiceRecorder from '../../components/VoiceRecorder';
import { ArrowLeft, Send, Clock, User, MessageCircle } from 'lucide-react';
import axios from 'axios';

export default function ConversationPracticeNew() {
  const router = useRouter();
  const { characterId, characterName } = router.query;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

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
      const response = await axios.post('/api/conversation/practice/chat', {
        character_id: characterId,
        message: inputMessage,
        conversation_history: messages,
        session_id: sessionStartTime
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
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
    } finally {
      setSending(false);
    }
  };

  // 音声入力からテキスト受信
  const handleTranscriptionReceived = (text) => {
    setInputMessage(text);
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
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-gradient-main)'
      }}>
        {/* ヘッダー */}
        <div style={{
          background: 'var(--bg-color)',
          padding: '15px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={() => router.push('/conversation/modes')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <ArrowLeft size={24} color="var(--text-dark)" />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: character.bg,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: character.color
                }}>
                  {character.initial}
                </span>
              </div>
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-dark)'
              }}>
                {character.name}
              </span>
            </div>
          </div>

          {/* タイマー */}
          <div style={{
            background: elapsedTime > 540 ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={18} color={elapsedTime > 540 ? '#F44336' : '#4CAF50'} />
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: elapsedTime > 540 ? '#F44336' : '#4CAF50'
            }}>
              {formatTime(elapsedTime)} / 10:00
            </span>
          </div>
        </div>

        {/* チャットエリア */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                background: message.sender === 'user' 
                  ? 'linear-gradient(145deg, #FF6B35, #FFB08A)'
                  : 'var(--bg-color)',
                color: message.sender === 'user' ? 'white' : 'var(--text-dark)',
                padding: '12px 18px',
                borderRadius: '20px',
                boxShadow: message.sender === 'user'
                  ? '4px 4px 8px rgba(0,0,0,0.1)'
                  : 'var(--shadow-light), var(--shadow-dark)'
              }}>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          
          {sending && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                background: 'var(--bg-color)',
                padding: '12px 18px',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-light), var(--shadow-dark)'
              }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span className="typing-dot">・</span>
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }}>・</span>
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }}>・</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div style={{
          background: 'var(--bg-color)',
          padding: '20px',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          {elapsedTime >= 300 && !sessionComplete && (
            <div style={{
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <button
                onClick={handleSessionComplete}
                style={{
                  background: 'rgba(244, 67, 54, 0.1)',
                  color: '#F44336',
                  border: '1px solid #F44336',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                会話を終了する
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <VoiceRecorder 
              onTranscriptionReceived={handleTranscriptionReceived}
              disabled={sending || sessionComplete}
            />
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="メッセージを入力..."
              disabled={sending || sessionComplete}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '25px',
                border: 'none',
                background: 'var(--bg-color)',
                boxShadow: 'inset 4px 4px 8px rgba(209, 186, 172, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.8)',
                fontSize: '15px'
              }}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sending || sessionComplete}
              style={{
                background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
                opacity: (!inputMessage.trim() || sending || sessionComplete) ? 0.5 : 1
              }}
            >
              <Send size={20} color="white" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
        
        .typing-dot {
          animation: typing 1.4s infinite;
          display: inline-block;
        }
      `}</style>
    </Layout>
  );
}