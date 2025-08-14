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
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e1-a.mp3",
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
          text: "事務は安定していていいですね。",
          feedback: "△ 悪くありませんが、もっと相手の体験や感想を聞く方が会話が発展します。",
          score: 1
        }
      ],
      correctAnswer: "C",
      explanation: "「事務」という一般的な回答に対して、「どんな会社で」「どんな業務を」など具体的に深掘りすることで、相手の詳しい状況を知ることができます。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e2-a.mp3",
      shadowingText: "どんな会社で働かれているんですか？",
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
          text: "沖縄のどこが一番印象に残りましたか？",
          feedback: "⭐ 素晴らしい深掘りです！相手の感動ポイントや価値観を知ることができ、より深い会話に発展します。",
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
      explanation: "旅行の話では、期間や場所よりも「印象に残ったこと」「感動したこと」を聞くことで、相手の価値観や感性を知ることができます。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e3-a.mp3",
      shadowingText: "沖縄のどこが一番印象に残りましたか？",
      tip: "体験談を聞く時は「どこが印象的だったか」「どんな気持ちになったか」など、感情や感想を聞くと相手の人柄が見えてきます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "deepen_003",
      category: "deepen",
      level: "beginner",
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
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e4-a.mp3",
      shadowingText: "真ん中だと、どんな性格になりましたか？",
      tip: "家族構成を聞いた後は、それが相手にどんな影響を与えたかを聞くと、相手の価値観や性格形成について深く理解できます。",
      createdAt: "2025-01-21",
      updatedAt: "2025-01-21"
    },
    {
      id: "elicit_002",
      category: "elicit",
      level: "beginner",
      tags: ["食事", "デート", "好み"],
      situation: "デート中に食事の話題になった場面",
      womanText: "私、実は少し好き嫌いが多いんです。",
      question: "相手が「好き嫌いが多い」と言った時、どのように話を引き出しますか？",
      options: [
        {
          id: "A",
          text: "そうなんですか。何が苦手なんですか？",
          feedback: "⭐ 良い質問です！具体的に聞くことで、相手の詳しい好みを知ることができます。",
          score: 3
        },
        {
          id: "B",
          text: "好き嫌いは直した方がいいですよ。",
          feedback: "❌ 相手を批判的に感じさせてしまいます。まずは受け入れることが大切です。",
          score: 0
        },
        {
          id: "C",
          text: "私も好き嫌いがありますよ。",
          feedback: "△ 共感は良いですが、相手の話を聞く機会を逃しています。",
          score: 1
        },
        {
          id: "D",
          text: "じゃあ外食は大変ですね。",
          feedback: "❌ ネガティブな印象を与えてしまいます。もっとポジティブに聞いてみましょう。",
          score: 0
        }
      ],
      correctAnswer: "A",
      explanation: "「何が苦手か」を具体的に聞くことで、相手の好みを理解し、今後のデートプランにも活かせます。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e5-a.mp3",
      shadowingText: "そうなんですか。何が苦手なんですか？",
      tip: "好き嫌いがあることを否定せず、具体的に聞くことで相手への理解を深めましょう。",
      createdAt: "2025-01-28",
      updatedAt: "2025-01-28"
    },
    {
      id: "elicit_003",
      category: "elicit",
      level: "beginner",
      tags: ["仕事", "キャリア", "価値観"],
      situation: "お茶をしながら仕事の話になった場面",
      womanText: "最近、仕事でちょっと悩んでいることがあって...",
      question: "相手が「仕事で悩んでいる」と切り出した時、どのように話を引き出しますか？",
      options: [
        {
          id: "A",
          text: "仕事の悩みは誰にでもありますよ。",
          feedback: "❌ 一般論で済ませてしまい、相手の具体的な悩みを聞く機会を逃しています。",
          score: 0
        },
        {
          id: "B",
          text: "どんなことが特に不安に感じられるんですか？",
          feedback: "⭐ 素晴らしい質問です！相手の具体的な悩みを聞くことで、理解を深め、適切なサポートができます。",
          score: 3
        },
        {
          id: "C",
          text: "転職を考えているんですか？",
          feedback: "❌ 勝手に解決策を想定してしまい、まずは話を聞くことが大切です。",
          score: 0
        },
        {
          id: "D",
          text: "私も仕事で悩むことがあります。",
          feedback: "△ 共感は良いですが、相手の話をもっと詳しく聞いてみましょう。",
          score: 1
        }
      ],
      correctAnswer: "B",
      explanation: "悩みを話してくれたことは信頼の証。丁寧に受け止めて聞く姿勢を示しましょう。",
      shadowingText: "どんなことが特に不安に感じられるんですか？",
      tip: "悩みを話してくれたことは信頼の証。丁寧に受け止めて聞く姿勢を示しましょう。",
      createdAt: "2025-01-28",
      updatedAt: "2025-01-28"
    },
    {
      id: "elicit_004",
      category: "elicit",
      level: "beginner",
      tags: ["休日", "ライフスタイル", "趣味"],
      situation: "休日の過ごし方について話している場面",
      womanText: "私、休日はだいたい家でゆっくりしていることが多いです。",
      question: "相手が「家でゆっくり」と言った時、どのように詳しく聞きますか？",
      options: [
        {
          id: "A",
          text: "インドア派なんですね。",
          feedback: "❌ ラベリングして終わってしまい、具体的な過ごし方を聞けていません。",
          score: 0
        },
        {
          id: "B",
          text: "外に出ることはないんですか？",
          feedback: "❌ 否定的な印象を与えてしまいます。まずは家での過ごし方を聞いてみましょう。",
          score: 0
        },
        {
          id: "C",
          text: "家でゆっくりする時は、どんなことをされているんですか？",
          feedback: "⭐ 良い質問です！「ゆっくり」の具体的な内容を聞くことで、相手の趣味や好みが分かります。",
          score: 3
        },
        {
          id: "D",
          text: "私も家にいることが多いです。",
          feedback: "△ 共感は良いですが、相手の具体的な過ごし方をもっと聞いてみましょう。",
          score: 1
        }
      ],
      correctAnswer: "C",
      explanation: "「家でゆっくり」という漠然とした表現の中に、読書、映画、料理など様々な趣味が隠れています。",
      // shadowingAudio: "``", // 音声なし - 準備中
      shadowingText: "家でゆっくりする時は、どんなことをされているんですか？",
      tip: "「家でゆっくり」にも様々な過ごし方があります。決めつけずに詳しく聞いてみましょう。",
      createdAt: "2025-01-28",
      updatedAt: "2025-01-28"
    },
    {
      id: "elicit_005",
      category: "elicit",
      level: "advanced",
      tags: ["将来", "夢", "価値観"],
      situation: "将来の話題になった場面",
      womanText: "将来のことを考えると、少し不安になることもあります。",
      question: "相手が「将来が不安」と言った時、どのように話を引き出しますか？",
      options: [
        {
          id: "A",
          text: "みんな不安ですよ。大丈夫です。",
          feedback: "△ 励ましはありますが、相手の具体的な不安を聞けていません。",
          score: 1
        },
        {
          id: "B",
          text: "どんなことが特に不安に感じられるんですか？",
          feedback: "⭐ 素晴らしい質問です！具体的に聞くことで、相手の本音を引き出せます。",
          score: 3
        },
        {
          id: "C",
          text: "不安なんて考えない方がいいですよ。",
          feedback: "❌ 相手の感情を否定してしまっています。",
          score: 0
        },
        {
          id: "D",
          text: "将来の夢とかはありますか？",
          feedback: "○ 前向きな質問ですが、今の不安な気持ちを受け止めてからの方が良いです。",
          score: 2
        }
      ],
      correctAnswer: "B",
      explanation: "不安の内容を具体的に聞くことで、相手の価値観や大切にしていることが分かります。",
      // shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/elicit_005.mp3", // 音声無効化 - advanced_002との混同を防ぐ
      shadowingText: "どんなことが特に不安に感じられるんですか？",
      tip: "不安な気持ちを話してくれたことを大切に受け止め、具体的に聞いてみましょう。",
      createdAt: "2025-01-28",
      updatedAt: "2025-01-28"
    },
    // 上級レベル追加シナリオ（感情の読み取り）
    {
      id: "advanced_001",
      category: "deepen",
      level: "advanced",
      tags: ["感情読み取り", "交際中", "デート"],
      situation: "交際6ヶ月のカップル。夜景の見えるレストランでディナー中、相手の表情が少し曇る",
      womanText: "最近、職場で少し嫌なことがあって...それで今日も少し疲れちゃって。",
      question: "相手の感情変化を察知した時、どのように対応しますか？",
      options: [
        {
          id: "A",
          text: "何があったか詳しく教えて。",
          feedback: "❌ いきなり詳細を求めすぎです。まずは相手の気持ちに寄り添いましょう。",
          score: 0
        },
        {
          id: "B",
          text: "お疲れさま。話したくなったら聞かせてね。今日は美味しいものを食べてリラックスしよう。",
          feedback: "⭐ 完璧な対応！相手の気持ちを受け止めつつ、無理に聞き出そうとせず、今の時間を大切にする配慮が素晴らしいです。",
          score: 3
        },
        {
          id: "C",
          text: "そんな時こそ楽しまなきゃ！",
          feedback: "❌ 相手の感情を軽視している印象を与えてしまいます。",
          score: 0
        },
        {
          id: "D",
          text: "職場の人間関係は難しいからね。",
          feedback: "❌ 決めつけと一般論で、相手の具体的な状況を理解しようとしていません。",
          score: 0
        }
      ],
      correctAnswer: "B",
      explanation: "相手の感情に寄り添い、話したければ聞く姿勢を示しつつ、プレッシャーを与えない配慮が上級者の対応です。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a1-a.mp3",
      shadowingText: "お疲れさま。話したくなったら聞かせてね。今日は美味しいものを食べてリラックスしよう。",
      tip: "相手の表情や声のトーンから感情を察知し、その気持ちを最優先に考えて対応しましょう。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    {
      id: "advanced_002",
      category: "deepen",
      level: "advanced",
      tags: ["感情読み取り", "交際中", "価値観"],
      situation: "交際4ヶ月のカップル。カフェで将来の話をしている時、相手が急に黙り込む",
      womanText: "結婚とか将来のことって...（少し沈んだ表情で）正直、うまくイメージできないんです。",
      question: "相手の言葉の裏にある複雑な感情をどう読み取り、対応しますか？",
      options: [
        {
          id: "A",
          text: "なぜイメージできないんですか？具体的に教えてください。",
          feedback: "❌ 質問攻めになってしまい、相手の複雑な気持ちへの配慮が不足しています。",
          score: 0
        },
        {
          id: "B",
          text: "どんなところが特に不安に感じるのか、よかったら聞かせてもらえる？",
          feedback: "⭐ 素晴らしい対応！相手の不安を否定せず、具体的な内容を聞くことで理解を深めようとしています。",
          score: 3
        },
        {
          id: "C",
          text: "僕も同じです。でも大丈夫、時間をかけて考えていきましょう。",
          feedback: "○ 共感は良いですが、相手の不安な気持ちにもう少し寄り添えるとより良いです。",
          score: 2
        },
        {
          id: "D",
          text: "みんな最初はそんなものですよ。考えすぎない方がいいです。",
          feedback: "△ 励ましの気持ちはありますが、相手の複雑な感情を軽視してしまっています。",
          score: 1
        }
      ],
      correctAnswer: "B", 
      explanation: "将来への不安は誰にでもあります。まずは相手の具体的な不安を理解することから始めましょう。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a2-a.mp3",
      shadowingText: "どんなところが特に不安に感じるのか、よかったら聞かせてもらえる？",
      tip: "沈黙や表情の変化は相手からの重要なサイン。言葉以上に気持ちを読み取る力が大切です。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    // 適切な自己開示
    {
      id: "advanced_003",
      category: "deepen",
      level: "advanced",
      tags: ["自己開示", "交際中", "過去の恋愛"],
      situation: "交際5ヶ月のカップル。散歩中に過去の恋愛について話題になる",
      womanText: "実は私、過去に一度結婚を考えた人がいたんですが、価値観の違いで別れてしまって...すごく辛かった経験です。",
      question: "相手の深い自己開示に対して、どのように応答しますか？",
      options: [
        {
          id: "A",
          text: "辛い経験を話してくれてありがとう。そういう経験があったからこそ、今の君の考え方があるんだね。",
          feedback: "⭐ 完璧な対応！過去の経験を肯定的に捉え、相手の成長を認めています。信頼関係が深まります。",
          score: 3
        },
        {
          id: "B",
          text: "僕は恋愛経験が少ないので、そういう深い関係になったことがないんです。",
          feedback: "△ 正直な自己開示ですが、相手の辛い経験への共感が不足しています。",
          score: 1
        },
        {
          id: "C",
          text: "そういう重い話は、もう少し明るい話をしませんか？",
          feedback: "❌ 相手の信頼を裏切る対応。深い自己開示を拒絶してしまっています。",
          score: 0
        },
        {
          id: "D",
          text: "価値観の違いって具体的にどんなことだったんですか？",
          feedback: "○ 興味を示していますが、まず相手の感情に共感することが先決です。",
          score: 2
        }
      ],
      correctAnswer: "A",
      explanation: "過去の辛い経験を話してくれたことへの感謝と、その経験を肯定的に捉える視点が重要です。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a3-a.mp3",
      shadowingText: "辛い経験を話してくれてありがとう。そういう経験があったからこそ、今の君の考え方があるんだね。",
      tip: "相手の自己開示のレベルに合わせて、自分も同程度の深さで開示することで信頼関係が深まります。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    {
      id: "advanced_004",
      category: "deepen",
      level: "advanced", 
      tags: ["自己開示", "交際中", "家族関係"],
      situation: "交際8ヶ月のカップル。お互いの家で映画鑑賞後、家族の話になる",
      womanText: "実は私、父親との関係があまり良くなくて...小さい頃から厳しすぎて、今でも実家に帰るのが少し憂鬱なんです。",
      question: "相手の家族に関する複雑な感情を聞いた時、どう自己開示しますか？",
      options: [
        {
          id: "A", 
          text: "僕の家族はみんな仲が良いので、そういう経験はないですね。",
          feedback: "❌ 自分の状況との違いを強調してしまい、相手を孤立させる可能性があります。",
          score: 0
        },
        {
          id: "B",
          text: "今日、よく実家に連れて行ってくれたね。きっと勇気が必要だったと思う。君の気持ちを大切にしたいよ。",
          feedback: "⭐ 素晴らしい対応！相手の勇気を認め、感情に寄り添っています。家族関係の複雑さを理解している姿勢が伝わります。",
          score: 3
        },
        {
          id: "C",
          text: "それは辛いですね。でも親はあなたのことを愛していると思いますよ。",
          feedback: "△ 慰めの気持ちはありますが、相手の複雑な感情を軽視してしまう可能性があります。",
          score: 1
        },
        {
          id: "D",
          text: "お父さんはどんな風に厳しかったんですか？",
          feedback: "○ 関心を示していますが、まず相手の勇気ある開示に対する反応が先です。",
          score: 2
        }
      ],
      correctAnswer: "B",
      explanation: "家族関係の問題はデリケートです。解決を急がず、まずは相手の気持ちを理解し、寄り添うことが重要です。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a4-a.mp3",
      shadowingText: "今日、よく実家に連れて行ってくれたね。きっと勇気が必要だったと思う。君の気持ちを大切にしたいよ。",
      tip: "デリケートな家族の話では、相手を孤立させないよう、似た経験や一般的な理解を示すことが大切です。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    // 価値観の探究
    {
      id: "advanced_005",
      category: "deepen",
      level: "advanced",
      tags: ["価値観探究", "交際中", "人生観"],
      situation: "交際7ヶ月のカップル。ドライブ中に仕事と人生について話している",
      womanText: "仕事にやりがいを感じているけれど、このまま仕事だけの人生でいいのかなって時々考えるんです。",
      question: "相手の人生観について、どのように深く探究しますか？",
      options: [
        {
          id: "A",
          text: "君がそんなふうに考えているなんて知らなかった。どんな時にそう感じるの？",
          feedback: "⭐ 完璧な対応！相手の新たな一面を知ったことへの驚きと、具体的な状況を聞く姿勢が素晴らしいです。",
          score: 3
        },
        {
          id: "B",
          text: "仕事と家庭のバランスが大切だよね。",
          feedback: "❌ 一般論で終わってしまい、相手の具体的な気持ちを聞けていません。",
          score: 0
        },
        {
          id: "C",
          text: "僕がいるから大丈夫だよ。",
          feedback: "❌ 相手の内面的な悩みを理解せず、自分の存在で解決しようとしています。",
          score: 0
        },
        {
          id: "D",
          text: "仕事があるだけでも幸せじゃない？",
          feedback: "❌ 相手の悩みを軽視し、現状で満足するよう促している印象です。",
          score: 0
        }
      ],
      correctAnswer: "A",
      explanation: "パートナーの人生観や価値観を深く理解する貴重な機会です。相手の内面に興味を示すことが重要です。",
      shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a5-a.mp3",
      shadowingText: "君がそんなふうに考えているなんて知らなかった。どんな時にそう感じるの？",
      tip: "価値観の探究では、「なぜ」「どんな時に」という質問で、相手の深い動機や感情を引き出しましょう。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    {
      id: "advanced_006",
      category: "deepen", 
      level: "advanced",
      tags: ["価値観探究", "交際中", "結婚観"],
      situation: "交際10ヶ月のカップル。公園のベンチで将来の結婚生活について話している",
      womanText: "結婚って、お互いが成長し続けられる関係がいいなって思うんです。でも具体的にどういうことかって言われると難しくて...",
      question: "相手の結婚観の背景にある価値観をどう探りますか？",
      options: [
        {
          id: "A",
          text: "成長って、キャリアアップのことですか？それとも人間的な成長？",
          feedback: "○ 具体化しようとしていますが、もう少し相手の内面の動機を探ることができます。",
          score: 2
        },
        {
          id: "B",
          text: "素敵な考えですね。そう思うようになったのは、何か特別な経験があったからですか？",
          feedback: "⭐ 優秀な質問！相手の価値観の形成背景を探ることで、より深い理解につながります。",
          score: 3
        },
        {
          id: "C",
          text: "僕も同じように思います。お互いを高め合える関係が理想ですよね。",
          feedback: "△ 共感は良いですが、相手の考えをもっと深く理解する機会を逃しています。",
          score: 1
        },
        {
          id: "D",
          text: "成長し続けるためには、どんなことが必要だと思いますか？",
          feedback: "○ 良い質問ですが、まず相手の価値観の源泉を理解することが先決です。",
          score: 2
        }
      ],
      correctAnswer: "B",
      explanation: "価値観の背景にある経験や動機を探ることで、相手をより深く理解し、共通の価値観を見つけられます。",
      // shadowingAudio: "``", // 音声なし - 準備中
      shadowingText: "素敵な考えですね。そう思うようになったのは、何か特別な経験があったからですか？",
      tip: "相手の価値観には必ず形成の背景があります。その源泉を理解することで、より深いつながりが生まれます。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    // デリケートな話題への配慮
    {
      id: "advanced_007", 
      category: "deepen",
      level: "advanced",
      tags: ["デリケート配慮", "交際中", "不安悩み"],
      situation: "交際6ヶ月のカップル。相手の部屋で夜遅くまで話していて、転職の悩みを打ち明けられる",
      womanText: "実は今の会社を辞めようか本気で悩んでいて...でも転職がうまくいくか不安だし、あなたに迷惑をかけるかもしれないし...",
      question: "相手の重要な人生決断の悩みに、どのように配慮して対応しますか？",
      options: [
        {
          id: "A",
          text: "僕のことは気にしないで、自分の気持ちを一番大切にして。一緒に考えられることがあれば何でも言って。",
          feedback: "⭐ 完璧な配慮！相手の不安を取り除き、サポートの意思を示しつつ、決定権は相手にあることを尊重しています。",
          score: 3
        },
        {
          id: "B",
          text: "転職は慎重に考えた方がいいよ。今の会社も悪くないんじゃない？",
          feedback: "❌ 相手の気持ちを理解せず、決定に口出ししてしまっています。",
          score: 0
        },
        {
          id: "C",
          text: "何が一番不安なの？具体的に聞かせて。",
          feedback: "○ 関心を示していますが、まず相手の心配（迷惑をかける）に対する配慮が必要です。",
          score: 2
        },
        {
          id: "D",
          text: "大丈夫、きっとうまくいくよ。あまり考えすぎない方がいいよ。",
          feedback: "△ 励ましの気持ちはありますが、相手の真剣な悩みを軽視してしまっています。",
          score: 1
        }
      ],
      correctAnswer: "A",
      explanation: "重要な人生決断では、相手の自主性を尊重し、サポートの意思を示しつつ、不安を取り除くことが大切です。",
      // shadowingAudio: "``", // 音声なし - 準備中
      shadowingText: "僕のことは気にしないで、自分の気持ちを一番大切にして。一緒に考えられることがあれば何でも言って。",
      tip: "人生の重要な決断では、アドバイスより先に、相手への信頼とサポートの気持ちを伝えることが重要です。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
    },
    {
      id: "advanced_008",
      category: "deepen",
      level: "advanced",
      tags: ["デリケート配慮", "交際中", "健康問題"],
      situation: "交際9ヶ月のカップル。カフェで相手から健康面での不安を打ち明けられる",
      womanText: "実は最近、体調のことで病院に通っていて...大したことじゃないと思うけど、将来のことを考えると少し心配で...",
      question: "相手の健康面の悩みという極めてデリケートな話題に、どう対応しますか？",
      options: [
        {
          id: "A",
          text: "それは心配ですね。どんな症状なんですか？",
          feedback: "❌ デリケートな健康問題に対して、詳細を聞くのは配慮が不足しています。",
          score: 0
        },
        {
          id: "B",
          text: "話してくれてありがとう。無理をしないでくださいね。何かサポートできることがあればいつでも言ってください。",
          feedback: "⭐ 素晴らしい配慮！相手の勇気ある開示に感謝し、プレッシャーを与えずサポートの意思を示しています。",
          score: 3
        },
        {
          id: "C",
          text: "きっと大丈夫ですよ。あまり心配しすぎない方がいいです。",
          feedback: "△ 励ましの気持ちはありますが、相手の不安な気持ちを軽視してしまう可能性があります。",
          score: 1
        },
        {
          id: "D",
          text: "僕も一緒に病院に付き添いますよ。一人で抱え込まないでください。",
          feedback: "○ サポートの気持ちは素晴らしいですが、相手が望んでいるかわからない段階では慎重さが必要です。",
          score: 2
        }
      ],
      correctAnswer: "B",
      explanation: "健康問題というデリケートな話題では、詳細を聞くより先に、開示への感謝とサポートの意思を示すことが重要です。",
      // shadowingAudio: "``", // 音声なし - 準備中
      shadowingText: "話してくれてありがとう。無理をしないでくださいね。何かサポートできることがあればいつでも言ってください。",
      tip: "健康問題では、相手のプライバシーを尊重し、必要以上に踏み込まずサポートの姿勢を示すことが大切です。",
      createdAt: "2025-01-29",
      updatedAt: "2025-01-29"
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