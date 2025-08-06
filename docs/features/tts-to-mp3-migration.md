# TTS to MP3 移行ガイド

## 概要
このドキュメントは、OpenAI TTS APIから事前録音されたMP3ファイルへの移行手順を説明します。
この移行により、APIコストの削減、レスポンス速度の向上、オフライン対応が可能になります。

## システム構成

### 1. 現在の構成（修正済み）
- **エラー原因**: APIエンドポイントが `/text-to-speech` → `/api/text-to-speech` に修正
- **拡張機能**: MP3ファイル優先システムを実装
- **フォールバック**: MP3 → TTS API → デフォルト音声

### 2. ファイル構造
```
frontend/
├── public/
│   └── audio/
│       └── conversation/
│           ├── mapping.json          # 音声マッピング設定
│           ├── sou_nan_desu_ne.mp3  # 個別音声ファイル
│           ├── naruhodo_taihen.mp3
│           └── default_response.mp3 # デフォルト音声
├── services/
│   ├── api.js                       # 既存API（修正済み）
│   ├── audioService.js              # 汎用音声サービス
│   └── enhancedTTSApi.js           # 拡張TTSサービス
└── components/
    └── TTSAudioPlayer.js            # 音声プレイヤー（更新済み）
```

## MP3ファイル作成手順

### 1. 必要な音声リスト
以下のテキストに対応するMP3ファイルを作成してください：

| テキスト | ファイル名 | 用途 |
|---------|-----------|------|
| そうなんですね。もう少し詳しく教えていただけますか？ | sou_nan_desu_ne.mp3 | 詳細質問 |
| なるほど、それは大変でしたね。 | naruhodo_taihen.mp3 | 共感表現 |
| 素晴らしいですね！どんなところが特に好きですか？ | subarashii_doko_suki.mp3 | 称賛質問 |
| それは興味深いですね。もっと聞かせてください。 | kyoumi_bukai.mp3 | 興味表現 |
| お気持ちよくわかります。 | okimochi_wakarimasu.mp3 | 共感 |
| それから、どうなりましたか？ | sorekara_dou.mp3 | 続き促し |
| どんな気持ちでしたか？ | donna_kimochi.mp3 | 感情質問 |
| それは楽しそうですね！ | tanoshisou.mp3 | ポジティブ反応 |

### 2. 音声録音仕様
- **形式**: MP3 (128kbps以上推奨)
- **声質**: 落ち着いた男性声（alloyに近い音質）
- **話速**: 0.9倍速相当（ゆっくり明瞭に）
- **トーン**: 優しく共感的な口調
- **録音環境**: 静かな環境、ノイズ除去処理推奨

### 3. 音声ファイル配置
```bash
# 音声ファイルを配置
cp [録音したMP3ファイル] frontend/public/audio/conversation/

# ファイル名を確認
ls -la frontend/public/audio/conversation/*.mp3
```

## 実装詳細

### enhancedTTSApi.js の仕組み
```javascript
// 1. MP3ファイルを優先的にチェック
if (preferMp3 && audioMappings[text]) {
  return mp3Path;
}

// 2. MP3がない場合はTTS APIを使用
return await conversationAPI.textToSpeech(text, options);

// 3. 両方失敗した場合はデフォルト音声
return '/audio/conversation/default_response.mp3';
```

### 新規音声の追加方法
1. `enhancedTTSApi.js` の `audioMappings` オブジェクトに追加
2. 対応するMP3ファイルを作成・配置
3. `mapping.json` を更新（オプション）

## テスト手順

### 1. MP3ファイル再生テスト
```javascript
// ブラウザコンソールで実行
const audio = new Audio('/audio/conversation/sou_nan_desu_ne.mp3');
audio.play();
```

### 2. TTSシステム全体テスト
1. 会話練習画面を開く
2. 正解文章が表示されたら「音声を生成して再生」ボタンをクリック
3. MP3ファイルが再生されることを確認
4. コンソールログで「MP3ファイル使用:」と表示されることを確認

### 3. フォールバックテスト
1. MP3ファイルを一時的にリネーム
2. TTS APIが使用されることを確認
3. APIエラー時にデフォルト音声が再生されることを確認

## トラブルシューティング

### 問題: MP3ファイルが再生されない
- **確認事項**:
  - ファイルパスが正しいか
  - ファイル名が一致しているか
  - MP3ファイルが破損していないか
  - ブラウザのネットワークタブで404エラーが出ていないか

### 問題: TTS APIエラーが続く
- **確認事項**:
  - APIキーが設定されているか
  - エンドポイントURLが `/api/text-to-speech` になっているか
  - バックエンドサーバーが起動しているか

### 問題: 音声が遅延する
- **解決策**:
  - `preloadAudio` 関数を使用して事前読み込み
  - MP3ファイルのサイズを最適化（128kbps推奨）
  - CDNを使用した配信を検討

## パフォーマンス最適化

### 1. 事前読み込み
```javascript
// ページロード時に実行
await enhancedTTSAPI.preloadAudio([
  "そうなんですね。もう少し詳しく教えていただけますか？",
  "なるほど、それは大変でしたね。",
  // 他の頻出テキスト
]);
```

### 2. キャッシュ設定
```nginx
# Nginx設定例
location /audio/ {
  expires 30d;
  add_header Cache-Control "public, immutable";
}
```

## 今後の拡張

### 1. 動的音声生成
- ユーザー名を含む動的テキストへの対応
- テンプレートシステムの実装

### 2. 多言語対応
- 英語、中国語などの音声ファイル追加
- 言語別フォルダ構造の実装

### 3. 音声カスタマイズ
- 複数の声質オプション
- 話速調整機能
- 音量正規化

## まとめ
このシステムにより、TTS APIの使用を最小限に抑えながら、高品質な音声体験を提供できます。
MP3ファイルの準備が整えば、即座に本番環境で使用可能です。