-- Azure MySQL用のカラム追加スクリプト
-- 実行コマンド: mysql -h eastasiafor9th.mysql.database.azure.com -u students -p testdb < add-missing-columns.sql

-- usersテーブルに不足しているカラムを追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_place VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekend_activity TEXT;

-- カラムの存在確認
SHOW COLUMNS FROM users;