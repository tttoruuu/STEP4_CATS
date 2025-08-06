// 音声URLのアクセス可能性をテスト
const https = require('https');
const { empathyAudioData } = require('./data/audioData');

console.log('=== 音声URLアクセステスト ===\n');

// URLをテストする関数
function testUrl(url, label) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${label}: アクセス可能 (Status: ${res.statusCode})`);
      } else {
        console.log(`⚠️  ${label}: ステータスコード ${res.statusCode}`);
      }
      resolve();
    }).on('error', (err) => {
      console.error(`❌ ${label}: アクセスエラー - ${err.message}`);
      resolve();
    });
  });
}

// すべての音声URLをテスト
async function testAllUrls() {
  for (let i = 0; i < empathyAudioData.length; i++) {
    const scenario = empathyAudioData[i];
    console.log(`\n--- シナリオ${i + 1} ---`);
    
    // 女性音声をテスト
    await testUrl(scenario.audioSrc, `女性音声 (${scenario.text})`);
    
    // 男性音声をテスト
    await testUrl(scenario.correctResponseAudioSrc, `男性音声 (${scenario.correctResponse})`);
  }
  
  console.log('\n=== テスト完了 ===');
}

testAllUrls();