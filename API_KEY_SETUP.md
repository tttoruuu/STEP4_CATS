# API Key設定ガイド

## OpenAI API Key設定手順

### 1. OpenAI API Keyの取得
1. [OpenAI Platform](https://platform.openai.com/api-keys)にアクセス
2. アカウント作成・ログイン
3. 「Create new secret key」でAPI Keyを生成
4. 生成されたキーをコピー（`sk-proj-`で始まる文字列）

### 2. 環境変数への設定

#### 開発環境（ローカル）
`.env`ファイルを編集：
```bash
# .envファイル内
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

#### Docker環境
1. `.env`ファイルの`OPENAI_API_KEY`を実際のキーに変更
2. Docker環境を再起動：
```bash
docker compose -f docker-compose.development.yml down
docker compose -f docker-compose.development.yml up --build
```

### 3. 機能確認
API Keyが正しく設定されると以下の機能が利用可能になります：

- **AIカウンセラー機能** (`/api/counselor/chat`)
- **プロフィール生成機能** (`/api/counselor/profile-generation`)
- **Text-to-Speech機能** (`/api/text-to-speech`)

### 4. トラブルシューティング

#### API Key エラーの場合
```
OpenAI API key not configured
```
→ `.env`ファイルの`OPENAI_API_KEY`を確認

#### 権限エラーの場合
```
You exceeded your current quota
```
→ OpenAI アカウントの利用制限・課金設定を確認

#### ネットワークエラーの場合
```
Connection timeout
```
→ インターネット接続・プロキシ設定を確認

### 5. セキュリティ注意事項
- API Keyを公開リポジトリにコミットしない
- `.env`ファイルは`.gitignore`に含める
- 本番環境では環境変数やシークレット管理サービスを使用する

## 確認コマンド
```bash
# Docker環境でAPI Key設定を確認
docker compose -f docker-compose.development.yml exec backend env | grep OPENAI

# ログでAPI呼び出しを確認
docker compose -f docker-compose.development.yml logs backend | grep -i openai
```