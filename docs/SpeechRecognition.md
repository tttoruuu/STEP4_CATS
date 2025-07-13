# 音声認識機能実装ドキュメント

## 概要

STEP4_CATSアプリケーションにOpenAI Whisper APIを使用した音声認識機能を実装しました。ユーザーは会話練習ページで音声入力を行い、リアルタイムでテキストに変換できます。

## 実装内容

### 1. バックエンド実装 (FastAPI)

#### エンドポイント
- **URL**: `/speech-to-text`
- **メソッド**: POST
- **認証**: Bearer Token認証が必要

#### 実装場所
`backend/main.py` (lines 642-731)

#### 機能詳細
- OpenAI Whisper-1 モデルを使用
- 対応音声形式: wav, mp3, m4a, webm
- 最大ファイルサイズ: 25MB
- 言語設定: 日本語 ("ja")
- 一時ファイル処理とクリーンアップ

#### パラメータ
```python
audio: UploadFile = File(...)  # 音声ファイル
current_user: User = Depends(get_current_user)  # 認証済みユーザー
```

#### レスポンス
```json
{
  "text": "変換されたテキスト",
  "duration": 音声の長さ（秒）
}
```

### 2. フロントエンド実装 (Next.js)

#### APIサービス実装
`frontend/services/api.js` - conversationAPI.speechToText メソッド

```javascript
speechToText: async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  const response = await axios.post(`${FINAL_API_BASE_URL}/speech-to-text`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
}
```

#### 使用ページ
`frontend/pages/conversation/practice.js`

#### 実装機能
- マイクボタンクリックで録音開始/停止
- MediaRecorder APIを使用した音声録音
- 録音データをBlob → File形式に変換
- 音声認識結果を入力欄に自動設定

### 3. 音声録音フロー

1. **録音開始**
   - ユーザーがマイクボタンをクリック
   - `navigator.mediaDevices.getUserMedia()`でマイクアクセス
   - `MediaRecorder`で録音開始

2. **録音停止**
   - 再度マイクボタンをクリック
   - 録音データを`Blob`として取得
   - `File`オブジェクトに変換

3. **音声認識**
   - `apiService.conversation.speechToText()`を呼び出し
   - バックエンドでWhisper APIに送信
   - 認識結果をテキスト入力欄に設定

## 環境設定

### 必要な環境変数
`backend/.env`
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 依存関係
- **バックエンド**: `httpx`, `aiofiles`, `tempfile`
- **フロントエンド**: `axios`, `MediaRecorder API`

## 使用方法

### 1. 開発環境での起動

#### Docker使用の場合
```bash
docker-compose up -d
```

#### 個別起動の場合
```bash
# バックエンド
cd backend
uvicorn main:app --reload

# フロントエンド
cd frontend  
npm run dev
```

### 2. 音声機能のテスト

1. http://localhost:3000 でログイン
2. 会話練習ページに移動: `/conversation/practice?partnerId=1&meetingCount=first&rallyCount=8`
3. マイクボタン（🎤）をクリックして録音開始
4. 音声入力後、再度マイクボタンをクリックして録音停止
5. 認識されたテキストが入力欄に表示されることを確認

### 3. ブラウザ設定

#### マイクアクセス許可
- Chrome/Edge: アドレスバー左の🔒アイコン → マイク → 許可
- Firefox: アドレスバー左の🔒アイコン → マイクロフォン → 許可
- Safari: Safari → 設定 → Webサイト → マイク → localhost:3000を許可

## トラブルシューティング

### よくある問題

#### 1. 422 Unprocessable Entity エラー
- **原因**: パラメータ名の不一致
- **解決**: `formData.append('audio', audioFile)` を確認

#### 2. マイクアクセス拒否
- **原因**: ブラウザでマイク許可が無効
- **解決**: ブラウザ設定でマイクアクセスを許可

#### 3. OPENAI_API_KEY エラー
- **原因**: API キーが設定されていない
- **解決**: `backend/.env` にAPI キーを設定

#### 4. Mixed Content エラー
- **原因**: HTTPSページからHTTPリソースへのアクセス
- **解決**: 本番環境では全てHTTPS化

### デバッグ方法

#### フロントエンド
- ブラウザ開発者ツール（F12）のコンソールタブでエラー確認
- Networkタブでリクエスト/レスポンス詳細確認

#### バックエンド
```bash
# Dockerログ確認
docker-compose logs -f backend

# 環境変数確認
docker-compose exec backend printenv | grep OPENAI
```

## 技術仕様

### 音声形式対応
- **入力**: WebM（ブラウザ録音）
- **対応形式**: WAV, MP3, M4A, WebM
- **制限**: 最大25MB

### セキュリティ
- JWT認証必須
- 一時ファイルの自動削除
- ファイル形式・サイズ検証

### パフォーマンス
- 非同期処理による応答性向上
- 適切なエラーハンドリング
- メモリリークの防止

## 今後の拡張案

