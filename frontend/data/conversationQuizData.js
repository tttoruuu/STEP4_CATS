// 会話クイズデータ管理
// 引き出す・深める練習用の4択クイズデータ

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

  // シナリオデータ
  scenarios: [
    // 引き出す練習
    {
      id: "elicit_001",
      category: "elicit",
      level: "beginner",
      tags: ["趣味", "初対面", "デート"],
      situation: "初デートで相手の趣味について聞く場面",
      womanText: "そうですね...特に趣味らしい趣味はないかもしれません。",
      choices: [
        {
          id: "a",
          text: "そうなんですね。普段はお休みの日は何をされてるんですか？",
          isCorrect: true,
          explanation: "「趣味」という直接的な言葉を避けて、より答えやすい「普段の過ごし方」を聞くことで、相手が話しやすい環境を作っています。"
        },
        {
          id: "b", 
          text: "趣味がないなんて信じられません！何か絶対あるはずです！",
          isCorrect: false,
          explanation: "相手の発言を否定したり、強く主張したりすると、相手が話しにくくなってしまいます。"
        },
        {
          id: "c",
          text: "そうですか...。僕の趣味は映画鑑賞で...",
          isCorrect: false,
          explanation: "相手の話を引き出そうとしているのに、自分の話に切り替えてしまっています。"
        },
        {
          id: "d",
          text: "趣味がないって、つまらない人ですね。",
          isCorrect: false,
          explanation: "相手を否定的に評価する発言は、会話を終わらせてしまう最悪のパターンです。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_001.mp3",
      shadowingText: "そうなんですね。普段はお休みの日は何をされてるんですか？",
      tip: "相手が「特にない」と言った時は、より具体的で答えやすい質問に変えてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    
    {
      id: "elicit_002", 
      category: "elicit",
      level: "beginner",
      tags: ["仕事", "会話のきっかけ"],
      situation: "相手の仕事について聞く場面",
      womanText: "仕事は...普通の事務職です。特に面白いことはないですね。",
      choices: [
        {
          id: "a",
          text: "事務職ってどんなお仕事されてるんですか？",
          isCorrect: true,
          explanation: "「普通の」「特に面白いことはない」と言われても、具体的な内容を聞くことで会話を続けられます。"
        },
        {
          id: "b",
          text: "事務職って大変そうですね。",
          isCorrect: false,
          explanation: "相手が「面白くない」と言っているのに、さらにネガティブな方向に向けてしまっています。"
        },
        {
          id: "c", 
          text: "そうですね、事務職は確かにつまらそうです。",
          isCorrect: false,
          explanation: "相手の仕事を否定してしまっています。これでは会話が続きません。"
        },
        {
          id: "d",
          text: "僕も事務職経験あります！",
          isCorrect: false,
          explanation: "相手の話を聞く前に、自分の話をしてしまっています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_002.mp3", 
      shadowingText: "事務職ってどんなお仕事されてるんですか？",
      tip: "相手が「つまらない」と言っても、具体的な内容を聞くことで新しい話題が見つかります。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },

    // 深掘り練習
    {
      id: "deepen_001",
      category: "deepen", 
      level: "beginner",
      tags: ["趣味", "深掘り", "共感"],
      situation: "相手が読書好きだと分かった後の深掘り",
      womanText: "読書が好きで、よく小説を読みます。",
      choices: [
        {
          id: "a",
          text: "どんなジャンルの小説がお好きなんですか？",
          isCorrect: true,
          explanation: "「読書好き」から「小説」へ、さらに「ジャンル」へと段階的に深掘りする良い質問です。"
        },
        {
          id: "b",
          text: "僕も読書好きです！最近は何読んでますか？",
          isCorrect: false,
          explanation: "自分の話を挟むことで、相手への関心が薄れて見えます。まずは相手の話を深く聞きましょう。"
        },
        {
          id: "c",
          text: "読書っていいですよね。",
          isCorrect: false,
          explanation: "あまりにも表面的すぎる反応で、会話が深まりません。"
        },
        {
          id: "d",
          text: "小説って難しくないですか？",
          isCorrect: false,
          explanation: "相手の趣味に対してネガティブな印象を与える質問です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_001.mp3",
      shadowingText: "どんなジャンルの小説がお好きなんですか？",
      tip: "相手の話を深掘りする時は、具体的で答えやすい質問を心がけましょう。",
      createdAt: "2025-01-21", 
      updatedAt: "2025-01-21"
    },

    {
      id: "deepen_002",
      category: "deepen",
      level: "intermediate", 
      tags: ["感情", "深掘り", "体験"],
      situation: "相手が旅行の話をした後の深掘り",
      womanText: "先月、沖縄に旅行に行ってきました。すごく良かったです。",
      choices: [
        {
          id: "a",
          text: "沖縄のどこが一番印象に残りましたか？",
          isCorrect: true,
          explanation: "「すごく良かった」という感情を、具体的な体験や印象に深掘りする良い質問です。"
        },
        {
          id: "b",
          text: "沖縄は僕も行ったことがあります！",
          isCorrect: false,
          explanation: "相手の話よりも自分の経験を優先してしまっています。"
        },
        {
          id: "c",
          text: "沖縄は暑くなかったですか？",
          isCorrect: false,
          explanation: "表面的すぎる質問で、相手の「すごく良かった」という感情に触れていません。"
        },
        {
          id: "d",
          text: "旅行っていいですね。",
          isCorrect: false,
          explanation: "一般論すぎて、相手の具体的な体験に興味を示していません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_002.mp3",
      shadowingText: "沖縄のどこが一番印象に残りましたか？",
      tip: "相手の感情（「良かった」「楽しかった」）を具体的な体験に深掘りしてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    }
  ]
};

// ユーティリティ関数
export const getScenariosByCategory = (category) => {
  return conversationQuizData.scenarios.filter(scenario => scenario.category === category);
};

export const getScenariosByLevel = (level) => {
  return conversationQuizData.scenarios.filter(scenario => scenario.level === level);
};

export const getRandomScenario = (category) => {
  const scenarios = getScenariosByCategory(category);
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

export const getScenarioById = (id) => {
  return conversationQuizData.scenarios.find(scenario => scenario.id === id);
};