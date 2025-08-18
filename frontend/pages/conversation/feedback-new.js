import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft, TrendingUp, MessageCircle, Heart, Star, Award, AlertCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function ConversationFeedbackNew() {
  const router = useRouter();
  const { characterId, characterName, duration, messages } = router.query;
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (messages) {
      generateFeedback();
    }
  }, [messages]);

  const generateFeedback = async () => {
    try {
      const parsedMessages = JSON.parse(messages);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/conversation/practice/feedback', {
        character_id: characterId,
        conversation_history: parsedMessages,
        duration: parseInt(duration)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setFeedback(response.data);
      setLoading(false);
    } catch (error) {
      console.error('フィードバック生成エラー:', error);
      setError('フィードバックの生成に失敗しました');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const getScoreColor = (score) => {
    if (score >= 4) return '#4CAF50';
    if (score >= 3) return '#FF9800';
    return '#F44336';
  };

  const getScoreEmoji = (score) => {
    if (score >= 4) return '😊';
    if (score >= 3) return '🙂';
    return '😔';
  };

  if (loading) {
    return (
      <Layout title="フィードバック">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-gradient-main)'
        }}>
          <div style={{
            background: 'var(--bg-color)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: 'var(--shadow-light), var(--shadow-dark)',
            textAlign: 'center'
          }}>
            <div className="typing-dots" style={{ fontSize: '24px', marginBottom: '20px' }}>
              <span>・</span>
              <span style={{ animationDelay: '0.2s' }}>・</span>
              <span style={{ animationDelay: '0.4s' }}>・</span>
            </div>
            <p style={{ color: 'var(--text-medium)' }}>
              会話を分析中です...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="フィードバック">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-gradient-main)'
        }}>
          <div style={{
            background: 'var(--bg-color)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: 'var(--shadow-light), var(--shadow-dark)',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} color="#F44336" style={{ marginBottom: '20px' }} />
            <p style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => router.push('/conversation/modes')}
              style={{
                background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              練習モード選択へ戻る
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="会話フィードバック">
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient-main)',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* ヘッダー */}
          <div style={{
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={() => router.push('/conversation/modes')}
              style={{
                background: 'var(--bg-color)',
                border: 'none',
                borderRadius: '15px',
                padding: '12px',
                boxShadow: 'var(--shadow-light), var(--shadow-dark)',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={24} color="var(--text-dark)" />
            </button>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              会話フィードバック
            </h1>
          </div>

          {/* 総合評価 */}
          <div style={{
            background: 'var(--bg-color)',
            borderRadius: '25px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-light), var(--shadow-dark)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  marginBottom: '5px'
                }}>
                  総合評価
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-medium)'
                }}>
                  {characterName}との会話（{formatTime(duration)}）
                </p>
              </div>
              
              <div style={{
                fontSize: '48px',
                background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
                borderRadius: '20px',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {feedback?.skill_scores ? 
                  getScoreEmoji(Math.round((feedback.skill_scores.greeting + feedback.skill_scores.empathy + feedback.skill_scores.listening) / 3))
                  : '🎯'
                }
              </div>
            </div>

            {/* スキルスコア */}
            {feedback?.skill_scores && (
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{
                  flex: 1,
                  minWidth: '150px',
                  background: 'var(--bg-color)',
                  padding: '15px',
                  borderRadius: '15px',
                  boxShadow: 'inset 4px 4px 8px rgba(209, 186, 172, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MessageCircle size={18} color={getScoreColor(feedback.skill_scores.greeting)} />
                    <span style={{ fontSize: '14px', color: 'var(--text-medium)' }}>挨拶</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= feedback.skill_scores.greeting ? getScoreColor(feedback.skill_scores.greeting) : 'none'}
                        color={star <= feedback.skill_scores.greeting ? getScoreColor(feedback.skill_scores.greeting) : '#DDD'}
                      />
                    ))}
                  </div>
                </div>

                <div style={{
                  flex: 1,
                  minWidth: '150px',
                  background: 'var(--bg-color)',
                  padding: '15px',
                  borderRadius: '15px',
                  boxShadow: 'inset 4px 4px 8px rgba(209, 186, 172, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Heart size={18} color={getScoreColor(feedback.skill_scores.empathy)} />
                    <span style={{ fontSize: '14px', color: 'var(--text-medium)' }}>共感</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= feedback.skill_scores.empathy ? getScoreColor(feedback.skill_scores.empathy) : 'none'}
                        color={star <= feedback.skill_scores.empathy ? getScoreColor(feedback.skill_scores.empathy) : '#DDD'}
                      />
                    ))}
                  </div>
                </div>

                <div style={{
                  flex: 1,
                  minWidth: '150px',
                  background: 'var(--bg-color)',
                  padding: '15px',
                  borderRadius: '15px',
                  boxShadow: 'inset 4px 4px 8px rgba(209, 186, 172, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <TrendingUp size={18} color={getScoreColor(feedback.skill_scores.listening)} />
                    <span style={{ fontSize: '14px', color: 'var(--text-medium)' }}>聞く力</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= feedback.skill_scores.listening ? getScoreColor(feedback.skill_scores.listening) : 'none'}
                        color={star <= feedback.skill_scores.listening ? getScoreColor(feedback.skill_scores.listening) : '#DDD'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 良かった点 */}
          {feedback?.good_points && feedback.good_points.length > 0 && (
            <div style={{
              background: 'var(--bg-color)',
              borderRadius: '25px',
              padding: '30px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-light), var(--shadow-dark)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <Award size={24} color="#4CAF50" />
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-dark)'
                }}>
                  良かった点
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {feedback.good_points.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(76, 175, 80, 0.1)',
                      padding: '15px',
                      borderRadius: '15px',
                      borderLeft: '4px solid #4CAF50'
                    }}
                  >
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-dark)',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      「{point}」
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 改善点 */}
          {feedback?.improvement_points && feedback.improvement_points.length > 0 && (
            <div style={{
              background: 'var(--bg-color)',
              borderRadius: '25px',
              padding: '30px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-light), var(--shadow-dark)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <TrendingUp size={24} color="#FF9800" />
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-dark)'
                }}>
                  改善ポイント
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {feedback.improvement_points.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 152, 0, 0.1)',
                      padding: '15px',
                      borderRadius: '15px',
                      borderLeft: '4px solid #FF9800'
                    }}
                  >
                    {typeof point === 'object' && point.before && point.after ? (
                      <div>
                        <p style={{
                          fontSize: '14px',
                          color: 'var(--text-medium)',
                          marginBottom: '8px'
                        }}>
                          Before: 「{point.before}」
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: 'var(--text-dark)',
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
                          After: 「{point.after}」
                        </p>
                      </div>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--text-dark)',
                        margin: 0
                      }}>
                        {point}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 次回へのアドバイス */}
          {feedback?.next_advice && (
            <div style={{
              background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
              borderRadius: '25px',
              padding: '30px',
              marginBottom: '20px',
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '15px'
              }}>
                💡 次回へのアドバイス
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'white',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feedback.next_advice}
              </p>
            </div>
          )}

          {/* アクションボタン */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginTop: '30px'
          }}>
            <button
              onClick={() => router.push('/conversation/practice-new')}
              style={{
                flex: 1,
                background: 'linear-gradient(145deg, #FF6B35, #FFB08A)',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              もう一度練習する
            </button>
            
            <button
              onClick={() => router.push('/conversation/modes')}
              style={{
                flex: 1,
                background: 'var(--bg-color)',
                color: 'var(--text-dark)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '15px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: 'var(--shadow-light), var(--shadow-dark)'
              }}
            >
              他の練習を選ぶ
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
        
        .typing-dots span {
          animation: typing 1.4s infinite;
          display: inline-block;
        }
      `}</style>
    </Layout>
  );
}