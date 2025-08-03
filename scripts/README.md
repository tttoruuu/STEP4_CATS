# Miraim デプロイメントスクリプト

このディレクトリには、Miraim アプリケーションのAzure Container Appsへのデプロイ用スクリプトが含まれています。

## 📁 スクリプト一覧

### 🚀 メインデプロイスクリプト

#### **`deploy.sh`** - 統合デプロイスクリプト（推奨）
```bash
# フロントエンド・バックエンド両方をデプロイ
./scripts/deploy.sh

# 個別デプロイ
./scripts/deploy.sh --frontend-only
./scripts/deploy.sh --backend-only

# 状態確認のみ
./scripts/deploy.sh --verify-only
```

**機能:**
- 🔧 前提条件の自動チェック（Azure認証・Docker・Container Registry）
- 🏗️ Docker イメージの自動ビルド（タイムスタンプタグ）
- 📦 Container Registry への自動プッシュ
- 🚀 Container Apps の自動更新・デプロイ
- ✅ エンドポイント疎通確認
- 🔍 デプロイ後の自動検証

#### **`deploy-check.sh`** - デプロイ後チェック・修正
```bash
# 完全チェック
./scripts/deploy-check.sh

# 環境変数チェックのみ
./scripts/deploy-check.sh --env-only

# ステータス確認のみ
./scripts/deploy-check.sh --status-only
```

**機能:**
- 🔍 Container Apps 状態確認
- 🛠️ 環境変数の自動検証・修正
- 🌐 エンドポイント疎通テスト
- 📊 デプロイ結果サマリー

### 🧪 テスト・検証

#### **`production-test.sh`** - 本番環境テスト
本番環境でのAPI・機能テストを実行

### 🗄️ データベース

#### **`create-databases.py`** - データベース作成
```bash
python scripts/create-databases.py
```
MySQL データベースの初期設定・作成

### 🎵 開発ツール

#### **`generate-tts-samples.js`** - TTS音声サンプル生成
```bash
node scripts/generate-tts-samples.js
```
OpenAI TTS API を使用した音声サンプル生成

### 🔧 フロントエンド検証

#### **`frontend/scripts/validate-env.js`** - 環境変数検証
```bash
# フロントエンドフォルダで実行
npm run validate-env
npm run validate-env:production
```

## 🚀 推奨デプロイフロー

### 1. 通常のデプロイ
```bash
# ワンコマンドデプロイ（推奨）
./scripts/deploy.sh

# デプロイ後チェック（自動実行されるが手動でも可能）
./scripts/deploy-check.sh
```

### 2. 個別デプロイ
```bash
# フロントエンドのみ
./scripts/deploy.sh --frontend-only

# バックエンドのみ
./scripts/deploy.sh --backend-only
```

### 3. 緊急修正
```bash
# 環境変数の問題修正
./scripts/deploy-check.sh --env-only

# 完全な状態確認
./scripts/deploy-check.sh
```

## 🔧 設定情報

### Azure リソース
- **リソースグループ**: `rg-001-gen9`
- **Container Registry**: `acrtech0for9th.azurecr.io`
- **フロントエンドアプリ**: `miraim-frontend`
- **バックエンドアプリ**: `miraim-backend`

### エンドポイント
- **フロントエンド**: https://miraim-frontend.icymoss-273d47c5.australiaeast.azurecontainerapps.io
- **バックエンド**: https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io

## 📋 前提条件

### 必要なツール
- ✅ Azure CLI（認証済み）
- ✅ Docker（起動済み）
- ✅ Node.js（フロントエンド用）
- ✅ Python（データベーススクリプト用）

### Azure 権限
- ✅ Container Apps の読み取り・更新権限
- ✅ Container Registry へのプッシュ権限
- ✅ リソースグループへのアクセス権限

## 🛡️ セキュリティ・注意事項

### 環境設定
- 🔒 本番環境の環境変数は自動検証・設定
- 🔒 Container Registry 認証は自動実行
- 🔒 HTTPS強制設定済み

### トラブルシューティング
- ❌ 環境変数が `backend:8000` になっている → `deploy-check.sh --env-only` で修正
- ❌ コンテナが起動しない → `deploy.sh --verify-only` で状態確認
- ❌ 疎通確認に失敗 → エンドポイントURLとContainer Apps状態を確認

## 📚 関連ドキュメント

詳細な運用手順は `CLAUDE.md` を参照してください。