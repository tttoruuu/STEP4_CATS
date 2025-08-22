import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import VoiceRecorder from '../../components/VoiceRecorder';
import { Edit, Save, RefreshCw, Copy, CheckCircle, MessageCircle, Sparkles, ArrowLeft, History, X } from 'lucide-react';

export default function ProfileCreator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    basicInfo: '',
    personality: '',
    hobbies: '',
    values: '',
    idealPartner: ''
  });
  const [generatedProfiles, setGeneratedProfiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState(new Set());
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showImprovements, setShowImprovements] = useState({});
  const [improvementData, setImprovementData] = useState({});
  const [loadingImprovements, setLoadingImprovements] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedProfileTitle, setSavedProfileTitle] = useState('');
  const textareaRef = useRef(null);

  const questions = [
    {
      id: 'basicInfo',
      title: '基本情報について',
      question: 'まずは、あなたのお仕事や普段の趣味について、自然に話してみてください。',
      voicePrompt: '「私は〇〇の仕事をしていて、休日は△△をして過ごしています」のように、リラックスして話してください。',
      placeholder: '音声入力の内容がここに表示されます。必要に応じて修正してください。\n\n例：IT企業でシステム開発をしています。休日は読書や映画鑑賞を楽しんでいます...'
    },
    {
      id: 'personality',
      title: '性格・人柄について',
      question: 'あなたの性格や、周りの人からどんな人だと言われるか教えてください。',
      voicePrompt: '「私は〇〇な性格で、友人からは△△だと言われます」など、ご自身の人柄について話してください。',
      placeholder: '音声入力の内容がここに表示されます。必要に応じて修正してください。\n\n例：真面目で責任感が強い性格です。友人からは優しくて頼りがいがあると言われます...'
    },
    {
      id: 'hobbies',
      title: '趣味・特技について',
      question: '好きなことや得意なこと、最近ハマっていることを教えてください。',
      voicePrompt: '趣味や特技について、具体的なエピソードも交えて話してください。相手が興味を持ちそうな内容を意識してみてください。',
      placeholder: '音声入力の内容がここに表示されます。必要に応じて修正してください。\n\n例：料理が好きで、週末は新しいレシピに挑戦しています。最近はイタリア料理にハマっています...'
    },
    {
      id: 'values',
      title: '価値観・将来の目標',
      question: '人生で大切にしていることや、将来の夢・目標について話してください。',
      voicePrompt: '結婚や家庭に対する考え、人生で大切にしている価値観について、思うままに話してください。',
      placeholder: '音声入力の内容がここに表示されます。必要に応じて修正してください。\n\n例：家族を大切にして、お互いを支え合える温かい家庭を築きたいです...'
    },
    {
      id: 'idealPartner',
      title: '理想のお相手について',
      question: 'どのような方とお付き合いしたいか、理想のパートナー像を教えてください。',
      voicePrompt: '外見よりも内面を重視して、どんな性格や価値観の方と出会いたいか話してください。',
      placeholder: '音声入力の内容がここに表示されます。必要に応じて修正してください。\n\n例：一緒にいて自然体でいられる、価値観の合う優しい方と出会いたいです...'
    }
  ];

  const currentQuestion = questions[step - 1];

  const handleInputChange = (value) => {
    setProfileData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    adjustTextareaHeight();
  };
  
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };
  
  useEffect(() => {
    adjustTextareaHeight();
  }, [profileData, step]);
  
  const handleVoiceTranscription = (transcribedText) => {
    const currentValue = profileData[currentQuestion.id];
    const newValue = currentValue ? currentValue + ' ' + transcribedText : transcribedText;
    handleInputChange(newValue);
    setHasRecorded(true);
    
    // テキストエリアの高さを調整
    setTimeout(() => {
      adjustTextareaHeight();
    }, 100);
  };
  
  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      alert('コピーに失敗しました。手動でテキストを選択してコピーしてください。');
    }
  };
  
  const saveProfile = async (profile, index) => {
    console.log('🔥 saveProfile関数が呼ばれました:', { profile: profile.title, index });
    try {
      setSavedProfiles(prev => new Set([...prev, index]));
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // プロフィール作成セッションとして会話履歴に保存
      const messages = [
        {
          role: 'user',
          content: `自己紹介文を作成してください。\n\n【基本情報】\n${profileData.basicInfo}\n\n【性格】\n${profileData.personality}\n\n【趣味】\n${profileData.hobbies}\n\n【価値観】\n${profileData.values}\n\n【理想のパートナー】\n${profileData.idealPartner}`,
          timestamp: new Date().toISOString()
        },
        {
          role: 'ai', 
          content: `【${profile.title}】の自己紹介文を作成いたしました。\n\n${profile.content}\n\n婚活において魅力的な自己紹介文となるよう、あなたの人柄と誠実さが伝わる内容にいたしました。ご活用ください。`,
          timestamp: new Date().toISOString()
        }
      ];

      console.log('=== プロフィール保存開始 ===');
      console.log('保存URL:', `${apiUrl}/api/counselor/save`);
      console.log('セッションタイプ:', 'profile');
      console.log('メッセージ数:', messages.length);
      console.log('メッセージ内容:', messages);

      const headers = {
        'Content-Type': 'application/json'
      };
      
      // 開発環境以外では認証が必要
      if (process.env.NODE_ENV !== 'development') {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      console.log('🚀 fetchを実行します:', `${apiUrl}/api/counselor/save`);
      const response = await fetch(`${apiUrl}/api/counselor/save`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          messages,
          session_type: 'profile'  // プロフィール作成セッションであることを明示
        })
      });
      console.log('✅ fetchが完了しました:', response);

      console.log('=== 保存レスポンス ===');
      console.log('ステータス:', response.status);
      console.log('成功:', response.ok);
      console.log('レスポンスヘッダー:', Object.fromEntries(response.headers));

      if (response.ok) {
        const data = await response.json();
        console.log('プロフィールを相談履歴に保存しました:', data);
        
        // 成功モーダルを表示
        setSavedProfileTitle(profile.title);
        setShowSuccessModal(true);
        
        // 3秒後にアイコンをリセット
        setTimeout(() => {
          setSavedProfiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }, 3000);
      } else {
        const errorText = await response.text();
        console.error('=== 保存エラー詳細 ===');
        console.error('ステータス:', response.status);
        console.error('ステータステキスト:', response.statusText);
        console.error('エラー内容:', errorText);
        console.error('リクエストURL:', `${apiUrl}/api/counselor/save`);
        console.error('リクエストヘッダー:', headers);
        throw new Error(`保存APIの呼び出しに失敗しました: ${response.status} ${errorText}`);
      }
      
    } catch (error) {
      console.error('保存に失敗しました:', error);
      alert('保存に失敗しました。もう一度お試しください。');
      
      // エラー時はアイコンを元に戻す
      setSavedProfiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      generateProfiles();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  const generateProfiles = async () => {
    setIsGenerating(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/counselor/profile-generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 開発環境では認証をバイパス
        },
        body: JSON.stringify({
          answers: profileData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.detail || response.statusText}`);
      }

      const data = await response.json();
      const profiles = data.profiles.map((profile, index) => ({
        id: index + 1,
        title: profile.title,
        content: profile.content
      }));
      
      setGeneratedProfiles(profiles);
    } catch (error) {
      console.error('Error generating profiles:', error);
      // フォールバック
      const profiles = [
        {
          id: 1,
          title: '親しみやすさ重視',
          content: `はじめまして！プロフィールをご覧いただき、ありがとうございます😊 ${profileData.basicInfo}

${profileData.personality}な性格で、${profileData.hobbies}を楽しんでいます。${profileData.values}を大切にしながら、いつも笑顔でいることを心がけています。

${profileData.idealPartner}ような方と、一緒に楽しい時間を過ごしながら自然体でいられる関係を築けたらと思います♪`
        },
        {
          id: 2,
          title: '誠実さ重視',
          content: `ご覧いただきありがとうございます。${profileData.basicInfo}

${profileData.personality}な性格で、仕事では責任感を持って取り組み、プライベートでは家族や友人との時間を大切にしています。${profileData.values}を人生の軸として、思いやりの心を忘れずに人と接することを心がけています。

将来は${profileData.idealPartner}ような方と、お互いを尊重し支え合える温かい家庭を築きたいと考えています。一緒に人生を歩んでいけるパートナーとの出会いを真剣に求めています。`
        },
        {
          id: 3,
          title: '個性重視',
          content: `こんにちは！プロフィールをご覧いただきありがとうございます。${profileData.basicInfo}

${profileData.personality}な性格で、特に${profileData.hobbies}に熱中しています。週末は新しいことにチャレンジしたり、興味のあることを深く探求したりして過ごしています。${profileData.values}を大切にしながら、常に成長していたいと思っています。

${profileData.idealPartner}ような方と、共通の趣味を楽しみながらお互いに新しい発見や体験を一緒にしていけたら嬉しいです。`
        }
      ];
      
      setGeneratedProfiles(profiles);
    } finally {
      setIsGenerating(false);
      setStep(questions.length + 1);
    }
  };

  const regenerateProfiles = () => {
    generateProfiles();
  };

  const getImprovements = async (profile) => {
    const profileId = profile.id;
    setLoadingImprovements(prev => ({ ...prev, [profileId]: true }));
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/counselor/profile-improvement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_content: profile.content,
          profile_type: profile.title
        })
      });

      if (!response.ok) {
        throw new Error('改善提案の取得に失敗しました');
      }

      const data = await response.json();
      setImprovementData(prev => ({ ...prev, [profileId]: data.improvements }));
      setShowImprovements(prev => ({ ...prev, [profileId]: true }));
    } catch (error) {
      console.error('改善提案取得エラー:', error);
      // フォールバック改善提案
      setImprovementData(prev => ({ 
        ...prev, 
        [profileId]: {
          strengths: ['人柄の良さが伝わる文章です', '具体的な趣味が記載されています'],
          improvements: ['もう少し具体的なエピソードを追加しましょう', '相手への質問を含めると良いでしょう'],
          suggestions: ['「最近〇〇にハマっています」など時系列を追加', '「一緒に〇〇したい」という提案を追加'],
          overall_rating: 4,
          key_advice: '全体的に良いプロフィールです。もう少し個性を出すとさらに魅力的になります。'
        }
      }));
      setShowImprovements(prev => ({ ...prev, [profileId]: true }));
    } finally {
      setLoadingImprovements(prev => ({ ...prev, [profileId]: false }));
    }
  };

  if (step > questions.length) {
    return (
      <Layout title="自己紹介文作成 - 完成">
        <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
          {/* 戻るボタン */}
          <div className="mb-4">
            <button
              onClick={() => router.push('/counselor')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF8551] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">戻る</span>
            </button>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-[#FF8551] mb-2">自己紹介文が完成しました！</h1>
            <p className="text-sm text-gray-600">
              3つのパターンを作成しました。お好みのものをお選びください。
            </p>
          </div>

          {isGenerating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8551] mx-auto mb-4"></div>
              <p className="text-gray-600">AIが自己紹介文を作成中...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {generatedProfiles.map((profile) => (
                <div key={profile.id} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">{profile.title}</h3>
                    <button className="text-[#FF8551] hover:text-[#FF7043]">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {profile.content}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => saveProfile(profile, profile.id)}
                      className="flex-1 bg-[#FF8551] text-white py-2 px-4 rounded-lg hover:bg-[#FF7043] transition-colors flex items-center justify-center"
                    >
                      {savedProfiles.has(profile.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          保存済み
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          保存
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(profile.content, profile.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                      {copiedIndex === profile.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          <span className="text-green-500">コピー済み</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          コピー
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* AI改善提案ボタン */}
                  <div className="mt-4">
                    <button
                      onClick={() => getImprovements(profile)}
                      disabled={loadingImprovements[profile.id]}
                      className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                    >
                      {loadingImprovements[profile.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          分析中...
                        </>
                      ) : showImprovements[profile.id] ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          AIアドバイスを非表示
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          AIアドバイスを見る
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* AI改善提案表示 */}
                  {showImprovements[profile.id] && improvementData[profile.id] && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI婚活アドバイザーからの改善提案
                      </h4>
                      
                      {/* 総合評価 */}
                      <div className="mb-4 p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">総合評価：</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${
                                  star <= improvementData[profile.id].overall_rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{improvementData[profile.id].key_advice}</p>
                      </div>
                      
                      {/* 良い点 */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-green-700 mb-2">✨ 良い点</h5>
                        <ul className="space-y-1">
                          {improvementData[profile.id].strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* 改善点 */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-orange-700 mb-2">💡 改善できる点</h5>
                        <ul className="space-y-1">
                          {improvementData[profile.id].improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-orange-500 mt-0.5">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* 具体的な提案 */}
                      <div>
                        <h5 className="text-sm font-medium text-blue-700 mb-2">📝 具体的な改善案</h5>
                        <ul className="space-y-1">
                          {improvementData[profile.id].suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">→</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-center space-y-4">
                <button
                  onClick={regenerateProfiles}
                  className="flex items-center gap-2 mx-auto text-[#FF8551] hover:text-[#FF7043] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  別のパターンを生成
                </button>
                
                <button
                  onClick={() => router.push('/counselor')}
                  className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  カウンセラーに戻る
                </button>
              </div>
            </div>
          )}
          
          {/* 保存成功モーダル */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">保存完了</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        「{savedProfileTitle}」の自己紹介文を相談履歴に保存しました
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    💡 保存した自己紹介文は「相談履歴」からいつでも確認できます
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/counselor/history')}
                    className="flex-1 bg-[#FF8551] text-white py-3 px-4 rounded-lg hover:bg-[#FF7043] transition-colors flex items-center justify-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    相談履歴を見る
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    続ける
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="自己紹介文作成">
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
        {/* 戻るボタン */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/counselor')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF8551] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">戻る</span>
          </button>
        </div>
        
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#FF8551] mb-2">自己紹介文作成</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index + 1 <= step ? 'bg-[#FF8551]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            ステップ {step} / {questions.length}
          </p>
        </div>

        {/* 質問セクション */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="font-medium text-gray-800 mb-2">{currentQuestion.title}</h2>
          <p className="text-sm text-gray-600 mb-4">{currentQuestion.question}</p>
          
          {/* 音声入力促進セクション */}
          <div className="bg-gradient-to-r from-[#FF8551] to-[#FF7043] p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-white font-medium">音声で回答してください</span>
            </div>
            <p className="text-white text-sm mb-3 opacity-90">
              {currentQuestion.voicePrompt}
            </p>
            <div className="flex items-center gap-3">
              <VoiceRecorder
                onTranscriptionReceived={handleVoiceTranscription}
                disabled={false}
              />
              <span className="text-white text-sm">
                マイクボタンを押して音声で回答してください
              </span>
            </div>
          </div>

          {/* テキスト修正エリア */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {hasRecorded ? '音声入力内容（必要に応じて修正してください）' : 'テキストで直接入力する場合はこちら'}
            </label>
            <textarea
              ref={textareaRef}
              value={profileData[currentQuestion.id]}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8551] focus:border-transparent resize-none min-h-[120px] overflow-hidden"
              style={{ height: 'auto' }}
            />
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              前へ
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!profileData[currentQuestion.id].trim()}
            className="flex-1 py-3 bg-[#FF8551] text-white rounded-lg hover:bg-[#FF7043] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step === questions.length ? 'プロフィール生成' : '次へ'}
          </button>
        </div>
      </main>
    </Layout>
  );
}