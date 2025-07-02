# Deployment Scripts

このディレクトリには、Azureへの自動デプロイメント用のスクリプトが含まれています。

## Core Deployment Scripts

### 🚀 Main Deployment
- **`deploy-all.sh`** - 完全なデプロイメント（推奨）
  - インフラ作成 → DB設定 → バックエンド → フロントエンド → マイグレーション の順で実行

### 🏗️ Infrastructure Setup
- **`deploy-azure-rg.sh`** - Azureリソースグループとコンテナ環境の作成
- **`deploy-db.sh`** - MySQL Flexible Serverの作成と設定

### 📦 Application Deployment
- **`deploy-backend.sh`** - バックエンドAPIのデプロイ
- **`deploy-frontend.sh`** - フロントエンドアプリのデプロイ
- **`deploy-db-migration.sh`** - データベースマイグレーションの実行

### 🔄 Maintenance
- **`rollback.sh`** - 前のバージョンにロールバック

## Development Tools

### 🛠️ tools/
開発・デバッグ用のユーティリティスクリプト
- **`verify-headers.sh`** - HTTPS設定の検証
- **`update-network-policy.sh`** - ネットワーク設定の更新

## Usage

### 初回デプロイ
```bash
./deploy-all.sh
```

### 個別コンポーネントの更新
```bash
./deploy-backend.sh    # バックエンドのみ
./deploy-frontend.sh   # フロントエンドのみ
```

### ロールバック
```bash
./rollback.sh <previous-version>
```

## Requirements

- Azure CLI がインストールされていること
- Docker がインストールされていること
- 適切なAzure権限があること

## Security Notes

⚠️ **重要**: 本番環境では以下の改善が必要です：
- データベースパスワードの環境変数化
- ファイアウォール規則の制限
- 環境別の設定分離