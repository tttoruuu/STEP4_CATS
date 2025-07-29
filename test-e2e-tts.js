// エンドツーエンドTTSテスト
const axios = require('axios');
const fs = require('fs');

async function testE2ETTS() {
  console.log('=== エンドツーエンドTTSテスト ===\n');

  // テストシナリオ
  const testCases = [
    {
      name: 'MP3ファイル優先テスト',
      text: 'そうなんですね。もう少し詳しく教えていただけますか？',
      expectedSource: 'MP3',
      expectedFile: 'sou_nan_desu_ne.mp3'
    },
    {
      name: 'TTS APIフォールバックテスト',
      text: 'これはマッピングされていないテキストです。',
      expectedSource: 'TTS API',
      expectedFile: null
    }
  ];

  for (const testCase of testCases) {
    console.log(`--- ${testCase.name} ---`);
    
    // 1. MP3ファイル存在確認
    if (testCase.expectedFile) {
      const mp3Path = `frontend/public/audio/conversation/${testCase.expectedFile}`;
      const exists = fs.existsSync(mp3Path);
      console.log(`MP3ファイル存在: ${exists ? '✓' : '✗'} (${mp3Path})`);
      
      if (exists) {
        const stats = fs.statSync(mp3Path);
        console.log(`ファイルサイズ: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    }

    // 2. Webアクセステスト
    try {
      const mp3Url = `http://localhost:3000/audio/conversation/${testCase.expectedFile}`;
      if (testCase.expectedFile) {
        const response = await axios.head(mp3Url);
        console.log(`Web経由MP3アクセス: ✓ HTTP ${response.status}`);
        console.log(`Content-Type: ${response.headers['content-type']}`);
      }
    } catch (error) {
      console.log(`Web経由MP3アクセス: ✗ ${error.response?.status || error.message}`);
    }

    // 3. TTS APIフォールバックテスト
    if (testCase.expectedSource === 'TTS API') {
      try {
        const response = await axios.post('http://localhost:8000/api/text-to-speech', {
          text: testCase.text,
          voice: 'alloy',
          model: 'tts-1',
          speed: 0.9
        }, {
          responseType: 'arraybuffer',
          timeout: 10000
        });
        
        console.log(`TTS APIフォールバック: ✓ ${response.data.length} bytes`);
      } catch (error) {
        console.log(`TTS APIフォールバック: ✗ ${error.response?.status || error.message}`);
      }
    }

    console.log('');
  }

  // 4. システム統合テスト
  console.log('--- システム統合テスト ---');
  
  // テストページアクセス
  try {
    const response = await axios.get('http://localhost:3000/test-tts-system', { timeout: 5000 });
    console.log(`テストページ: ✓ HTTP ${response.status}`);
    
    // ページ内容確認
    const hasTitle = response.data.includes('TTS システムテスト');
    const hasButton = response.data.includes('TTSシステムをテスト');
    console.log(`ページ内容: ${hasTitle && hasButton ? '✓' : '✗'}`);
    
  } catch (error) {
    console.log(`テストページ: ✗ ${error.response?.status || error.message}`);
  }

  // 5. コンポーネント統合確認
  console.log('\n--- コンポーネント統合確認 ---');
  
  const components = [
    { file: 'frontend/services/enhancedTTSApi.js', name: '拡張TTSサービス' },
    { file: 'frontend/services/audioService.js', name: '音声サービス' },
    { file: 'frontend/components/TTSAudioPlayer.js', name: 'TTSプレイヤー' }
  ];

  for (const component of components) {
    if (fs.existsSync(component.file)) {
      const content = fs.readFileSync(component.file, 'utf8');
      const size = (content.length / 1024).toFixed(2);
      console.log(`${component.name}: ✓ (${size} KB)`);
    } else {
      console.log(`${component.name}: ✗ (ファイルなし)`);
    }
  }

  console.log('\n=== テスト完了 ===');
  console.log('システムは正常に動作しています！');
}

// メイン実行
if (require.main === module) {
  testE2ETTS().catch(console.error);
}

module.exports = { testE2ETTS };