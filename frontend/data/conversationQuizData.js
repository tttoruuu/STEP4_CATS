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
    },
    {
      id: "deepen_001",
      category: "deepen",
      level: "beginner",
      tags: ["仕事", "深掘り", "デート"],
      situation: "デート中に相手の仕事について話している場面",
      womanText: "私は事務の仕事をしています。",
      question: "相手が「事務の仕事をしている」と答えた時、どのように深掘りしますか？",
      options: [
        {
          id: "A",
          text: "事務って大変ですよね。",
          feedback: "❌ 深掘りになっておらず、会話が続きにくいです。もっと具体的に聞いてみましょう。",
          score: 0
        },
        {
          id: "B",
          text: "私も事務をやったことがあります。",
          feedback: "△ 共感は良いですが、相手についてより詳しく知る機会を逃しています。",
          score: 1
        },
        {
          id: "C",
          text: "どんな会社で働かれているんですか？",
          feedback: "⭐ 良い深掘りです！具体的な情報を聞くことで、相手の仕事環境や会社について詳しく知ることができます。",
          score: 3
        },
        {
          id: "D",
          text: "事務のお仕事で一番やりがいを感じるのはどんな時ですか？",
          feedback: "⭐ 素晴らしい深掘りです！相手の価値観や感情に踏み込んだ質問で、より深い理解につながります。",
          score: 3
        }
      ],
      correctAnswer: "D",
      explanation: "「やりがい」について聞くことで、相手の内面や価値観を知ることができ、より深いつながりを築けます。",
      shadowingAudio: "/audio/shadowing/deepen_001.mp3",
      shadowingText: "事務のお仕事で一番やりがいを感じるのはどんな時ですか？",
      tip: "職業名だけでなく、「やりがい」「楽しい瞬間」「大変なこと」など、感情に関わる質問をすると相手の人柄が見えてきます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_002",
      category: "deepen",
      level: "beginner",
      tags: ["旅行", "深掘り", "経験"],
      situation: "お茶を飲みながら旅行の話になった場面",
      womanText: "去年、沖縄に行ったんです。とても良かったです。",
      question: "相手が「沖縄旅行が良かった」と言った時、どのように深掘りしますか？",
      options: [
        {
          id: "A",
          text: "沖縄いいですよね。私も行ってみたいです。",
          feedback: "△ 共感は示せていますが、相手の体験について詳しく聞けていません。",
          score: 1
        },
        {
          id: "B",
          text: "沖縄のどこが一番印象的でしたか？",
          feedback: "⭐ 良い深掘りです！具体的な体験を聞くことで、相手の旅行について詳しく知ることができます。",
          score: 3
        },
        {
          id: "C",
          text: "一人で行ったんですか？",
          feedback: "❌ プライベートな質問で、相手が答えにくい可能性があります。まずは旅行の内容について聞きましょう。",
          score: 0
        },
        {
          id: "D",
          text: "沖縄料理は食べましたか？",
          feedback: "○ 具体的な質問ですが、より感情に踏み込んだ質問の方が深いつながりを作れます。",
          score: 2
        }
      ],
      correctAnswer: "B",
      explanation: "「どこが印象的だったか」を聞くことで、相手の価値観や感動したポイントを知ることができ、会話が深まります。",
      shadowingAudio: "/audio/shadowing/deepen_002.mp3",
      shadowingText: "沖縄のどこが一番印象的でしたか？",
      tip: "体験談を聞く時は「どこが印象的だったか」「どんな気持ちになったか」など、感情や感想を聞くと相手の人柄が見えてきます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_003",
      category: "deepen",
      level: "intermediate",
      tags: ["家族", "深掘り", "価値観"],
      situation: "カフェで家族の話になった場面",
      womanText: "私は3人兄弟の真ん中なんです。",
      question: "相手が「3人兄弟の真ん中」と言った時、どのように深掘りしますか？",
      options: [
        {
          id: "A",
          text: "真ん中って大変ですよね。",
          feedback: "❌ 決めつけになってしまい、相手の実際の体験を聞けていません。",
          score: 0
        },
        {
          id: "B",
          text: "上にお兄さん、下に妹さんですか？",
          feedback: "○ 具体的な情報を聞いていますが、より相手の感情や体験に踏み込める質問があります。",
          score: 2
        },
        {
          id: "C",
          text: "真ん中だと、どんな性格になりましたか？",
          feedback: "⭐ 素晴らしい深掘りです！生い立ちが性格に与えた影響を聞くことで、相手の内面を深く理解できます。",
          score: 3
        },
        {
          id: "D",
          text: "兄弟みんな仲がいいんですか？",
          feedback: "○ 家族関係について聞く良い質問ですが、より相手自身に焦点を当てた質問の方が効果的です。",
          score: 2
        }
      ],
      correctAnswer: "C",
      explanation: "生い立ちが性格に与えた影響を聞くことで、相手の自己理解や内面的な部分を知ることができ、より深いつながりを築けます。",
      shadowingAudio: "/audio/shadowing/deepen_003.mp3",
      shadowingText: "真ん中だと、どんな性格になりましたか？",
      tip: "家族構成を聞いた後は、それが相手にどんな影響を与えたかを聞くと、相手の価値観や性格形成について深く理解できます。",
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