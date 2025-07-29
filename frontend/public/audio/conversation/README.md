# 音声ファイル配置ガイド

このディレクトリには以下のMP3ファイルを配置してください：

## 必須ファイル

1. **sou_nan_desu_ne.mp3**
   - テキスト: 「そうなんですね。もう少し詳しく教えていただけますか？」
   - 用途: 詳細を聞く際の返答

2. **naruhodo_taihen.mp3**
   - テキスト: 「なるほど、それは大変でしたね。」
   - 用途: 共感を示す返答

3. **subarashii_doko_suki.mp3**
   - テキスト: 「素晴らしいですね！どんなところが特に好きですか？」
   - 用途: 称賛と質問

4. **kyoumi_bukai.mp3**
   - テキスト: 「それは興味深いですね。もっと聞かせてください。」
   - 用途: 興味を示す返答

5. **okimochi_wakarimasu.mp3**
   - テキスト: 「お気持ちよくわかります。」
   - 用途: 深い共感

6. **sorekara_dou.mp3**
   - テキスト: 「それから、どうなりましたか？」
   - 用途: 話の続きを促す

7. **donna_kimochi.mp3**
   - テキスト: 「どんな気持ちでしたか？」
   - 用途: 感情を聞く

8. **tanoshisou.mp3**
   - テキスト: 「それは楽しそうですね！」
   - 用途: ポジティブな反応

## オプションファイル

- **default_response.mp3** - デフォルト音声（エラー時のフォールバック）
- **silence_1s.mp3** - 1秒の無音（タイミング調整用）

## 音声ファイル作成ツール

### 1. OpenAI TTS APIで生成
```bash
# サンプルスクリプト
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1",
    "input": "そうなんですね。もう少し詳しく教えていただけますか？",
    "voice": "alloy",
    "speed": 0.9
  }' \
  --output sou_nan_desu_ne.mp3
```

### 2. 無料TTS代替案
- Google Cloud Text-to-Speech
- Amazon Polly
- Azure Speech Service
- VOICEVOX（日本語特化）

### 3. 人間による録音
- Audacityなどの録音ソフトを使用
- 静かな環境で録音
- ノイズ除去処理を適用

## ファイル仕様
- 形式: MP3
- ビットレート: 128kbps以上
- サンプリングレート: 44.1kHz
- チャンネル: モノラルまたはステレオ