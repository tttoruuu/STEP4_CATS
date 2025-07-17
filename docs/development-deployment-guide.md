# 開発・デプロイガイド

## 概要

このドキュメントは、Miraimアプリケーションの開発環境構築からデプロイまでの完全なワークフローを説明します。

## 目次

1. [開発環境構築](#開発環境構築)
2. [開発ワークフロー](#開発ワークフロー)
3. [ビルド方法](#ビルド方法)
4. [テスト実行](#テスト実行)
5. [デプロイ方法](#デプロイ方法)
6. [トラブルシューティング](#トラブルシューティング)

---

## 開発環境構築

### 前提条件

以下のツールが必要です：

- **Node.js 18.x** - フロントエンド開発
- **Python 3.10** - バックエンド開発
- **Docker Desktop** - コンテナ環境
- **Git** - バージョン管理
- **Azure CLI** - 本番デプロイ（オプション）

### 初回セットアップ

#### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd miraim
```

#### 2. 自動セットアップ（推奨）

```bash
# Makefileを使用した自動セットアップ
make setup
```

#### 3. 手動セットアップ

```bash
# セットアップスクリプトを実行
./scripts/dev-setup.sh
```

#### 4. 環境変数の設定

```bash
# 開発環境用設定をコピー
cp config/.env.example config/.env.development

# 必要に応じて設定を編集
vim config/.env.development
```

---

## 開発ワークフロー

### 利用可能なコマンド

```bash
make help  # 全コマンド一覧を表示
```

### 主要コマンド

| コマンド | 説明 |
|---------|------|
| `make setup` | 初回セットアップ |
| `make dev` | ローカル開発サーバー起動 |
| `make build` | プロダクションビルド |
| `make test` | テスト実行 |
| `make lint` | コード品質チェック |
| `make docker-dev` | Docker開発環境起動 |
| `make docker-prod` | Docker本番環境起動 |
| `make clean` | ビルドファイル削除 |

---

## ビルド方法

開発者は以下の**3つの方法**から選択できます：

### 1. ローカル開発（推奨）

#### メリット
- 高速なホットリロード
- IDEとの連携が良好
- デバッグしやすい
- リソース消費が少ない

#### 使用方法

```bash
# 1. 依存関係のインストール
make install

# 2. 開発サーバーの起動
make dev

# または個別起動
cd frontend && npm run dev  # フロントエンド
cd backend && uvicorn main:app --reload  # バックエンド
```

#### アクセス先
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:8000
- API仕様書: http://localhost:8000/docs

### 2. Docker開発環境

#### メリット
- 環境の統一性
- 本番環境との整合性
- 依存関係の分離
- チーム開発での一貫性

#### 使用方法

```bash
# Docker開発環境の起動
make docker-dev

# または従来の方法
docker-compose -f docker-compose.development.yml up -d

# ログの確認
make docker-logs
```

#### サービス構成
- frontend: Next.js開発サーバー
- backend: FastAPI開発サーバー
- db: MySQL 8.0
- redis: Redis 7

### 3. Docker本番環境（テスト用）

#### メリット
- 本番環境と同じ構成
- パフォーマンステスト可能
- セキュリティ設定の検証

#### 使用方法

```bash
# 本番環境変数の準備
./config/secrets/azure-keyvault.sh  # Azure Key Vault使用
# または
./config/secrets/decrypt.sh  # GPG復号化使用

# Docker本番環境の起動
make docker-prod
```

---

## テスト実行

### 全テストの実行

```bash
make test
```

### 個別テスト

```bash
# フロントエンドテスト
cd frontend
npm test

# バックエンドテスト
cd backend
pytest

# カバレッジ付きテスト
pytest --cov=. --cov-report=html
```

### コード品質チェック

```bash
# リンティング
make lint

# 型チェック
cd frontend && npm run type-check
cd backend && mypy .
```

---

## デプロイ方法

### 環境別デプロイ戦略

| 環境 | ブランチ | トリガー | 用途 |
|------|---------|---------|------|
| 開発 | `develop` | Push/PR | 機能開発・テスト |
| 本番 | `main` | Push | 本番リリース |

### 1. 開発環境デプロイ

#### 自動デプロイ

```bash
# developブランチにプッシュで自動デプロイ
git checkout develop
git add .
git commit -m "feat: 新機能実装"
git push origin develop
```

#### 手動デプロイ

```bash
# GitHub ActionsでManual trigger
# または
./scripts/deploy-dev.sh
```

### 2. 本番環境デプロイ

#### 事前準備

```bash
# 1. Azure Key Vaultの設定
./config/secrets/setup-keyvault.sh

# 2. 本番環境変数の設定
az keyvault secret set --vault-name miraim-keyvault --name "openai-api-key" --value "your-key"
# 他の必要なシークレットも設定

# 3. GitHub Secretsの設定
# GitHub > Settings > Secrets and variables > Actions で以下を設定:
# - AZURE_CREDENTIALS
# - REGISTRY_USERNAME
# - REGISTRY_PASSWORD
# - NEXT_PUBLIC_API_URL
# - DATABASE_URL
```

#### 自動デプロイ

```bash
# mainブランチにプッシュで自動デプロイ
git checkout main
git merge develop
git push origin main
```

#### 手動デプロイ

```bash
# GitHub ActionsでManual trigger
# または
./scripts/deploy-all.sh
```

### 3. デプロイフロー詳細

#### 開発環境デプロイ（`deploy-development.yml`）

1. **テスト実行**
   - Frontend: npm test, lint, type-check
   - Backend: pytest, flake8, mypy
2. **Dockerイメージビルド**
   - 開発用Dockerfileを使用
   - dev-latest タグでpush
3. **Azure Container Appsデプロイ**
   - 開発環境リソースグループに配置
   - 開発用設定で起動
4. **統合テスト**
   - API Health Check
   - 基本機能テスト

#### 本番環境デプロイ（`deploy-production.yml`）

1. **セキュリティスキャン**
   - TruffleHogでシークレット検出
   - 脆弱性スキャン実行
2. **Azure Key Vaultから設定取得**
   - 本番環境変数を安全に取得
3. **Dockerイメージビルド**
   - 本番用Dockerfileを使用
   - latest + SHA タグでpush
4. **Azure Container Appsデプロイ**
   - 本番環境リソースグループに配置
   - 本番用設定で起動
5. **データベースマイグレーション**
   - Alembicマイグレーション実行
6. **ヘルスチェック**
   - サービス正常性確認
7. **通知**
   - Slack通知でデプロイ状況報告
8. **ロールバック**
   - 失敗時の自動ロールバック

---

## トラブルシューティング

### 開発環境の問題

#### Node.js依存関係の問題

```bash
# node_modules削除して再インストール
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Python依存関係の問題

```bash
# 仮想環境の再作成
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Docker環境の問題

```bash
# コンテナとボリュームの完全削除
docker-compose down -v
docker system prune -a

# 再ビルド
docker-compose build --no-cache
```

### データベースの問題

#### マイグレーションエラー

```bash
# データベースリセット
make db-reset

# 手動マイグレーション
cd backend
alembic upgrade head
```

#### 接続エラー

```bash
# データベースサービスの確認
docker-compose ps

# ログの確認
docker-compose logs db
```

### デプロイの問題

#### GitHub Actions失敗

1. **Actions タブでログを確認**
2. **Secrets設定を確認**
3. **Azure認証情報を確認**

#### Azure Container Apps問題

```bash
# コンテナアプリの状態確認
az containerapp show --name miraim-app --resource-group miraim-rg

# ログの確認
az containerapp logs show --name miraim-app --resource-group miraim-rg
```

#### ロールバック手順

```bash
# 前のリビジョンに戻す
az containerapp revision list --name miraim-app --resource-group miraim-rg
az containerapp revision activate --name miraim-app --resource-group miraim-rg --revision [revision-name]

# スクリプトによるロールバック
./scripts/rollback.sh
```

---

## 環境別設定ファイル

### 開発環境
- Docker Compose: `docker-compose.development.yml`
- Dockerfile: `Dockerfile.development`
- 環境変数: `config/.env.development`

### 本番環境
- Docker Compose: `docker-compose.prod.yml`
- Dockerfile: `Dockerfile.production`
- 環境変数: `config/.env.production`（Git管理対象外）

### CI/CD
- 開発デプロイ: `.github/workflows/deploy-development.yml`
- 本番デプロイ: `.github/workflows/deploy-production.yml`

---

## 追加リソース

- [セキュリティガイド](./security-guide.md)
- [GitHub開発手順](./Github開発手順.md)
- [Azure トラブルシューティング](./azure-docker-troubleshooting.md)
- [マイグレーションガイド](./alembic-migration-guide.md)

---

## 質問・サポート

- **一般的な質問**: GitHub Issues
- **開発環境の問題**: チームSlack #dev-support
- **デプロイの問題**: チームSlack #deployments
- **緊急時**: 開発チームリードに直接連絡