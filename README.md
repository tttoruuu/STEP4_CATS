<<<<<<< Updated upstream
# 🗣️ Miraim - AI会話練習アプリ

結婚相談所での会話練習を支援するWebアプリケーションです。AI相手との自然な会話練習と詳細なフィードバックを提供します。

## 📋 主な機能

- **🤖 AI会話練習**: OpenAI GPT-4oを使用した自然な会話シミュレーション
- **👥 複数の会話相手**: 様々な性格・バックグラウンドのキャラクター
- **📊 詳細フィードバック**: 会話後のAI分析による改善点の提案
- **🎯 難易度調整**: 初回会話・継続会話での段階的練習
- **🔐 ユーザー管理**: 安全な認証システムとプロフィール管理

## 🛠️ 技術スタック

- **Frontend**: Next.js (React) + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: MySQL
- **AI**: OpenAI GPT-4o
- **Infrastructure**: Docker + Azure Container Apps

## 📁 プロジェクト構造

```
miraim/
├── frontend/           # Next.js フロントエンド
│   ├── pages/         # ページコンポーネント
│   ├── components/    # 再利用可能コンポーネント
│   └── services/      # API通信
├── backend/           # FastAPI バックエンド
│   ├── models/        # データベースモデル
│   ├── routers/       # APIルーター
│   ├── schemas/       # Pydanticスキーマ
│   └── auth/          # 認証機能
├── scripts/           # デプロイメントスクリプト
├── docs/              # ドキュメント
└── docker-compose.yml # Docker設定
```

## 🚀 クイックスタート

### 前提条件

- Docker Desktop
- OpenAI APIキー

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd miraim
```

### 2. 環境変数の設定

#### ルートディレクトリに `.env` を作成

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

#### `backend/.env` を作成

```bash
ENV=development
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=mysql+pymysql://root:password@db:3306/testdb
```

#### `frontend/.env.local` を作成

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. アプリケーションの起動

```bash
docker-compose up -d
```

### 4. アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs

## 🔧 開発

### データベースマイグレーション

```bash
# マイグレーション作成
docker compose exec backend alembic revision --autogenerate -m "変更内容"

# マイグレーション適用
docker compose exec backend alembic upgrade head
```

### ログの確認

```bash
# 全体のログ
docker-compose logs -f

# 個別サービス
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🚀 デプロイメント

### Azure Container Apps へのデプロイ

```bash
# 完全デプロイ
./scripts/deploy-all.sh

# 個別デプロイ
./scripts/deploy-backend.sh
./scripts/deploy-frontend.sh
```

詳細な手順は [scripts/README.md](scripts/README.md) を参照してください。

## 📚 ドキュメント

- [セットアップガイド](docs/setup-guide.md) - 詳細なローカル環境構築手順
- [GitHub開発手順](docs/Github開発手順.md) - チーム開発のワークフロー
- [マイグレーションガイド](docs/alembic-migration-guide.md) - データベース変更の管理
- [Azure トラブルシューティング](docs/azure-docker-troubleshooting.md) - デプロイ時の問題解決

## 🤝 開発チーム向け

### ブランチ戦略

- `main`: 本番環境用（常にデプロイ可能な状態）
- `feature/*`: 機能開発用ブランチ
- `fix/*`: バグ修正用ブランチ

### コントリビューション

1. feature ブランチを作成
2. 変更を実装
3. Pull Request を作成
4. レビュー後に main へマージ

詳細は [docs/Github開発手順.md](docs/Github開発手順.md) を参照してください。

## ⚠️ セキュリティ

- **APIキーの管理**: `.env` ファイルは絶対にコミットしない
- **データベース**: 本番環境では適切なファイアウォール設定を行う
- **HTTPS**: 本番環境では必ずHTTPS接続を使用する

## 📄 ライセンス

このプロジェクトは私的利用を目的としています。

## 🐛 問題報告

バグやその他の問題を発見した場合は、Issue を作成してください。
=======
# お見合い会話練習アプリ

## 📝 プロジェクト概要

このプロジェクトは、お見合いの際の会話を練習するためのWebアプリケーションです。ユーザーは架空の会話相手を登録し、様々なシナリオで会話練習を行うことができます。フロントエンドはNext.js、バックエンドはFastAPI、データベースはMySQLを使用しています。

## 🛠️ システム構成

```
docker-next-fastapi-mysql/
├── frontend/        # Next.jsフロントエンド
├── backend/         # FastAPIバックエンド
├── mysql/           # MySQLデータベース
└── docker-compose.yml  # Docker設定
```

## 🚀 主要機能

1. **ユーザー管理**
   - ユーザー登録・ログイン
   - プロフィール管理

2. **会話相手管理**
   - 会話相手の登録
   - 会話相手の一覧表示・削除

3. **会話練習**
   - 会話シナリオの選択
   - 会う回数の選択（初めて、2-3回目、それ以上）
   - 会話シミュレーション（ChatGPT APIを利用）

## 追加した機能：X-Forwarded-Proto ヘッダー対応

Azure Container AppsなどのリバースプロキシでHTTPSリクエストを適切に処理するための対応を追加しました。

### 主な変更点

1. X-Forwarded-Protoヘッダーを処理するミドルウェアの実装
2. リクエストヘッダー検証用の `/headers` エンドポイントの追加

### 検証方法

ローカル環境での確認:

