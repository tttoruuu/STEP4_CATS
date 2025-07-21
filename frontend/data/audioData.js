// 音声練習用データ管理

// 相槌練習用音声データ
export const empathyAudioData = [
  {
    id: 1,
    audioSrc: '/audio/empathy/work-stress-1.mp3',
    text: '最近、仕事が本当に忙しくて、毎日残業続きなんです。体も疲れているし、心も少し疲れてしまって...',
    scenario: '仕事の悩み',
    correctResponses: ['大変ですね', 'お疲れ様です', 'それは辛いですね'],
    tip: '相手の感情に寄り添う相槌を心がけましょう'
  },
  {
    id: 2,
    audioSrc: '/audio/empathy/hobby-photography.mp3',
    text: '週末に写真を撮りに行ったんですが、すごく綺麗な夕日が撮れたんです！久しぶりに心が癒されました。',
    scenario: '趣味の話',
    correctResponses: ['素敵ですね', 'いいですね', '良かったですね'],
    tip: '相手の喜びに共感する明るい相槌を使いましょう'
  },
  {
    id: 3,
    audioSrc: '/audio/empathy/family-concern.mp3',
    text: '実は、両親の体調が心配で...高齢になってきて、遠くに住んでいるので、なかなか様子を見に行けないんです。',
    scenario: '家族の心配',
    correctResponses: ['心配ですね', 'そうですか', 'ご心配でしょうね'],
    tip: '心配事には共感を込めた相槌で応えましょう'
  }
];

// 全コピー練習用音声データ
export const repeatAudioData = [
  {
    id: 1,
    audioSrc: '/audio/repeat/project-success.mp3',
    text: '3ヶ月間準備してきたプロジェクトが、ついに成功したんです。チーム全員で協力して、本当に良い結果を出せました。',
    scenario: '仕事の成功体験',
    keyWords: ['3ヶ月間', 'プロジェクト', '成功', 'チーム全員', '協力', '良い結果'],
    correctRepeat: '3ヶ月間準備してきたプロジェクトが成功して、チーム全員で協力して良い結果を出せたということですね',
    tip: '時間や具体的な内容も含めて繰り返しましょう'
  },
  {
    id: 2,
    audioSrc: '/audio/repeat/travel-experience.mp3',
    text: '先月、友人と京都旅行に行きました。清水寺で美しい景色を見て、とても感動しました。',
    scenario: '旅行体験',
    keyWords: ['先月', '友人', '京都旅行', '清水寺', '美しい景色', '感動'],
    correctRepeat: '先月、友人と京都旅行に行って、清水寺で美しい景色を見て感動されたということですね',
    tip: '場所や感情も含めて正確に繰り返しましょう'
  }
];

// NG/OK例のデータ
export const examplesData = {
  empathy: {
    work: {
      situation: '「仕事が忙しくて疲れている」という相手の話',
      ngExample: {
        audioSrc: '/audio/examples/empathy-work-ng.mp3',
        text: 'あ、そう。',
        reason: '相手の感情に寄り添えていません。素っ気なく聞こえます。'
      },
      okExample: {
        audioSrc: '/audio/examples/empathy-work-ok.mp3',
        text: 'それは大変ですね。お疲れ様です。',
        reason: '相手の大変さを理解し、労いの気持ちが伝わります。'
      },
      advice: '相手の感情を理解し、共感を込めた相槌を心がけましょう。「大変ですね」「お疲れ様です」など、相手を気遣う言葉が効果的です。'
    },
    hobby: {
      situation: '「趣味の写真で良い作品が撮れた」という相手の話',
      ngExample: {
        audioSrc: '/audio/examples/empathy-hobby-ng.mp3',
        text: 'ふーん。',
        reason: '相手の喜びに興味を示せていません。'
      },
      okExample: {
        audioSrc: '/audio/examples/empathy-hobby-ok.mp3',
        text: 'それは素敵ですね！良かったですね。',
        reason: '相手の喜びに共感し、明るい反応ができています。'
      },
      advice: '相手の嬉しい気持ちには、明るく前向きな相槌で応えましょう。「素敵ですね」「良かったですね」など、相手の気持ちを盛り上げる言葉を使いましょう。'
    }
  },
  repeat: {
    project: {
      situation: 'プロジェクト成功の体験談',
      ngExample: {
        audioSrc: '/audio/examples/repeat-project-ng.mp3',
        text: '仕事がうまくいったんですね。',
        reason: '要約してしまい、相手の具体的な話を正確に受け取れていません。'
      },
      okExample: {
        audioSrc: '/audio/examples/repeat-project-ok.mp3',
        text: '3ヶ月間準備してきたプロジェクトが成功して、チーム全員で協力して良い結果を出せたということですね。',
        reason: '相手の言葉を具体的に、そのまま繰り返せています。'
      },
      advice: '相手の話を要約せず、重要なキーワードや数字も含めて、できるだけそのまま繰り返しましょう。「〜ということですね」で確認すると自然です。'
    }
  }
};

// ランダムに音声を選択する関数
export const getRandomAudio = (audioArray) => {
  return audioArray[Math.floor(Math.random() * audioArray.length)];
};

// 音声ファイルの存在確認（開発用）
export const checkAudioExists = async (audioSrc) => {
  try {
    const response = await fetch(audioSrc, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};