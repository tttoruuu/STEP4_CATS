# CLAUDE.md

このファイルは、このリポジトリでClaude Code (claude.ai/code)が作業する際のガイダンスを提供します。

## プロジェクト概要

**婚活男性向け「内面スタイリング」トータルサポートアプリ**

ビジョン：「婚活＝つらい」を「希望に満ちた楽しいもの」に変える
対象：婚活に不安や壁を感じる男性（特に草食系、非恋愛経験者、自信のない層）

### 主要機能
- AI会話トレーニング（テキスト・音声対話練習）
- 自己紹介文の音声入力＆AI添削
- AIカウンセラーによる悩み相談、メンタルサポート
- MBTI／価値観診断による内面分析
- スタイリング提案（マンダム連携）


## 開発コマンド

### フロントエンド（Next.js PWA）
- 開発サーバー: `npm run dev`
- ビルド: `npm run build`
- テスト: `npm test`
- リント: `npm run lint`
- 型チェック: `npm run type-check`
- PWAビルド: `npm run build && npm run export`

### バックエンド（FastAPI）
- 開発サーバー: `uvicorn main:app --reload`
- API テスト: `pytest`
- データベースマイグレーション: `alembic upgrade head`
- API仕様確認: `http://localhost:8000/docs` (Swagger UI)

### Docker開発環境
- 全体起動: `docker-compose up -d`
- フロントエンド単体: `docker-compose up frontend`
- バックエンド単体: `docker-compose up api`
- データベース単体: `docker-compose up mysql`
- ログ確認: `docker-compose logs -f [service-name]`
- 環境停止: `docker-compose down`

### AI/ML関連
- モデル学習: `python scripts/train_model.py`
- 音声処理テスト: `python scripts/test_voice_analysis.py`

## アーキテクチャ概要

### システム構成
```
フロントエンド（モバイルアプリ）
    ↓
API Gateway / BFF
    ↓
マイクロサービス群
├── ユーザー管理サービス
├── AI対話サービス（LLM API統合）
├── 音声解析サービス
├── 診断・分析サービス
├── スタイリング提案サービス
└── 外部連携サービス（マンダム API等）
    ↓
データベース層（MySQL）
```

### 主要技術スタック
- **フロントエンド**: Next.js（PWA対応でモバイル・Web統一）
- **バックエンド**: Python/FastAPI
- **AI/ML**: OpenAI API, 音声認識（Speech-to-Text）, 自然言語処理
- **データベース**: MySQL
- **インフラ**: Azure, Docker, Kubernetes

### 重要なディレクトリ構成
```
/apps
  /frontend       # Next.js PWAアプリ（ユーザー向け・管理画面統合）
  /api            # FastAPI バックエンド
/packages
  /shared         # 共通型定義・ユーティリティ
  /ai-services    # AI関連サービス
/scripts          # データ処理・ML学習スクリプト
/docs            # 設計書・仕様書
/docker          # Docker設定ファイル
docker-compose.yml
Dockerfile.frontend
Dockerfile.api
```

## Docker開発環境詳細

### サービス構成
- **frontend**: Next.js PWAアプリケーション (Port: 3000)
- **api**: FastAPI バックエンド (Port: 8000)
- **mysql**: MySQL データベース (Port: 3306)
- **redis**: キャッシュ・セッション管理 (Port: 6379)

### 開発フロー
1. `docker-compose up -d` で全サービス起動
2. フロントエンド: http://localhost:3000
3. API仕様: http://localhost:8000/docs
4. MySQL管理: phpMyAdmin (Port: 8080)

### データ永続化
- MySQL データ: `./docker/mysql/data`
- Redis データ: `./docker/redis/data`

## 開発における重要な考慮事項

### セキュリティ
- 個人情報（婚活データ）の適切な暗号化と保護
- 音声データの匿名化処理
- GDPR/個人情報保護法への準拠

### パフォーマンス
- AI推論処理の最適化（レスポンス時間短縮）
- 音声データの効率的な圧縮・転送
- キャッシュ戦略（頻繁にアクセスされる診断結果など）

### 外部連携
- OpenAI API制限とコスト管理
- マンダムAPI連携の実装パターン（Azure API Management経由）
- 結婚相談所データ連携のセキュアな実装（Azure Key Vault使用）

### データ分析
- ユーザー行動ログの設計
- 成婚率・会話成功率の計測方法
- A/Bテスト用の実験フレームワーク

## 環境変数設定

```bash
# AI/ML
OPENAI_API_KEY=
SPEECH_API_KEY=

# データベース
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=konkatsu_app
MYSQL_USER=root
MYSQL_PASSWORD=
DATABASE_URL=mysql://user:password@localhost:3306/konkatsu_app

# 外部API
MANDAMU_API_KEY=
MANDAMU_API_SECRET=

# 認証
JWT_SECRET=
AUTH0_DOMAIN=

# インフラ (Azure)
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_TENANT_ID=
AZURE_SUBSCRIPTION_ID=
REDIS_URL=
```

## テスト戦略

### 単体テスト
- AI応答品質のテスト
- 音声解析精度のテスト
- ユーザーマッチング機能のテスト

### 統合テスト
- API間連携のテスト
- 外部サービス連携のテスト

### ユーザビリティテスト
- 婚活ユーザーとの実際の対話セッション
- UI/UX改善のためのフィードバック収集