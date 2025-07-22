import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Mic, MicOff, Edit, Save, RefreshCw } from 'lucide-react';

export default function ProfileCreator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [profileData, setProfileData] = useState({
    basicInfo: '',
    personality: '',
    hobbies: '',
    values: '',
    idealPartner: ''
  });
  const [generatedProfiles, setGeneratedProfiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = [
    {
      id: 'basicInfo',
      title: '基本情報について',
      question: 'あなたの仕事や趣味について、自然に話してください。',
      placeholder: '例：IT企業で働いています。休日は読書や映画鑑賞を楽しんでいます...'
    },
    {
      id: 'personality',
      title: '性格について',
      question: 'あなたの性格や人柄について教えてください。',
      placeholder: '例：真面目で責任感が強いです。友人からは優しいと言われます...'
    },
    {
      id: 'hobbies',
      title: '趣味・興味について',
      question: '趣味や興味のあることについて詳しく話してください。',
      placeholder: '例：料理が好きで、週末は新しいレシピに挑戦しています...'
    },
    {
      id: 'values',
      title: '価値観について',
      question: '大切にしている価値観や将来の目標について教えてください。',
      placeholder: '例：家族を大切にして、お互いを支え合える関係を築きたいです...'
    },
    {
      id: 'idealPartner',
      title: '理想のパートナーについて',
      question: 'どのような方とお付き合いしたいか教えてください。',
      placeholder: '例：一緒にいて自然体でいられる、価値観の合う方と出会いたいです...'
    }
  ];

  const currentQuestion = questions[step - 1];

  const handleInputChange = (value) => {
    setProfileData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // 音声録音機能の実装（将来的に追加）
  };

  const generateProfiles = async () => {
    setIsGenerating(true);
    
    // AIによるプロフィール生成のシミュレーション
    setTimeout(() => {
      const profiles = [
        {
          id: 1,
          title: 'カジュアル版',
          content: `${profileData.basicInfo}

性格は${profileData.personality}で、${profileData.hobbies}を通じて日々を充実させています。

${profileData.values}という価値観を大切にしており、${profileData.idealPartner}と思っています。

お互いを尊重し合える関係を築けたらと思います。よろしくお願いします。`
        },
        {
          id: 2,
          title: 'フォーマル版',
          content: `はじめまして。プロフィールをご覧いただき、ありがとうございます。

【仕事・趣味】
${profileData.basicInfo}

【性格】
${profileData.personality}

【価値観】
${profileData.values}

【理想のお相手】
${profileData.idealPartner}

真剣な出会いを求めており、お互いに成長し合える関係を築きたいと考えています。ご興味を持っていただけましたら、お気軽にメッセージをお送りください。`
        },
        {
          id: 3,
          title: '親しみやすい版',
          content: `こんにちは！プロフィールを見ていただき、ありがとうございます😊

${profileData.basicInfo}

${profileData.personality}な性格で、特に${profileData.hobbies}に熱中しています。

${profileData.values}を大切にしており、${profileData.idealPartner}ような方と出会えたらと思っています。

一緒にいて楽しい時間を過ごせる方との出会いを楽しみにしています♪`
        }
      ];
      
      setGeneratedProfiles(profiles);
      setIsGenerating(false);
      setStep(questions.length + 1);
    }, 2000);
  };

  const regenerateProfiles = () => {
    generateProfiles();
  };

  if (step > questions.length) {
    return (
      <Layout title="自己紹介文作成 - 完成">
        <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
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
                    <button className="flex-1 bg-[#FF8551] text-white py-2 px-4 rounded-lg hover:bg-[#FF7043] transition-colors">
                      <Save className="w-4 h-4 inline mr-2" />
                      保存
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      コピー
                    </button>
                  </div>
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
                  onClick={() => router.back()}
                  className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  カウンセラーに戻る
                </button>
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
          
          {/* 音声録音ボタン */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'bg-[#FF8551] text-white hover:bg-[#FF7043]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  録音停止
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  音声で回答
                </>
              )}
            </button>
            <span className="text-xs text-gray-500">
              または下記に直接入力してください
            </span>
          </div>

          {/* テキスト入力 */}
          <textarea
            value={profileData[currentQuestion.id]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8551] focus:border-transparent resize-none"
            rows="6"
          />
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