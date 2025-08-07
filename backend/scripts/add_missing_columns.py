#!/usr/bin/env python3
"""
データベースに不足しているカラムを追加するスクリプト
"""

import os
import sys
from pathlib import Path

# プロジェクトのルートディレクトリをPythonパスに追加
sys.path.insert(0, str(Path(__file__).parent.parent))

import pymysql
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()

def add_missing_columns():
    """不足しているカラムをusersテーブルに追加"""
    
    # データベース接続情報
    host = os.getenv('MYSQL_HOST', 'localhost')
    port = int(os.getenv('MYSQL_PORT', 3306))
    database = os.getenv('MYSQL_DATABASE', 'miraim_db')
    user = os.getenv('MYSQL_USER', 'root')
    password = os.getenv('MYSQL_PASSWORD', '')
    
    print(f"データベースに接続中: {host}:{port}/{database}")
    
    try:
        # データベースに接続
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # 追加するカラムのリスト
        columns_to_add = [
            ("konkatsu_status", "VARCHAR(50)"),
            ("occupation", "VARCHAR(255)"),
            ("birthplace", "VARCHAR(255)"),
            ("current_location", "VARCHAR(255)"),
            ("holiday_style", "TEXT")
        ]
        
        # 既存のカラムを取得
        cursor.execute(f"SHOW COLUMNS FROM users")
        existing_columns = [row[0] for row in cursor.fetchall()]
        print(f"既存のカラム: {existing_columns}")
        
        # 不足しているカラムを追加
        for column_name, column_type in columns_to_add:
            if column_name not in existing_columns:
                try:
                    alter_query = f"ALTER TABLE users ADD COLUMN {column_name} {column_type}"
                    print(f"カラムを追加中: {column_name} ({column_type})")
                    cursor.execute(alter_query)
                    connection.commit()
                    print(f"✅ カラム '{column_name}' を追加しました")
                except Exception as e:
                    print(f"⚠️ カラム '{column_name}' の追加中にエラー: {e}")
                    connection.rollback()
            else:
                print(f"ℹ️ カラム '{column_name}' は既に存在します")
        
        # 最終的なテーブル構造を確認
        cursor.execute("DESCRIBE users")
        print("\n最終的なテーブル構造:")
        print("-" * 50)
        for row in cursor.fetchall():
            print(f"{row[0]:20} {row[1]:20}")
        
        print("\n✅ データベースの更新が完了しました")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        return False
    finally:
        if 'connection' in locals():
            connection.close()
    
    return True

if __name__ == "__main__":
    success = add_missing_columns()
    sys.exit(0 if success else 1)