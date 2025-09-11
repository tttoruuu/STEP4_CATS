# Miraim Azure デプロイメント完全ガイド

このガイドは、Miraimアプリケーションを新規のAzureアカウントにデプロイするための詳細な手順書です。

## 📋 前提条件

### 必要なアカウント・ツール
- [ ] Azureアカウント（無料アカウントでも可）
- [ ] Azure CLI インストール済み
- [ ] Docker Desktop インストール済み
- [ ] Git インストール済み
- [ ] Node.js 18+ インストール済み
- [ ] Python 3.11+ インストール済み

### Azure CLIセットアップ
```bash
# Azure CLI インストール（Mac）
brew update && brew install azure-cli

# Azure CLI インストール（Windows）
winget install -e --id Microsoft.AzureCLI

# Azure CLI インストール（Linux）
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# ログイン
az login

# サブスクリプション確認
az account list --output table

# デフォルトサブスクリプション設定
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

## 🏗️ Step 1: リソースグループとContainer Registry作成

### 1.1 リソースグループ作成
```bash
# 変数設定（これらを自分の環境に合わせて変更）
export RESOURCE_GROUP="rg-miraim-prod"
export LOCATION="japaneast"  # または "japanwest"
export REGISTRY_NAME="miraimregistry$(date +%s)"  # ユニークな名前が必要

# リソースグループ作成
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# 確認
az group show --name $RESOURCE_GROUP --output table
```

### 1.2 Container Registry作成
```bash
# Container Registry作成（Basic SKUで開始）
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $REGISTRY_NAME \
  --sku Basic \
  --admin-enabled true

# ログイン情報取得
az acr credential show \
  --name $REGISTRY_NAME \
  --resource-group $RESOURCE_GROUP

# ログイン情報を環境変数に保存
export ACR_USERNAME=$(az acr credential show --name $REGISTRY_NAME --query username -o tsv)
export ACR_PASSWORD=$(az acr credential show --name $REGISTRY_NAME --query passwords[0].value -o tsv)
export ACR_LOGIN_SERVER=$(az acr show --name $REGISTRY_NAME --query loginServer -o tsv)

# Docker ログイン
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD
```

## 🗄️ Step 2: MySQL Database作成

### 2.1 MySQL Flexible Server作成
```bash
# MySQL サーバー名（ユニークである必要）
export MYSQL_SERVER_NAME="miraim-mysql-$(date +%s)"
export MYSQL_ADMIN_USER="miraimadmin"
export MYSQL_ADMIN_PASSWORD="MiraimP@ssw0rd2024!"  # 強力なパスワードに変更

# MySQL Flexible Server作成
az mysql flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER_NAME \
  --location $LOCATION \
  --admin-user $MYSQL_ADMIN_USER \
  --admin-password $MYSQL_ADMIN_PASSWORD \
  --sku-name B_Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 8.0.21 \
  --public-access 0.0.0.0

# ファイアウォールルール追加（Container Appsからのアクセス許可）
az mysql flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER_NAME \
  --rule-name AllowAllAzureIps \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# 接続文字列取得
export MYSQL_HOST=$(az mysql flexible-server show \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER_NAME \
  --query fullyQualifiedDomainName -o tsv)
```

### 2.2 データベース作成
```bash
# データベース作成
az mysql flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $MYSQL_SERVER_NAME \
  --database-name miraim_db

# 接続テスト
mysql -h $MYSQL_HOST -u $MYSQL_ADMIN_USER -p$MYSQL_ADMIN_PASSWORD -e "SHOW DATABASES;"
```

## 🌊 Step 3: Container Apps環境作成

### 3.1 Container Apps環境作成
```bash
# Container Apps環境名
export CONTAINERAPPS_ENVIRONMENT="miraim-env"

# Log Analytics Workspace作成
export WORKSPACE_NAME="miraim-logs-$(date +%s)"

az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --location $LOCATION

# Workspace情報取得
export WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --query customerId -o tsv)

export WORKSPACE_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --query primarySharedKey -o tsv)

# Container Apps環境作成
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --logs-workspace-id $WORKSPACE_ID \
  --logs-workspace-key $WORKSPACE_KEY
```

## 🔐 Step 4: 環境変数とシークレット設定

### 4.1 環境設定ファイル作成
```bash
# プロジェクトルートで実行
cd /path/to/miraim

# 環境変数ファイル作成
cat > .env.production <<EOF
# Azure Container Registry
ACR_LOGIN_SERVER=$ACR_LOGIN_SERVER
ACR_USERNAME=$ACR_USERNAME
ACR_PASSWORD=$ACR_PASSWORD
REGISTRY_NAME=$REGISTRY_NAME

