"""
環境設定管理モジュール
ローカル開発環境とAzure本番環境の切り替えを管理
"""
import os
from dotenv import load_dotenv
from pathlib import Path

# .envファイルの読み込み
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"
load_dotenv(dotenv_path=env_path)

# 環境判定
ENV = os.getenv("ENV", "development")
IS_PRODUCTION = ENV == "production"
IS_DEVELOPMENT = ENV == "development"

# データベース設定
# .envファイルからDATABASE_URLを直接取得
DATABASE_URL = os.getenv("DATABASE_URL")

# MySQL関連変数をデフォルト値で初期化（インポートエラー回避）
MYSQL_HOST = "localhost"
MYSQL_PORT = 3306
MYSQL_DATABASE = "testdb"
MYSQL_USER = "root"
MYSQL_PASSWORD = "password"
MYSQL_SSL_ENABLED = False

if not DATABASE_URL:
    # DATABASE_URLが設定されていない場合のフォールバック
    if IS_PRODUCTION:
        # Azure MySQL（本番環境）
        MYSQL_HOST = os.getenv("AZURE_MYSQL_HOST", "eastasiafor9th.mysql.database.azure.com")
        MYSQL_PORT = int(os.getenv("AZURE_MYSQL_PORT", "3306"))
        MYSQL_DATABASE = os.getenv("AZURE_MYSQL_DATABASE", "testdb")
        MYSQL_USER = os.getenv("AZURE_MYSQL_USER", "students")
        MYSQL_PASSWORD = os.getenv("AZURE_MYSQL_PASSWORD", "9th-tech0")
        
        # Azure MySQL用のSSL設定
        MYSQL_SSL_ENABLED = True
        # mysql-connector-pythonを使用し、SSLを強制的に有効化
        DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4&use_ssl=1&ssl_verify_cert=0"
    else:
        # ローカルMySQL（開発環境）
        # Docker環境での接続判定
        is_docker = os.path.exists('/.dockerenv') or os.getenv("DOCKER_CONTAINER", False)
        default_host = "db" if is_docker else "localhost"
        default_port = "3306" if is_docker else "3307"
        
        MYSQL_HOST = os.getenv("LOCAL_MYSQL_HOST", default_host)
        MYSQL_PORT = int(os.getenv("LOCAL_MYSQL_PORT", default_port))
        MYSQL_DATABASE = os.getenv("LOCAL_MYSQL_DATABASE", "testdb")
        MYSQL_USER = os.getenv("LOCAL_MYSQL_USER", "root")
        MYSQL_PASSWORD = os.getenv("LOCAL_MYSQL_PASSWORD", "password")
        
        # ローカルMySQLはSSL不要
        MYSQL_SSL_ENABLED = False
        DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"

# SQLite使用時の設定
if DATABASE_URL and DATABASE_URL.startswith("sqlite"):
    MYSQL_SSL_ENABLED = False
    MYSQL_HOST = "sqlite"
    MYSQL_PORT = 0
    MYSQL_DATABASE = "sqlite"
    MYSQL_USER = "sqlite"
    MYSQL_PASSWORD = "sqlite"

# OpenAI API設定
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# JWT設定
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_key_for_testing_only")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7

# CORS設定
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# ログ設定
LOG_LEVEL = "ERROR" if IS_PRODUCTION else "INFO"

# デバッグ出力（開発時のみ）
if IS_DEVELOPMENT:
    print(f"環境: {ENV}")
    print(f"データベースホスト: {MYSQL_HOST}:{MYSQL_PORT}")
    print(f"データベース名: {MYSQL_DATABASE}")
    print(f"SSL有効: {MYSQL_SSL_ENABLED}")