# CLAUDE.md

⚠️ **チームメンバー必読** ⚠️
Claude Code作業時は必ずこのファイルを確認してください。
プロジェクトのルール・コマンド・手順がすべて記載されています。

このファイルは、このリポジトリでClaude Code (claude.ai/code)が作業する際の基盤ガイダンスを提供します。

## CLAUDE.md更新ルール（重要）
```bash
# 更新形式: # コメント: コマンド の形式で記載
# 冗長な説明禁止: Claude Codeが理解しやすい簡潔な記載のみ
# 必須情報のみ記載: 実行可能なコマンドと最小限の説明
# 更新時は必ずアナウンス: 「CLAUDE.mdを更新しますが良いですか？」→事後報告でOK
```

## プロジェクト基本概要

**GitHubリポジトリ**: https://github.com/tttoruuu/STEP4_CATS.git

**婚活男性向け「内面スタイリング」トータルサポートアプリ**

**重要**: 詳細な機能仕様・計画は `APP_PLAN.md` を参照すること

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
```bash
# 統合コマンド（Makefile）
# 初回セットアップ: make setup
# 開発サーバー起動: make dev
# ビルド: make build
# テスト実行: make test

# フロントエンド（Next.js PWA）
# 開発サーバー: npm run dev
# ビルド: npm run build
# リント: npm run lint
# 型チェック: npm run type-check

# バックエンド（FastAPI）
# 開発サーバー: uvicorn main:app --reload
# API テスト: pytest
# API仕様確認: http://localhost:8000/docs

# Docker開発環境
# 開発環境起動: docker-compose -f docker-compose.development.yml up -d
# 環境停止: docker-compose down
# ログ確認: docker-compose logs -f [service-name]

# AI/ML関連
# モデル学習: python scripts/train_model.py
# 音声処理テスト: python scripts/test_voice_analysis.py
```

### Git運用ルール（チーム開発）
```bash
# 作業開始: git checkout -b feature/機能名-担当者名
# 作業完了: git push origin [ブランチ名] → GitHub PR作成
# コンフリクト回避: main.py=末尾追加, models/=個別ファイル, pages/=機能別分割
```

### GitHubプルリクエストマージ
```bash
# 基本手順: git add -A && git commit -m "変更内容" && git push origin main
# PR確認: curl -s https://api.github.com/repos/tttoruuu/STEP4_CATS/pulls
# マージ: git fetch origin && git stash && git merge origin/[PR-ブランチ名]
# 完了: git add . && git commit -m "🔀 マージ完了" && git push origin main && git stash pop
# 競合解決: models/user.py=全リレーション統合, フロントエンド=git checkout --theirs
```

## アーキテクチャ設計

### システム構成
```
フロントエンド（Next.js PWA）
    ↓
API Gateway / BFF
    ↓
マイクロサービス群
├── ユーザー管理サービス
├── AI対話サービス（LLM API統合：GPT-4o-mini採用）
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
- GitHub Secretsによる機密情報管理
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

## 開発ルール・規約

### 言語設定
- **このプロジェクトは日本語で開発する**：UIテキスト、コメント、変数名、関数名、ファイル名すべて日本語を基本とする
- **Claude Codeへの指示**: 必ず日本語で回答し、日本語でのコーディングを行うこと

### AI設定
```bash
# AI/MLモデル選定: GPT-4o-mini採用
# 採用理由: コスト70%削減（vs GPT-3.5-turbo）、品質大幅向上、高速レスポンス
# 月間1000回利用想定: 約30円（vs GPT-4o: 1000円、GPT-3.5-turbo: 100円）
# 用途: AIカウンセラー、プロフィール生成、会話分析
```

### コーディング規約
- **フロントエンド**: ESLint + Prettier、TypeScript strict mode
- **バックエンド**: Black + isort、Pydantic型定義必須、docstring必須
- **コミット**: Conventional Commits形式
- **ブランチ**: feature/機能名、hotfix/修正内容

### Git運用ルール
```bash
# ブランチ構成: main（本番）← develop（統合）← feature（機能開発）
# デプロイ専用: main（安定版のみ）
# チーム開発: develop → feature/機能名-担当者名
# 緊急修正: hotfix/修正内容 → main
```
- **main**: 本番デプロイ専用（安定版のみ）
- **develop**: チーム開発統合ブランチ  
- **feature**: 個別機能開発用
- **プルリクエスト**: develop←feature、main←develop

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

## デプロイ手順
```bash
# 開発環境
# 初回セットアップ: make setup
# 開発サーバー起動: make dev  
# テスト実行: make test
# コード品質チェック: make lint

# 本番環境
# GitHub Actions（mainブランチ）で自動デプロイ
# Azure Container Apps へのデプロイ
# データベースマイグレーション実行
# ヘルスチェック確認
```