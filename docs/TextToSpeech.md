# Text-to-Speech機能実装ドキュメント

## 概要

STEP4_CATSアプリケーションの会話練習ページに、OpenAI TTS APIを使用したText-to-Speech機能を実装します。会話相手のメッセージを自動的に音声で読み上げることで、より自然な会話練習体験を提供します。

## 実装計画

### 機能要件

1. **自動読み上げ**: 会話相手のメッセージが表示された時点で自動音声再生
2. **手動読み上げ**: 各メッセージに音声再生ボタンを配置
3. **音声制御**: 再生・停止・音量調整機能
4. **音声設定**: 音声の種類・速度・音程の選択
5. **バックグラウンド再生**: 他の操作を妨げない音声再生

### 技術仕様

#### バックエンド
- **API**: OpenAI Text-to-Speech API
- **エンドポイント**: `/text-to-speech`
- **音声形式**: MP3（ブラウザ対応）
- **音声モデル**: `tts-1`（高速）/ `tts-1-hd`（高品質）
- **声の種類**: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

#### フロントエンド
- **音声再生**: HTML5 Audio API
- **UI要素**: 音声再生ボタン、音量スライダー、設定パネル
- **状態管理**: 音声再生状態の管理

## 実装内容

### 1. バックエンド実装 (FastAPI)

#### エンドポイント仕様
```python
@app.post("/text-to-speech")
async def text_to_speech(
    text: str,
    voice: str = "alloy",
    model: str = "tts-1",
    speed: float = 1.0,
    current_user: User = Depends(get_current_user)
):
```

#### パラメータ
- `text`: 読み上げるテキスト（最大4096文字）
- `voice`: 音声の種類（alloy, echo, fable, onyx, nova, shimmer）
- `model`: TTSモデル（tts-1, tts-1-hd）
- `speed`: 再生速度（0.25〜4.0）

#### レスポンス
- Content-Type: `audio/mpeg`
- 音声データ（MP3形式）のストリーミング

### 2. フロントエンド実装

#### APIサービス
```javascript
// services/api.js
textToSpeech: async (text, options = {}) => {
  const { voice = 'alloy', model = 'tts-1', speed = 1.0 } = options;
  
  const response = await axios.post('/text-to-speech', {
    text,
    voice,
    model,
    speed
  }, {
    responseType: 'blob'
  });
  
  return URL.createObjectURL(response.data);
}
```

#### 音声再生コンポーネント
```javascript
// components/AudioPlayer.js
const AudioPlayer = ({ text, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  
  const playAudio = async () => {
    if (!audioUrl) {
      const url = await apiService.conversation.textToSpeech(text);
      setAudioUrl(url);
    }
    audioRef.current.play();
  };
  
  return (
    <div className="audio-player">
      <button onClick={playAudio}>🔊</button>
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};
```

### 3. 会話練習ページへの統合

#### メッセージコンポーネントの拡張
```javascript
// 会話相手のメッセージに音声再生機能を追加
{message.sender === 'partner' && (
  <div className="message-with-audio">
    <div className="message-text">{message.text}</div>
    <AudioPlayer 
      text={message.text} 
      autoPlay={autoPlayEnabled}
    />
  </div>
)}
```

#### 設定パネル
```javascript
const [ttsSettings, setTtsSettings] = useState({
  voice: 'alloy',
  speed: 1.0,
  autoPlay: true,
  volume: 0.8
});
```

## UI/UX設計

### 音声再生ボタン
- **位置**: 各会話相手メッセージの右下
- **アイコン**: 🔊（再生待機）、⏸️（再生中）、🔇（エラー）
- **状態表示**: 読み込み中はスピナー表示

### 設定パネル
- **音声選択**: ドロップダウンメニュー
- **速度調整**: スライダー（0.5x〜2.0x）
- **自動再生**: トグルスイッチ
- **音量調整**: ボリュームスライダー

### レスポンシブ対応
- モバイル: 音声ボタンを大きく表示
- タブレット: 設定パネルをサイドバー表示
- デスクトップ: 全機能を表示

## 環境設定

### 必要な環境変数
```bash
# backend/.env
OPENAI_API_KEY=your_openai_api_key_here
TTS_MODEL=tts-1  # または tts-1-hd
DEFAULT_VOICE=alloy
```

### 依存関係
#### バックエンド
```python
# requirements.txt に追加
httpx>=0.24.0
aiofiles>=23.0.0
```

#### フロントエンド
```json
// package.json - 追加依存関係なし（標準Web API使用）
```

## 実装手順

