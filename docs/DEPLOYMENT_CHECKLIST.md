# デプロイチェックリスト

## 📋 デプロイ前の確認事項

### 1. データベース接続
- [ ] Azure MySQL の接続情報確認
  - ユーザー名: `students`（管理者）
  - ホスト: `eastasiafor9th.mysql.database.azure.com`
- [ ] ファイアウォールルール確認（Container Apps IPが許可されているか）

### 2. 環境変数
- [ ] DATABASE_URL が正しく設定されているか
- [ ] ENV=production が設定されているか
- [ ] SSL接続が有効か（本番環境）

### 3. スキーマ同期
- [ ] ローカルとAzure DBのスキーマが一致しているか
- [ ] 新しいカラムが追加された場合、マイグレーション実行

### 4. デプロイコマンド
```bash
# 推奨：統合デプロイスクリプト使用
./scripts/deploy.sh

# デプロイ後の確認
./scripts/deploy-check.sh
```

### 5. デプロイ後の確認
- [ ] ヘルスチェック: `curl https://miraim-backend.icymoss-273d47c5.australiaeast.azurecontainerapps.io/health`
- [ ] ログイン機能テスト
- [ ] フロントエンドアクセス確認

## ⚠️ よくある問題と対処法

### データベース接続エラー
```bash
# Container Apps環境変数を確認
az containerapp show --name miraim-backend --resource-group rg-001-gen9 --query "properties.template.containers[0].env"

# 環境変数を修正
az containerapp update --name miraim-backend --resource-group rg-001-gen9 --set-env-vars DATABASE_URL="mysql+pymysql://students:9th-tech0@eastasiafor9th.mysql.database.azure.com:3306/testdb"
```

### スキーマ不一致エラー
```bash
# スキーマ同期スクリプト実行
python scripts/sync-database-schema.py
```

### テストユーザー
- Email: `miraim@test.com`
- Password: `pass1234`