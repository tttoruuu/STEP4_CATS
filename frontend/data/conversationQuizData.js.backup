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
      tags: ["挨拶", "初対面", "アイスブレーク"],
      situation: "初対面の相手との会話開始時",
      womanText: "こんにちは、今日は来るまでちょっと迷っちゃいました。",
      choices: [
        {
          id: "a",
          text: "今日、来るまで大変じゃなかったですか？",
          isCorrect: true,
          explanation: "相手の体験に共感を示し、会話を自然に広げる優れた返答です。相手が話しやすい環境を作っています。"
        },
        {
          id: "b", 
          text: "とりあえずLINE交換しませんか？",
          isCorrect: false,
          explanation: "相手の話を聞かずに自分のペースで進めようとしており、会話の流れを無視しています。"
        },
        {
          id: "c",
          text: "結婚願望ありますか？",
          isCorrect: false,
          explanation: "初対面でいきなり結婚の話は重すぎて、相手を驚かせてしまう可能性があります。"
        },
        {
          id: "d",
          text: "なんでこの会に来たんですか？",
          isCorrect: false,
          explanation: "詰問調で相手を責めるような印象を与え、守勢に回らせてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_001.mp3",
      shadowingText: "今日、来るまで大変じゃなかったですか？",
      tip: "相手の体験に共感を示すことで、自然に会話が広がります。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "elicit_002",
      category: "elicit", 
      level: "beginner",
      tags: ["週末", "趣味", "ライフスタイル"],
      situation: "相手の休日の過ごし方について",
      womanText: "最近、週末の過ごし方を工夫してて…",
      choices: [
        {
          id: "a",
          text: "週末はどんな風に過ごすことが多いんですか？",
          isCorrect: true,
          explanation: "相手の話に興味を示し、具体的で答えやすい質問をしています。"
        },
        {
          id: "b",
          text: "毎日何時に起きてますか？",
          isCorrect: false,
          explanation: "話題を変えてしまい、相手が話したがっていることを聞けていません。"
        },
        {
          id: "c", 
          text: "一人暮らしですか？",
          isCorrect: false,
          explanation: "週末の過ごし方とは関係のない質問で、会話の流れを断ち切っています。"
        },
        {
          id: "d",
          text: "土日は暇してますか？",
          isCorrect: false,
          explanation: "「暇」という表現がネガティブで、相手の充実した生活を否定する印象を与えます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_002.mp3",
      shadowingText: "週末はどんな風に過ごすことが多いんですか？",
      tip: "相手が話し始めたトピックを深掘りすることで、自然な会話が続きます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "elicit_003",
      category: "elicit",
      level: "beginner", 
      tags: ["趣味", "興味", "関心"],
      situation: "趣味について探る場面",
      womanText: "趣味とかって、気になりますか？",
      choices: [
        {
          id: "a",
          text: "最近ハマってること、ありますか？",
          isCorrect: true,
          explanation: "「趣味」より気軽で答えやすい「ハマってること」という表現で、相手が話しやすい環境を作っています。"
        },
        {
          id: "b",
          text: "趣味は何？詳しく教えて？",
          isCorrect: false,
          explanation: "直接的すぎて圧迫感を与え、相手が身構えてしまう可能性があります。"
        },
        {
          id: "c",
          text: "何かオタクですか？",
          isCorrect: false,
          explanation: "「オタク」という表現は偏見を含む可能性があり、相手を不快にさせるリスクがあります。"
        },
        {
          id: "d", 
          text: "暇つぶしって何してるの？",
          isCorrect: false,
          explanation: "「暇つぶし」という表現は相手の活動を軽視している印象を与えます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_003.mp3",
      shadowingText: "最近ハマってること、ありますか？",
      tip: "硬い表現を避けて、カジュアルで答えやすい言葉を選びましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_001",
      category: "deepen",
      level: "intermediate",
      tags: ["学生時代", "思い出", "過去"],
      situation: "学生時代の話から深掘りする場面",
      womanText: "学生時代って、いろんな思い出がありますよね。",
      choices: [
        {
          id: "a",
          text: "学生の頃ってどんなタイプでした？",
          isCorrect: true,
          explanation: "相手の性格や人柄を知ることができる素晴らしい質問です。過去から現在の人となりを理解できます。"
        },
        {
          id: "b",
          text: "偏差値いくつくらいでした？",
          isCorrect: false,
          explanation: "学歴を直接聞くのは失礼で、相手を不快にさせる可能性があります。"
        },
        {
          id: "c",
          text: "どこの大学ですか？",
          isCorrect: false,
          explanation: "学歴詮索と受け取られ、相手が身構えてしまいます。"
        },
        {
          id: "d",
          text: "部活とか無駄じゃなかったですか？",
          isCorrect: false,
          explanation: "相手の経験を否定的に捉える発言で、非常に失礼です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_001.mp3",
      shadowingText: "学生の頃ってどんなタイプでした？",
      tip: "過去の経験から相手の人柄を知る質問を心がけましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_002",
      category: "deepen",
      level: "beginner",
      tags: ["休日", "ライフスタイル", "価値観"],
      situation: "休日の過ごし方を深掘りする場面",
      womanText: "休日はだいたい家にいることが多いかも。",
      choices: [
        {
          id: "a",
          text: "休日は外出派ですか？それとも家でゆっくり派ですか？",
          isCorrect: true,
          explanation: "相手の価値観を尊重しながら、ライフスタイルの傾向を聞く良い質問です。"
        },
        {
          id: "b",
          text: "土日ヒマなら遊べますか？",
          isCorrect: false,
          explanation: "いきなり誘うような発言で、相手にプレッシャーを与えてしまいます。"
        },
        {
          id: "c",
          text: "家で何してるんですか？",
          isCorrect: false,
          explanation: "少し詰問調で、相手を責めているような印象を与える可能性があります。"
        },
        {
          id: "d",
          text: "寝てばかりじゃないですか？",
          isCorrect: false,
          explanation: "相手の生活習慣を批判的に捉える失礼な発言です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_002.mp3", 
      shadowingText: "休日は外出派ですか？それとも家でゆっくり派ですか？",
      tip: "相手の価値観を尊重する選択肢を提示することで、安心して答えてもらえます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_003",
      category: "deepen",
      level: "intermediate",
      tags: ["旅行", "価値観", "将来"],
      situation: "旅行の話から価値観を探る場面",
      womanText: "旅行とか好きですよ。",
      choices: [
        {
          id: "a",
          text: "もし1週間休みがあったら、どこに行きたいですか？",
          isCorrect: true,
          explanation: "仮定の質問で相手の理想や価値観を引き出す優れた質問です。"
        },
        {
          id: "b",
          text: "会社辞めたいと思ったことありますか？",
          isCorrect: false,
          explanation: "旅行の話から急に仕事の愚痴に転換してしまい、ネガティブな方向に向かいます。"
        },
        {
          id: "c",
          text: "1人で旅行って寂しくないですか？",
          isCorrect: false,
          explanation: "一人旅を否定的に捉える発言で、相手の価値観を否定してしまいます。"
        },
        {
          id: "d",
          text: "海外より日本が好きですよね？",
          isCorrect: false,
          explanation: "決めつけの発言で、相手の選択肢を狭めてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_003.mp3",
      shadowingText: "もし1週間休みがあったら、どこに行きたいですか？",
      tip: "仮定の質問は相手の理想や価値観を自然に引き出すのに効果的です。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "elicit_004",
      category: "elicit",
      level: "beginner",
      tags: ["映画", "娯楽", "共通点"],
      situation: "映画の話題で会話を広げる場面",
      womanText: "最近、家でゆっくり映画観たりしてます。",
      choices: [
        {
          id: "a", 
          text: "映画とか観ます？最近おすすめあります？",
          isCorrect: true,
          explanation: "相手の興味に寄り添い、おすすめを聞くことで会話が自然に広がります。"
        },
        {
          id: "b",
          text: "推しとかいます？",
          isCorrect: false,
          explanation: "唐突すぎて、映画の話からずれてしまいます。"
        },
        {
          id: "c",
          text: "ディズニー好きですよね？",
          isCorrect: false,
          explanation: "決めつけの発言で、相手の好みを勝手に推測しています。"
        },
        {
          id: "d",
          text: "恋愛ものって観る派ですか？",
          isCorrect: false,
          explanation: "少し踏み込みすぎで、初対面では重い質問かもしれません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_004.mp3",
      shadowingText: "映画とか観ます？最近おすすめあります？",
      tip: "相手の興味に合わせて、おすすめを聞くことで自然な会話が生まれます。",
      createdAt: "2025-01-21", 
      updatedAt: "2025-01-21"
    },
    {
      id: "elicit_005",
      category: "elicit",
      level: "beginner",
      tags: ["食事", "グルメ", "共通点"],
      situation: "食べ物の話題から会話を展開する場面",
      womanText: "食べるの大好きなんです。最近ちょっと食べすぎてて…",
      choices: [
        {
          id: "a",
          text: "好きな食べ物って何ですか？外食とか行きます？",
          isCorrect: true,
          explanation: "相手の好みを聞きつつ、外食という共通の話題に展開する良い質問です。"
        },
        {
          id: "b",
          text: "料理できない派ですか？",
          isCorrect: false,
          explanation: "少し失礼で、相手を否定的に決めつける印象を与えます。"
        },
        {
          id: "c",
          text: "一人でラーメン行けます？",
          isCorrect: false,
          explanation: "唐突で、相手の話している内容とずれています。"
        },
        {
          id: "d",
          text: "ファミレスとか好きですか？",
          isCorrect: false,
          explanation: "相手の好みを聞かずに決めつけた質問をしています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_005.mp3",
      shadowingText: "好きな食べ物って何ですか？外食とか行きます？",
      tip: "相手の好みを聞いてから、関連する話題に展開しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_004", 
      category: "deepen",
      level: "intermediate",
      tags: ["緊張", "感情", "共感"],
      situation: "相手の緊張に共感を示す場面",
      womanText: "こういう場って、ちょっと緊張しますよね…",
      choices: [
        {
          id: "a",
          text: "初対面の人と話すとき、緊張するタイプですか？",
          isCorrect: true,
          explanation: "相手の感情に寄り添い、性格について自然に聞くことができる優れた質問です。"
        },
        {
          id: "b",
          text: "こういう場って面倒くさいですよね？",
          isCorrect: false,
          explanation: "ネガティブすぎて、場の雰囲気を悪くしてしまいます。"
        },
        {
          id: "c",
          text: "俺、全然緊張しないんですけど大丈夫ですか？",
          isCorrect: false,
          explanation: "自慢めいた発言で、相手の不安に寄り添えていません。"
        },
        {
          id: "d",
          text: "一人参加って寂しくないですか？",
          isCorrect: false,
          explanation: "相手の状況を否定的に捉え、さらに不安にさせてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_004.mp3",
      shadowingText: "初対面の人と話すとき、緊張するタイプですか？",
      tip: "相手の感情に共感を示しながら、性格について聞いてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_005",
      category: "deepen", 
      level: "intermediate",
      tags: ["仕事", "やりがい", "価値観"],
      situation: "仕事の話から価値観を探る場面",
      womanText: "仕事、最近忙しくて…でもやりがいはあるかな。",
      choices: [
        {
          id: "a",
          text: "お仕事ってどんなことされてるんですか？忙しいですか？",
          isCorrect: true,
          explanation: "相手の仕事に興味を示し、状況も気遣う思いやりのある質問です。"
        },
        {
          id: "b",
          text: "年収ってどれくらいですか？",
          isCorrect: false,
          explanation: "プライベートすぎる質問で、相手を不快にさせる可能性があります。"
        },
        {
          id: "c",
          text: "転職考えてます？",
          isCorrect: false,
          explanation: "やりがいがあると言っているのに転職を勧めるのは失礼です。"
        },
        {
          id: "d",
          text: "事務職とかラクそうですよね？",
          isCorrect: false,
          explanation: "決めつけと偏見に満ちた発言で、相手の仕事を軽視しています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_005.mp3",
      shadowingText: "お仕事ってどんなことされてるんですか？忙しいですか？",
      tip: "仕事について聞くときは、興味と気遣いの両方を示しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_006",
      category: "deepen",
      level: "advanced",
      tags: ["仕事", "やりがい", "深掘り"],
      situation: "仕事の楽しさについて深掘りする場面", 
      womanText: "仕事って、大変なこともあるけど楽しさもあります。",
      choices: [
        {
          id: "a",
          text: "今の仕事、どんなところが楽しいですか？",
          isCorrect: true,
          explanation: "ポジティブな面に焦点を当てて、相手の価値観を深く理解できる素晴らしい質問です。"
        },
        {
          id: "b",
          text: "辞めたいって思うときありますよね？",
          isCorrect: false,
          explanation: "楽しさがあると言っているのに、ネガティブな方向に持っていくのは不適切です。"
        },
        {
          id: "c",
          text: "仕事ってつまらなくないですか？",
          isCorrect: false,
          explanation: "相手のポジティブな発言を完全に否定する失礼な発言です。"
        },
        {
          id: "d",
          text: "上司ムカつきません？",
          isCorrect: false,
          explanation: "愚痴の方向に誘導してしまい、建設的な会話になりません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_006.mp3",
      shadowingText: "今の仕事、どんなところが楽しいですか？",
      tip: "相手のポジティブな面を引き出すことで、価値観を深く理解できます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "elicit_006",
      category: "elicit",
      level: "intermediate",
      tags: ["共感", "場慣れ", "緊張"],
      situation: "場の雰囲気について共感を示す場面",
      womanText: "実はこういう会、ちょっと慣れてなくて…", 
      choices: [
        {
          id: "a",
          text: "実はこういう場、ちょっと慣れてなくて…〇〇さんはどうですか？",
          isCorrect: true,
          explanation: "相手の言葉を受けて自分も同じ気持ちだと共感を示し、相手の状況も聞く理想的な返答です。"
        },
        {
          id: "b",
          text: "緊張してるんですけど伝わってますか？",
          isCorrect: false,
          explanation: "自分のことだけに焦点を当てて、相手への関心を示せていません。"
        },
        {
          id: "c",
          text: "こういうの、正直めんどいですよね？",
          isCorrect: false,
          explanation: "非常にネガティブで、場の雰囲気を悪くしてしまいます。"
        },
        {
          id: "d",
          text: "どうせ今日もダメな気がしてて…",
          isCorrect: false,
          explanation: "自己否定的すぎて、相手も不安にさせてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/elicit_006.mp3",
      shadowingText: "実はこういう場、ちょっと慣れてなくて…〇〇さんはどうですか？",
      tip: "共感を示しながら、相手の状況も気にかけることで親近感が生まれます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_007",
      category: "deepen",
      level: "intermediate", 
      tags: ["友達", "人間関係", "価値観"],
      situation: "友達関係について深掘りする場面",
      womanText: "友達といる時間がすごく好きなんですよね。",
      choices: [
        {
          id: "a",
          text: "周りの友達ってどんな人が多いですか？",
          isCorrect: true,
          explanation: "相手の人間関係の傾向を知ることで、価値観や人柄を理解できる良い質問です。"
        },
        {
          id: "b",
          text: "友達少ないですか？",
          isCorrect: false,
          explanation: "ネガティブな決めつけで、相手を不快にさせる可能性があります。"
        },
        {
          id: "c",
          text: "友達関係って続く方ですか？",
          isCorrect: false,
          explanation: "少し詰問調で、相手の人間関係を疑うような印象を与えます。"
        },
        {
          id: "d",
          text: "親友とかいないんですか？",
          isCorrect: false,
          explanation: "否定的な決めつけで、相手の人間関係を軽視している印象です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_007.mp3",
      shadowingText: "周りの友達ってどんな人が多いですか？",
      tip: "友達の特徴を聞くことで、相手の価値観や人柄を知ることができます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_008",
      category: "deepen",
      level: "advanced", 
      tags: ["リラックス", "価値観", "ライフスタイル"],
      situation: "リラックス方法について深掘りする場面",
      womanText: "最近は、自分なりのリラックス法を見つけようとしてて…",
      choices: [
        {
          id: "a",
          text: "〇〇さんって、どんなときにリラックスできますか？",
          isCorrect: true,
          explanation: "相手の価値観やライフスタイルを深く理解できる優れた質問です。"
        },
        {
          id: "b",
          text: "ストレス発散どうしてます？",
          isCorrect: false,
          explanation: "ストレスという言葉でネガティブな方向に向かってしまいます。"
        },
        {
          id: "c",
          text: "お酒強いですか？",
          isCorrect: false,
          explanation: "唐突で、相手のリラックス法を勝手に決めつけています。"
        },
        {
          id: "d",
          text: "カラオケとか行くんですか？",
          isCorrect: false,
          explanation: "特定の活動を決めつけて聞くのは適切ではありません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_008.mp3",
      shadowingText: "〇〇さんって、どんなときにリラックスできますか？",
      tip: "相手の価値観を知るには、感情や心の状態について聞くのが効果的です。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_009",
      category: "deepen",
      level: "advanced",
      tags: ["褒める", "印象", "コミュニケーション"],
      situation: "会話の最後に良い印象を伝える場面",
      womanText: "今日、ちゃんと話せるか不安だったけど、思ったよりリラックスできてるかも。",
      choices: [
        {
          id: "a",
          text: "話してて思ったんですけど、〇〇なところ素敵ですね",
          isCorrect: true,
          explanation: "具体的な褒め言葉で相手の良いところを認める、非常に効果的なコミュニケーションです。"
        },
        {
          id: "b", 
          text: "写真と違って印象良いですね",
          isCorrect: false,
          explanation: "写真と比較するのは失礼で、相手を不快にさせる可能性があります。"
        },
        {
          id: "c",
          text: "思ったより話しやすいっすね",
          isCorrect: false,
          explanation: "「思ったより」という表現が失礼で、上から目線の印象を与えます。"
        },
        {
          id: "d",
          text: "今日の服、攻めてますね",
          isCorrect: false,
          explanation: "「攻めてる」という表現は曖昧で、褒め言葉として適切ではありません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/deepen_009.mp3",
      shadowingText: "話してて思ったんですけど、〇〇なところ素敵ですね",
      tip: "具体的で真心のこもった褒め言葉は、相手に良い印象を残します。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },

    // === 追加のクイズデータ（conversation_quiz_dialogue_style_full.jsonから） ===
    // 基本的な会話の練習問題（重複を避けて新規追加分のみ）

    // === リスニング・共感練習（listening_quiz_dialogue_style_full.jsonから） ===
    {
      id: "listen_001",
      category: "deepen",
      level: "intermediate",
      tags: ["感情", "共感", "ドラマ"],
      situation: "相手の感情的な体験を聞く場面",
      womanText: "最近、ドラマ観て泣いちゃいました",
      choices: [
        {
          id: "a",
          text: "えっ、そんな感動する内容だったんですか？",
          isCorrect: true,
          explanation: "相手の感情に興味を示し、体験の詳細を聞くことで共感を深められます。"
        },
        {
          id: "b",
          text: "泣くなんて子どもみたいですね",
          isCorrect: false,
          explanation: "相手の感情を否定し、人格を貶める非常に失礼な発言です。"
        },
        {
          id: "c",
          text: "どのドラマですか？僕は観てないですけど",
          isCorrect: false,
          explanation: "興味はありますが、最初から「観てない」と言うことで会話を断ち切ってしまいます。"
        },
        {
          id: "d",
          text: "最近のドラマって安っぽくないですか？",
          isCorrect: false,
          explanation: "相手が好きなものを批判し、感情体験を否定する発言です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_001.mp3",
      shadowingText: "えっ、そんな感動する内容だったんですか？",
      tip: "相手の感情体験に興味を示すことで、深いコミュニケーションが生まれます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_002",
      category: "deepen",
      level: "advanced",
      tags: ["悩み", "共感", "仕事"],
      situation: "相手の悩みを聞く場面",
      womanText: "最近、仕事でちょっと落ち込んでて…",
      choices: [
        {
          id: "a",
          text: "どんなことで落ち込んだんですか？",
          isCorrect: true,
          explanation: "相手の気持ちに寄り添い、具体的な状況を聞くことで適切なサポートができます。"
        },
        {
          id: "b",
          text: "みんな大変ですよね",
          isCorrect: false,
          explanation: "一般論で済ませてしまい、相手の個別の悩みを軽視してしまいます。"
        },
        {
          id: "c",
          text: "気にしすぎじゃないですか？",
          isCorrect: false,
          explanation: "相手の感情を否定し、問題を軽視する失礼な発言です。"
        },
        {
          id: "d",
          text: "転職考えてるんですか？",
          isCorrect: false,
          explanation: "いきなり極端な解決策を提示し、相手の気持ちを聞かずに決めつけています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_002.mp3",
      shadowingText: "どんなことで落ち込んだんですか？",
      tip: "相手の悩みを聞くときは、まず状況を理解することから始めましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_003",
      category: "elicit",
      level: "intermediate",
      tags: ["音楽", "学生時代", "趣味"],
      situation: "相手の過去の趣味について聞く場面",
      womanText: "学生時代、軽音部だったんです",
      choices: [
        {
          id: "a",
          text: "かっこいいですね！何のパートだったんですか？",
          isCorrect: true,
          explanation: "相手の活動を褒めつつ、具体的で答えやすい質問をしています。"
        },
        {
          id: "b",
          text: "軽音って、暇そうじゃないですか？",
          isCorrect: false,
          explanation: "相手の活動を軽視し、偏見に満ちた失礼な発言です。"
        },
        {
          id: "c",
          text: "文化部だったんですね",
          isCorrect: false,
          explanation: "事実の確認に留まり、会話を広げる努力が見られません。"
        },
        {
          id: "d",
          text: "何か大会とか出てたんですか？",
          isCorrect: false,
          explanation: "悪くない質問ですが、まずは相手の役割や楽しさを聞く方が自然です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_003.mp3",
      shadowingText: "かっこいいですね！何のパートだったんですか？",
      tip: "相手の活動を褒めてから具体的な質問をすると、話しやすい雰囲気が作れます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_004",
      category: "deepen",
      level: "intermediate",
      tags: ["旅行", "価値観", "一人旅"],
      situation: "一人旅の価値観について深掘りする場面",
      womanText: "旅行好きで、よく一人旅してました",
      choices: [
        {
          id: "a",
          text: "一人旅って自由でいいですよね。どこが一番印象的でした？",
          isCorrect: true,
          explanation: "一人旅の良さを理解し、印象的な体験を聞くことで価値観を共有できます。"
        },
        {
          id: "b",
          text: "一人って寂しくないんですか？",
          isCorrect: false,
          explanation: "一人旅を否定的に捉え、相手の価値観を理解しようとしていません。"
        },
        {
          id: "c",
          text: "自分は団体派ですけど",
          isCorrect: false,
          explanation: "自分の価値観を主張し、相手について知ろうとする姿勢がありません。"
        },
        {
          id: "d",
          text: "女の子の一人旅って危なくないですか？",
          isCorrect: false,
          explanation: "心配の気持ちは良いですが、相手の自立性を疑う発言になってしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_004.mp3",
      shadowingText: "一人旅って自由でいいですよね。どこが一番印象的でした？",
      tip: "相手の価値観を理解してから、具体的な体験を聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_005",
      category: "elicit",
      level: "beginner",
      tags: ["カメラ", "趣味", "創作"],
      situation: "相手の新しい趣味について聞く場面",
      womanText: "最近カメラにハマってて",
      choices: [
        {
          id: "a",
          text: "どんなものを撮るのが好きなんですか？",
          isCorrect: true,
          explanation: "相手の興味の方向性を聞き、趣味の楽しさを共有しようとしています。"
        },
        {
          id: "b",
          text: "カメラって高いですよね？",
          isCorrect: false,
          explanation: "金銭的な話に焦点を当て、相手の趣味の楽しさを聞こうとしていません。"
        },
        {
          id: "c",
          text: "インスタとかに上げる系ですか？",
          isCorrect: false,
          explanation: "決めつけの質問で、相手の本当の動機を聞けていません。"
        },
        {
          id: "d",
          text: "自分はスマホで十分です",
          isCorrect: false,
          explanation: "相手の趣味を軽視し、自分の価値観を押し付けています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_005.mp3",
      shadowingText: "どんなものを撮るのが好きなんですか？",
      tip: "新しい趣味について聞くときは、楽しさや興味の方向性を聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_006",
      category: "deepen",
      level: "intermediate",
      tags: ["料理", "ストレス発散", "リラックス"],
      situation: "ストレス発散方法について深掘りする場面",
      womanText: "料理するのがちょっとストレス発散です",
      choices: [
        {
          id: "a",
          text: "いいですね！どんな料理を作るとリフレッシュになりますか？",
          isCorrect: true,
          explanation: "相手のストレス発散方法を理解し、具体的な楽しさを聞いています。"
        },
        {
          id: "b",
          text: "料理って疲れませんか？",
          isCorrect: false,
          explanation: "相手の価値観を理解せず、否定的な印象を与えてしまいます。"
        },
        {
          id: "c",
          text: "ストレスってそんなにあります？",
          isCorrect: false,
          explanation: "相手の状況を軽視し、ストレス発散方法に興味を示していません。"
        },
        {
          id: "d",
          text: "毎日やってるんですか？",
          isCorrect: false,
          explanation: "頻度の確認に留まり、楽しさや意味を聞けていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_006.mp3",
      shadowingText: "いいですね！どんな料理を作るとリフレッシュになりますか？",
      tip: "相手のストレス発散方法を理解し、その楽しさを共有しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_007",
      category: "deepen",
      level: "intermediate",
      tags: ["音楽", "ピアノ", "過去の経験"],
      situation: "過去の習い事について深掘りする場面",
      womanText: "昔ピアノやってたんです",
      choices: [
        {
          id: "a",
          text: "何年くらいやってたんですか？今でも弾いたりします？",
          isCorrect: true,
          explanation: "期間と現在の状況を聞くことで、ピアノとの関わりを理解できます。"
        },
        {
          id: "b",
          text: "ピアノって指つりません？",
          isCorrect: false,
          explanation: "ネガティブな面にフォーカスし、相手の経験の価値を理解していません。"
        },
        {
          id: "c",
          text: "音楽系って頭良い人多いですよね",
          isCorrect: false,
          explanation: "一般論で済ませ、相手の個人的な体験を聞こうとしていません。"
        },
        {
          id: "d",
          text: "へー、自分は音楽センスゼロです",
          isCorrect: false,
          explanation: "自己否定で会話を終わらせ、相手の経験に興味を示していません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_007.mp3",
      shadowingText: "何年くらいやってたんですか？今でも弾いたりします？",
      tip: "過去の経験について聞くときは、期間と現在の関わりを聞くと良いでしょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_008",
      category: "deepen",
      level: "advanced",
      tags: ["読書", "きっかけ", "成長"],
      situation: "新しい習慣のきっかけを聞く場面",
      womanText: "実は、最近読書を再開してて",
      choices: [
        {
          id: "a",
          text: "何かきっかけがあったんですか？",
          isCorrect: true,
          explanation: "行動の背景にある動機を聞くことで、相手の価値観や変化を理解できます。"
        },
        {
          id: "b",
          text: "やっぱ活字のほうが安心しますよね",
          isCorrect: false,
          explanation: "決めつけの発言で、相手の個別の動機を聞けていません。"
        },
        {
          id: "c",
          text: "読書って自己満って感じします",
          isCorrect: false,
          explanation: "読書を否定的に捉え、相手の新しい習慣を軽視しています。"
        },
        {
          id: "d",
          text: "本って眠くなりません？",
          isCorrect: false,
          explanation: "ネガティブな印象を与え、相手の新しい取り組みを理解しようとしていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_008.mp3",
      shadowingText: "何かきっかけがあったんですか？",
      tip: "新しい習慣や変化について聞くときは、そのきっかけを聞くと深い理解が得られます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_009",
      category: "elicit",
      level: "beginner",
      tags: ["動物", "癒し", "好み"],
      situation: "相手の好きなものについて聞く場面",
      womanText: "動物園とか水族館がすごく好きです",
      choices: [
        {
          id: "a",
          text: "癒されますよね。どんな動物がお好きなんですか？",
          isCorrect: true,
          explanation: "共感を示してから具体的な好みを聞き、会話を自然に広げています。"
        },
        {
          id: "b",
          text: "子ども向けって感じですよね",
          isCorrect: false,
          explanation: "相手の趣味を幼稚だと決めつけ、非常に失礼な発言です。"
        },
        {
          id: "c",
          text: "パンダとかって飽きません？",
          isCorrect: false,
          explanation: "相手の興味を否定し、楽しさを理解しようとしていません。"
        },
        {
          id: "d",
          text: "正直、動物見るより食べる方が好きです",
          isCorrect: false,
          explanation: "相手の価値観を完全に否定し、不適切な発言です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_009.mp3",
      shadowingText: "癒されますよね。どんな動物がお好きなんですか？",
      tip: "相手の好きなものについて聞くときは、まず共感を示してから具体的に聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_010",
      category: "deepen",
      level: "intermediate",
      tags: ["学校", "思い出", "役割"],
      situation: "楽しい思い出について深掘りする場面",
      womanText: "高校の文化祭がすごく楽しかった記憶あります",
      choices: [
        {
          id: "a",
          text: "どんな役割やってたんですか？",
          isCorrect: true,
          explanation: "楽しかった理由を具体的に聞き、その時の体験を理解しようとしています。"
        },
        {
          id: "b",
          text: "文化祭ってめんどくさいですよね",
          isCorrect: false,
          explanation: "相手の楽しい思い出を否定し、非常に失礼な発言です。"
        },
        {
          id: "c",
          text: "そういうの全然記憶にないです",
          isCorrect: false,
          explanation: "自分の経験に焦点を当て、相手の思い出に興味を示していません。"
        },
        {
          id: "d",
          text: "模擬店とかで食べてばかりじゃなかった？",
          isCorrect: false,
          explanation: "決めつけの質問で、相手の個別の体験を聞こうとしていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_010.mp3",
      shadowingText: "どんな役割やってたんですか？",
      tip: "楽しい思い出について聞くときは、具体的な役割や体験を聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_011",
      category: "elicit",
      level: "intermediate",
      tags: ["朝", "ルーティン", "生活習慣"],
      situation: "生活習慣について聞く場面",
      womanText: "朝が弱くて…",
      choices: [
        {
          id: "a",
          text: "何か朝にルーティンとかあります？",
          isCorrect: true,
          explanation: "相手の工夫や対策を聞くことで、建設的な会話に発展させています。"
        },
        {
          id: "b",
          text: "自分は朝型なんで…",
          isCorrect: false,
          explanation: "自分の話にすり替え、相手への関心を示していません。"
        },
        {
          id: "c",
          text: "朝は気合いで起きるもんでしょ",
          isCorrect: false,
          explanation: "説教調で相手を責め、理解しようとする姿勢がありません。"
        },
        {
          id: "d",
          text: "寝坊常習犯ですか？",
          isCorrect: false,
          explanation: "相手をからかうような発言で、不快感を与える可能性があります。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_011.mp3",
      shadowingText: "何か朝にルーティンとかあります？",
      tip: "相手の苦手なことについて聞くときは、工夫や対策を聞いてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_012",
      category: "elicit",
      level: "intermediate",
      tags: ["マイルール", "こだわり", "性格"],
      situation: "相手の性格について聞く場面",
      womanText: "マイルールが多い方かも…",
      choices: [
        {
          id: "a",
          text: "どんなマイルールがあるんですか？",
          isCorrect: true,
          explanation: "相手の個性に興味を示し、具体的に聞くことで理解を深められます。"
        },
        {
          id: "b",
          text: "こだわり強いんですね…（苦笑）",
          isCorrect: false,
          explanation: "相手の性格を否定的に捉え、不快感を与える反応です。"
        },
        {
          id: "c",
          text: "自分は自由人なんで無理です",
          isCorrect: false,
          explanation: "相手の性格を否定し、理解しようとする姿勢がありません。"
        },
        {
          id: "d",
          text: "神経質ってことですか？",
          isCorrect: false,
          explanation: "ネガティブなレッテルを貼り、相手を不快にさせる発言です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_012.mp3",
      shadowingText: "どんなマイルールがあるんですか？",
      tip: "相手の個性について聞くときは、興味深く具体的に聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_013",
      category: "deepen",
      level: "advanced",
      tags: ["性格", "継続", "強み"],
      situation: "相手の弱点から強みを探る場面",
      womanText: "昔からわりと飽きっぽい性格で",
      choices: [
        {
          id: "a",
          text: "何が続いたことありますか？逆に",
          isCorrect: true,
          explanation: "弱点を受け入れつつ、強みを見つける素晴らしい質問の転換です。"
        },
        {
          id: "b",
          text: "それって短所ですよね",
          isCorrect: false,
          explanation: "相手の自己開示を否定的に受け取り、自信を失わせる発言です。"
        },
        {
          id: "c",
          text: "自分は何でも続けられる方です",
          isCorrect: false,
          explanation: "自慢話になってしまい、相手を劣等感に陥れる可能性があります。"
        },
        {
          id: "d",
          text: "それって集中力ないってこと？",
          isCorrect: false,
          explanation: "相手を分析し、ネガティブな印象を与える失礼な発言です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_013.mp3",
      shadowingText: "何が続いたことありますか？逆に",
      tip: "相手の弱点を聞いたときは、逆に強みを見つける質問をしてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_014",
      category: "deepen",
      level: "advanced",
      tags: ["本音", "コミュニケーション", "深層心理"],
      situation: "相手の深層心理について聞く場面",
      womanText: "本音ってなかなか言えないタイプで…",
      choices: [
        {
          id: "a",
          text: "どんなときに本音が言えたって思ったことあります？",
          isCorrect: true,
          explanation: "相手の心を開く瞬間を聞くことで、深いコミュニケーションの手がかりを得られます。"
        },
        {
          id: "b",
          text: "言わないと伝わらないですよ",
          isCorrect: false,
          explanation: "説教調で相手の気持ちを理解せず、プレッシャーを与えてしまいます。"
        },
        {
          id: "c",
          text: "それ、損するタイプですよね",
          isCorrect: false,
          explanation: "相手の性格を否定的に評価し、不快感を与える発言です。"
        },
        {
          id: "d",
          text: "本音言わない人、苦手です",
          isCorrect: false,
          explanation: "相手の人格を否定する非常に失礼で傷つける発言です。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_014.mp3",
      shadowingText: "どんなときに本音が言えたって思ったことあります？",
      tip: "相手の深層心理について聞くときは、心が開かれる瞬間を聞いてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "listen_015",
      category: "deepen",
      level: "advanced",
      tags: ["感謝", "印象", "会話の締め"],
      situation: "会話の最後に相手の感想を聞く場面",
      womanText: "今日は話せてよかったです",
      choices: [
        {
          id: "a",
          text: "こちらこそ嬉しいです。何か印象に残ったこととかありますか？",
          isCorrect: true,
          explanation: "感謝を返しつつ、相手の印象を聞くことで会話を有意義に締めくくれます。"
        },
        {
          id: "b",
          text: "まさかそんなふうに言われるとは",
          isCorrect: false,
          explanation: "驚きすぎて、相手の好意的な感想を素直に受け取れていません。"
        },
        {
          id: "c",
          text: "え、本当ですか？",
          isCorrect: false,
          explanation: "相手の感想を疑ってしまい、せっかくの好印象を台無しにしてしまいます。"
        },
        {
          id: "d",
          text: "じゃあ次も確定ですね（笑）",
          isCorrect: false,
          explanation: "軽薄な印象を与え、相手にプレッシャーをかけてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/listen_015.mp3",
      shadowingText: "こちらこそ嬉しいです。何か印象に残ったこととかありますか？",
      tip: "相手からの好意的な感想は素直に受け取り、さらに深く聞いてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },

    // === 上級練習（advanced_quiz_dialogue_style_full.jsonから） ===
    {
      id: "advanced_001",
      category: "deepen",
      level: "advanced",
      tags: ["悩み", "職場", "サポート"],
      situation: "相手が職場の悩みを打ち明けかけた場面",
      womanText: "最近、職場で少し嫌なことがあって...（表情が少し曇る）",
      choices: [
        {
          id: "a",
          text: "お疲れ様です。でも今日は楽しい時間にしましょう！",
          isCorrect: false,
          explanation: "相手の気持ちを軽視し、話を聞かずに切り替えようとしています。"
        },
        {
          id: "b",
          text: "大変でしたね。もしよろしければ、お話聞かせてもらえますか？無理にとは言いませんが。",
          isCorrect: true,
          explanation: "相手の気持ちを尊重しながら、話を聞く準備があることを伝える理想的な対応です。"
        },
        {
          id: "c",
          text: "仕事の愚痴は聞きたくないですね。",
          isCorrect: false,
          explanation: "相手の感情を完全に拒絶する非常に冷たい対応です。"
        },
        {
          id: "d",
          text: "そんな時は美味しいものを食べて忘れましょう！",
          isCorrect: false,
          explanation: "相手の悩みを軽視し、表面的な解決で済ませようとしています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_001.mp3",
      shadowingText: "大変でしたね。もしよろしければ、お話聞かせてもらえますか？無理にとは言いませんが。",
      tip: "相手が悩みを打ち明けそうな時は、強制せずに話を聞く準備があることを伝えましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_002",
      category: "deepen",
      level: "advanced",
      tags: ["過去", "恋愛", "価値観"],
      situation: "相手が過去の恋愛について話し始めた場面",
      womanText: "実は私、過去に一度結婚を考えた人がいたんですが、価値観の違いで別れてしまって...",
      choices: [
        {
          id: "a",
          text: "僕も似たような経験があります。辛かったでしょうね。その経験から、美咲さんはパートナーに何を一番大切にしてほしいと思うようになりましたか？",
          isCorrect: true,
          explanation: "共感を示しつつ、その経験から学んだ価値観を聞く素晴らしい質問です。"
        },
        {
          id: "b",
          text: "僕は恋愛経験が少ないので、そういう深い関係になったことがないんです。",
          isCorrect: false,
          explanation: "自分の話にすり替えてしまい、相手の経験に寄り添えていません。"
        },
        {
          id: "c",
          text: "そういう話は重いので、もう少し明るい話をしませんか？",
          isCorrect: false,
          explanation: "相手の重要な自己開示を拒絶してしまっています。"
        },
        {
          id: "d",
          text: "価値観の違いって具体的にどんなことだったんですか？",
          isCorrect: false,
          explanation: "過去の痛みを詳しく聞きすぎて、相手を不快にさせる可能性があります。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_002.mp3",
      shadowingText: "僕も似たような経験があります。辛かったでしょうね。その経験から、美咲さんはパートナーに何を一番大切にしてほしいと思うようになりましたか？",
      tip: "過去の恋愛経験を聞く時は、その経験から学んだ価値観に焦点を当てましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_003",
      category: "deepen",
      level: "advanced",
      tags: ["家族", "価値観", "深掘り"],
      situation: "家族の価値観について深く聞く場面",
      womanText: "家族って大切ですよね。",
      choices: [
        {
          id: "a",
          text: "将来は何人くらい子供が欲しいですか？",
          isCorrect: false,
          explanation: "いきなり具体的すぎる質問で、相手にプレッシャーを与えてしまいます。"
        },
        {
          id: "b",
          text: "ご家族とはよく連絡を取り合われるんですか？美咲さんにとって『家族が大切』というのは、どんな時に特に感じますか？",
          isCorrect: true,
          explanation: "現在の家族関係と価値観の具体的な内容を聞く、バランスの取れた質問です。"
        },
        {
          id: "c",
          text: "家族との時間と仕事、どちらを優先しますか？",
          isCorrect: false,
          explanation: "二者択一の質問で、相手を困らせてしまう可能性があります。"
        },
        {
          id: "d",
          text: "僕も家族は大切だと思います。",
          isCorrect: false,
          explanation: "同意だけで終わってしまい、会話が深まりません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_003.mp3",
      shadowingText: "ご家族とはよく連絡を取り合われるんですか？美咲さんにとって『家族が大切』というのは、どんな時に特に感じますか？",
      tip: "抽象的な価値観について聞く時は、具体的な状況や感情と結びつけて聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_004",
      category: "deepen",
      level: "advanced",
      tags: ["不安", "結婚", "サポート"],
      situation: "結婚への不安を打ち明けられた場面",
      womanText: "正直に言うと、結婚に対して少し不安もあるんです。仕事を続けられるかとか...",
      choices: [
        {
          id: "a",
          text: "大丈夫ですよ。僕が支えますから。",
          isCorrect: false,
          explanation: "安易な約束で、相手の不安を真剣に聞いていません。"
        },
        {
          id: "b",
          text: "そういう不安を持つのは自然なことだと思います。どんな不安が一番大きいか、よろしければ教えてもらえますか？一緒に考えられることがあるかもしれません。",
          isCorrect: true,
          explanation: "不安を受け入れ、具体的に聞いて、一緒に考える姿勢を示す理想的な対応です。"
        },
        {
          id: "c",
          text: "女性はみんなそう思うものですよ。",
          isCorrect: false,
          explanation: "相手の感情を一般論で片付け、個別性を無視しています。"
        },
        {
          id: "d",
          text: "不安になる必要はないと思います。なんとかなりますよ。",
          isCorrect: false,
          explanation: "相手の不安を軽視し、真剣に向き合っていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_004.mp3",
      shadowingText: "そういう不安を持つのは自然なことだと思います。どんな不安が一番大きいか、よろしければ教えてもらえますか？一緒に考えられることがあるかもしれません。",
      tip: "相手の不安に対しては、まず受け入れて、具体的に聞いて、一緒に考える姿勢を示しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_005",
      category: "deepen",
      level: "advanced",
      tags: ["感性", "関係性", "深い質問"],
      situation: "美術館で感性について深く聞く場面",
      womanText: "この絵を見ていると、なんだか心が落ち着きます。",
      choices: [
        {
          id: "a",
          text: "僕はよく分からないんですが、美咲さんが好きなら素敵な絵なんでしょうね。",
          isCorrect: false,
          explanation: "自分の無理解を表明し、相手の感性を軽視してしまっています。"
        },
        {
          id: "b",
          text: "美咲さんって感受性が豊かですね。普段はどんな時に心が落ち着くと感じますか？僕と一緒にいる時はどうですか？",
          isCorrect: true,
          explanation: "相手の感性を褒め、日常と関係性について自然に聞く高度な質問です。"
        },
        {
          id: "c",
          text: "そうですね。次は違う展示も見に行きましょう。",
          isCorrect: false,
          explanation: "相手の感情に共感せず、話題を変えてしまっています。"
        },
        {
          id: "d",
          text: "美術館って静かでいいですよね。",
          isCorrect: false,
          explanation: "一般論で済ませ、相手の個人的な感情に寄り添えていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_005.mp3",
      shadowingText: "美咲さんって感受性が豊かですね。普段はどんな時に心が落ち着くと感じますか？僕と一緒にいる時はどうですか？",
      tip: "相手の感性を褒めつつ、自分との関係性についても自然に聞いてみましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_006",
      category: "deepen",
      level: "advanced",
      tags: ["婚活", "疲れ", "共感"],
      situation: "婚活の疲れを共有された場面",
      womanText: "婚活って、なかなか大変ですよね...（少し疲れた様子）",
      choices: [
        {
          id: "a",
          text: "僕も大変だと思います。お互い頑張りましょう。",
          isCorrect: false,
          explanation: "一般的な共感で終わってしまい、相手の具体的な状況を聞けていません。"
        },
        {
          id: "b",
          text: "そうですね。美咲さんは婚活を始めてどのくらいになるんですか？正直、今までで一番大変だったことってありますか？",
          isCorrect: true,
          explanation: "共感を示しつつ、相手の具体的な経験を聞くことで理解を深められます。"
        },
        {
          id: "c",
          text: "でも僕たちは出会えましたから、良かったじゃないですか。",
          isCorrect: false,
          explanation: "相手の疲れを軽視し、自分との関係を押し付けています。"
        },
        {
          id: "d",
          text: "大変なのは分かりますが、前向きに行きましょう。",
          isCorrect: false,
          explanation: "相手の疲れを受け止めず、励ましで済ませようとしています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_006.mp3",
      shadowingText: "そうですね。美咲さんは婚活を始めてどのくらいになるんですか？正直、今までで一番大変だったことってありますか？",
      tip: "婚活の疲れを共有された時は、具体的な経験を聞いて理解を深めましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_007",
      category: "deepen",
      level: "advanced",
      tags: ["謝罪", "信頼", "関係性"],
      situation: "相手が重い話をしたことを謝った場面",
      womanText: "すみません、重い話をしてしまって...（申し訳なさそうな表情）",
      choices: [
        {
          id: "a",
          text: "そうですね。もう少し明るい話をしましょう。",
          isCorrect: false,
          explanation: "相手の謝罪を肯定してしまい、今後の自己開示を妨げる可能性があります。"
        },
        {
          id: "b",
          text: "とんでもないです。美咲さんが大切なことを話してくださって、僕はとても嬉しいです。信頼してもらえているように感じて。でも、もう少し軽い話でリラックスしませんか？",
          isCorrect: true,
          explanation: "自己開示を肯定し、信頼関係を確認しつつ、相手の気遣いにも配慮する完璧な対応です。"
        },
        {
          id: "c",
          text: "気にしないでください。そういう話も必要ですから。",
          isCorrect: false,
          explanation: "形式的な返答で、相手の気持ちに深く寄り添えていません。"
        },
        {
          id: "d",
          text: "大丈夫ですよ。僕も重い話は好きなんです。",
          isCorrect: false,
          explanation: "少し変わった返答で、相手を困惑させる可能性があります。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_007.mp3",
      shadowingText: "とんでもないです。美咲さんが大切なことを話してくださって、僕はとても嬉しいです。信頼してもらえているように感じて。でも、もう少し軽い話でリラックスしませんか？",
      tip: "相手が重い話を謝った時は、信頼関係を確認しつつ、相手の気遣いにも配慮しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_008",
      category: "deepen",
      level: "advanced",
      tags: ["感謝", "気持ち", "関係発展"],
      situation: "デートへの感謝を伝えられた場面",
      womanText: "今日は素敵な場所に連れてきてくれて、ありがとうございます。",
      choices: [
        {
          id: "a",
          text: "気に入ってもらえて良かったです。美咲さんの笑顔が見れて、僕も嬉しいです。正直に言うと、美咲さんともっと色々な場所に行ってみたいなと思っています。",
          isCorrect: true,
          explanation: "感謝を受け止め、相手の反応を褒め、自分の気持ちも素直に伝える理想的な返答です。"
        },
        {
          id: "b",
          text: "どういたしまして。またこういう場所に来ましょう。",
          isCorrect: false,
          explanation: "形式的な返答で、感情の交流が生まれていません。"
        },
        {
          id: "c",
          text: "美咲さんに喜んでもらえるように頑張りました。",
          isCorrect: false,
          explanation: "努力をアピールしてしまい、少し重い印象を与えます。"
        },
        {
          id: "d",
          text: "僕も楽しかったです。今度はどこに行きたいですか？",
          isCorrect: false,
          explanation: "悪くない返答ですが、今の感情を十分に共有できていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_008.mp3",
      shadowingText: "気に入ってもらえて良かったです。美咲さんの笑顔が見れて、僕も嬉しいです。正直に言うと、美咲さんともっと色々な場所に行ってみたいなと思っています。",
      tip: "感謝された時は、相手の反応を褒めて、自分の素直な気持ちも伝えましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_009",
      category: "deepen",
      level: "advanced",
      tags: ["関係性", "将来", "価値観"],
      situation: "穏やかな時間から将来の話へ展開する場面",
      womanText: "こうして二人でいると、とても穏やかな気持ちになります。",
      choices: [
        {
          id: "a",
          text: "そろそろ結婚について真剣に考えませんか？",
          isCorrect: false,
          explanation: "感情の共有を飛ばして、いきなり結論に急ぎすぎています。"
        },
        {
          id: "b",
          text: "僕もです。美咲さんと一緒にいると、将来こんな風に穏やかに過ごせたらいいなって思います。美咲さんは理想の結婚生活ってどんなイメージですか？",
          isCorrect: true,
          explanation: "感情を共有し、自然に将来の話題へ展開し、相手の価値観を聞く完璧な流れです。"
        },
        {
          id: "c",
          text: "僕たち、結婚に向けて真剣に付き合いませんか？",
          isCorrect: false,
          explanation: "相手の気持ちを確認せずに、関係を急ぎすぎています。"
        },
        {
          id: "d",
          text: "穏やかでいいですね。結婚したらいつもこんな感じですかね？",
          isCorrect: false,
          explanation: "軽い調子で結婚を語り、真剣さが伝わりません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_009.mp3",
      shadowingText: "僕もです。美咲さんと一緒にいると、将来こんな風に穏やかに過ごせたらいいなって思います。美咲さんは理想の結婚生活ってどんなイメージですか？",
      tip: "穏やかな雰囲気から自然に将来の話へ展開し、相手の価値観を聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "advanced_010",
      category: "deepen",
      level: "advanced",
      tags: ["重要な話", "緊張", "安心感"],
      situation: "相手が重要な話を切り出そうとしている場面",
      womanText: "健太さんとお付き合いを続けていく上で、お話ししたいことがあるんですが...（少し緊張した様子）",
      choices: [
        {
          id: "a",
          text: "何でしょうか？聞きます。",
          isCorrect: false,
          explanation: "事務的すぎて、相手の緊張を和らげることができていません。"
        },
        {
          id: "b",
          text: "美咲さん、緊張しなくて大丈夫ですよ。僕たちはもうお互いのことをよく知り合った仲じゃないですか。どんなお話でも、美咲さんが大切に思っていることなら、僕も真剣に聞かせてもらいます。ゆっくりで構いませんよ。",
          isCorrect: true,
          explanation: "相手の緊張を和らげ、関係性を確認し、真剣に聞く姿勢と時間的余裕を与える完璧な対応です。"
        },
        {
          id: "c",
          text: "大丈夫です。何でも言ってください。",
          isCorrect: false,
          explanation: "簡潔すぎて、相手の緊張に十分配慮できていません。"
        },
        {
          id: "d",
          text: "緊張しているんですね。重要な話なんでしょうか？",
          isCorrect: false,
          explanation: "相手の状態を指摘するだけで、安心感を与えられていません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/advanced_010.mp3",
      shadowingText: "美咲さん、緊張しなくて大丈夫ですよ。僕たちはもうお互いのことをよく知り合った仲じゃないですか。どんなお話でも、美咲さんが大切に思っていることなら、僕も真剣に聞かせてもらいます。ゆっくりで構いませんよ。",
      tip: "相手が重要な話を切り出す時は、緊張を和らげ、真剣に聞く姿勢を示しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },

    // === 会話スキル練習（conversation_skill_quiz_dialogue_style_full.jsonから） ===
    {
      id: "skill_001",
      category: "elicit",
      level: "advanced",
      tags: ["挨拶", "初対面", "敬語", "プロフィール"],
      situation: "初対面の挨拶で相手のプロフィールを踏まえた返答をする場面",
      womanText: "はじめまして、佐藤美咲と申します。今日はよろしくお願いします。",
      choices: [
        {
          id: "a",
          text: "はじめまして。田中です。緊張しますね。",
          isCorrect: false,
          explanation: "緊張を表すより、相手への関心を示す方が良い第一印象を与えます。"
        },
        {
          id: "b",
          text: "はじめまして、田中健太です。今日はお時間をいただき、ありがとうございます。美咲さんは看護師さんでいらっしゃるんですね。",
          isCorrect: true,
          explanation: "丁寧な挨拶と感謝、そして相手のプロフィールに触れる完璧な自己紹介です。"
        },
        {
          id: "c",
          text: "よろしくお願いします。写真よりも実物の方がお綺麗ですね。",
          isCorrect: false,
          explanation: "外見に関するコメントは初対面では不適切で、相手を不快にさせる可能性があります。"
        },
        {
          id: "d",
          text: "はじめまして。今日はよろしくお願いします。何か飲み物を注文しませんか？",
          isCorrect: false,
          explanation: "実用的ですが、まず自己紹介と相手への関心を示すことが優先されます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_001.mp3",
      shadowingText: "はじめまして、田中健太です。今日はお時間をいただき、ありがとうございます。美咲さんは看護師さんでいらっしゃるんですね。",
      tip: "初対面では、丁寧な挨拶と相手のプロフィールへの言及で関心を示しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_002",
      category: "elicit",
      level: "intermediate",
      tags: ["趣味", "パン作り", "興味", "褒める"],
      situation: "相手の趣味に対して興味と尊敬を示す場面",
      womanText: "最近、パン作りにハマっているんです。休日によく作っています。",
      choices: [
        {
          id: "a",
          text: "へぇ、そうなんですね。",
          isCorrect: false,
          explanation: "関心が薄く、会話が続かない返答です。"
        },
        {
          id: "b",
          text: "パン作りですか。難しそうですね。",
          isCorrect: false,
          explanation: "ネガティブな印象で、相手の楽しさを理解していません。"
        },
        {
          id: "c",
          text: "すごいですね！僕は不器用なので、パンを作れる人って本当に尊敬します。どんなパンを作るんですか？",
          isCorrect: true,
          explanation: "相手を褒めて、自分の正直な気持ちを伝え、具体的な質問で会話を広げています。"
        },
        {
          id: "d",
          text: "パン作りって時間かかりますよね。仕事で疲れませんか？",
          isCorrect: false,
          explanation: "趣味の楽しさより負担面に焦点を当て、否定的な印象を与えます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_002.mp3",
      shadowingText: "すごいですね！僕は不器用なので、パンを作れる人って本当に尊敬します。どんなパンを作るんですか？",
      tip: "相手の趣味を褒めて、正直な気持ちを伝えてから具体的に質問しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_003",
      category: "deepen",
      level: "advanced",
      tags: ["仕事", "やりがい", "価値観", "看護師"],
      situation: "相手の仕事のやりがいについて深く理解しようとする場面",
      womanText: "看護師の仕事は大変ですが、患者さんが元気になって帰られる姿を見ると、この仕事をしていて良かったなって思います。",
      choices: [
        {
          id: "a",
          text: "看護師さんって大変ですよね。給料はどのくらいもらえるんですか？",
          isCorrect: false,
          explanation: "やりがいの話から金銭面に話題を変えてしまい、相手の価値観を理解していません。"
        },
        {
          id: "b",
          text: "僕のIT業界も残業が多くて大変なんですよ。",
          isCorrect: false,
          explanation: "相手の話を自分の話にすり替えてしまい、共感が不十分です。"
        },
        {
          id: "c",
          text: "素晴らしいお仕事ですね。美咲さんのように患者さんを思いやれる方がいるから、みんな安心して治療を受けられるんでしょうね。やりがいを感じる瞬間って、他にもありますか？",
          isCorrect: true,
          explanation: "仕事の価値を認め、相手の人柄を褒め、さらにやりがいについて深掘りする理想的な返答です。"
        },
        {
          id: "d",
          text: "看護師さんなら安定していていいですね。",
          isCorrect: false,
          explanation: "安定性にのみ言及し、相手のやりがいや使命感を理解していません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_003.mp3",
      shadowingText: "素晴らしいお仕事ですね。美咲さんのように患者さんを思いやれる方がいるから、みんな安心して治療を受けられるんでしょうね。やりがいを感じる瞬間って、他にもありますか？",
      tip: "相手の仕事の価値を認め、人柄を褒めてから、さらに深くやりがいについて聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_004",
      category: "elicit",
      level: "intermediate",
      tags: ["食事", "共通点", "イタリア料理"],
      situation: "食事中の会話で共通の話題を見つける場面",
      womanText: "このパスタ、とても美味しいですね。イタリア料理って好きなんです。",
      choices: [
        {
          id: "a",
          text: "僕は和食の方が好きなんですよね。",
          isCorrect: false,
          explanation: "相手の好みを否定し、共通点を探そうとしていません。"
        },
        {
          id: "b",
          text: "本当ですね！美咲さんはイタリア料理の中でも何が一番お好きですか？僕も最近イタリアンにハマっているんです。",
          isCorrect: true,
          explanation: "共感を示し、具体的な好みを聞いて、共通点も伝える完璧な会話の広げ方です。"
        },
        {
          id: "c",
          text: "そうですね。値段の割にはまずまずですね。",
          isCorrect: false,
          explanation: "味についてネガティブなコメントをし、相手の好意的な感想を台無しにしています。"
        },
        {
          id: "d",
          text: "美味しいですね。今度、もっと高級なイタリアンに行きませんか？",
          isCorrect: false,
          explanation: "いきなり誘いに発展させ、今の会話を十分に楽しんでいません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_004.mp3",
      shadowingText: "本当ですね！美咲さんはイタリア料理の中でも何が一番お好きですか？僕も最近イタリアンにハマっているんです。",
      tip: "共感を示してから具体的に聞き、自分の共通点も伝えて会話を広げましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_005",
      category: "elicit",
      level: "intermediate",
      tags: ["健康", "ジョギング", "生活習慣"],
      situation: "相手の健康的な習慣について興味を示す場面",
      womanText: "最近は健康のために、朝早く起きてジョギングをしているんです。",
      choices: [
        {
          id: "a",
          text: "僕は朝が苦手で、朝ジョギングなんて絶対無理です。",
          isCorrect: false,
          explanation: "自分の不能を強調し、相手の努力を否定的に受け取っています。"
        },
        {
          id: "b",
          text: "健康的でいいですね。僕も見習わないと。どのくらいの距離を走るんですか？",
          isCorrect: true,
          explanation: "相手を褒めて、自分も刺激を受けたことを伝え、具体的な質問で関心を示しています。"
        },
        {
          id: "c",
          text: "ジョギングって膝を痛めたりしませんか？気をつけた方がいいですよ。",
          isCorrect: false,
          explanation: "心配する気持ちは良いですが、最初から否定的な面を指摘してしまっています。"
        },
        {
          id: "d",
          text: "へぇ、頑張ってますね。",
          isCorrect: false,
          explanation: "形式的な反応で、会話を広げる努力が見られません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_005.mp3",
      shadowingText: "健康的でいいですね。僕も見習わないと。どのくらいの距離を走るんですか？",
      tip: "相手の良い習慣を褒めて、自分も刺激を受けたことを伝えてから具体的に聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_006",
      category: "elicit",
      level: "intermediate",
      tags: ["旅行", "京都", "共通の興味"],
      situation: "相手の旅行体験について興味深く聞く場面",
      womanText: "先月、友人と京都に行ってきました。紅葉がとても綺麗でした。",
      choices: [
        {
          id: "a",
          text: "京都いいですね！どちらのお寺に行かれたんですか？僕も紅葉の季節の京都は大好きなんです。",
          isCorrect: true,
          explanation: "共感を示し、具体的な場所を聞いて、自分の共通の興味も伝える理想的な返答です。"
        },
        {
          id: "b",
          text: "京都ですか。観光地って人が多くて疲れませんでしたか？",
          isCorrect: false,
          explanation: "ネガティブな面に焦点を当て、相手の楽しい体験を台無しにしてしまいます。"
        },
        {
          id: "c",
          text: "へぇ、そうなんですね。僕は海外旅行の方が好きなんですよ。",
          isCorrect: false,
          explanation: "相手の体験より自分の好みを優先し、会話を自分の方向に持っていってしまいます。"
        },
        {
          id: "d",
          text: "京都なら近いからいいですね。",
          isCorrect: false,
          explanation: "単純すぎる反応で、相手の体験の価値を理解していません。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_006.mp3",
      shadowingText: "京都いいですね！どちらのお寺に行かれたんですか？僕も紅葉の季節の京都は大好きなんです。",
      tip: "相手の体験に共感し、具体的に聞いて、自分の共通の興味も伝えましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_007",
      category: "elicit",
      level: "beginner",
      tags: ["動物", "猫", "興味"],
      situation: "相手のペットについて興味を示す場面",
      womanText: "実家では猫を2匹飼っているんです。とても可愛くて癒されます。",
      choices: [
        {
          id: "a",
          text: "猫ですか。僕は犬派なんですよね。",
          isCorrect: false,
          explanation: "相手の好みを否定し、自分の好みを主張してしまっています。"
        },
        {
          id: "b",
          text: "可愛いでしょうね！どんな猫ちゃんなんですか？美咲さんって動物好きなんですね。",
          isCorrect: true,
          explanation: "相手の感情に共感し、具体的に聞いて、相手の性格についても理解を示しています。"
        },
        {
          id: "c",
          text: "猫って毛が抜けて大変じゃないですか？",
          isCorrect: false,
          explanation: "ネガティブな面を指摘し、相手の癒しの体験を否定してしまいます。"
        },
        {
          id: "d",
          text: "へぇ、猫好きなんですね。アレルギーとかは大丈夫ですか？",
          isCorrect: false,
          explanation: "心配の気持ちは良いですが、まず相手の猫への愛情を理解することが優先されます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_007.mp3",
      shadowingText: "可愛いでしょうね！どんな猫ちゃんなんですか？美咲さんって動物好きなんですね。",
      tip: "相手の感情に共感し、具体的に聞いて、性格についても理解を示しましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_008",
      category: "deepen",
      level: "advanced",
      tags: ["将来", "仕事", "家庭", "価値観"],
      situation: "将来の価値観について深く理解しようとする場面",
      womanText: "将来は、家庭と仕事を両立させたいと思っています。",
      choices: [
        {
          id: "a",
          text: "女性も働く時代ですからね。頑張ってください。",
          isCorrect: false,
          explanation: "一般論で済ませてしまい、相手の個別の価値観を理解しようとしていません。"
        },
        {
          id: "b",
          text: "素晴らしい考えですね。美咲さんなら、きっと両方とも上手にこなされると思います。どんな家庭を築きたいと思われますか？",
          isCorrect: true,
          explanation: "相手の考えを肯定し、能力を信頼し、さらに具体的な理想を聞く理想的な深掘りです。"
        },
        {
          id: "c",
          text: "僕の収入だけでも十分だと思いますけど。",
          isCorrect: false,
          explanation: "相手の価値観を否定し、時代錯誤な考え方を押し付けています。"
        },
        {
          id: "d",
          text: "両立って大変そうですね。子育てとかも考えてるんですか？",
          isCorrect: false,
          explanation: "ネガティブな印象を与え、いきなり具体的すぎる質問をしています。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_008.mp3",
      shadowingText: "素晴らしい考えですね。美咲さんなら、きっと両方とも上手にこなされると思います。どんな家庭を築きたいと思われますか？",
      tip: "相手の価値観を肯定し、能力を信頼してから、理想について具体的に聞きましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_009",
      category: "deepen",
      level: "advanced",
      tags: ["クラシック音楽", "共感", "関係性"],
      situation: "文化的な体験を共有して関係性を深める場面",
      womanText: "今日のコンサート、とても素敵でした。クラシック音楽って心が落ち着きますね。",
      choices: [
        {
          id: "a",
          text: "僕はロックの方が好きなんですが、たまにはクラシックもいいですね。",
          isCorrect: false,
          explanation: "自分の好みを先に言ってしまい、相手の感動を共有できていません。"
        },
        {
          id: "b",
          text: "本当にそうですね。美咲さんと一緒に聞けて、いつもより音楽が特別に感じました。普段もクラシックをよく聞かれるんですか？",
          isCorrect: true,
          explanation: "共感を示し、一緒にいることの特別さを伝え、相手の普段の興味についても聞いています。"
        },
        {
          id: "c",
          text: "そうですね。でも少し眠くなりました。",
          isCorrect: false,
          explanation: "正直すぎて、相手の感動を台無しにしてしまいます。"
        },
        {
          id: "d",
          text: "クラシックって難しくてよく分からないんですよね。",
          isCorrect: false,
          explanation: "自分の無理解を強調し、相手との文化的な差を際立たせてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_009.mp3",
      shadowingText: "本当にそうですね。美咲さんと一緒に聞けて、いつもより音楽が特別に感じました。普段もクラシックをよく聞かれるんですか？",
      tip: "文化的な体験を共有する時は、一緒にいることの特別さを伝えてから興味を深掘りしましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "skill_010",
      category: "deepen",
      level: "advanced",
      tags: ["沈黙", "雰囲気", "場の空気"],
      situation: "沈黙が生まれた時に自然に会話を再開する場面",
      womanText: "（少し沈黙が続いている）",
      choices: [
        {
          id: "a",
          text: "えーっと、他に何か話すことありませんか？",
          isCorrect: false,
          explanation: "沈黙を問題視し、焦りを相手に伝えてしまっています。"
        },
        {
          id: "b",
          text: "（微笑みながら）このカフェの雰囲気、とても落ち着きますね。美咲さんはこういう静かな場所はお好きですか？",
          isCorrect: true,
          explanation: "沈黙を自然に受け入れ、雰囲気を活用して新しい話題に展開する理想的な対応です。"
        },
        {
          id: "c",
          text: "すみません、話が下手で...",
          isCorrect: false,
          explanation: "自己否定的になり、相手に気を遣わせてしまいます。"
        },
        {
          id: "d",
          text: "（スマートフォンを見て時間を確認する）",
          isCorrect: false,
          explanation: "非言語的な行動ですが、相手に失礼な印象を与えてしまいます。"
        }
      ],
      shadowingAudio: "/audio/shadowing/skill_010.mp3",
      shadowingText: "このカフェの雰囲気、とても落ち着きますね。美咲さんはこういう静かな場所はお好きですか？",
      tip: "沈黙が生まれた時は、その場の雰囲気を活用して自然に新しい話題を始めましょう。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    }
  ]
};

// ユーティリティ関数群

/**
 * カテゴリ別にシナリオを取得
 * @param {string} category - カテゴリ名 ('elicit' | 'deepen')
 * @returns {Array} 該当カテゴリのシナリオ配列
 */
export function getScenariosByCategory(category) {
  return conversationQuizData.scenarios.filter(scenario => scenario.category === category);
}

/**
 * 難易度別にシナリオを取得
 * @param {string} level - 難易度 ('beginner' | 'intermediate' | 'advanced')
 * @returns {Array} 該当難易度のシナリオ配列
 */
export function getScenariosByLevel(level) {
  return conversationQuizData.scenarios.filter(scenario => scenario.level === level);
}

/**
 * カテゴリからランダムにシナリオを取得
 * @param {string} category - カテゴリ名 (省略時は全カテゴリ)
 * @returns {Object} ランダムなシナリオ
 */
export function getRandomScenario(category = null) {
  const scenarios = category 
    ? getScenariosByCategory(category)
    : conversationQuizData.scenarios;
  
  if (scenarios.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
}

/**
 * ID指定でシナリオを取得
 * @param {string} id - シナリオID
 * @returns {Object|null} 該当シナリオまたはnull
 */
export function getScenarioById(id) {
  return conversationQuizData.scenarios.find(scenario => scenario.id === id) || null;
}

/**
 * タグでシナリオを検索
 * @param {string} tag - 検索したいタグ
 * @returns {Array} 該当タグを含むシナリオ配列
 */
export function getScenariosByTag(tag) {
  return conversationQuizData.scenarios.filter(scenario => 
    scenario.tags.includes(tag)
  );
}

/**
 * カテゴリと難易度で絞り込み
 * @param {string} category - カテゴリ名
 * @param {string} level - 難易度
 * @returns {Array} 条件に合致するシナリオ配列
 */
export function getScenariosByCategoryAndLevel(category, level) {
  return conversationQuizData.scenarios.filter(scenario => 
    scenario.category === category && scenario.level === level
  );
}

/**
 * 全カテゴリ情報を取得
 * @returns {Object} カテゴリ定義オブジェクト
 */
export function getCategories() {
  return conversationQuizData.categories;
}

/**
 * 全難易度情報を取得
 * @returns {Object} 難易度定義オブジェクト
 */
export function getLevels() {
  return conversationQuizData.levels;
}