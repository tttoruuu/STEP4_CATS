// 会話練習クイズ データ構造
// 設計書: https://github.com/tttoruuu/STEP4_CATS/blob/main/docs/conversation-quiz-data-structure.md

export const conversationQuizData = {
  version: "1.0",
  lastUpdated: "2025-01-21",
  
  // カテゴリ定義
  categories: {
    elicit: {
      name: "会話を引き出す",
      description: "相手が話しやすい質問をする練習",
      color: "from-yellow-500 to-yellow-600",
      icon: "lightbulb"
    },
    deepen: {
      name: "深掘りする", 
      description: "話題を掘り下げる質問をする練習",
      color: "from-purple-500 to-purple-600",
      icon: "search"
    }
  },
  
  // 難易度定義
  levels: {
    beginner: { name: "初級", order: 1 },
    intermediate: { name: "中級", order: 2 },
    advanced: { name: "上級", order: 3 }
  },
  
  // シナリオデータ（問題集）
  scenarios: [
    {
      id: "elicit_001",
      category: "elicit",
      level: "beginner",
      tags: ["趣味", "初対面", "デート"],
      situation: "初デートで相手の趣味について聞く場面",
      womanText: "そうですね...特に趣味らしい趣味はないかもしれません。",
      question: "相手が「特に趣味はない」と言った時、どのように会話を続けますか？",
      options: [
        {
          id: "A",
          text: "そうですか、それは残念ですね。",
          feedback: "❌ 会話が終わってしまいます。相手の答えを受け入れつつ、別の角度から引き出してみましょう。",
          score: 0
        },
        {
          id: "B", 
          text: "趣味は何かあった方がいいですよ。",
          feedback: "❌ 相手を否定的に感じさせる可能性があります。",
          score: 0
        },
        {
          id: "C",
          text: "休日はどんなことをして過ごされているんですか？",
          feedback: "⭐ 良い質問です！「趣味」という言葉にこだわらず、相手の日常から話題を見つけることができます。",
          score: 3
        },
        {
          id: "D",
          text: "私も趣味らしい趣味はないんです。",
          feedback: "△ 共感は良いですが、会話が発展しにくいです。相手について詳しく聞いてみましょう。",
          score: 1
        }
      ],
      correctAnswer: "C",
      explanation: "相手が「趣味がない」と言っても、休日の過ごし方や興味があることは必ずあります。別の角度から質問することで会話が続きます。",
      shadowingAudio: "/audio/shadowing/elicit_001.mp3",
      shadowingText: "休日はどんなことをして過ごされているんですか？",
      tip: "「趣味」という言葉にこだわらず、「休日の過ごし方」「最近気になること」など、別の表現で聞いてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    }
  ]
};

// ヘルパー関数
export const getCategories = () => {
  return conversationQuizData.categories;
};

export const getScenariosByCategory = (category) => {
  return conversationQuizData.scenarios.filter(scenario => scenario.category === category);
};

export const getRandomScenario = (category, level = null) => {
  let scenarios = conversationQuizData.scenarios.filter(scenario => scenario.category === category);
  
  if (level) {
    scenarios = scenarios.filter(scenario => scenario.level === level);
  }
  
  if (scenarios.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
};