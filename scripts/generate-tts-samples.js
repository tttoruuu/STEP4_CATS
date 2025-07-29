const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

/**
 * OpenAI TTS APIを使用してサンプル音声ファイルを生成
 */
async function generateTTSSamples() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY is not set in environment variables');
    process.exit(1);
  }

  const samples = [
    { text: 'そうなんですね。もう少し詳しく教えていただけますか？', filename: 'sou_nan_desu_ne.mp3' },
    { text: 'なるほど、それは大変でしたね。', filename: 'naruhodo_taihen.mp3' },
    { text: '素晴らしいですね！どんなところが特に好きですか？', filename: 'subarashii_doko_suki.mp3' },
    { text: 'それは興味深いですね。もっと聞かせてください。', filename: 'kyoumi_bukai.mp3' },
    { text: 'お気持ちよくわかります。', filename: 'okimochi_wakarimasu.mp3' },
    { text: 'それから、どうなりましたか？', filename: 'sorekara_dou.mp3' },
    { text: 'どんな気持ちでしたか？', filename: 'donna_kimochi.mp3' },
    { text: 'それは楽しそうですね！', filename: 'tanoshisou.mp3' },
    { text: '申し訳ございません。もう一度お聞かせください。', filename: 'default_response.mp3' }
  ];

  const outputDir = path.join(__dirname, '../frontend/public/audio/conversation');
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('音声ファイル生成を開始します...');
  console.log(`出力ディレクトリ: ${outputDir}`);

  for (const sample of samples) {
    try {
      console.log(`\n生成中: ${sample.filename}`);
      console.log(`テキスト: "${sample.text}"`);

      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          input: sample.text,
          voice: 'alloy',
          speed: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      const outputPath = path.join(outputDir, sample.filename);
      fs.writeFileSync(outputPath, response.data);
      
      console.log(`✓ 保存完了: ${outputPath}`);
      console.log(`  ファイルサイズ: ${(response.data.length / 1024).toFixed(2)} KB`);

    } catch (error) {
      console.error(`✗ エラー: ${sample.filename}`);
      console.error(`  ${error.message}`);
    }
  }

  // 無音ファイルの生成（1秒）
  console.log('\n無音ファイルを生成中...');
  try {
    // 簡易的な無音MP3データ（実際の実装では適切なMP3エンコーダーを使用）
    const silencePath = path.join(outputDir, 'silence_1s.mp3');
    // この部分は実際のMP3エンコーダーに置き換える必要があります
    console.log('注意: silence_1s.mp3 は手動で作成してください（1秒の無音MP3）');
  } catch (error) {
    console.error('無音ファイル生成エラー:', error);
  }

  console.log('\n完了！');
}

// コスト見積もり表示
function showCostEstimate() {
  const samples = 9; // サンプル数
  const avgCharsPerSample = 30; // 平均文字数
  const totalChars = samples * avgCharsPerSample;
  const costPerMillion = 15; // $15 per 1M characters
  const estimatedCost = (totalChars / 1000000) * costPerMillion;
  
  console.log('\n=== コスト見積もり ===');
  console.log(`サンプル数: ${samples}`);
  console.log(`合計文字数: 約${totalChars}文字`);
  console.log(`推定コスト: $${estimatedCost.toFixed(4)} (約${Math.ceil(estimatedCost * 150)}円)`);
  console.log('====================\n');
}

// メイン実行
if (require.main === module) {
  showCostEstimate();
  
  console.log('音声ファイルを生成しますか？ (y/n)');
  
  process.stdin.once('data', (data) => {
    const answer = data.toString().trim().toLowerCase();
    if (answer === 'y' || answer === 'yes') {
      generateTTSSamples()
        .then(() => process.exit(0))
        .catch((error) => {
          console.error('エラーが発生しました:', error);
          process.exit(1);
        });
    } else {
      console.log('キャンセルしました');
      process.exit(0);
    }
  });
}