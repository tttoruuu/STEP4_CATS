"""
ローカルMySQLのテーブル作成スクリプト
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
from models.user import User
from models.conversation_partner import ConversationPartner

def create_tables():
    """全テーブルを作成"""
    try:
        print("テーブル作成開始...")
        Base.metadata.create_all(bind=engine)
        print("✅ テーブル作成完了")
        return True
    except Exception as e:
        print(f"❌ テーブル作成エラー: {e}")
        return False

if __name__ == "__main__":
    create_tables()