# Miraim デプロイに必要なAPIキー・環境変数 完全ガイド

このガイドでは、Miraimアプリケーションをデプロイするために必要なすべてのAPIキー、サービスアカウント、環境変数について説明します。

## 📌 必須APIキー・サービス一覧

### 1. OpenAI API（必須）
**用途**: 
- AIカウンセラー機能
- 会話練習のAI応答生成
- 音声認識（Whisper API）
- 音声合成（TTS API）
- プロフィール文生成

**必要なキー**:
- `OPENAI_API_KEY`: OpenAI APIキー

### 2. Azure MySQL Database（必須）
**用途**: 
- ユーザー情報の保存
- 会話履歴の記録
- 診断結果の保存

**必要な情報**:
- `MYSQL_HOST`: データベースホスト
- `MYSQL_PORT`: ポート番号（通常3306）
- `MYSQL_DATABASE`: データベース名
- `MYSQL_USER`: ユーザー名
- `MYSQL_PASSWORD`: パスワード
- `MYSQL_SSL_DISABLED`: SSL接続設定

### 3. JWT認証（必須）
**用途**: 
- ユーザー認証
- セッション管理

**必要な情報**:
- `JWT_SECRET`: JWT署名用秘密鍵（32文字以上のランダム文字列）

### 4. Azure Container Apps（必須）
**用途**: 
- アプリケーションホスティング

**必要な情報**:
- Azure サブスクリプション
- リソースグループ
- Container Registry認証情報

## 🔑 APIキー取得方法

### 1. OpenAI API キーの取得

1. **アカウント作成**
   ```
   https://platform.openai.com/signup
   ```

2. **APIキー生成**
   - ダッシュボードにログイン
   - 左メニューから「API keys」選択
   - 「Create new secret key」クリック
   - キー名を入力（例：miraim-production）
   - キーをコピー（一度しか表示されません！）

3. **料金設定**
   - 「Billing」から支払い方法を設定
   - 使用上限を設定（推奨：月$50程度から開始）

4. **使用モデルと料金目安**
   ```
   GPT-4o-mini: $0.15 / 1M input tokens, $0.60 / 1M output tokens
   Whisper API: $0.006 / minute
   TTS API: $15 / 1M characters
   
   月間1000ユーザー想定コスト: 約$30-50
   ```

### 2. Azure MySQL Database セットアップ

```bash
# Azure CLIでの作成（前のガイド参照）
az mysql flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name miraim-mysql-server \
  --location japaneast \
  --admin-user miraimadmin \
  --admin-password "StrongP@ssw0rd2024!" \
  --sku-name B_Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 8.0.21

# 接続文字列の形式
DATABASE_URL=mysql+pymysql://miraimadmin:StrongP@ssw0rd2024!@miraim-mysql-server.mysql.database.azure.com:3306/miraim_db?ssl_disabled=False
```

### 3. JWT Secret 生成

```bash
# Linux/Mac
openssl rand -hex 32

# または Python
python -c "import secrets; print(secrets.token_hex(32))"

# 例：生成される値
# a7f8d9e2c4b6a1e5f9d8c7b4a2e1f5d9c8b7a4e2f1d9c8b7a4e2f1d9c8b7a4e2
```

## 📝 環境変数設定ファイル

### 本番環境用 .env.production
```bash
# ==================================
# 🔑 APIキー・認証情報
# ==================================

# OpenAI API（必須）
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx  # ← 取得したAPIキーを設定
OPENAI_MODEL=gpt-4o-mini  # 使用モデル（コスト重視）

# JWT認証（必須）
JWT_SECRET=your-32-character-secret-key-here  # ← openssl rand -hex 32 で生成
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# ==================================
# 🗄️ データベース設定（必須）
# ==================================

# Azure MySQL
MYSQL_HOST=your-mysql-server.mysql.database.azure.com
MYSQL_PORT=3306
MYSQL_DATABASE=miraim_db
MYSQL_USER=miraimadmin
MYSQL_PASSWORD=YourStrongPassword2024!
MYSQL_SSL_DISABLED=false

# 統合接続文字列
DATABASE_URL=mysql+pymysql://miraimadmin:YourStrongPassword2024!@your-mysql-server.mysql.database.azure.com:3306/miraim_db?ssl_disabled=False

# ==================================
# 🌐 アプリケーション設定
# ==================================

# 環境設定
NODE_ENV=production
ENVIRONMENT=production
ENV=production

# CORS設定
CORS_ORIGINS=["https://your-frontend-domain.azurecontainerapps.io"]
FRONTEND_ORIGIN=https://your-frontend-domain.azurecontainerapps.io

# ==================================
# 🚀 Azure Container Apps設定
# ==================================

# Container Registry
ACR_LOGIN_SERVER=yourregistry.azurecr.io
ACR_USERNAME=yourregistry
ACR_PASSWORD=your-acr-password

# リソース情報
RESOURCE_GROUP=rg-miraim-prod
LOCATION=japaneast
CONTAINERAPPS_ENVIRONMENT=miraim-env

# デプロイ後に設定
BACKEND_URL=https://miraim-backend.xxxxx.azurecontainerapps.io
FRONTEND_URL=https://miraim-frontend.xxxxx.azurecontainerapps.io
NEXT_PUBLIC_API_URL=https://miraim-backend.xxxxx.azurecontainerapps.io

# ==================================
# 📊 ログ・モニタリング（オプション）
# ==================================

# Log Analytics（Container Apps作成時に自動生成）
WORKSPACE_ID=your-workspace-id
WORKSPACE_KEY=your-workspace-key

# ログレベル
LOG_LEVEL=ERROR
```

