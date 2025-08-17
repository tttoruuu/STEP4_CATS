"""
サービス説明動画表示フラグをユーザーテーブルに追加するマイグレーション
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
            # まず既存のカラムを確認
            result = connection.execute(text("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'users'
                AND COLUMN_NAME IN ('show_service_video', 'first_login_at')
            """))
            existing_columns = [row[0] for row in result]
            
            # show_service_video カラムを追加
            if 'show_service_video' not in existing_columns:
                logger.info("Adding show_service_video column...")
                connection.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN show_service_video BOOLEAN DEFAULT TRUE
                """))
                connection.commit()
            else:
                logger.info("show_service_video column already exists, skipping...")
            
            # first_login_at カラムを追加
            if 'first_login_at' not in existing_columns:
                logger.info("Adding first_login_at column...")
                connection.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN first_login_at TIMESTAMP NULL
                """))
                connection.commit()
            else:
                logger.info("first_login_at column already exists, skipping...")
            
            logger.info("Migration completed successfully!")
            
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    run_migration()