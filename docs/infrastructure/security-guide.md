# セキュリティガイド

## 概要

このドキュメントは、Miraimアプリケーションのセキュリティ設定と運用方法について説明します。

## 環境分離アーキテクチャ

### ファイル構成

```
config/
├── .env.development      # 開発環境（Git管理対象）
├── .env.test            # テスト環境（Git管理対象）
├── .env.production      # 本番環境（Git管理対象外）
├── .env.example         # 設定例（Git管理対象）
└── secrets/
    ├── .env.prod.encrypted    # 暗号化された本番設定
    ├── encrypt.sh            # 暗号化スクリプト
    ├── decrypt.sh            # 復号化スクリプト
    ├── azure-keyvault.sh     # Azure Key Vault連携
    └── setup-keyvault.sh     # Key Vault初期設定
```

### 環境別設定

| 環境 | 設定ファイル | Git管理 | 用途 |
|------|--------------|---------|------|
| 開発 | `.env.development` | ✅ | ローカル開発、ダミー値使用 |
| テスト | `.env.test` | ✅ | 自動テスト実行時 |
| 本番 | `.env.production` | ❌ | 本番環境、実際の値使用 |

## シークレット管理

### 1. Azure Key Vault（推奨）

#### セットアップ

```bash
# Key Vaultの作成
./config/secrets/setup-keyvault.sh

# シークレットの設定
az keyvault secret set --vault-name miraim-keyvault --name "openai-api-key" --value "your-actual-key"
az keyvault secret set --vault-name miraim-keyvault --name "mysql-password" --value "your-actual-password"
```

#### 本番環境変数の取得

```bash
# Azure Key Vaultから環境変数ファイルを生成
./config/secrets/azure-keyvault.sh
```

### 2. GPG暗号化（代替案）

#### 暗号化

```bash
# 本番環境変数を暗号化
./config/secrets/encrypt.sh
```

#### 復号化

```bash
# 暗号化ファイルから本番環境変数を復号化
./config/secrets/decrypt.sh
```

## Docker環境分離

### 開発環境

```bash
# 開発環境の起動
docker-compose -f docker-compose.development.yml up -d
```

**特徴:**
- ホットリロード対応
- 開発用デバッグツール含む
- ボリュームマウントでコード変更反映

### 本番環境

```bash
# 本番環境の起動
docker-compose -f docker-compose.prod.yml up -d
```

**特徴:**
- 最小限のイメージサイズ
- 非特権ユーザーで実行
- セキュリティ最適化

## CI/CD セキュリティ

### GitHub Actions設定

#### 必要なシークレット

```yaml
# 本番環境用
AZURE_CREDENTIALS          # Azure認証情報
REGISTRY_USERNAME          # コンテナレジストリユーザー
REGISTRY_PASSWORD          # コンテナレジストリパスワード
NEXT_PUBLIC_API_URL        # フロントエンドAPI URL
DATABASE_URL               # データベース接続文字列
SLACK_WEBHOOK             # 通知用Webhook

# 開発環境用
AZURE_CREDENTIALS_DEV      # 開発環境Azure認証情報
DEV_API_URL               # 開発環境API URL
```

### セキュリティスキャン

#### 自動実行される検査

1. **シークレット検出**: TruffleHogによる機密情報漏洩検査
2. **脆弱性スキャン**: 依存関係の既知の脆弱性検査
3. **コード品質**: ESLint, Flake8による静的解析
4. **型チェック**: TypeScript, mypyによる型安全性検査

## 運用セキュリティ

### .gitignoreによる保護

```gitignore
# 機密情報ファイル
.env
.env.production
.env.local
config/.env.production

# 暗号化キー
*.pem
*.key
*.crt
```

### ファイル権限

```bash
# 本番環境変数ファイルの権限設定
chmod 600 config/.env.production

# スクリプトファイルの実行権限
chmod +x config/secrets/*.sh
```

### 定期的なセキュリティタスク

#### 毎月実行

- [ ] 依存関係の更新とセキュリティパッチ適用
- [ ] アクセスログの監査
- [ ] Key Vaultアクセス権限の確認

#### 四半期実行

- [ ] パスワード・APIキーの更新
- [ ] セキュリティスキャンの実行
- [ ] バックアップの整合性確認

## 緊急時対応

### インシデント対応手順

1. **発見**: セキュリティインシデントの発見
2. **分離**: 影響範囲の特定と分離
3. **対応**: 脆弱性の修正
4. **復旧**: サービスの復旧
5. **報告**: インシデントレポートの作成

### ロールバック手順

```bash
# 自動ロールバック（CI/CDで障害検出時）
./scripts/rollback.sh

# 手動ロールバック
az containerapp revision list --name miraim-app --resource-group miraim-rg
az containerapp revision activate --name miraim-app --resource-group miraim-rg --revision [previous-revision]
```

## コンプライアンス

### 個人情報保護

- **データ暗号化**: 保存時・転送時の暗号化
- **アクセス制御**: 最小権限の原則
- **ログ管理**: 個人情報を含まないログ記録
- **データ保持**: 適切な保持期間の設定

### 監査ログ

```bash
# Azure Key Vaultアクセスログ
az monitor activity-log list --resource-group miraim-rg --max-events 100

# コンテナログ
az containerapp logs show --name miraim-app --resource-group miraim-rg
```

## 問い合わせ

セキュリティに関する質問や報告は以下まで：

- **一般的な質問**: GitHub Issues
- **セキュリティ脆弱性**: security@miraim.com（非公開）
- **緊急時**: セキュリティ責任者に直接連絡