```bash
# X-Forwarded-Protoヘッダーを含むリクエスト
curl -v -H "X-Forwarded-Proto: https" http://localhost:8000/headers | json_pp

# 通常のリクエスト（ヘッダーなし）
curl -v http://localhost:8000/headers | json_pp
```

詳細な手順とAzure Container Appsでの設定確認については、[X-Forwarded-Proto ヘッダー検証ガイド](docs/azure-proxy-check.md)を参照してください。

## 🏁 クイックスタート

以下の手順で開発環境をセットアップできます：

```bash
# リポジトリのクローン
git clone <repository-url>
cd docker-next-fastapi-mysql

# 環境変数の設定（.envファイルのコピー）
cp .env.example .env
# .envファイルを編集してOPENAI_API_KEYを設定

# Dockerコンテナのビルドと起動
docker compose up -d --build

# ログの確認
docker compose logs -f
```

セットアップ後に以下のURLでアクセスできます：

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- Swagger UI (API仕様書): http://localhost:8000/docs

## 🚢 Azure Container Appsへのデプロイ

このプロジェクトはAzure Container Appsにデプロイすることを前提としています。デプロイは以下の手順で行えます：

```bash
# 1. Azureへのログイン
az login

# 2. 環境変数の設定 (.envファイルを作成して必要な情報を設定)
cp .env.example .env
# 重要: OPENAI_API_KEYを必ず設定してください

# 3. リソースグループのデプロイ
./scripts/deploy-azure-rg.sh

# 4. データベースのデプロイ
./scripts/deploy-db.sh

# 5. バックエンドのデプロイ
./scripts/deploy-backend.sh

# 6. フロントエンドのデプロイ
./scripts/deploy-frontend.sh
```

### ⚠️ OpenAI APIキーの設定

ChatGPT機能を使用するには、OpenAI APIキーを設定する必要があります：

1. OpenAIのウェブサイトでAPIキーを取得
2. 以下のいずれかの方法でAPIキーを設定：
   - ルートディレクトリの`.env`ファイルに`OPENAI_API_KEY=sk-xxxxxxxx...`を追加
   - Azure Container Appsの環境変数に直接設定

### デプロイの詳細設定

デプロイに関する詳細な設定は各スクリプトファイルで変更できます：

- `scripts/deploy-azure-rg.sh`: リソースグループとコンテナアプリ環境の設定
- `scripts/deploy-db.sh`: MySQLデータベースの設定
- `scripts/deploy-backend.sh`: バックエンドの設定とデプロイ
- `scripts/deploy-frontend.sh`: フロントエンドの設定とデプロイ

## 🧩 アーキテクチャ

![システムアーキテクチャ](docs/architecture.png)

- **フロントエンド**: Next.js + Tailwind CSS
- **バックエンド**: FastAPI + SQLAlchemy
- **データベース**: MySQL
- **認証**: JWT (JSON Web Token)

## 👥 開発ワークフロー

1. **フロントエンド開発者**
   - `frontend/`ディレクトリで作業
   - APIクライアント（`frontend/services/api.js`）を使用してバックエンドと通信
   - 詳細は`frontend/README.md`を参照

2. **バックエンド開発者**
   - `backend/`ディレクトリで作業
   - APIエンドポイントを実装
   - 詳細は`backend/README.md`を参照

## 📡 API概要

主要なAPIエンドポイント：

| カテゴリ | エンドポイント | 説明 |
|----------|--------------|------|
| 認証 | `/register`, `/login` | ユーザー登録・ログイン |
| ユーザー | `/me` | ユーザー情報取得 |
| 会話相手 | `/conversation-partners` | 会話相手の管理 |
| 会話 | `/conversation` | 会話シミュレーション |

## ⚙️ 環境変数

### バックエンド (`.env`ファイル)

```
ENV=development
FRONTEND_ORIGIN=http://localhost:3000
```

### フロントエンド

特に設定は不要ですが、APIのエンドポイントは`frontend/services/api.js`で定義されています。

## 🐳 Docker環境

- `docker-compose.yml`ファイルで定義された3つのコンテナ：
  - `frontend`: Next.jsアプリケーション
  - `backend`: FastAPIアプリケーション
  - `db`: MySQLデータベース

### コマンド

```bash
# コンテナの起動
docker compose up -d

# コンテナの停止
docker compose down

# コンテナのビルドと起動
docker compose up -d --build

# ログの表示
docker compose logs -f [サービス名]
```

## 🔍 トラブルシューティング

- **フロントエンドが起動しない**: `docker compose logs frontend`でログを確認
- **バックエンドが起動しない**: `docker compose logs backend`でログを確認
- **APIエラー**: Swagger UI（http://localhost:8000/docs）でAPIを手動テスト
- **データベース接続エラー**: 環境変数を確認

## 🔗 参考リソース

- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [SQLAlchemyドキュメント](https://docs.sqlalchemy.org/)

## 📦 ディレクトリ構造と役割

```
docker-next-fastapi-mysql/
├── frontend/           # Next.jsフロントエンド
│   ├── components/     # 共通コンポーネント
│   ├── pages/          # ページコンポーネント
│   ├── services/       # APIサービスクライアント
│   └── styles/         # スタイルシート
├── backend/            # FastAPIバックエンド
│   ├── auth/           # 認証関連
│   ├── models/         # データモデル
│   ├── routers/        # APIルーター
│   ├── schemas/        # データスキーマ
│   └── main.py         # エントリーポイント
└── docs/               # ドキュメント
```
>>>>>>> Stashed changes
