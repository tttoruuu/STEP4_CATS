# MIRAIM 開発コマンド一覧

## 統合コマンド（Makefile推奨）

### 初回セットアップ
```bash
make setup                    # 全環境の初回セットアップ
```

### 開発環境
```bash
make dev                      # フロントエンド・バックエンド同時起動
make install                  # 依存関係インストール
make build                    # 本番ビルド
make test                     # テスト実行
make lint                     # コード品質チェック
```

### Docker環境
```bash
make docker-dev               # Docker開発環境起動
make docker-prod              # Docker本番環境起動
make docker-stop              # Docker停止
make docker-logs              # ログ確認
```

## フロントエンド個別コマンド
```bash
cd frontend
npm run dev                   # 開発サーバー起動 (localhost:3000)
npm run build                 # 本番ビルド（環境変数検証付き）
npm run build:unsafe          # ビルド（検証なし）
npm run start                 # 本番サーバー起動
npm run lint                  # ESLint実行
npm run type-check            # TypeScript型チェック
npm run validate-env          # 環境変数検証
npm run validate-env:production # 本番環境変数検証
```

## バックエンド個別コマンド
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000  # 開発サーバー
pytest                       # テスト実行
python -m flake8 .           # リント
python -m black .            # フォーマット
alembic upgrade head         # マイグレーション実行
```

## デプロイコマンド

### Azure CLI デプロイ（推奨）
```bash
./scripts/deploy.sh                    # フル・デプロイ
./scripts/deploy.sh --frontend-only    # フロントエンドのみ
./scripts/deploy.sh --backend-only     # バックエンドのみ
./scripts/deploy.sh --verify-only      # 状態確認のみ
```

### デプロイ後チェック
```bash
./scripts/deploy-check.sh              # 完全チェック
./scripts/deploy-check.sh --env-only   # 環境変数のみ
./scripts/deploy-check.sh --status-only # ステータスのみ
```

### 本番環境テスト
```bash
./scripts/production-test.sh           # 本番環境疎通テスト
```

## Git運用
```bash
git checkout -b feature/機能名-担当者名  # 機能ブランチ作成
git add -A && git commit -m "変更内容"   # コミット
git push origin main                    # 本番デプロイ（mainブランチ）
```

## データベース関連
```bash
make db-migrate               # マイグレーション実行
make db-reset                 # データベースリセット
python scripts/create-databases.py     # データベース初期化
```

## 開発ツール
```bash
node scripts/generate-tts-samples.js   # TTS音声サンプル生成
```

## アクセスURL（開発時）
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **API仕様**: http://localhost:8000/docs
- **phpMyAdmin**: http://localhost:8080 (Docker使用時)