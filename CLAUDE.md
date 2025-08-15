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

## 📚 【最重要】ドキュメント自動参照ルール

### 🤖 Claude Code作業時の必須確認事項

**作業開始時に必ず以下を自動確認すること：**

1. **UI実装時** → `/docs/UI_DESIGN_GUIDE.md` を必ず参照（ネオモーフィズムスタイル）
2. **新機能開発時** → `/docs/features/` 内の既存仕様を確認
3. **ファイル作成時** → `/docs/DOCUMENTATION_RULES.md` のルールに従う
4. **デプロイ時** → `/scripts/deploy.sh` を使用

### 📁 ファイル作成場所の自動判定ルール

```bash
# 新規ファイル作成時の配置ルール（Claude Codeはこれに従うこと）
機能仕様書 → /docs/features/機能名.md（kebab-case）
作業記録 → /docs/meetings/YYYY-MM-DD_内容.md
UIコンポーネント → /frontend/components/ui/
APIエンドポイント → /backend/routers/
テストファイル → 対象ファイルと同じディレクトリ内に*.test.*

# 絶対にやってはいけないこと
❌ ルートディレクトリに個人メモ.mdを作成
❌ /docs直下に機能仕様を作成（必ず/features/へ）
❌ 日本語ファイル名の使用（meetings除く）
```

### 🔍 必須参照ドキュメント優先順位

```bash
1. このファイル（CLAUDE.md） - 基本ルール
2. /docs/DOCUMENTATION_RULES.md - ドキュメント作成ルール
3. /docs/UI_DESIGN_GUIDE.md - UI実装時
4. /docs/features/ - 機能開発時
5. APP_PLAN.md - 仕様確認時
```

### ⚡ Claude Code自動判定フロー

```
ユーザー依頼
  ↓
1. タスク種別判定（UI/機能/バグ修正/ドキュメント）
  ↓
2. 関連ドキュメント自動参照
  ↓
3. 適切なディレクトリでファイル作成/編集
  ↓
4. CLAUDE.mdのルールに従って実行
```

**重要**: このセクションはClaude Codeが自動的に参照し、適切な場所にファイルを作成するための指示です。チームメンバーは特に指定しなくても、Claude Codeが正しく動作します。

## プロジェクト基本概要

**GitHubリポジトリ**: https://github.com/tttoruuu/STEP4_CATS.git

**婚活男性向け「内面スタイリング」トータルサポートアプリ**

### 🌐 本番環境URL
- **フロントエンド**: https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io
- **バックエンドAPI**: https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io

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

### 主要課
1. **会話・コミュニケーション能力の不足**（最重要課題）
2. **自己理解と相手理解の不足**
3. **婚活サービスにおける体験の不満**

### 4つの主要機能
1. **AIカウンセラー**：婚活悩み相談・自己紹介文作成支援
2. **会話練習機能**：聞く力特化のコミュニケーショントレーニング
3. **相性診断機能**：性格・価値観診断とマッチング支援
4. **スタイリング提案**：年齢・季節・タイプ別の外見改善提案

## 🚨 Azure CLI 運用ルール（必読・厳守）

⚠️ **Azure CLI使用前に必ずCLAUDE_PRIVATE.mdを確認すること** ⚠️

### 基本方針
```bash
# 詳細な設定・コマンドは CLAUDE_PRIVATE.md を参照
# 機密情報（リソース名、ID等）は CLAUDE_PRIVATE.md に記載
# このファイルは一般的なルールのみ記載
```

### 許可される操作カテゴリ
```bash
# ✅ 許可: Container Apps のスケーリング・状態確認・ログ確認
# ✅ 許可: Container Registry のイメージ管理・タグ確認
# ✅ 許可: コスト使用量の確認・監視
# ✅ 許可: リソース状態の確認（読み取り専用）
```

### 🚫 禁止される操作
```bash
# ❌ 禁止: 新規リソースの作成
# ❌ 禁止: 高額リソース（VM、GPU、Premium Storage等）の操作
# ❌ 禁止: 対象外リソースグループへのアクセス
# ❌ 禁止: リソースの削除（--delete系コマンド）
```

### 必須チェックリスト
```bash
# 作業前（必須）: コスト確認、リソース状態確認
# 作業中（必須）: 操作ログの記録
# 作業後（必須）: スケーリング設定の適正化、コスト増加確認
```

### 緊急時対応
```bash
# 高額課金アラート時: 即座にContainer Appsを停止
# 問題発生時: 本部への即座報告 + 操作ログ共有
```

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
# 環境変数検証: npm run validate-env

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

## 📋 運用スクリプト一覧

### 🚀 デプロイスクリプト
```bash
# メインデプロイ（推奨）
./scripts/deploy.sh                    # フル・デプロイ
./scripts/deploy.sh --frontend-only    # フロントエンドのみ
./scripts/deploy.sh --backend-only     # バックエンドのみ
./scripts/deploy.sh --verify-only      # 状態確認のみ

# デプロイ後チェック・修正
./scripts/deploy-check.sh              # 完全チェック  
./scripts/deploy-check.sh --env-only   # 環境変数のみ
./scripts/deploy-check.sh --status-only # ステータスのみ
```

