#!/usr/bin/env python
"""テストユーザーを作成するスクリプト"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import User
from models.conversation import Conversation  # 依存関係を解決
from auth.password import get_password_hash
from database import DATABASE_URL

def create_test_user():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # 既存のテストユーザーを削除
        existing_user = session.query(User).filter_by(email='test@example.com').first()
        if existing_user:
            session.delete(existing_user)
            session.commit()
            print("既存のテストユーザーを削除しました")
        
        # 新しいテストユーザーを作成
        test_user = User(
            username='test@example.com',
            email='test@example.com',
            password_hash=get_password_hash('testpass123'),  # 8文字以上
            full_name='Test User',
            birth_date='1990-01-01',
            show_service_video=True
        )
        
        session.add(test_user)
        session.commit()
        
        print("テストユーザーを作成しました！")
        print("Email: test@example.com")
        print("Password: testpass123")
        
    except Exception as e:
        print(f"エラー: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    create_test_user()