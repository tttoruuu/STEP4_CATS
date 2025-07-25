#!/bin/bash
# Azure Portal Web Shell用デプロイスクリプト
# 本部担当者がPortal内で実行（認証情報不要）

set -e

# 設定値
RESOURCE_GROUP="rg-001-gen9"
CONTAINER_APP="aca-wild-australiaeast"
ACR_NAME="acrtech0for9th"
GITHUB_REPO="tttoruuu/STEP4_CATS"
IMAGE_TAG="latest"

echo "🚀 Miraim Azure デプロイ開始"
echo "リソースグループ: $RESOURCE_GROUP"
echo "Container App: $CONTAINER_APP"

# 1. GitHub最新コードを取得
echo "📥 GitHubから最新コードを取得中..."
if [ -d "STEP4_CATS" ]; then
    cd STEP4_CATS
    git pull origin main
else
    git clone https://github.com/$GITHUB_REPO.git
    cd STEP4_CATS
fi

# 2. ACRにログイン（Portal内では自動認証）
echo "🔐 Container Registryに接続中..."
az acr login --name $ACR_NAME

# 3. Dockerイメージビルド & プッシュ
echo "🏗️ フロントエンドイメージをビルド中..."
docker build -f frontend/Dockerfile.production \
    --build-arg NEXT_PUBLIC_API_URL=https://aca-wild-australiaeast.icymoss-273d47c5.australiaeast.azurecontainerapps.io \
    -t $ACR_NAME.azurecr.io/miraim-frontend:$IMAGE_TAG \
    ./frontend

echo "🏗️ バックエンドイメージをビルド中..."
docker build -f backend/Dockerfile.production \
    -t $ACR_NAME.azurecr.io/miraim-backend:$IMAGE_TAG \
    ./backend

echo "📤 イメージをプッシュ中..."
docker push $ACR_NAME.azurecr.io/miraim-frontend:$IMAGE_TAG
docker push $ACR_NAME.azurecr.io/miraim-backend:$IMAGE_TAG

# 4. Container Appsにデプロイ
echo "🚀 Container Appsにデプロイ中..."

# フロントエンドコンテナ更新
az containerapp update \
    --name $CONTAINER_APP \
    --resource-group $RESOURCE_GROUP \
    --image $ACR_NAME.azurecr.io/miraim-frontend:$IMAGE_TAG \
    --set-env-vars \
        NODE_ENV=production \
        NEXT_PUBLIC_API_URL=https://aca-wild-australiaeast.icymoss-273d47c5.australiaeast.azurecontainerapps.io

# 5. デプロイ確認
echo "✅ デプロイ完了確認中..."
sleep 30

# ヘルスチェック
APP_URL="https://aca-wild-australiaeast.icymoss-273d47c5.australiaeast.azurecontainerapps.io"
if curl -f $APP_URL > /dev/null 2>&1; then
    echo "✅ デプロイ成功！"
    echo "🌐 アプリケーションURL: $APP_URL"
else
    echo "❌ デプロイ検証エラー"
    echo "ログを確認してください:"
    echo "az containerapp logs show --name $CONTAINER_APP --resource-group $RESOURCE_GROUP"
fi

echo "🎉 デプロイプロセス完了"