### 🧪 テスト・検証スクリプト
```bash
# 本番環境テスト
./scripts/production-test.sh

# フロントエンド環境変数検証
cd frontend && npm run validate-env
cd frontend && npm run validate-env:production
```

### 🗄️ データベーススクリプト
```bash
# データベース作成・初期化
python scripts/create-databases.py
```

### 🎵 開発ツール
```bash
# TTS音声サンプル生成
node scripts/generate-tts-samples.js
```

詳細は `scripts/README.md` を参照してください。

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

**開発環境・本番環境の詳細設定は `CLAUDE_PRIVATE.md` を参照**

```bash
# 環境変数例（実際の値はCLAUDE_PRIVATE.mdに記載）
# AI/ML: OPENAI_API_KEY, SPEECH_API_KEY
# データベース: MYSQL_HOST, MYSQL_PORT, DATABASE_URL
# 認証: JWT_SECRET
# Azure: リソース名、接続情報等
```

### デプロイ方法
```bash
# GitHub Actions（mainブランチpush時）による自動デプロイ
# 手動実行: GitHub → Actions → "Deploy to Production"
# 詳細設定: docs/deployment/github-secrets-setup.md
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

### 開発環境
```bash
# 初回セットアップ: make setup
# 開発サーバー起動: make dev  
# テスト実行: make test
# コード品質チェック: make lint
```

### 🚀 本番環境デプロイ（推奨：Azure CLI直接）

#### ⚡ ワンコマンドデプロイ（推奨）
```bash
# フロントエンド・バックエンド両方をデプロイ
./scripts/deploy.sh

# フロントエンドのみデプロイ
./scripts/deploy.sh --frontend-only

# バックエンドのみデプロイ
./scripts/deploy.sh --backend-only

# デプロイ状態確認のみ
./scripts/deploy.sh --verify-only
```

#### 📋 デプロイスクリプトの機能
- **自動ビルド**: Docker イメージの自動ビルド
- **環境変数検証**: 本番環境設定の自動チェック
- **タイムスタンプタグ**: `YYYYMMDDHHMMSS` 形式の一意タグ
- **Container Registry**: 自動プッシュ
- **Container Apps**: 自動更新・デプロイ
- **疎通確認**: エンドポイントの自動テスト
- **後処理チェック**: デプロイ後の自動検証

#### 🛡️ 安全なデプロイフロー
1. **前提条件チェック**: Azure認証・Docker・Container Registry
2. **環境変数検証**: 本番環境設定の確認
3. **並行ビルド**: フロントエンド・バックエンドの同時処理
4. **段階的デプロイ**: イメージプッシュ → Container Apps更新
5. **自動検証**: 疎通確認・ヘルスチェック
6. **完了確認**: デプロイ結果サマリー表示

### 🔄 従来方法（GitHub Actions）
```bash
# GitHub Actions経由のデプロイも利用可能
git add -A
git commit -m "deploy: 本番環境デプロイ"
git push origin main
# → GitHub Actions が自動実行
```

### 🚨 【重要】環境切り替え問題の完全解決
デプロイ後に以下のルールを必ず実行すること：

```bash
# 1. デプロイ後チェック（自動実行）
./scripts/deploy-check.sh

# 2. 手動での環境変数確認
az containerapp show --name miraim-frontend --resource-group rg-001-gen9 --query "properties.template.containers[0].env"

# 3. 緊急時の修正コマンド
./scripts/deploy-check.sh --env-only

# 4. フロントエンド環境検証
cd frontend && npm run validate-env:production
```

## 🔧 環境切り替え問題の根本解決

### 問題の原因
- ローカル開発環境（localhost:8000）と本番環境（Container Apps FQDN）の設定混在
- 環境変数の設定不整合
- デプロイ時の設定検証不足

### 解決策（実装済み）

#### 1. 自動環境検出システム
```bash
# 場所: frontend/lib/env-config.js
# 機能: ホスト名とNode環境から適切なAPIエンドポイントを自動選択
# 効果: ローカル/本番の自動判定、設定ミス防止
```

#### 2. ビルド時環境検証
```bash
# 自動実行: npm run build（検証後にビルド）
# 手動実行: npm run validate-env
# 効果: ビルド前に環境設定の問題を検出
```

#### 3. デプロイ時自動チェック
```bash
# 実行コマンド: ./scripts/deploy-check.sh
# 機能: Container Apps環境変数の確認・自動修正
# 効果: デプロイ後の設定不整合を自動解決
```

#### 4. Container Apps環境変数の強制設定
```bash
# 確実な本番環境設定
NEXT_PUBLIC_API_URL=https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io
NODE_ENV=production
ENVIRONMENT=production
```

### 運用ルール（厳守）

#### デプロイ時（必須）
1. `./scripts/deploy-check.sh` を実行
2. 環境変数設定の自動検証・修正
3. エンドポイント疎通確認

#### ローカル開発時
1. 環境変数は自動判定（手動設定不要）
2. 本番APIを使用する場合は明示的に設定
3. `npm run validate-env` で設定確認

#### トラブルシューティング
```bash
# 環境設定の確認
npm run validate-env

# Container Apps環境変数の確認
az containerapp show --name miraim-frontend --resource-group rg-001-gen9 --query "properties.template.containers[0].env"

# 緊急修正
./scripts/deploy-check.sh --env-only

# 完全チェック
./scripts/deploy-check.sh
```