1. **多言語対応**: 言語自動検出機能
2. **音声品質向上**: ノイズキャンセリング
3. **リアルタイム変換**: ストリーミング音声認識
4. **音声分析**: 感情分析、話速分析
5. **音声合成**: Text-to-Speech機能の追加

## Git開発フロー

### ブランチ戦略

#### 1. 機能ブランチの作成
```bash
# mainブランチから最新を取得
git checkout main
git pull origin main

# 音声認識機能用のブランチを作成
git checkout -b feature/speech-recognition

# または具体的な作業内容を含む名前
git checkout -b feature/whisper-api-integration
```

#### 2. 開発作業の流れ
```bash
# 作業ブランチで開発
git add .
git commit -m "feat: Whisper APIエンドポイント実装

- /speech-to-text エンドポイント追加
- OpenAI Whisper-1モデル統合
- 音声ファイル形式・サイズ検証
- 一時ファイル処理とクリーンアップ"

# 定期的にリモートにプッシュ
git push origin feature/speech-recognition
```

#### 3. プルリクエスト作成
```bash
# GitHub CLIを使用する場合
gh pr create --title "音声認識機能実装（Whisper API統合）" --body "
## 概要
OpenAI Whisper APIを使用した音声認識機能を実装

## 変更内容
- バックエンド: /speech-to-text エンドポイント実装
- フロントエンド: speechToTextメソッド追加
- 会話練習ページに音声入力機能統合

## テスト方法
1. docker-compose up -d で起動
2. /conversation/practice ページで音声録音テスト
3. 認識結果がテキスト欄に表示されることを確認

## 関連Issue
- #XX 音声入力機能の実装

## レビューポイント
- OpenAI API KEY設定の確認
- エラーハンドリングの妥当性
- セキュリティ考慮事項
"

# Webブラウザでプルリクエスト作成も可能
git push origin feature/speech-recognition
# GitHub上でCompare & pull requestボタンをクリック
```

### コミットメッセージ規約

#### 推奨フォーマット
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### タイプ一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイル修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: その他の変更

#### 音声認識機能での例
```bash
# バックエンド実装
git commit -m "feat(api): Whisper API音声認識エンドポイント実装

- /speech-to-text POST エンドポイント追加
- OpenAI Whisper-1モデル統合
- 対応形式: wav, mp3, m4a, webm (最大25MB)
- JWT認証とファイル検証機能"

# フロントエンド実装
git commit -m "feat(frontend): 音声録音・認識機能追加

- conversationAPI.speechToText メソッド実装
- MediaRecorder APIによる音声録音
- 会話練習ページに音声入力UI統合"

# バグ修正
git commit -m "fix(api): speechToTextパラメータ名修正

- FormDataパラメータを'file'から'audio'に変更
- 422エラーの解消"

# ドキュメント追加
git commit -m "docs: 音声認識機能実装ドキュメント追加

- SpeechRecognition.md作成
- 実装仕様・使用方法・トラブルシューティング記載"
```

### ブランチ管理のベストプラクティス

#### 1. ブランチ命名規則
```bash
# 機能追加
feature/機能名
feature/speech-recognition
feature/whisper-integration

# バグ修正
fix/問題内容
fix/speech-api-422-error
fix/audio-parameter-mismatch

# ホットフィックス
hotfix/緊急修正内容
hotfix/openai-api-key-validation

# リリース準備
release/v1.2.0
```

#### 2. マージ戦略
```bash
# プルリクエストマージ後
git checkout main
git pull origin main
git branch -d feature/speech-recognition  # ローカルブランチ削除

# リモートブランチも削除（GitHubで自動削除設定推奨）
git push origin --delete feature/speech-recognition
```

### チーム開発での注意点

#### 1. コンフリクト防止
```bash
# 定期的にmainブランチの変更を取り込む
git checkout feature/speech-recognition
git fetch origin
git rebase origin/main

# または
git merge origin/main
```

#### 2. 環境設定ファイルの管理
```bash
# .env ファイルは追跡しない
echo "backend/.env" >> .gitignore

# .env.example で設定例を共有
cp backend/.env backend/.env.example
git add backend/.env.example
```

#### 3. レビュー観点
- **機能性**: 音声認識が正常に動作するか
- **セキュリティ**: API KEY漏洩がないか
- **パフォーマンス**: ファイルサイズ制限が適切か
- **エラーハンドリング**: 適切な例外処理があるか
- **コードスタイル**: チームのコーディング規約に準拠しているか

### CI/CD連携

#### GitHub Actions例
```yaml
# .github/workflows/speech-recognition-test.yml
name: Speech Recognition Tests

on:
  pull_request:
    paths:
      - 'backend/main.py'
      - 'frontend/services/api.js'
      - 'frontend/pages/conversation/practice.js'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test Speech Recognition API
        run: |
          # API エンドポイントのテスト
          pytest backend/tests/test_speech_recognition.py
```

## 参考資料

- [OpenAI Whisper API Documentation](https://platform.openai.com/docs/guides/speech-to-text)
- [MediaRecorder API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [FormData API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Git Flow - Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)