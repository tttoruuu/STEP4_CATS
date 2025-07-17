#!/bin/bash
# Azure Key Vaultからシークレットを取得して環境変数ファイルを生成するスクリプト

set -e

# Azure CLIの存在確認
if ! command -v az &> /dev/null; then
    echo "Error: Azure CLIが見つかりません。インストールしてください"
    exit 1
fi

# Key Vault名の設定
VAULT_NAME="miraim-keyvault"

# Azure CLIにログインしているか確認
if ! az account show &> /dev/null; then
    echo "Azure CLIにログインしてください"
    az login
fi

echo "Azure Key Vaultから本番環境のシークレットを取得しています..."

# 本番環境変数ファイルの生成
cat > config/.env.production << EOF
# 本番環境設定（Azure Key Vaultから取得）
# このファイルは秘密情報を含むため、Gitにコミットしないでください

# API設定
OPENAI_API_KEY=$(az keyvault secret show --vault-name $VAULT_NAME --name "openai-api-key" --query value -o tsv)
SPEECH_API_KEY=$(az keyvault secret show --vault-name $VAULT_NAME --name "speech-api-key" --query value -o tsv)

# データベース設定
DATABASE_URL=$(az keyvault secret show --vault-name $VAULT_NAME --name "database-url" --query value -o tsv)
MYSQL_HOST=$(az keyvault secret show --vault-name $VAULT_NAME --name "mysql-host" --query value -o tsv)
MYSQL_PORT=3306
MYSQL_DATABASE=$(az keyvault secret show --vault-name $VAULT_NAME --name "mysql-database" --query value -o tsv)
MYSQL_USER=$(az keyvault secret show --vault-name $VAULT_NAME --name "mysql-user" --query value -o tsv)
MYSQL_PASSWORD=$(az keyvault secret show --vault-name $VAULT_NAME --name "mysql-password" --query value -o tsv)

# 外部API設定
MANDAMU_API_KEY=$(az keyvault secret show --vault-name $VAULT_NAME --name "mandamu-api-key" --query value -o tsv)
MANDAMU_API_SECRET=$(az keyvault secret show --vault-name $VAULT_NAME --name "mandamu-api-secret" --query value -o tsv)

# 認証設定
JWT_SECRET=$(az keyvault secret show --vault-name $VAULT_NAME --name "jwt-secret" --query value -o tsv)
AUTH0_DOMAIN=$(az keyvault secret show --vault-name $VAULT_NAME --name "auth0-domain" --query value -o tsv)
AUTH0_CLIENT_ID=$(az keyvault secret show --vault-name $VAULT_NAME --name "auth0-client-id" --query value -o tsv)
AUTH0_CLIENT_SECRET=$(az keyvault secret show --vault-name $VAULT_NAME --name "auth0-client-secret" --query value -o tsv)

# Azure設定
AZURE_CLIENT_ID=$(az keyvault secret show --vault-name $VAULT_NAME --name "azure-client-id" --query value -o tsv)
AZURE_CLIENT_SECRET=$(az keyvault secret show --vault-name $VAULT_NAME --name "azure-client-secret" --query value -o tsv)
AZURE_TENANT_ID=$(az keyvault secret show --vault-name $VAULT_NAME --name "azure-tenant-id" --query value -o tsv)
AZURE_SUBSCRIPTION_ID=$(az keyvault secret show --vault-name $VAULT_NAME --name "azure-subscription-id" --query value -o tsv)

# アプリケーション設定
ENV=production
NODE_ENV=production
FRONTEND_ORIGIN=https://your-frontend-domain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
INTERNAL_API_URL=http://backend:8000

EOF

if [ $? -eq 0 ]; then
    echo "✅ 本番環境変数ファイルを生成しました: config/.env.production"
    chmod 600 config/.env.production
    echo "✅ ファイル権限を設定しました (600)"
    echo "⚠️  このファイルは秘密情報を含むため、適切に管理してください"
else
    echo "❌ シークレットの取得に失敗しました"
    exit 1
fi