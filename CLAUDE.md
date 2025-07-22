<<<<<<< Updated upstream
# CLAUDE.md

このファイルは、このリポジトリでClaude Code (claude.ai/code)が作業する際の基盤ガイダンスを提供します。

## プロジェクト基本概要

**婚活男性向け「内面スタイリング」トータルサポートアプリ**

**ビジョン**：結婚相談所に通う真剣な婚活男性のコミュニケーション能力を向上させ、理想的なパートナーとの出会いを実現する  
**対象**：結婚相談所に入会している、会話・コミュニケーションに課題を抱える男性  
**技術スタック**：Next.js PWA + FastAPI + MySQL + AI API統合（特に聞く力向上とコミュニケーション分析に特化）

## ターゲットペルソナ（基本特徴）

### メインターゲットの特徴
- **結婚相談所入会者**: 多額の入会金を支払い、真剣に結婚を考えている
- **コミュニケーション課題**: 「口下手」「話がうまくいかない」と自覚、特に初対面への不安
- **効率性重視**: 身元保証を重視し、条件で相手を選びがち
- **精神的サポート必要**: 婚活疲れ、「落ち込む」「何をしていいか分からない」状態

### 主要課題
1. **会話・コミュニケーション能力の不足**（最重要課題）
2. **自己理解と相手理解の不足**
3. **婚活サービスにおける体験の不満**

### 4つの主要機能
1. **AIカウンセラー**：婚活悩み相談・自己紹介文作成支援
2. **会話練習機能**：聞く力特化のコミュニケーショントレーニング
3. **相性診断機能**：性格・価値観診断とマッチング支援
4. **スタイリング提案**：年齢・季節・タイプ別の外見改善提案


## 開発コマンド

### 統合コマンド（Makefile）
- 初回セットアップ: `make setup`
- 開発サーバー起動: `make dev`
- ビルド: `make build`
- テスト実行: `make test`
- リント: `make lint`
- Docker開発環境: `make docker-dev`
- Docker本番環境: `make docker-prod`
- 全コマンド表示: `make help`

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
- 開発環境起動: `docker-compose -f docker-compose.development.yml up -d`
- 本番環境起動: `docker-compose -f docker-compose.prod.yml up -d`
- フロントエンド単体: `docker-compose -f docker-compose.development.yml up frontend`
- バックエンド単体: `docker-compose -f docker-compose.development.yml up backend`
- データベース単体: `docker-compose -f docker-compose.development.yml up db`
- ログ確認: `docker-compose logs -f [service-name]`
- 環境停止: `docker-compose down`

### セキュリティ関連
- 本番環境変数生成: `./config/secrets/azure-keyvault.sh`
- 環境変数暗号化: `./config/secrets/encrypt.sh`
- 環境変数復号化: `./config/secrets/decrypt.sh`
- Azure Key Vaultセットアップ: `./config/secrets/setup-keyvault.sh`

### デプロイ関連
- 開発環境デプロイ: GitHub Actions (developブランチ)
- 本番環境デプロイ: GitHub Actions (mainブランチ)
- 手動デプロイ: `./scripts/deploy-all.sh`
- ロールバック: `./scripts/rollback.sh`

### AI/ML関連
- モデル学習: `python scripts/train_model.py`
- 音声処理テスト: `python scripts/test_voice_analysis.py`

## アーキテクチャ設計

### システム構成
```
フロントエンド（Next.js PWA）
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
データベース層（MySQL + Redis）
```

### 技術選定理由
- **Next.js PWA**: モバイル・Web統一、オフライン対応、高速描画
- **FastAPI**: 高速API開発、自動ドキュメント生成、型安全性
- **MySQL**: トランザクション安全性、複雑なリレーション対応
- **Redis**: セッション管理、キャッシュ、リアルタイム機能
- **Azure**: エンタープライズレベルのセキュリティ、AI統合

### ディレクトリ構成
```
/frontend          # Next.js PWA
/backend           # FastAPI
/config            # 設定ファイル・シークレット管理
/scripts           # デプロイ・開発スクリプト
/docs             # 設計書・仕様書
docker-compose.*.yml
```

### セキュリティ要件
- 個人情報（婚活データ）の適切な暗号化と保護
- 音声データの匿名化処理
- GDPR/個人情報保護法への準拠
- Azure Key Vault による機密情報管理
- JWT認証 + OAuth2による認可制御

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

## 開発ルール・規約

### コーディング規約
- **フロントエンド**: ESLint + Prettier、TypeScript strict mode
- **バックエンド**: Black + isort、Pydantic型定義必須、docstring必須
- **コミット**: Conventional Commits形式
- **ブランチ**: feature/機能名、hotfix/修正内容

### Git運用ルール
- **メインブランチ**: main（本番）、develop（開発）
- **プルリクエスト**: レビュー必須、CI/CD通過必須
- **リリース**: semantic versioning（major.minor.patch）

### テスト方針
- **単体テスト**: 各機能80%以上のカバレッジ
- **統合テスト**: API間連携、外部サービス連携
- **E2Eテスト**: 主要ユーザージャーニー
- **AI応答品質テスト**: 会話精度、音声解析精度

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

## API仕様（基本構造）

### 認証エンドポイント
- `POST /auth/login` - ユーザーログイン
- `POST /auth/register` - ユーザー登録
- `POST /auth/refresh` - トークンリフレッシュ

### 主要エンドポイント
- `GET /api/user/profile` - ユーザープロフィール取得
- `POST /api/counselor/chat` - AIカウンセラー対話
- `POST /api/conversation/practice` - 会話練習
- `POST /api/compatibility/diagnose` - 相性診断
- `GET /api/styling/recommend` - スタイリング提案

### データモデル（基本構造）
```typescript
User {
  id: string
  email: string
  profile: UserProfile
  createdAt: Date
}

UserProfile {
  name: string
  age: number
  personalityType: string
  communicationLevel: number
}
```

## デプロイ手順（基本フロー）

### 開発環境
1. `make setup` - 初回セットアップ
2. `make dev` - 開発サーバー起動
3. `make test` - テスト実行
4. `make lint` - コード品質チェック

### 本番環境
1. GitHub Actions（mainブランチ）で自動デプロイ
2. Azure Container Apps へのデプロイ
3. データベースマイグレーション実行
4. ヘルスチェック確認
=======
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
>>>>>>> Stashed changes
