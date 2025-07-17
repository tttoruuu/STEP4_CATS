#!/bin/bash
# Azure Key Vaultを作成してシークレットを設定するスクリプト

set -e

# 設定
RESOURCE_GROUP="miraim-rg"
VAULT_NAME="miraim-keyvault"
LOCATION="japaneast"

# Azure CLIの存在確認
if ! command -v az &> /dev/null; then
    echo "Error: Azure CLIが見つかりません。インストールしてください"
    exit 1
fi

# Azure CLIにログインしているか確認
if ! az account show &> /dev/null; then
    echo "Azure CLIにログインしてください"
    az login
fi

echo "Azure Key Vaultをセットアップしています..."

# Key Vaultの作成
echo "Key Vaultを作成しています..."
az keyvault create \
    --name $VAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --enable-soft-delete true \
    --enable-purge-protection false

if [ $? -eq 0 ]; then
    echo "✅ Key Vault '$VAULT_NAME' を作成しました"
else
    echo "❌ Key Vaultの作成に失敗しました"
    exit 1
fi

# 現在のユーザーにKey Vaultへの権限を付与
echo "Key Vaultへの権限を設定しています..."
USER_OBJECT_ID=$(az ad signed-in-user show --query objectId -o tsv)
az keyvault set-policy \
    --name $VAULT_NAME \
    --object-id $USER_OBJECT_ID \
    --secret-permissions get list set delete backup restore recover

echo "✅ Key Vaultのセットアップが完了しました"
echo ""
echo "次の手順:"
echo "1. 本番環境の実際の値を使用してシークレットを設定："
echo "   az keyvault secret set --vault-name $VAULT_NAME --name 'openai-api-key' --value 'your-actual-key'"
echo "   az keyvault secret set --vault-name $VAULT_NAME --name 'mysql-password' --value 'your-actual-password'"
echo "   # 他のシークレットも同様に設定"
echo ""
echo "2. 環境変数ファイルを生成："
echo "   ./config/secrets/azure-keyvault.sh"