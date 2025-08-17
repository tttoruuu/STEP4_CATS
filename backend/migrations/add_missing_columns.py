"""
不足しているカラムを追加するマイグレーション
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
import logging
from dotenv import load_dotenv

# .env ファイルを読み込む
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migration():
    # ローカル開発環境用のデータベース接続設定
    database_url = os.getenv("DATABASE_URL")
    
    # DATABASE_URLが設定されていない場合は個別の環境変数から構築
    if not database_url:
        host = os.getenv("MYSQL_HOST", "localhost")
        port = os.getenv("MYSQL_PORT", "3307")  # Dockerの場合は3307
        user = os.getenv("MYSQL_USER", "root")
        password = os.getenv("MYSQL_PASSWORD", "password")
        database = os.getenv("MYSQL_DATABASE", "testdb")
        
        database_url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}?charset=utf8mb4"
        logger.info(f"Using constructed DATABASE_URL: mysql+pymysql://{user}:****@{host}:{port}/{database}")
    
    engine = create_engine(database_url)
    
    try:
        with engine.connect() as connection:
            # 必要なカラムのリスト
            columns_to_add = [
                ("konkatsu_status", "VARCHAR(50)"),
                ("occupation", "VARCHAR(255)"),
                ("birth_place", "VARCHAR(255)"),
                ("location", "VARCHAR(255)"),
                ("weekend_activity", "TEXT")
            ]
            
            # 既存のカラムを確認
            result = connection.execute(text("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'users'
            """))
            existing_columns = [row[0] for row in result]
            
            # 不足しているカラムを追加
            for column_name, column_type in columns_to_add:
                if column_name not in existing_columns:
                    logger.info(f"Adding {column_name} column...")
                    connection.execute(text(f"""
                        ALTER TABLE users 
                        ADD COLUMN {column_name} {column_type}
                    """))
                    connection.commit()
                else:
                    logger.info(f"{column_name} column already exists, skipping...")
            
            logger.info("Migration completed successfully!")
            
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    run_migration()