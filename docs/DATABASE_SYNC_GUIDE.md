# データベース環境同期ガイド

## 🚨 よくある問題と解決策

### 1. ローカル開発 → Azure本番デプロイ時の問題

#### 問題パターン
- **接続エラー**: `Access denied for user`
- **カラム不一致**: `Unknown column 'xxx' in 'field list'`
- **型の違い**: `Data truncated for column`
- **認証失敗**: パスワードフォーマットの違い

#### 根本原因
1. **ユーザー名の違い**
   - ローカル: `root`
   - Azure: `tech09thstudents`

2. **接続文字列フォーマット**
   - ローカル: `mysql+pymysql://root:password@localhost:3307/testdb`
   - Azure: `mysql+pymysql://tech09thstudents:9th-tech0@eastasiafor9th.mysql.database.azure.com:3306/testdb`

3. **スキーマの差異**
   - マイグレーション未実行
   - カラム名の不一致
   - データ型の違い

## 📋 デプロイ前チェックリスト

### 必須確認項目

```bash
# 1. Docker環境起動
docker-compose -f docker-compose.development.yml up -d

# 2. スキーマ比較
python scripts/sync-database-schema.py

# 3. 環境変数確認
grep DATABASE_URL backend/.env  # ローカル用
az containerapp show --name miraim-backend --resource-group rg-001-gen9 --query "properties.template.containers[0].env[?name=='DATABASE_URL'].value"  # Azure用

# 4. テストユーザー確認
python scripts/sync-database-schema.py --create-user
```

### config.py の正しい設定

```python
# 本番環境では環境変数を優先使用
if IS_PRODUCTION:
    if os.getenv("DATABASE_URL"):
        DATABASE_URL = os.getenv("DATABASE_URL")
    else:
        # フォールバック設定
        MYSQL_USER = "tech09thstudents"  # ⚠️ studentsではない！
        MYSQL_PASSWORD = "9th-tech0"
        MYSQL_HOST = "eastasiafor9th.mysql.database.azure.com"
        DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:3306/testdb"
```

## 🔧 トラブルシューティング

### 1. Access Denied エラー

```bash
# 環境変数を直接設定
az containerapp update --name miraim-backend --resource-group rg-001-gen9 \
  --set-env-vars DATABASE_URL="mysql+pymysql://tech09thstudents:9th-tech0@eastasiafor9th.mysql.database.azure.com:3306/testdb"
```

### 2. カラム不一致エラー

```bash
# スキーマ差異を確認
python scripts/sync-database-schema.py

# 生成されたSQLをAzure DBで実行
mysql -h eastasiafor9th.mysql.database.azure.com -u tech09thstudents -p testdb < fix.sql
```

### 3. テストユーザー不在

```bash
# テストユーザー作成
python scripts/sync-database-schema.py --create-user

# または手動でSQL実行
mysql -h eastasiafor9th.mysql.database.azure.com -u tech09thstudents -p testdb
> INSERT INTO users (username, email, password_hash, full_name, birth_date)
> VALUES ('miraim', 'miraim@test.com', '$2b$12$...', 'テストユーザー', '1990-01-01');
```

## 🚀 推奨デプロイフロー

1. **ローカルでテスト完了**
2. **スキーマ同期確認**: `python scripts/sync-database-schema.py`
3. **環境変数設定**: Container Appsで`DATABASE_URL`を明示的に設定
4. **デプロイ実行**: `./scripts/deploy.sh`
5. **動作確認**: ヘルスチェック → ログイン → 機能テスト

## 📝 環境別設定一覧

| 項目 | ローカル開発 | Azure本番 |
|------|-------------|-----------|
| ホスト | localhost | eastasiafor9th.mysql.database.azure.com |
| ポート | 3307 | 3306 |
| ユーザー | root | tech09thstudents |
| パスワード | password | 9th-tech0 |
| データベース | testdb | testdb |
| SSL | 不要 | 推奨 |

## ⚡ クイックフィックス

```bash
# 最も一般的な問題の一括修正
./scripts/fix-database-issues.sh

# 内容:
# 1. スキーマ同期
# 2. 環境変数更新
# 3. テストユーザー作成
# 4. Container Apps再起動
```

## 🔄 定期メンテナンス

- **週次**: スキーマ差異チェック
- **デプロイ前**: 必須チェックリスト実行
- **問題発生時**: このガイドに記録・更新