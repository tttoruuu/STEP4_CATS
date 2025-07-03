import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ChevronLeft, Sparkles, CheckCircle, Camera, Calendar } from 'lucide-react';

export default function SkincareAnalysis() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [analysisData, setAnalysisData] = useState({
    skinType: null,
    concerns: [],
    age: null,
    currentRoutine: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const skinTypes = [
    { id: 'normal', name: '普通肌', description: 'ベタつきも乾燥も気にならない' },
    { id: 'dry', name: '乾燥肌', description: 'カサつきやつっぱり感がある' },
    { id: 'oily', name: '脂性肌', description: 'テカリやベタつきが気になる' },
    { id: 'combination', name: '混合肌', description: 'Tゾーンはオイリー、頬は乾燥' },
    { id: 'sensitive', name: '敏感肌', description: '肌荒れしやすい、刺激に弱い' }
  ];

  const skinConcerns = [
    { id: 'acne', name: 'ニキビ・吹き出物' },
    { id: 'dryness', name: '乾燥' },
    { id: 'oiliness', name: 'テカリ・皮脂' },
    { id: 'pores', name: '毛穴の開き' },
    { id: 'blackheads', name: '黒ずみ' },
    { id: 'dullness', name: 'くすみ' },
    { id: 'roughness', name: 'ざらつき' },
    { id: 'redness', name: '赤み・炎症' }
  ];

  const ageRanges = [
    { id: '20s', name: '20代', range: '20-29歳' },
    { id: '30s', name: '30代', range: '30-39歳' },
    { id: '40s', name: '40代', range: '40-49歳' },
    { id: '50s', name: '50代以上', range: '50歳以上' }
  ];

  const handleSkinTypeSelect = (type) => {
    setAnalysisData(prev => ({ ...prev, skinType: type }));
  };

  const handleConcernToggle = (concernId) => {
    setAnalysisData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concernId)
        ? prev.concerns.filter(id => id !== concernId)
        : [...prev.concerns, concernId]
    }));
  };

  const handleAgeSelect = (age) => {
    setAnalysisData(prev => ({ ...prev, age }));
  };

  const generateSkincareResult = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockResult = {
        skinType: analysisData.skinType,
        routine: {
          morning: [
            { step: 1, product: '洗顔料', name: 'マンダム ウォッシングフォーム', description: '毛穴汚れをすっきり洗浄' },
            { step: 2, product: '化粧水', name: 'マンダム モイスチャーローション', description: '肌に潤いを与える' },
            { step: 3, product: '乳液', name: 'マンダム デイリーエマルジョン', description: '肌を保護してなめらかに' }
          ],
          night: [
            { step: 1, product: '洗顔料', name: 'マンダム ディープクレンジング', description: '一日の汚れをしっかり除去' },
            { step: 2, product: '化粧水', name: 'マンダム ナイトローション', description: '夜の肌に集中ケア' },
            { step: 3, product: '美容液', name: 'マンダム セラム', description: '肌悩みに特化した集中ケア' },
            { step: 4, product: 'クリーム', name: 'マンダム ナイトクリーム', description: '夜の間に肌を修復' }
          ]
        },
        tips: [
          '朝は洗顔料を使って余分な皮脂を除去しましょう',
          '化粧水は手で優しくパッティングして浸透させましょう',
          '日焼け止めは365日欠かさず使用しましょう',
          '週1-2回のスペシャルケアも効果的です'
        ],
        nextCheckDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
      setStep(5);
    }, 2000);
  };

  if (step === 5 && result) {
    return (
      <Layout title="スキンケア診断結果">
        <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">診断完了！</h1>
            <p className="text-gray-600">あなた専用のスキンケアプランが完成しました</p>
          </div>

          {/* 朝のルーティン */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              ☀️ 朝のスキンケア
            </h3>
            <div className="space-y-4">
              {result.routine.morning.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 夜のルーティン */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              🌙 夜のスキンケア
            </h3>
            <div className="space-y-4">
              {result.routine.night.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* スキンケアのコツ */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="font-medium text-gray-800 mb-4">スキンケアのコツ</h3>
            <div className="space-y-2">
              {result.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 次回チェック */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5" />
              <h3 className="font-medium">次回チェック予定</h3>
            </div>
            <p className="text-sm opacity-90">
              {result.nextCheckDate.toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} に肌の状態をチェックしましょう
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/styling')}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              他のスタイリングも見る
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="スキンケア診断">
      <main className="max-w-sm mx-auto px-6 py-8 bg-[#F5F5F5] min-h-screen">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">スキンケア診断</h1>
            <p className="text-sm text-gray-600">ステップ {step} / 4</p>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center">{Math.round((step / 4) * 100)}% 完了</p>
        </div>

        {isAnalyzing ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">分析中...</h3>
            <p className="text-sm text-gray-600">あなたに最適なスキンケアプランを作成しています</p>
          </div>
        ) : (
          <>
            {/* Step 1: 肌タイプ */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-6">あなたの肌タイプを教えてください</h2>
                <div className="space-y-3">
                  {skinTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleSkinTypeSelect(type.id)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        analysisData.skinType === type.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: 肌の悩み */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-6">
                  気になる肌の悩みを選んでください（複数選択可）
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {skinConcerns.map((concern) => (
                    <button
                      key={concern.id}
                      onClick={() => handleConcernToggle(concern.id)}
                      className={`p-3 text-sm rounded-lg border-2 transition-all ${
                        analysisData.concerns.includes(concern.id)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {concern.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: 年代 */}
            {step === 3 && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-6">年代を教えてください</h2>
                <div className="space-y-3">
                  {ageRanges.map((age) => (
                    <button
                      key={age.id}
                      onClick={() => handleAgeSelect(age.id)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        analysisData.age === age.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 mb-1">{age.name}</h3>
                      <p className="text-sm text-gray-600">{age.range}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: 写真撮影（オプション） */}
            {step === 4 && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-6">
                  より詳細な分析のため、お肌の写真を撮影しますか？（オプション）
                </h2>
                <div className="text-center py-8">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-6">
                    写真により詳細な肌分析が可能になります。<br />
                    撮影をスキップしても診断は受けられます。
                  </p>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      写真を撮影する
                    </button>
                    <button 
                      onClick={generateSkincareResult}
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      スキップして診断する
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ナビゲーション */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  前へ
                </button>
              )}
              {step < 4 && (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !analysisData.skinType) ||
                    (step === 2 && analysisData.concerns.length === 0) ||
                    (step === 3 && !analysisData.age)
                  }
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  次へ
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}