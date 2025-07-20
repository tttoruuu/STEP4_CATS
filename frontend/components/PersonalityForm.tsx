import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: Array<{
    text: string;
    score: number;
  }>;
}

interface PersonalityFormProps {
  questions: Question[];
  onComplete: (answers: Record<number, number>) => void;
  onBack?: () => void;
}

const PersonalityForm: React.FC<PersonalityFormProps> = ({
  questions,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // 回答を保存
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionIndex
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    if (isLastQuestion) {
      // 最後の質問の場合、結果を送信
      onComplete(answers);
    } else {
      // 次の質問へ
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      // 既に回答済みの質問の場合、前回の回答を表示
      const nextQuestion = questions[currentQuestionIndex + 1];
      if (nextQuestion && answers[nextQuestion.id] !== undefined) {
        setSelectedOption(answers[nextQuestion.id]);
      } else {
        setSelectedOption(null);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // 前の質問の回答を表示
      const prevQuestion = questions[currentQuestionIndex - 1];
      if (prevQuestion && answers[prevQuestion.id] !== undefined) {
        setSelectedOption(answers[prevQuestion.id]);
      } else {
        setSelectedOption(null);
      }
    } else if (onBack) {
      onBack();
    }
  };

  const canProceed = selectedOption !== null;

  return (
    <div className="max-w-sm mx-auto px-6 py-8 min-h-screen bg-[#F5F5F5]">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-white shadow-sm hover:opacity-90 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h1 className="text-lg font-medium text-gray-800">性格診断</h1>
          <p className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>
        
        <div className="w-9"></div> {/* スペーサー */}
      </div>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#FF8551] to-[#FFA46D] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 質問カード */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                selectedOption === index
                  ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                  selectedOption === index
                    ? 'border-white bg-white'
                    : 'border-gray-400'
                }`}>
                  {selectedOption === index && (
                    <div className="w-2 h-2 bg-[#FF8551] rounded-full m-0.5"></div>
                  )}
                </div>
                <span className="text-sm font-medium leading-relaxed">
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="space-y-4">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-3 px-4 rounded-full font-medium text-sm transition-all duration-200 ${
            canProceed
              ? 'bg-gradient-to-r from-[#FF8551] to-[#FFA46D] text-white hover:opacity-90 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center">
            <span>
              {isLastQuestion ? '診断結果を見る' : '次の質問へ'}
            </span>
            {!isLastQuestion && (
              <ChevronRight className="w-4 h-4 ml-2" />
            )}
          </div>
        </button>

        {/* 進捗表示 */}
        <div className="text-center text-sm text-gray-500">
          あと {questions.length - currentQuestionIndex - 1} 問
        </div>
      </div>
    </div>
  );
};

export default PersonalityForm;