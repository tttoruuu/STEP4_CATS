// TTS統合テスト
const axios = require('axios');
const fs = require('fs');

async function testTTSIntegration() {
  console.log('=== TTS統合テスト開始 ===\n');

  // 1. バックエンドヘルスチェック
  console.log('1. バックエンドヘルスチェック');
  try {
    const response = await axios.get('http://localhost:8000/health');
    console.log('✓ バックエンド正常:', response.data.status);
  } catch (error) {
    console.log('✗ バックエンドエラー:', error.message);
    return;
  }

  // 2. TTS APIエンドポイントテスト
  console.log('\n2. TTS APIエンドポイントテスト');
  try {
    const response = await axios.post('http://localhost:8000/api/text-to-speech', {
      text: 'そうなんですね。もう少し詳しく教えていただけますか？',
      voice: 'alloy',
      model: 'tts-1',
      speed: 0.9
    }, {
      responseType: 'arraybuffer'
    });
    
    console.log(`✓ TTS API正常: ${response.data.length} bytes`);
    
    // テスト音声ファイルを保存
    fs.writeFileSync('test_tts_output.mp3', response.data);
    console.log('✓ テスト音声ファイル保存: test_tts_output.mp3');
    
  } catch (error) {
    console.log('✗ TTS APIエラー:', error.response?.status, error.message);
  }

  // 3. フロントエンドサーバーチェック
  console.log('\n3. フロントエンドサーバーチェック');
  try {
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    console.log('✓ フロントエンド正常: HTTP', response.status);
  } catch (error) {
    console.log('✗ フロントエンドエラー:', error.message);
  }

  // 4. 音声ディレクトリ構造チェック
  console.log('\n4. 音声ディレクトリ構造チェック');
  const audioDir = 'frontend/public/audio/conversation';
  if (fs.existsSync(audioDir)) {
    const files = fs.readdirSync(audioDir);
    console.log('✓ 音声ディレクトリ存在:', audioDir);
    console.log('  ファイル:', files.join(', '));
  } else {
    console.log('✗ 音声ディレクトリなし:', audioDir);
  }

  // 5. 設定ファイルチェック
  console.log('\n5. 設定ファイルチェック');
  const mappingFile = audioDir + '/mapping.json';
  if (fs.existsSync(mappingFile)) {
    const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    console.log('✓ マッピングファイル存在');
    console.log('  登録テキスト数:', Object.keys(mapping.mappings.texts).length);
  } else {
    console.log('✗ マッピングファイルなし');
  }

  // 6. enhancedTTSApi.jsファイルチェック
  console.log('\n6. 拡張TTSサービスファイルチェック');
  const enhancedTTSFile = 'frontend/services/enhancedTTSApi.js';
  if (fs.existsSync(enhancedTTSFile)) {
    const content = fs.readFileSync(enhancedTTSFile, 'utf8');
    const hasMapping = content.includes('audioMappings');
    const hasFallback = content.includes('conversationAPI.textToSpeech');
    console.log('✓ enhancedTTSApi.js存在');
    console.log('  マッピング機能:', hasMapping ? '✓' : '✗');
    console.log('  フォールバック機能:', hasFallback ? '✓' : '✗');
  } else {
    console.log('✗ enhancedTTSApi.jsなし');
  }

  console.log('\n=== テスト完了 ===');
}

// メイン実行
if (require.main === module) {
  testTTSIntegration().catch(console.error);
}

module.exports = { testTTSIntegration };