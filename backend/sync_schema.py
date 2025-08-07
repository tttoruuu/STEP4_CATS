"""
データベーススキーマ同期スクリプト
ローカルとAzureのテーブル構造を同期する
"""
import pymysql
from config import (
    MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, 
    MYSQL_USER, MYSQL_PASSWORD, IS_DEVELOPMENT
)

def check_and_add_columns():
    """テーブルのカラムをチェックして不足分を追加"""
    
    connection = None
    try:
        # データベース接続
        connection = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # conversationsテーブルのカラムを確認
        print("🔍 conversationsテーブルのカラムを確認中...")
        
        # テーブルが存在するか確認
        cursor.execute("SHOW TABLES LIKE 'conversations'")
        if not cursor.fetchone():
            print("❌ conversationsテーブルが存在しません")
            print("💡 create_local_tables.pyを実行してテーブルを作成してください")
            return False
        
        # 既存のカラムを取得
        cursor.execute("SHOW COLUMNS FROM conversations")
        existing_columns = {row[0]: row[1] for row in cursor.fetchall()}
        print(f"既存カラム: {list(existing_columns.keys())}")
        
        # 必要なカラムの定義
        required_columns = {
            'id': 'INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
            'user_id': 'INT NOT NULL',
            'role': 'VARCHAR(50) NOT NULL',
            'user_message': 'TEXT NOT NULL',
            'ai_message': 'TEXT NOT NULL',
            'conversation_id': 'VARCHAR(100)',
            'conversation_title': 'VARCHAR(200)',
            'created_at': 'DATETIME DEFAULT CURRENT_TIMESTAMP'
        }
        
        # 不足しているカラムを追加
        for column_name, column_def in required_columns.items():
            if column_name not in existing_columns:
                if column_name == 'id':
                    continue  # PRIMARY KEYは既に存在するはず
                    
                try:
                    # シンプルにカラムを追加
                    if column_name == 'conversation_id':
                        alter_query = "ALTER TABLE conversations ADD COLUMN conversation_id VARCHAR(100)"
                    elif column_name == 'conversation_title':
                        alter_query = "ALTER TABLE conversations ADD COLUMN conversation_title VARCHAR(200)"
                    else:
                        continue
                    cursor.execute(alter_query)
                    connection.commit()
                    print(f"✅ カラム '{column_name}' を追加しました")
                    
                except Exception as e:
                    print(f"⚠️ カラム '{column_name}' の追加中にエラー: {e}")
                    connection.rollback()
            else:
                print(f"✓ カラム '{column_name}' は既に存在します")
        
        # インデックスの確認と追加
        cursor.execute("SHOW INDEX FROM conversations WHERE Key_name = 'idx_conversation_id'")
        if not cursor.fetchone():
            try:
                cursor.execute("CREATE INDEX idx_conversation_id ON conversations(conversation_id)")
                connection.commit()
                print("✅ conversation_idにインデックスを追加しました")
            except Exception as e:
                print(f"⚠️ インデックス追加エラー: {e}")
        
        print("\n✅ スキーマ同期完了")
        return True
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        return False
        
    finally:
        if connection:
            connection.close()

def check_all_tables():
    """全テーブルの状態を確認"""
    connection = None
    try:
        connection = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # 全テーブルのリスト
        required_tables = ['users', 'conversations', 'conversation_partners']
        
        print("\n📊 テーブル状態確認:")
        print("-" * 50)
        
        for table in required_tables:
            cursor.execute(f"SHOW TABLES LIKE '{table}'")
            if cursor.fetchone():
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"✅ {table}: {count} 件のレコード")
            else:
                print(f"❌ {table}: テーブルが存在しません")
        
        print("-" * 50)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    print("=" * 50)
    print("データベーススキーマ同期ツール")
    print(f"環境: {'ローカル' if IS_DEVELOPMENT else '本番'}")
    print(f"接続先: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
    print("=" * 50)
    
    # スキーマ同期
    if check_and_add_columns():
        # テーブル状態確認
        check_all_tables()
    else:
        print("\n⚠️ スキーマ同期に失敗しました")