### Phase 1: バックエンド実装
1. `/text-to-speech` エンドポイント作成
2. OpenAI TTS API統合
3. 音声データストリーミング実装
4. エラーハンドリング・バリデーション

### Phase 2: フロントエンド基盤
1. `textToSpeech` APIメソッド実装
2. 音声再生コンポーネント作成
3. 音声状態管理実装

### Phase 3: UI統合
1. 会話練習ページに音声ボタン追加
2. 設定パネル実装
3. 自動再生機能実装

### Phase 4: 最適化・テスト
1. 音声キャッシュ機能
2. パフォーマンス最適化
3. クロスブラウザテスト

## セキュリティ・パフォーマンス考慮事項

### セキュリティ
- **認証**: JWT認証必須
- **入力制限**: テキスト長制限（4096文字）
- **レート制限**: API呼び出し回数制限
- **CORS設定**: 適切なOrigin制限

### パフォーマンス
- **音声キャッシュ**: 同じテキストの音声を再利用
- **遅延読み込み**: 必要時にのみ音声生成
- **ストリーミング**: 大きな音声ファイルの分割配信
- **圧縮**: 音声データの適切な圧縮

### コスト最適化
- **モデル選択**: 用途に応じてtts-1/tts-1-hdを選択
- **キャッシュ戦略**: 頻繁に使用される音声のキャッシュ
- **バッチ処理**: 複数テキストの一括処理

## エラーハンドリング

### 想定エラーケース
1. **OpenAI API エラー**: API制限・認証エラー
2. **音声再生エラー**: ブラウザサポート・ネットワークエラー
3. **テキスト制限エラー**: 文字数制限超過
4. **音声形式エラー**: ブラウザ非対応形式

### 対応策
```javascript
try {
  const audioUrl = await apiService.conversation.textToSpeech(text);
  // 音声再生
} catch (error) {
  if (error.response?.status === 429) {
    showError('音声生成の制限に達しました。しばらく待ってから再試行してください。');
  } else if (error.response?.status === 400) {
    showError('テキストが長すぎます。短いメッセージに分割してください。');
  } else {
    showError('音声生成に失敗しました。');
  }
}
```

## テスト戦略

### 単体テスト
- TTS API エンドポイントのテスト
- 音声再生コンポーネントのテスト
- エラーハンドリングのテスト

### 統合テスト
- 会話練習ページでの音声再生フロー
- 設定変更時の動作確認
- 複数メッセージの連続再生

### ユーザビリティテスト
- 音声品質の評価
- UI操作性の確認
- アクセシビリティ対応

## アクセシビリティ対応

### 視覚障害者対応
- スクリーンリーダー対応
- キーボードナビゲーション
- 音声再生状態の音声フィードバック

### 聴覚障害者対応
- 視覚的な再生状態表示
- 字幕表示オプション
- 振動フィードバック（モバイル）

## 今後の拡張案

1. **多言語対応**: 各言語に最適化された音声
2. **感情表現**: テキスト解析による感情的な音声生成
3. **会話相手別音声**: キャラクターに応じた音声の使い分け
4. **音声学習**: ユーザーの好みを学習した音声カスタマイズ
5. **リアルタイム音声合成**: ストリーミングTTS

## Git開発フロー

### ブランチ戦略
```bash
# TTS機能開発用ブランチ作成
git checkout main
git pull origin main
git checkout -b feature/text-to-speech-integration

# または段階的な開発
git checkout -b feature/tts-backend-api      # Phase 1
git checkout -b feature/tts-frontend-ui      # Phase 2
git checkout -b feature/tts-conversation-integration  # Phase 3
```

### コミット例
```bash
# バックエンド実装
git commit -m "feat(api): OpenAI TTS APIエンドポイント実装

- /text-to-speech POST エンドポイント追加
- 音声モデル・声・速度パラメータ対応
- MP3音声データストリーミング機能
- JWT認証とテキスト長バリデーション"

# フロントエンド実装
git commit -m "feat(frontend): Text-to-Speech音声再生機能追加

- textToSpeech APIメソッド実装
- AudioPlayerコンポーネント作成
- 音声再生状態管理機能"

# UI統合
git commit -m "feat(ui): 会話練習ページにTTS機能統合

- 会話相手メッセージに音声再生ボタン追加
- TTS設定パネル実装
- 自動再生・音量調整機能"
```

## 参考資料

- [OpenAI Text-to-Speech API Documentation](https://platform.openai.com/docs/guides/text-to-speech)
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTML5 Audio Element - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [Speech Synthesis API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)