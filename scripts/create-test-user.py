#!/usr/bin/env python3
"""
テストユーザー作成スクリプト（簡易版）
"""

import pymysql
import bcrypt
from datetime import datetime

# Azure DB接続設定
AZURE_DB = {
    'host': 'eastasiafor9th.mysql.database.azure.com',
    'port': 3306,
    'user': 'tech09thstudents',
    'password': '9th-tech0',
    'database': 'testdb'
}

def create_test_user():
    """テストユーザーを作成"""
    print("📝 テストユーザー作成スクリプト")
    print("=" * 40)
    
    try:
        # データベース接続
        conn = pymysql.connect(**AZURE_DB)
        cursor = conn.cursor()
        print("✅ データベース接続成功")
        
        # 既存ユーザーの確認
        cursor.execute("SELECT id, username, email FROM users WHERE email = %s", ('miraim@test.com',))
        existing = cursor.fetchone()
        
        if existing:
            print(f"⚠️  テストユーザーは既に存在します: ID={existing[0]}, username={existing[1]}")
            return
        
        # パスワードのハッシュ化
        password = 'pass1234'
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # ユーザー作成
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, full_name, birth_date, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        """, ('miraim', 'miraim@test.com', password_hash, 'ミライム テスト', '1990-01-01'))
        
        conn.commit()
        print("✅ テストユーザーを作成しました")
        print(f"   Email: miraim@test.com")
        print(f"   Password: pass1234")
        print(f"   Username: miraim")
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    create_test_user()