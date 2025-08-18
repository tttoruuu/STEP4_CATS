"""
データベースマイグレーションスクリプト
PR #22 で追加された機能用のカラムを追加
"""
import os
import sys

# Add to Python path
sys.path.insert(0, '/app')

from sqlalchemy import create_engine, text
from config import DATABASE_URL

def run_migration():
    """マイグレーションを実行"""
    print("Starting migration...")
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # Add show_service_video column
        try:
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN show_service_video BOOLEAN DEFAULT TRUE
            """))
            conn.commit()
            print("✓ Added show_service_video column")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("- show_service_video column already exists")
            else:
                print(f"Error adding show_service_video: {e}")
        
        # Add first_login_at column
        try:
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN first_login_at DATETIME DEFAULT NULL
            """))
            conn.commit()
            print("✓ Added first_login_at column")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("- first_login_at column already exists")
            else:
                print(f"Error adding first_login_at: {e}")
        
        # Verify columns
        result = conn.execute(text("DESCRIBE users"))
        columns = result.fetchall()
        
        print("\nTable structure:")
        for col in columns:
            print(f"  {col[0]}: {col[1]}")
    
    print("\nMigration completed!")

if __name__ == "__main__":
    run_migration()
