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