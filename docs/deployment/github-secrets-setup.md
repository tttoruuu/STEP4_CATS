# GitHub Secrets設定手順

Azure CLIアクセス権限がない場合のデプロイ設定方法

## 必要なSecrets

### 1. Azure認証情報
```
AZURE_CREDENTIALS
```
値の形式:
```json
{
  "clientId": "service-principal-client-id",
  "clientSecret": "service-principal-secret",
  "subscriptionId": "9b680e6d-e5a6-4381-aad5-a30afcbc8459",
  "tenantId": "admintech0jp.onmicrosoft.com"
}
```

### 2. Container Registry認証
```
ACR_USERNAME=acrtech0for9th
ACR_PASSWORD=registry-password
```

### 3. Database接続情報
```
DATABASE_URL=mysql+pymysql://username:password@eastasiafor9th.mysql.database.azure.com:3306/database_name
MYSQL_DATABASE=miraim_prod
MYSQL_USER=admin_user
MYSQL_PASSWORD=secure_password
```

### 4. API設定
```
NEXT_PUBLIC_API_URL=https://aca-wild-australiaeast.azurecontainerapps.io
OPENAI_API_KEY=sk-proj-xxx
JWT_SECRET=production_jwt_secret_random_string
```

### 5. Azure Storage
```
AZURE_STORAGE_ACCOUNT=blobeastasiafor9th
AZURE_STORAGE_KEY=storage-access-key
```

## 本部への依頼事項（セキュア版）

### 限定権限Service Principal作成依頼
```
目的: GitHub ActionsからのContainer Appsデプロイのみ
スコープ: リソースグループ rg-001-gen9 の以下リソースのみ
必要最小権限:
- aca-wild-australiaeast: Container Apps へのデプロイ権限のみ
- acrtech0for9th: イメージpush権限のみ

※ユーザー名・パスワード等の機密情報は不要
※Service Principal JSONのみ提供
```

### 代替案：Azure Portal Web Shellスクリプト
```bash
# 本部担当者がPortal Web Shellで実行するスクリプトを提供
# 認証情報を外部に出すことなくデプロイ可能
```

## GitHub Secrets設定手順

1. GitHubリポジトリ → Settings → Secrets and variables → Actions
2. "New repository secret"をクリック
3. 上記の各Secretを設定

## テストデプロイ手順

1. GitHub Actions → "Deploy to Azure Production"
2. "Run workflow"をクリック（手動実行）
3. ログを確認してデプロイ状況をチェック

## トラブルシューティング

### よくあるエラー
- 認証エラー: AZURE_CREDENTIALS確認
- Registry接続エラー: ACR認証情報確認
- Database接続エラー: MySQL設定確認

### ログ確認方法
```bash
# Container Apps ログ（本部に依頼）
az containerapp logs show --name aca-wild-australiaeast --resource-group rg-001-gen9
```