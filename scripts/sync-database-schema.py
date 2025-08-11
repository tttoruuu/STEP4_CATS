#!/usr/bin/env python3
"""
データベーススキーマ同期スクリプト
ローカル開発環境とAzure本番環境のスキーマ差異を検出・修正
"""

import os
import sys
import pymysql
from datetime import datetime

# 環境設定
LOCAL_DB = {
    'host': 'localhost',
    'port': 3307,
    'user': 'root',
    'password': 'password',
    'database': 'testdb'
}

AZURE_DB = {
    'host': 'eastasiafor9th.mysql.database.azure.com',
    'port': 3306,
    'user': 'tech09thstudents',
    'password': '9th-tech0',
    'database': 'testdb'
}

def get_connection(config):
    """データベース接続を取得"""
    try:
        return pymysql.connect(**config)
    except Exception as e:
        print(f"❌ 接続エラー ({config['host']}): {e}")
        return None

def get_table_structure(conn, table_name):
    """テーブル構造を取得"""
    cursor = conn.cursor()
    cursor.execute(f"DESCRIBE {table_name}")
    columns = cursor.fetchall()
    cursor.close()
    return columns

def get_tables(conn):
    """全テーブル名を取得"""
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = [row[0] for row in cursor.fetchall()]
    cursor.close()
    return tables

def compare_schemas():
    """ローカルとAzureのスキーマを比較"""
    print("=" * 60)
    print("🔍 データベーススキーマ比較ツール")
    print("=" * 60)
    
    # ローカル接続
    local_conn = get_connection(LOCAL_DB)
    if not local_conn:
        print("⚠️  ローカルDBに接続できません。Docker Composeが起動していることを確認してください。")
        return
    
    # Azure接続
    azure_conn = get_connection(AZURE_DB)
    if not azure_conn:
        print("⚠️  Azure DBに接続できません。")
        local_conn.close()
        return
    
    print("✅ 両方のデータベースに接続成功\n")
    
    # テーブル比較
    local_tables = set(get_tables(local_conn))
    azure_tables = set(get_tables(azure_conn))
    
    print("📊 テーブル比較:")
    print(f"  ローカルのみ: {local_tables - azure_tables or 'なし'}")
    print(f"  Azureのみ: {azure_tables - local_tables or 'なし'}")
    print(f"  共通: {local_tables & azure_tables}\n")
    
    # 共通テーブルのカラム比較
    common_tables = local_tables & azure_tables
    differences = []
    
    for table in common_tables:
        local_cols = get_table_structure(local_conn, table)
        azure_cols = get_table_structure(azure_conn, table)
        
        local_col_dict = {col[0]: col for col in local_cols}
        azure_col_dict = {col[0]: col for col in azure_cols}
        
        # カラム名の差異
        local_col_names = set(local_col_dict.keys())
        azure_col_names = set(azure_col_dict.keys())
        
        if local_col_names != azure_col_names:
            differences.append({
                'table': table,
                'local_only': local_col_names - azure_col_names,
                'azure_only': azure_col_names - local_col_names,
                'type_diff': []
            })
        
        # 型の差異
        for col_name in local_col_names & azure_col_names:
            if local_col_dict[col_name][1] != azure_col_dict[col_name][1]:
                if differences and differences[-1]['table'] == table:
                    differences[-1]['type_diff'].append({
                        'column': col_name,
                        'local': local_col_dict[col_name][1],
                        'azure': azure_col_dict[col_name][1]
                    })
                else:
                    differences.append({
                        'table': table,
                        'local_only': set(),
                        'azure_only': set(),
                        'type_diff': [{
                            'column': col_name,
                            'local': local_col_dict[col_name][1],
                            'azure': azure_col_dict[col_name][1]
                        }]
                    })
    
    # 差異レポート
    if differences:
        print("⚠️  スキーマの差異が検出されました:\n")
        for diff in differences:
            print(f"📌 テーブル: {diff['table']}")
            if diff['local_only']:
                print(f"   ローカルのみのカラム: {diff['local_only']}")
            if diff['azure_only']:
                print(f"   Azureのみのカラム: {diff['azure_only']}")
            if diff['type_diff']:
                print("   型の差異:")
                for td in diff['type_diff']:
                    print(f"     - {td['column']}: ローカル={td['local']}, Azure={td['azure']}")
            print()
    else:
        print("✅ スキーマは完全に一致しています！\n")
    
    # 推奨SQLの生成
    if differences:
        print("📝 推奨される修正SQL (Azureで実行):\n")
        for diff in differences:
            if diff['local_only']:
                for col in diff['local_only']:
                    # ローカルから型情報を取得
                    local_col_info = local_col_dict[col]
                    col_type = local_col_info[1]
                    nullable = "NULL" if local_col_info[2] == "YES" else "NOT NULL"
                    default = f"DEFAULT {local_col_info[4]}" if local_col_info[4] else ""
                    print(f"ALTER TABLE {diff['table']} ADD COLUMN {col} {col_type} {nullable} {default};")
            
            if diff['azure_only']:
                print(f"-- 注意: Azureにのみ存在するカラム (削除する場合は慎重に)")
                for col in diff['azure_only']:
                    print(f"-- ALTER TABLE {diff['table']} DROP COLUMN {col};")
    
    # テストユーザーの存在確認
    print("\n👤 テストユーザー確認:")
    for conn, env_name in [(local_conn, "ローカル"), (azure_conn, "Azure")]:
        cursor = conn.cursor()
        cursor.execute("SELECT username, email FROM users WHERE email = %s", ('miraim@test.com',))
        user = cursor.fetchone()
        if user:
            print(f"  {env_name}: ✅ 存在 (username={user[0]})")
        else:
            print(f"  {env_name}: ❌ 不在")
        cursor.close()
    
    local_conn.close()
    azure_conn.close()
    
    print("\n" + "=" * 60)
    print("✨ 比較完了")
    print("=" * 60)

def create_test_user():
    """テストユーザーを作成"""
    print("\n📝 テストユーザー作成")
    
    azure_conn = get_connection(AZURE_DB)
    if not azure_conn:
        print("❌ Azure DBに接続できません")
        return
    
    cursor = azure_conn.cursor()
    
    try:
        # 既存ユーザーの確認
        cursor.execute("SELECT id FROM users WHERE email = %s", ('miraim@test.com',))
        if cursor.fetchone():
            print("⚠️  テストユーザーは既に存在します")
        else:
            # パスワードのハッシュ化 (bcrypt使用)
            import bcrypt
            password_hash = bcrypt.hashpw('pass1234'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # ユーザー作成
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, full_name, birth_date, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            """, ('miraim', 'miraim@test.com', password_hash, 'ミライム テスト', '1990-01-01'))
            
            azure_conn.commit()
            print("✅ テストユーザーを作成しました")
    except Exception as e:
        print(f"❌ エラー: {e}")
        azure_conn.rollback()
    finally:
        cursor.close()
        azure_conn.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='データベーススキーマ同期ツール')
    parser.add_argument('--create-user', action='store_true', help='テストユーザーを作成')
    parser.add_argument('--check-only', action='store_true', help='比較のみ実行')
    
    args = parser.parse_args()
    
    if args.create_user:
        create_test_user()
    else:
        compare_schemas()