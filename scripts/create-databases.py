#!/usr/bin/env python3
"""
Azure MySQL個別データベース作成スクリプト
"""

import pymysql
import sys

# Azure MySQL接続情報
MYSQL_CONFIG = {
    'host': 'eastasiafor9th.mysql.database.azure.com',
    'user': 'tech09thstudents',
    'password': '9th-tech0',
    'port': 3306,
    'charset': 'utf8mb4',
    'ssl_verify_cert': False,
    'ssl_verify_identity': False
}

def create_databases():
    """個別データベースを作成"""
    try:
        print("🔗 Azure MySQLに接続中...")
        connection = pymysql.connect(**MYSQL_CONFIG)
        
        with connection.cursor() as cursor:
            # 既存データベース確認
            print("📋 既存データベース一覧:")
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            existing_dbs = [db[0] for db in databases]
            
            for db in existing_dbs:
                print(f"  - {db}")
            
            # テスト用データベース作成
            if 'miraim_test' not in existing_dbs:
                print("\n🛠️ miraim_test データベースを作成中...")
                cursor.execute("""
                    CREATE DATABASE miraim_test 
                    CHARACTER SET utf8mb4 
                    COLLATE utf8mb4_unicode_ci
                """)
                print("✅ miraim_test データベース作成完了")
            else:
                print("ℹ️ miraim_test データベースは既に存在します")
            
            # 本番用データベース作成
            if 'miraim_prod' not in existing_dbs:
                print("\n🛠️ miraim_prod データベースを作成中...")
                cursor.execute("""
                    CREATE DATABASE miraim_prod 
                    CHARACTER SET utf8mb4 
                    COLLATE utf8mb4_unicode_ci
                """)
                print("✅ miraim_prod データベース作成完了")
            else:
                print("ℹ️ miraim_prod データベースは既に存在します")
            
            # 確認
            print("\n📋 更新後のデータベース一覧:")
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            for db in databases:
                if 'miraim' in db[0]:
                    print(f"  ✅ {db[0]}")
                else:
                    print(f"  - {db[0]}")
        
        connection.close()
        print("\n🎉 データベース作成処理完了！")
        return True
        
    except pymysql.Error as e:
        print(f"❌ MySQL接続エラー: {e}")
        return False
    except Exception as e:
        print(f"❌ 予期しないエラー: {e}")
        return False

def test_connection():
    """接続テスト"""
    try:
        print("🧪 miraim_test データベース接続テスト...")
        config = MYSQL_CONFIG.copy()
        config['database'] = 'miraim_test'
        
        connection = pymysql.connect(**config)
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result[0] == 1:
                print("✅ miraim_test 接続成功！")
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ 接続テストエラー: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("🗄️ Azure MySQL 個別データベース作成")
    print("=" * 50)
    
    if create_databases():
        print("\n" + "=" * 30)
        test_connection()
        print("=" * 30)
        print("✅ 全ての処理が完了しました！")
        print("📝 事前検証テストを実行してください:")
        print("   ./scripts/production-test.sh")
    else:
        print("❌ データベース作成に失敗しました")
        print("💡 本部にデータベース作成を依頼してください")
        sys.exit(1)