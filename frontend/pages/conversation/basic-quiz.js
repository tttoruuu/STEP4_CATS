import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Play, Pause, Mic, MicOff, Volume2 } from 'lucide-react';
import { 
  conversationQuizData, 
  getScenariosByCategory, 
  getRandomScenario,
  getCategories 
} from '../../data/conversationQuizData';

export default function BasicConversationQuiz() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userAudioBlob, setUserAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  
  const audioRef = useRef(null);

  // カテゴリー一覧
  const categories = getCategories();
  const categoryOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'elicit', label: categories.elicit.name },
    { value: 'deepen', label: categories.deepen.name }
  ];

  // 初期化時とカテゴリー変更時にシナリオを設定
  useEffect(() => {
    let filteredScenarios;
    
    if (selectedCategory === 'all') {
      filteredScenarios = conversationQuizData.scenarios;
    } else {
      filteredScenarios = getScenariosByCategory(selectedCategory);
    }
    
    // シナリオをシャッフル
    const shuffledScenarios = [...filteredScenarios].sort(() => Math.random() - 0.5);
    setScenarios(shuffledScenarios);
    setCurrentScenarioIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFinalResult(false);
    setScore(0);
    setAnswers([]);
  }, [selectedCategory]);

  const currentScenario = scenarios[currentScenarioIndex];

  // 音声再生制御
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  // 録音機能
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setUserAudioBlob(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('マイクアクセスエラー:', error);
        alert('マイクへのアクセスが拒否されました');
      }
    }
  };

  const handleAnswerSelect = (choiceId) => {
    if (showResult) return;
    setSelectedAnswer(choiceId);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const selectedChoice = currentScenario.choices.find(choice => choice.id === selectedAnswer);
    const isCorrect = selectedChoice.isCorrect;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([...answers, {
      scenarioId: currentScenario.id,
      selected: selectedAnswer,
      isCorrect: isCorrect
    }]);

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setUserAudioBlob(null);
      setIsAudioPlaying(false);
    } else {
      setShowFinalResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenarioIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setShowFinalResult(false);
    setUserAudioBlob(null);
  };

  if (scenarios.length === 0) {
    return (
      <Layout title="会話の基本練習" hideHeader={true}>
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">クイズデータが見つかりません</h2>
              <button
                onClick={() => router.push('/conversation')}
                className="bg-[#FF8551] text-white py-3 px-6 rounded-xl hover:opacity-90"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (showFinalResult) {
    const percentage = Math.round((score / scenarios.length) * 100);
    return (
      <Layout title="会話の基本練習 - 結果" hideHeader={true}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-[#FF8551] to-[#FFA46D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{percentage}%</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">練習完了！</h2>
                <p className="text-gray-600">
                  {scenarios.length}問中{score}問正解
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {percentage >= 80 ? (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-semibold text-green-800 mb-2">🎉 素晴らしい！</h3>
                    <p className="text-sm text-green-700">
                      基本的な会話の受け答えがよくできています。実際の場面でも自信を持って会話を楽しんでください。
                    </p>
                  </div>
                ) : percentage >= 60 ? (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">👍 良い調子です</h3>
                    <p className="text-sm text-blue-700">
                      基本は理解できています。間違えた問題を復習して、より自然な会話を目指しましょう。
                    </p>
                  </div>
                ) : (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">💪 もう少し練習しましょう</h3>
                    <p className="text-sm text-orange-700">
                      相手の気持ちを考えながら返答することを意識してみてください。練習を重ねれば必ず上達します。
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📝 覚えておきたいポイント</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 相手の話に興味を持って質問する</li>
                    <li>• ポジティブな返答を心がける</li>
                    <li>• 急ぎすぎず、自然な会話の流れを大切に</li>
                    <li>• 相手の気持ちに共感を示す</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRestart}
                  className="w-full bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  もう一度挑戦
                </button>
                <button
                  onClick={() => router.push('/conversation')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  会話練習に戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="会話の基本練習" hideHeader={true}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        {/* ヘッダー */}
        <div className="bg-white shadow-sm p-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/conversation')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>戻る</span>
            </button>
            <div className="text-center">
              <h1 className="font-bold text-gray-800">会話の基本練習</h1>
              <p className="text-sm text-gray-500">
                {selectedCategory === 'all' ? '総合練習' : categories[selectedCategory]?.name}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {currentScenarioIndex + 1}/{scenarios.length}
            </div>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="bg-white p-4 border-b">
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* カテゴリー選択 */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-center">📚 練習カテゴリー</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* シナリオカード */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="mb-4">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  📝 {currentScenario.situation}
                </div>
                <div className="bg-pink-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-800">
                        {currentScenario.womanText}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-600 font-medium">
                  どのように返答しますか？
                </p>
              </div>
            </div>

            {/* 選択肢 */}
            <div className="space-y-3">
              {currentScenario.choices.map((choice) => {
                const isSelected = selectedAnswer === choice.id;
                const showCorrect = showResult && choice.isCorrect;
                const showWrong = showResult && isSelected && !choice.isCorrect;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleAnswerSelect(choice.id)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-[#FF8551] bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        showCorrect
                          ? 'bg-green-500 text-white'
                          : showWrong
                          ? 'bg-red-500 text-white'
                          : isSelected
                          ? 'bg-[#FF8551] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {choice.id.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-700">{choice.text}</p>
                        {showResult && (
                          <div className="mt-2">
                            {showCorrect && (
                              <p className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle size={16} />
                                正解！
                              </p>
                            )}
                            {showWrong && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <XCircle size={16} />
                                不正解
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 解説とシャドーイング */}
            {showResult && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-[#FF8551]">💡</span>
                  解説
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      正解: {currentScenario.choices.find(c => c.isCorrect).id.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {currentScenario.choices.find(c => c.isCorrect).text}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentScenario.choices.find(c => c.isCorrect).explanation}
                    </p>
                  </div>

                  {/* ヒント */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 学習ヒント</h4>
                    <p className="text-sm text-blue-700">{currentScenario.tip}</p>
                  </div>

                  {/* シャドーイング練習 */}
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3">🎤 シャドーイング練習</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      正解の文章を音声に合わせて練習しましょう
                    </p>
                    <div className="mb-3 p-3 bg-white rounded-lg">
                      <p className="text-sm font-medium text-gray-800">
                        "{currentScenario.shadowingText}"
                      </p>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={toggleAudio}
                        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {isAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
                        {isAudioPlaying ? '一時停止' : '音声再生'}
                      </button>
                      <button
                        onClick={toggleRecording}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                          isRecording 
                            ? 'bg-red-500 text-white' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                        {isRecording ? '録音停止' : '録音開始'}
                      </button>
                    </div>
                    {userAudioBlob && (
                      <button
                        onClick={() => {
                          const audio = new Audio(URL.createObjectURL(userAudioBlob));
                          audio.play();
                        }}
                        className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Volume2 size={16} />
                        録音再生
                      </button>
                    )}
                    
                    {/* 音声ファイル */}
                    <audio
                      ref={audioRef}
                      src={currentScenario.shadowingAudio}
                      onEnded={() => setIsAudioPlaying(false)}
                      preload="metadata"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ボタン */}
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                回答する
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white py-4 px-6 rounded-2xl font-semibold hover:opacity-90 transition-opacity"
              >
                {currentScenarioIndex < scenarios.length - 1 ? '次の問題へ' : '結果を見る'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}