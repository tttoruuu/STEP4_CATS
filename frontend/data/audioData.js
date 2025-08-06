// 音声練習用データ管理

// 挨拶・アイスブレイク練習用音声データ
export const greetingAudioData = [
  {
    id: 1,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/greeting1.mp3',
    text: 'こんにちは。○○さんでいらっしゃいますよね？お待たせしてしまって申し訳ございません。',
    scenario: 'シナリオ1',
    correctResponse: 'こんにちは。○○さんですよね。お会いするのを楽しみにしていました。私もちょうど今到着したところです。',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/greeting1-2.mp3',
    tip: '笑顔で挨拶し、相手の名前を確認しながら自己紹介しましょう'
  },
  {
    id: 2,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/greeting2.mp3',
    text: 'こんばんは。このパーティー、参加されて初めてですか？',
    scenario: 'シナリオ2',
    correctResponse: 'はい、初めてです。何度か参加されているのですか？色々と教えて頂けると嬉しいです',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/greeting2-2.mp3',
    tip: '軽い話題から始めて、相手の緊張もほぐす雰囲気作りを心がけましょう'
  },
  {
    id: 3,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/greeting3.mp3',
    text: 'はじめまして。○○さんから紹介していただいた□□と申します',
    scenario: 'シナリオ3',
    correctResponse: 'はじめまして。○○さんからお聞きしております。お会いできるのを楽しみにしておりました。',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/greeting3-2.mp3',
    tip: '紹介者への感謝を示し、お互いの緊張を和らげる配慮をしましょう'
  }
];

// 相槌練習用音声データ
export const empathyAudioData = [
  {
    id: 1,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/aizuti1.mp3',
    text: '初対面ってやっぱり緊張しますね',
    scenario: 'シナリオ1',
    correctResponse: 'そうですね！でもお会いできてうれしいです！',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/aizuti1-2.mp3',
    tip: '相手の緊張をほぐすような明るい返答を心がけましょう'
  },
  {
    id: 2,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/aizuti2.mp3',
    text: 'カフェ巡りが好きなんです。',
    scenario: 'シナリオ2',
    correctResponse: 'へぇ〜！カフェって落ち着きますよね☕おすすめのカフェありますか？',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/aizuti2-2.mp3',
    tip: '相手の趣味に興味を示し、話を広げる質問を加えましょう'
  },
  {
    id: 3,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/aizuti3.mp3',
    text: 'このお店、おしゃれですね',
    scenario: 'シナリオ3',
    correctResponse: 'ほんとですね！雰囲気もよくて落ち着きます。',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/aizuti3-2.mp3',
    tip: '相手の感想に共感し、さらに自分の感想も添えましょう'
  }
];

// 全コピー練習用音声データ
export const repeatAudioData = [
  {
    id: 1,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/oumu1.mp3',
    text: '最近テニス始めたんです',
    scenario: 'シナリオ1',
    correctResponse: '最近テニス始めたんですね！始めたきっかけはあるんですか？',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/oumu1-2.mp3',
    tip: '相手の話をそのまま繰り返してから、関連する質問を加えましょう'
  },
  {
    id: 2,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/oumu2.mp3',
    text: '料理が趣味なんです',
    scenario: 'シナリオ2',
    correctResponse: '料理が趣味なんですね！どんな料理が得意なんですか？',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/oumu2-2.mp3',
    tip: '「オウム返し」で相手の言葉を受け止めてから、興味を示す質問をしましょう'
  },
  {
    id: 3,
    audioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/oumu3.mp3',
    text: '実家は九州なんですよ',
    scenario: 'シナリオ3',
    correctResponse: '実家が九州なんですね！たまに帰られたりするんですか？',
    correctResponseAudioSrc: 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/oumu3-2.mp3',
    tip: '繰り返しによって相手の話をしっかり聞いていることを示しましょう'
  }
];

// NG/OK例のデータ（現在は使用していません）
export const examplesData = {};

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