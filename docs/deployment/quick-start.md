# ⚡ Miraim Azureデプロイ クイックスタートガイド

最速でMiraimをAzureにデプロイするための簡潔なガイドです。詳細は各ステップのリンク先を参照してください。

## 🎯 前提条件（5分）

```bash
# 必須ツール確認
az --version           # Azure CLI
docker --version        # Docker
node --version          # Node.js 18+
git --version          # Git

# Azure ログイン
az login
```

## 📋 Step 0: 準備（10分）

### OpenAI APIキー取得
1. https://platform.openai.com でアカウント作成
2. API keys → Create new secret key
3. キーをメモ（表示は一度だけ！）

### リポジトリクローン
```bash
git clone https://github.com/tttoruuu/STEP4_CATS.git miraim
cd miraim
```

## 🚀 Step 1: 環境変数設定（5分）

```bash
# 環境変数エクスポート（自分の値に変更）
export RESOURCE_GROUP="rg-miraim-prod"
export LOCATION="japaneast"
export REGISTRY_NAME="miraimreg$(date +%s)"
export MYSQL_SERVER_NAME="miraim-mysql-$(date +%s)"
export MYSQL_ADMIN_USER="miraimadmin"
export MYSQL_ADMIN_PASSWORD="Miraim2024Secure!"
export OPENAI_API_KEY="sk-proj-xxxxxxxxxx"  # ← あなたのAPIキー
```

## 🏗️ Step 2: Azureリソース作成（10分）

```bash
# 一括実行スクリプト
cat > setup-azure.sh << 'EOF'
#!/bin/bash
set -e

echo "🔵 リソースグループ作成..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "🔵 Container Registry作成..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $REGISTRY_NAME \
  --sku Basic \
  --admin-enabled true

echo "🔵 MySQL作成..."
az mysql flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER_NAME \
  --location $LOCATION \
  --admin-user $MYSQL_ADMIN_USER \
  --admin-password "$MYSQL_ADMIN_PASSWORD" \
  --sku-name B_Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 8.0.21 \
  --public-access 0.0.0.0

echo "🔵 データベース作成..."
az mysql flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $MYSQL_SERVER_NAME \
  --database-name miraim_db

echo "🔵 Container Apps環境作成..."
WORKSPACE_NAME="miraim-logs-$(date +%s)"
az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --location $LOCATION

WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --query customerId -o tsv)

WORKSPACE_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --query primarySharedKey -o tsv)

az containerapp env create \
  --name miraim-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --logs-workspace-id $WORKSPACE_ID \
  --logs-workspace-key $WORKSPACE_KEY

echo "✅ Azureリソース作成完了！"
EOF

chmod +x setup-azure.sh
./setup-azure.sh
```

## 📦 Step 3: アプリケーションデプロイ（15分）