## ⚠️ セキュリティ注意事項

### 1. 絶対にGitHubにコミットしないファイル
```bash
# .gitignoreに必ず含める
.env
.env.local
.env.production
.env.*.local
CLAUDE_PRIVATE.md
*.key
*.pem
```

### 2. APIキー管理のベストプラクティス
- **ローテーション**: 3ヶ月ごとにAPIキーを更新
- **最小権限**: 必要最小限の権限のみ付与
- **監視**: 使用量を定期的にチェック
- **分離**: 開発/ステージング/本番で異なるキー使用

### 3. Azure Key Vault使用（推奨）
```bash
# Key Vault作成
az keyvault create \
  --name miraim-keyvault \
  --resource-group $RESOURCE_GROUP \
  --location japaneast

# シークレット追加
az keyvault secret set \
  --vault-name miraim-keyvault \
  --name openai-api-key \
  --value "sk-proj-xxxxxxxxxxxxx"

# Container Appsから参照
az containerapp update \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars OPENAI_API_KEY=keyvault-secret://miraim-keyvault/openai-api-key
```

## 🚀 環境変数設定手順

### 1. ローカル開発環境
```bash
# プロジェクトルートに.env.localファイル作成
cp .env.example .env.local

# 編集
vim .env.local
# 必要な値を設定
```

### 2. Container Apps環境変数設定
```bash
# バックエンド環境変数設定
az containerapp update \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars \
    OPENAI_API_KEY="sk-proj-xxxxx" \
    DATABASE_URL="mysql+pymysql://..." \
    JWT_SECRET="your-secret" \
    NODE_ENV="production"

# フロントエンド環境変数設定
az containerapp update \
  --name miraim-frontend \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars \
    NEXT_PUBLIC_API_URL="https://backend-url" \
    NODE_ENV="production"
```

## 📋 デプロイ前チェックリスト

### 必須項目
- [ ] OpenAI APIキー取得済み
- [ ] OpenAI 支払い方法設定済み
- [ ] Azure MySQL作成済み
- [ ] データベース接続確認済み
- [ ] JWT Secret生成済み（32文字以上）
- [ ] .env.production作成済み
- [ ] .gitignoreで環境変数ファイル除外確認

### 推奨項目
- [ ] Azure Key Vault設定
- [ ] APIキー使用上限設定
- [ ] バックアップ設定
- [ ] モニタリング設定
- [ ] アラート設定

## 🔧 トラブルシューティング

### OpenAI APIエラー
```bash
# エラー: Invalid API key
→ APIキーの先頭・末尾の空白確認
→ 正しいプロジェクトのキーか確認

# エラー: Rate limit exceeded
→ 使用上限の確認・引き上げ
→ リトライロジック実装確認
```

### データベース接続エラー
```bash
# エラー: Can't connect to MySQL server
→ ファイアウォール設定確認
→ SSL設定確認（MYSQL_SSL_DISABLED）
→ 接続文字列のフォーマット確認
```

### JWT認証エラー
```bash
# エラー: Invalid token
→ JWT_SECRETが全サービスで同一か確認
→ 環境変数が正しく設定されているか確認
```

## 📞 サポート

問題が発生した場合の確認順序：
1. 環境変数の設定確認
2. APIキーの有効性確認
3. ネットワーク接続確認
4. ログ確認
5. このガイドのトラブルシューティング参照

---

**重要**: このファイルには実際のAPIキーやパスワードを記載しないでください。
実際の値は`.env.production`ファイルまたはAzure Key Vaultに保存してください。