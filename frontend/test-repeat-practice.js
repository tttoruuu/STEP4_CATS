// 会話ポイント全コピー練習モードのテストスクリプト
// 実行方法: node test-repeat-practice.js

const { repeatAudioData } = require('./data/audioData');

console.log('=== 会話ポイント全コピー練習モード データ検証 ===\n');

// データ構造の検証
console.log(`シナリオ数: ${repeatAudioData.length}`);
console.log('');

repeatAudioData.forEach((scenario, index) => {
  console.log(`--- シナリオ${index + 1} ---`);
  console.log(`ID: ${scenario.id}`);
  console.log(`シナリオ名: ${scenario.scenario}`);
  console.log(`女性の発言: "${scenario.text}"`);
  console.log(`女性音声URL: ${scenario.audioSrc}`);
  console.log(`男性の返し: "${scenario.correctResponse}"`);
  console.log(`男性音声URL: ${scenario.correctResponseAudioSrc}`);
  console.log(`ワンポイント: ${scenario.tip}`);
  console.log('');
  
  // 必須フィールドの確認
  const requiredFields = ['id', 'audioSrc', 'text', 'scenario', 'correctResponse', 'correctResponseAudioSrc', 'tip'];
  const missingFields = requiredFields.filter(field => !scenario[field]);
  
  if (missingFields.length > 0) {
    console.error(`⚠️  エラー: シナリオ${index + 1}に不足フィールドがあります: ${missingFields.join(', ')}`);
  } else {
    console.log('✅ すべての必須フィールドが存在します');
  }
  console.log('');
});

// URL形式の検証
console.log('=== URL形式の検証 ===');
repeatAudioData.forEach((scenario, index) => {
  const urls = [scenario.audioSrc, scenario.correctResponseAudioSrc];
  urls.forEach((url, urlIndex) => {
    const urlType = urlIndex === 0 ? '女性音声' : '男性音声';
    if (url.startsWith('https://blobeastasiafor9th.blob.core.windows.net/')) {
      console.log(`✅ シナリオ${index + 1} ${urlType}URL: 正しい形式`);
    } else {
      console.error(`⚠️  シナリオ${index + 1} ${urlType}URL: 不正な形式 - ${url}`);
    }
  });
});

console.log('\n=== テスト完了 ===');