```bash
# デプロイスクリプト作成
cat > deploy-app.sh << 'EOF'
#!/bin/bash
set -e

# ACR情報取得
export ACR_LOGIN_SERVER=$(az acr show --name $REGISTRY_NAME --query loginServer -o tsv)
export ACR_USERNAME=$(az acr credential show --name $REGISTRY_NAME --query username -o tsv)
export ACR_PASSWORD=$(az acr credential show --name $REGISTRY_NAME --query passwords[0].value -o tsv)

# Docker ログイン
echo "🔵 Docker ログイン..."
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD

# MySQL接続情報
export MYSQL_HOST=$(az mysql flexible-server show \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER_NAME \
  --query fullyQualifiedDomainName -o tsv)

export DATABASE_URL="mysql+pymysql://$MYSQL_ADMIN_USER:$MYSQL_ADMIN_PASSWORD@$MYSQL_HOST:3306/miraim_db?ssl_disabled=False"

# タグ生成
export TAG=$(date +%Y%m%d%H%M%S)

echo "🔵 バックエンドビルド&プッシュ..."
docker build -f backend/Dockerfile.production \
  -t $ACR_LOGIN_SERVER/miraim-backend:$TAG \
  -t $ACR_LOGIN_SERVER/miraim-backend:latest \
  ./backend

docker push $ACR_LOGIN_SERVER/miraim-backend:$TAG
docker push $ACR_LOGIN_SERVER/miraim-backend:latest

echo "🔵 バックエンドデプロイ..."
az containerapp create \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --environment miraim-env \
  --image $ACR_LOGIN_SERVER/miraim-backend:latest \
  --target-port 8000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 --memory 1.0Gi \
  --min-replicas 1 --max-replicas 3 \
  --env-vars \
    DATABASE_URL="$DATABASE_URL" \
    OPENAI_API_KEY="$OPENAI_API_KEY" \
    JWT_SECRET="$(openssl rand -hex 32)" \
    ENVIRONMENT="production"

# バックエンドURL取得
export BACKEND_URL=$(az containerapp show \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "🔵 フロントエンドビルド&プッシュ..."
docker build -f frontend/Dockerfile.production \
  -t $ACR_LOGIN_SERVER/miraim-frontend:$TAG \
  -t $ACR_LOGIN_SERVER/miraim-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://$BACKEND_URL \
  ./frontend

docker push $ACR_LOGIN_SERVER/miraim-frontend:$TAG
docker push $ACR_LOGIN_SERVER/miraim-frontend:latest

echo "🔵 フロントエンドデプロイ..."
az containerapp create \
  --name miraim-frontend \
  --resource-group $RESOURCE_GROUP \
  --environment miraim-env \
  --image $ACR_LOGIN_SERVER/miraim-frontend:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 --memory 1.0Gi \
  --min-replicas 1 --max-replicas 3 \
  --env-vars \
    NEXT_PUBLIC_API_URL="https://$BACKEND_URL" \
    NODE_ENV="production"

# URL表示
export FRONTEND_URL=$(az containerapp show \
  --name miraim-frontend \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "✅ デプロイ完了！"
echo "📱 フロントエンド: https://$FRONTEND_URL"
echo "🔧 バックエンド: https://$BACKEND_URL"
echo "📚 API ドキュメント: https://$BACKEND_URL/docs"
EOF

chmod +x deploy-app.sh
./deploy-app.sh
```

## ✅ Step 4: 動作確認（5分）

```bash
# ヘルスチェック
curl https://$BACKEND_URL/health

# ログ確認（問題がある場合）
az containerapp logs show \
  --name miraim-backend \
  --resource-group $RESOURCE_GROUP \
  --tail 50

# ブラウザでアクセス
echo "ブラウザで開く: https://$FRONTEND_URL"
```

## 🛑 停止・削除（コスト削減）

```bash
# アプリ停止（コスト削減）
az containerapp update --name miraim-frontend --resource-group $RESOURCE_GROUP --min-replicas 0 --max-replicas 0
az containerapp update --name miraim-backend --resource-group $RESOURCE_GROUP --min-replicas 0 --max-replicas 0

# MySQL停止
az mysql flexible-server stop --resource-group $RESOURCE_GROUP --name $MYSQL_SERVER_NAME

# 完全削除（注意！すべて削除されます）
# az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## 💡 トラブルシューティング

### よくあるエラーと対処法

#### 1. Container Apps起動失敗
```bash
# 詳細ログ確認
az containerapp logs show --name miraim-backend --resource-group $RESOURCE_GROUP --tail 100
```

#### 2. データベース接続エラー
```bash
# ファイアウォール追加
az mysql flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $MYSQL_SERVER_NAME \
  --rule-name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

#### 3. OpenAI APIエラー
- APIキーが正しいか確認
- 課金設定が有効か確認
- 使用上限に達していないか確認

## 📊 コスト管理

```bash
# 現在のコスト確認
az consumption usage list \
  --subscription $(az account show --query id -o tsv) \
  --start-date $(date -d '30 days ago' '+%Y-%m-%d') \
  --end-date $(date '+%Y-%m-%d') \
  --query "[?resourceGroup=='$RESOURCE_GROUP'].{name:instanceName,cost:pretaxCost}" \
  --output table
```

## 🎉 完了！

約30-40分でデプロイ完了です。問題が発生した場合は：
1. [詳細ガイド](./azure-deployment-guide.md)を参照
2. [APIキー設定](./required-api-keys-guide.md)を確認
3. ログを確認して原因を特定

---

**ヒント**: 
- 2回目以降は`deploy-app.sh`だけ実行すればOK
- 開発時はContainer Appsを停止してコスト削減
- 本番運用前にはセキュリティ設定を必ず確認