# Azure Resources
RESOURCE_GROUP=$RESOURCE_GROUP
LOCATION=$LOCATION
CONTAINERAPPS_ENVIRONMENT=$CONTAINERAPPS_ENVIRONMENT

# MySQL
MYSQL_HOST=$MYSQL_HOST
MYSQL_PORT=3306
MYSQL_DATABASE=miraim_db
MYSQL_USER=$MYSQL_ADMIN_USER
MYSQL_PASSWORD=$MYSQL_ADMIN_PASSWORD
MYSQL_SSL_DISABLED=false

# Database URL
DATABASE_URL=mysql+pymysql://$MYSQL_ADMIN_USER:$MYSQL_ADMIN_PASSWORD@$MYSQL_HOST:3306/miraim_db?ssl_disabled=False

# Application
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=["*"]

# OpenAI（必要に応じて設定）
OPENAI_API_KEY=your_openai_api_key_here
EOF

echo "環境変数ファイルが作成されました: .env.production"
```

### 4.2 CLAUDE_PRIVATE.md更新用テンプレート
```bash
cat > CLAUDE_PRIVATE_template.md <<EOF
# CLAUDE_PRIVATE.md - Azure環境固有設定

## Azure リソース情報
- リソースグループ: $RESOURCE_GROUP
- リージョン: $LOCATION
- Container Registry: $REGISTRY_NAME
- MySQL Server: $MYSQL_SERVER_NAME
- Container Apps環境: $CONTAINERAPPS_ENVIRONMENT

## 接続情報
- ACR Login Server: $ACR_LOGIN_SERVER
- MySQL Host: $MYSQL_HOST
- MySQL Database: miraim_db

## 認証情報（機密）
※ この情報は安全に管理してください
- ACR Username: $ACR_USERNAME
- MySQL Admin User: $MYSQL_ADMIN_USER

## Container Apps URL（デプロイ後に更新）
- Frontend URL: [デプロイ後に設定]
- Backend URL: [デプロイ後に設定]
EOF

echo "CLAUDE_PRIVATE.mdテンプレートが作成されました"
```

## 🚀 Step 5: アプリケーションのビルドとデプロイ

### 5.1 Dockerイメージのビルド
```bash
# タイムスタンプタグ生成
export TAG=$(date +%Y%m%d%H%M%S)

# フロントエンドイメージビルド
docker build \
  -f frontend/Dockerfile.production \
  -t $ACR_LOGIN_SERVER/miraim-frontend:$TAG \
  -t $ACR_LOGIN_SERVER/miraim-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://[BACKEND_URL_PLACEHOLDER] \
  ./frontend

# バックエンドイメージビルド
docker build \
  -f backend/Dockerfile.production \
  -t $ACR_LOGIN_SERVER/miraim-backend:$TAG \
  -t $ACR_LOGIN_SERVER/miraim-backend:latest \
  ./backend
```

### 5.2 Container Registryへプッシュ
```bash
# イメージプッシュ
docker push $ACR_LOGIN_SERVER/miraim-frontend:$TAG
docker push $ACR_LOGIN_SERVER/miraim-frontend:latest
docker push $ACR_LOGIN_SERVER/miraim-backend:$TAG
docker push $ACR_LOGIN_SERVER/miraim-backend:latest

# 確認
az acr repository list --name $REGISTRY_NAME --output table
```

### 5.3 Container Appsデプロイ

#### バックエンドデプロイ
```bash
# バックエンドContainer App作成
az containerapp create \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/miraim-backend:latest \
  --target-port 8000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    DATABASE_URL="$DATABASE_URL" \
    MYSQL_HOST="$MYSQL_HOST" \
    MYSQL_PORT=3306 \
    MYSQL_DATABASE="miraim_db" \
    MYSQL_USER="$MYSQL_ADMIN_USER" \
    MYSQL_PASSWORD="$MYSQL_ADMIN_PASSWORD" \
    MYSQL_SSL_DISABLED="false" \
    JWT_SECRET="$(openssl rand -hex 32)" \
    CORS_ORIGINS='["*"]'

