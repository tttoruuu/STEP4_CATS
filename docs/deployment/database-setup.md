# Azure MySQL データベース個別作成手順

## 注意事項
Azure Database for MySQL Server は共有リソースのため、**個別データベース作成が必要**です。

## 本部への依頼

### データベース作成依頼（緊急）
```
【MySQL個別データベース作成のお願い】

MySQL Server: eastasiafor9th.mysql.database.azure.com
認証情報: tech09thstudents / 9th-tech0

外部からの接続がファイアウォールで制限されているため、
Azure Portal内から以下のデータベースを作成していただけますでしょうか：

1. miraim_prod (本番用)
2. miraim_test (テスト用)

■ Azure Portal内での実行方法:
1. eastasiafor9th MySQL リソースを開く
2. 「Query editor」または「Cloud Shell」を使用
3. 以下のSQLを実行:

CREATE DATABASE miraim_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE miraim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;

■ 確認事項:
作成後に「miraim_prod」「miraim_test」が表示されることを確認
```

## 自分で作成する場合

### 1. MySQL接続
```bash
# MySQL Clientを使用
mysql -h eastasiafor9th.mysql.database.azure.com \
      -u tech09thstudents \
      -p9th-tech0 \
      --ssl-mode=REQUIRED
```

### 2. データベース作成
```sql
-- テスト用データベース
CREATE DATABASE miraim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 本番用データベース  
CREATE DATABASE miraim_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 確認
SHOW DATABASES;
```

### 3. 権限確認
```sql
-- 作成したデータベースにアクセス可能か確認
USE miraim_test;
SHOW TABLES;
```

## トラブルシューティング

### SSL接続エラー
```bash
# SSL証明書問題の場合
mysql -h eastasiafor9th.mysql.database.azure.com \
      -u tech09thstudents \
      -p9th-tech0 \
      --ssl-mode=REQUIRED \
      --ssl-ca=/path/to/BaltimoreCyberTrustRoot.crt.pem
```

### 権限エラー
本部に以下を依頼：
- データベース作成権限の付与
- 個別データベースへのフルアクセス権限

## 確認方法

データベース作成後、以下で接続テスト：
```bash
# 接続テスト
python -c "
import pymysql
conn = pymysql.connect(
    host='eastasiafor9th.mysql.database.azure.com',
    user='tech09thstudents', 
    password='9th-tech0',
    database='miraim_test',
    port=3306
)
print('接続成功！')
conn.close()
"
```