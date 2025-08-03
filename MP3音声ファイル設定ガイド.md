# MP3音声ファイル設定ガイド

## 概要
聞く力トレーニング機能では、Azure Blob StorageにアップロードされたMP3ファイルを使用してシャドーイング練習を提供します。

**最終更新**: 2025年8月3日  
**音声対応状況**: 15問中10問で音声対応完了

---

## 🎵 現在の音声ファイル設定状況

### conversationQuizDataでの設定
各シナリオには`shadowingAudio`フィールドでMP3ファイルの完全URLが設定されています。

```javascript
// 例：音声対応済み問題
{
  id: "elicit_001",
  category: "elicit", 
  level: "beginner",
  shadowingAudio: "https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e1-a.mp3",
  shadowingText: "休日はどんなことをして過ごされているんですか？",
  // ... その他のフィールド
}

// 例：音声準備中問題（shadowingAudioプロパティなし）
{
  id: "elicit_003",
  category: "elicit", 
  level: "beginner",
  // shadowingAudio: undefined（プロパティなし）
  shadowingText: "どんなことが特に不安に感じられるんですか？",
  // ... その他のフィールド
}
```

### 現在設定されているMP3ファイル一覧

#### ✅ 音声対応済み

**初級レベル（5問）**
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e1-a.mp3` - "休日はどんなことをして過ごされているんですか？"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e2-a.mp3` - "どんな会社で働かれているんですか？"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e3-a.mp3` - "沖縄のどこが一番印象に残りましたか？"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e4-a.mp3` - "真ん中だと、どんな性格になりましたか？"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/e5-a.mp3` - "そうなんですか。何が苦手なんですか？"

**上級レベル（5問）**
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a1-a.mp3` - "お疲れさま。話したくなったら聞かせてね。今日は美味しいものを食べてリラックスしよう。"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a2-a.mp3` - "どんなところが特に不安に感じるのか、よかったら聞かせてもらえる？"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a3-a.mp3` - "辛い経験を話してくれてありがとう。そういう経験があったからこそ、今の君の考え方があるんだね。"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a4-a.mp3` - "今日、よく実家に連れて行ってくれたね。きっと勇気が必要だったと思う。君の気持ちを大切にしたいよ。"
- `https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a5-a.mp3` - "君がそんなふうに考えているなんて知らなかった。どんな時にそう感じるの？"

#### ⏳ 音声準備中（「音声は準備中です」表示）

**初級レベル（2問）**
- `elicit_003` - "どんなことが特に不安に感じられるんですか？"
- `elicit_004` - "家でゆっくりする時は、どんなことをされているんですか？"

**上級レベル（3問）**
- `advanced_006` - "素敵な考え方だね。君にとって『お互いが成長し続ける』って、どんなイメージなのか聞かせて。"
- `advanced_007` - "僕のことは気にしないで、自分の気持ちを一番大切にして。一緒に考えられることがあれば何でも言って。"
- `advanced_008` - "話してくれてありがとう。無理をしないでくださいね。何かサポートできることがあればいつでも言ってください。"

---

## 🎯 実装済み機能

### 音声エラーハンドリング
- **音声準備中の問題**: `shadowingAudio`プロパティが未定義の場合、「音声は準備中です」エラー画面を表示
- **無効な音声URL**: 空文字、バッククォート、無効なURLの場合はエラー処理
- **ネットワークエラー**: 音声読み込み失敗時のフォールバック処理

### 出題順序の最適化
- **音声優先出題**: 音声がある設問を優先的に出題
- **順序ベース選択**: ランダム選択から音声対応問題を優先する順序選択に変更

### 音声再生機能
```javascript
// ShadowingPractice.jsでの実装
const isValidAudio = (audioUrl) => {
  if (audioUrl === undefined || audioUrl === null) return false;
  if (!audioUrl) return false;
  const trimmed = String(audioUrl).trim();
  if (trimmed === '' || trimmed === '``' || trimmed.match(/^`+$/)) return false;
  if (!trimmed.startsWith('http')) return false;
  return true;
};

// advanced_002の特別処理（音声URL強制設定）
if (scenario.id === 'advanced_002') {
  audioUrl = 'https://blobeastasiafor9th.blob.core.windows.net/wild-nyatsby-mp3-test/a2-a.mp3';
}
```

---

## Azure Blob Storage設定手順

### 1. Azure Blob Storageコンテナの準備
```bash
# コンテナ名例
audio-files

# 推奨フォルダ構造
/audio/
  /shadowing/
    /beginner/
      elicit_001.mp3
      deepen_001.mp3
      ...
    /advanced/
      advanced_001.mp3
      advanced_002.mp3
      ...
```

### 2. MP3ファイルのアップロード方法

#### Azure Portal経由
1. Azure Portal → Storage Account → Containers → audio-files
2. Upload → Files → MP3ファイルを選択
3. Advanced → Blob type: Block blob
4. Access tier: Hot（頻繁にアクセスされるため）

#### Azure CLI経由
```bash
# 単一ファイルアップロード
az storage blob upload \
  --account-name <storage-account-name> \
  --container-name audio-files \
  --name audio/shadowing/elicit_001.mp3 \
  --file ./elicit_001.mp3 \
  --account-key <storage-account-key>

# 一括アップロード
az storage blob upload-batch \
  --source ./audio-files \
  --destination audio-files \
  --account-name <storage-account-name> \
  --account-key <storage-account-key>
```

### 3. パブリックアクセス設定
```bash
# コンテナをパブリック読み取り可能に設定
az storage container set-permission \
  --name audio-files \
  --public-access blob \
  --account-name <storage-account-name> \
  --account-key <storage-account-key>
```

---

## アプリケーション設定の更新

### 1. 環境変数の設定
```bash
# .env ファイルに追加
AZURE_BLOB_BASE_URL=https://<storage-account-name>.blob.core.windows.net/audio-files
```

### 2. conversationQuizData.jsの更新
現在は相対パス設定ですが、Azure Blob Storage使用時は絶対URLに変更：

```javascript
// 現在の設定（相対パス）
shadowingAudio: "/audio/shadowing/e1-a.mp3"

// Azure Blob Storage使用時（絶対URL）
shadowingAudio: "https://<storage-account-name>.blob.core.windows.net/audio-files/audio/shadowing/e1-a.mp3"
```

### 3. 動的URL生成の実装（推奨）
```javascript
// utils/audioUtils.js （新規作成推奨）
export const getAudioUrl = (audioPath) => {
  const baseUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_BASE_URL || '';
  return audioPath.startsWith('http') ? audioPath : `${baseUrl}${audioPath}`;
};

// ShadowingPractice.jsでの使用
const audioUrl = getAudioUrl(scenario.shadowingAudio) || '/audio/default.mp3';
```

---

## MP3ファイル仕様

### 推奨設定
- **ファイル形式**: MP3
- **ビットレート**: 128kbps（音質とファイルサイズのバランス）
- **サンプリングレート**: 44.1kHz
- **チャンネル**: モノラル（ファイルサイズ削減のため）
- **長さ**: 3〜10秒程度（短い返答文のため）

### 音声品質要件
- **話者**: 自然な日本語を話せる女性または男性
- **話速**: やや遅め（シャドーイングしやすいペース）
- **発音**: 明瞭で聞き取りやすい
- **感情**: 自然で親しみやすい

---

## 実装されている再生機能

### ShadowingPractice.jsでの実装
```javascript
// 現在の実装
<button
  onClick={() => {
    const audioUrl = scenario.shadowingAudio || '/audio/default.mp3';
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('音声再生エラー:', error);
      alert('音声の再生に失敗しました。');
    });
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
>
  練習する
</button>
```

### エラーハンドリング
- ファイルが見つからない場合のフォールバック
- ネットワークエラー時の適切なメッセージ表示
- ブラウザ互換性の考慮

---

## テスト手順

### 1. ローカルテスト
```bash
# publicフォルダに音声ファイルを配置してテスト
mkdir -p /frontend/public/audio/shadowing
# MP3ファイルを配置
# Docker環境を再起動
docker-compose -f docker-compose.development.yml restart frontend
```

### 2. 本番環境テスト
1. Azure Blob StorageにMP3ファイルをアップロード
2. URLの動作確認（ブラウザで直接アクセス）
3. アプリケーションでの再生テスト

### 3. 動作確認項目
- [ ] 初級レベル全7問の音声再生
- [ ] 上級レベル全8問の音声再生  
- [ ] エラー時のフォールバック動作
- [ ] 異なるブラウザでの互換性
- [ ] モバイルデバイスでの動作

---

## トラブルシューティング

### よくある問題

#### 1. 音声が再生されない
- **原因**: ファイルパスの間違い、CORS設定、ファイル形式
- **対処**: コンソールエラーを確認、パスを検証

#### 2. 音声の読み込みが遅い
- **原因**: ファイルサイズが大きい、CDNの未使用
- **対処**: MP3圧縮、Azure CDNの使用検討

#### 3. モバイルで再生できない
- **原因**: ブラウザの自動再生ポリシー
- **対処**: ユーザーインタラクション後の再生に限定（現在の実装は対応済み）

---

## 今後の拡張可能性

### 1. 音声品質の向上
- より自然な音声合成技術の採用
- 複数話者による音声バリエーション

### 2. 機能の拡張
- 再生速度調整機能
- 音声波形の視覚化
- 音声の一時停止・再開機能

### 3. 効率化
- 音声ファイルの事前ローディング
- キャッシュ機能の実装
- CDN配信の最適化