# バックエンドURL取得
export BACKEND_URL=$(az containerapp show \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Backend URL: https://$BACKEND_URL"
```

#### フロントエンドデプロイ
```bash
# フロントエンドイメージ再ビルド（正しいバックエンドURLで）
docker build \
  -f frontend/Dockerfile.production \
  -t $ACR_LOGIN_SERVER/miraim-frontend:$TAG \
  -t $ACR_LOGIN_SERVER/miraim-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://$BACKEND_URL \
  ./frontend

# プッシュ
docker push $ACR_LOGIN_SERVER/miraim-frontend:$TAG
docker push $ACR_LOGIN_SERVER/miraim-frontend:latest

# フロントエンドContainer App作成
az containerapp create \
  --name miraim-frontend \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/miraim-frontend:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    NEXT_PUBLIC_API_URL="https://$BACKEND_URL" \
    NODE_ENV="production" \
    ENVIRONMENT="production"

# フロントエンドURL取得
export FRONTEND_URL=$(az containerapp show \
  --name miraim-frontend \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Frontend URL: https://$FRONTEND_URL"
```

## ✅ Step 6: デプロイ確認とテスト

### 6.1 ヘルスチェック
```bash
# バックエンドヘルスチェック
curl https://$BACKEND_URL/health
curl https://$BACKEND_URL/docs

# フロントエンドアクセス
echo "ブラウザで開く: https://$FRONTEND_URL"

# Container Appsログ確認
az containerapp logs show \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --follow

az containerapp logs show \
  --name miraim-frontend \
  --resource-group $RESOURCE_GROUP \
  --follow
```

### 6.2 データベース初期化
```bash
# backend/scripts/init_db.pyを実行
python backend/scripts/create-databases.py
```

## 🔧 Step 7: デプロイスクリプトの調整

### 7.1 deploy.shの環境変数更新
```bash
# scripts/deploy.shを編集して以下の変数を更新
cat > scripts/deploy-config.sh <<EOF
#!/bin/bash
# Azure環境設定
export RESOURCE_GROUP="$RESOURCE_GROUP"
export REGISTRY_NAME="$REGISTRY_NAME"
export ACR_LOGIN_SERVER="$ACR_LOGIN_SERVER"
export CONTAINERAPPS_ENVIRONMENT="$CONTAINERAPPS_ENVIRONMENT"
export BACKEND_URL="$BACKEND_URL"
export FRONTEND_URL="$FRONTEND_URL"
EOF

chmod +x scripts/deploy-config.sh
```

### 7.2 今後のデプロイ
```bash
# 設定読み込み
source scripts/deploy-config.sh

# デプロイ実行
./scripts/deploy.sh
```

## 💰 コスト管理

### 推定月額コスト（最小構成）
- Container Apps: ¥2,000-3,000
- MySQL Flexible Server (B1ms): ¥2,000-3,000
- Container Registry (Basic): ¥500
- Log Analytics: ¥500
- **合計: 約¥5,000-7,000/月**

### コスト削減のヒント
1. 開発時はContainer Appsを停止
2. MySQL ServerをBurstableプランで運用
3. Container RegistryはBasic SKUを使用
4. 不要時はリソースグループごと削除

### リソース停止/削除コマンド
```bash
# Container Apps停止
az containerapp update --name miraim-frontend --resource-group $RESOURCE_GROUP --min-replicas 0 --max-replicas 0
az containerapp update --name miraim-backend --resource-group $RESOURCE_GROUP --min-replicas 0 --max-replicas 0

# MySQL Server停止
az mysql flexible-server stop --resource-group $RESOURCE_GROUP --name $MYSQL_SERVER_NAME

# 全リソース削除（注意！）
# az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. Container Apps起動失敗
```bash
# ログ確認
az containerapp logs show --name miraim-backend --resource-group $RESOURCE_GROUP --tail 100

# 環境変数確認
az containerapp show --name miraim-backend --resource-group $RESOURCE_GROUP --query properties.template.containers[0].env
```

#### 2. データベース接続エラー
```bash
# ファイアウォール確認
az mysql flexible-server firewall-rule list --resource-group $RESOURCE_GROUP --server-name $MYSQL_SERVER_NAME

# 接続テスト
mysql -h $MYSQL_HOST -u $MYSQL_ADMIN_USER -p$MYSQL_ADMIN_PASSWORD -e "SELECT 1;"
```

#### 3. イメージプルエラー
```bash
# Registry認証確認
az acr login --name $REGISTRY_NAME

# イメージ存在確認
az acr repository show-tags --name $REGISTRY_NAME --repository miraim-backend
```

## 📝 まとめ

このガイドに従うことで、Miraimアプリケーションを新規のAzure環境にデプロイできます。
重要なポイント：

1. **環境変数の管理**: .env.productionファイルを安全に管理
2. **コスト監視**: Azure Cost Managementで定期的に確認
3. **セキュリティ**: 本番環境では必ずSSL/TLS、ファイアウォール設定を確認
4. **バックアップ**: MySQL Databaseの定期バックアップ設定

## 🆘 サポート

問題が発生した場合：
1. Azure Portal でリソースの状態確認
2. Container Apps のログ確認
3. このガイドのトラブルシューティングセクション参照

成功をお祈りします！ 🚀